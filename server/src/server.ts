/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import {
	createConnection,
	TextDocuments,
	Diagnostic,
	ProposedFeatures,
	InitializeParams,
	DidChangeConfigurationNotification,
	CompletionItem,
	TextDocumentPositionParams,
	TextDocumentSyncKind,
	InitializeResult,
	Command,
} from 'vscode-languageserver/node';
import {
	TextDocument
} from 'vscode-languageserver-textdocument';
import { characterCompletions, closingCompletions, dialogueCompletions, openingCompletions, sceneCompletions, titlePageCompletions, transitionCompletions } from './completions';
import { isTitlePage } from "./util/isTitlePage";
import { dialogueLens, locationsLens, scenesLens } from './lenses';
import { CharacterGenderIdentityProvider } from './guessGender';
import { getConfig as getFountainrc } from './fountainrc';
import { logger } from './logger';
import { CharacterRacialIdentityProvider } from './racialIdentity';
import { getDocumentation } from './documentation';
import { SimpleSentimentProvider } from './sentiment';
import { ExampleSettings } from './ExampleSettings';
import { PostProcessedScript } from './PostProcessedScript';
import { IFountainScript } from 'fountain-parser/src/types';
import { ReadingGradeProvider } from './readingGrade';


// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);
logger.connection = connection;

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;

connection.onInitialize((params: InitializeParams) => {
	const capabilities = params.capabilities;

	// Does the client support the `workspace/configuration` request?
	// If not, we fall back using global settings.
	hasConfigurationCapability = !!(
		capabilities.workspace && !!capabilities.workspace.configuration
	);
	hasWorkspaceFolderCapability = !!(
		capabilities.workspace && !!capabilities.workspace.workspaceFolders
	);

	const result: InitializeResult = {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Incremental,
			hoverProvider: true,
			declarationProvider: true,
			codeLensProvider: {
				resolveProvider: true
			},
			// documentSymbolProvider: true,
			// Tell the client that this server supports code completion.
			completionProvider: {
				resolveProvider: true
			}
		}
	};
	if (hasWorkspaceFolderCapability) {
		result.capabilities.workspace = {
			workspaceFolders: {
				supported: true
			}
		};
	}
	// sentimentInit();
	return result;
});

connection.onInitialized(() => {
	if (hasConfigurationCapability) {
		// Register for all configuration changes.
		connection.client.register(DidChangeConfigurationNotification.type, undefined);
	}
	if (hasWorkspaceFolderCapability) {
		connection.workspace.onDidChangeWorkspaceFolders(() => {
			connection.console.log('Workspace folder change event received.');
		});
	}
});

connection.onRequest("fountain.statistics.characters", async (params) => {
	const parsedScript = parsedDocuments[params.uri];
	const result = parsedScript.statsPerCharacter;
	return result;
});

connection.onRequest("fountain.statistics.locations", async (params) => {
	const parsedScript = parsedDocuments[params.uri];
	const result = parsedScript.statsPerLocation;
	return result;
});

connection.onRequest("fountain.statistics.scenes", async (params) => {
	const parsedScript = parsedDocuments[params.uri];
	const result = parsedScript.statsPerScene;
	return result;
});

connection.onRequest((params) => {
	connection.console.log(JSON.stringify({ onRequest: params }));
});

// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.
const defaultSettings: ExampleSettings = { guessCharacterGenders: true, locale: "en" };
let globalSettings: ExampleSettings = defaultSettings;

// Cache the settings of all open documents
const documentSettings: Map<string, Thenable<ExampleSettings>> = new Map();

connection.onDidChangeConfiguration(change => {
	if (hasConfigurationCapability) {
		// Reset all cached document settings
		documentSettings.clear();
	} else {
		globalSettings = <ExampleSettings>(
			(change.settings.languageServerExample || defaultSettings)
		);
	}

	// Revalidate all open text documents
	documents.all().forEach(validateTextDocument);
});

function getDocumentSettings(resource: string): Thenable<ExampleSettings> {
	if (!hasConfigurationCapability) {
		return Promise.resolve(globalSettings);
	}
	let result = documentSettings.get(resource);
	if (!result) {
		result = connection.workspace.getConfiguration({
			scopeUri: resource,
			section: 'fountain'
		});
		documentSettings.set(resource, result);
	}
	return result.then(it => it || globalSettings);
}

// Only keep settings for open documents
documents.onDidClose(e => {
	documentSettings.delete(e.document.uri);
});

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(change => {
	validateTextDocument(change.document);
});

const parsedDocuments: { [uri: string]: IFountainScript } = {};
const lines: { [uri: string]: string[] } = {};


async function validateTextDocument(textDocument: TextDocument): Promise<void> {
	const settings = await getDocumentSettings(textDocument.uri);
	const fountainrc = await getFountainrc(textDocument.uri);
	const opts= { locale: new Intl.Locale(settings.locale), fountainrc };
	const parser = new PostProcessedScript([
		new SimpleSentimentProvider(opts),
		new CharacterGenderIdentityProvider(opts),
		new CharacterRacialIdentityProvider(opts),
		new ReadingGradeProvider(opts)
	], settings);
	parsedDocuments[textDocument.uri] = await parser.parse(textDocument.getText());
	lines[textDocument.uri] = parser.lines;
	const diagnostics: Diagnostic[] = [];

	// Send the computed diagnostics to VSCode.
	connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

connection.onDidChangeWatchedFiles(async () => {
	// Monitored files have change in VSCode
	// TODO: flush config cache...
});

connection.onHover(async (params) => {
	const uri = params.textDocument.uri;
	const parsedScript = parsedDocuments[uri];
	const hoveredElements = parsedScript.getElementsByPosition(params.position);
	if (hoveredElements.length > 0) {
		const deepestHoveredElement = hoveredElements[hoveredElements.length - 1];
		const documentation = await getDocumentation(deepestHoveredElement.type);
		documentation.contents += JSON.stringify(deepestHoveredElement.elementAttributes);
		return documentation;
	}
	return null;
});

connection.onCodeLens((params) => {
	logger.log("onCodeLens");
	const uri = params.textDocument.uri;
	const parsedScript = parsedDocuments[uri];
	return [
		...dialogueLens(lines[uri], parsedScript, uri),
		...locationsLens(lines[uri], parsedScript, uri),
		...scenesLens(lines[uri], parsedScript, uri)
	];
});


connection.onCodeLensResolve((codeLens) => {
	logger.log("onCodeLensResolve");
	const args = { ...codeLens.data, range: codeLens.range };
	if (args.type === 'character') {
		codeLens.command = Command.create(`Character ${args.name} (${args.lines} lines)`, 'fountain.analyseCharacter', args);
	} else if (args.type === 'location') {
		codeLens.command = Command.create(`Location ${args.name} (${args.references} references)`, 'fountain.analyseLocation', args);
	} else if (args.type === 'scene') {
		codeLens.command = Command.create(`Scene Duration ${args.duration}`, 'fountain.analyseScene', args);
	}
	return codeLens;
});

// This handler provides the initial list of the completion items.
connection.onCompletion((documentPosition: TextDocumentPositionParams): CompletionItem[] => {
	const completions: CompletionItem[] = [];

	const parsedScript = parsedDocuments[documentPosition.textDocument.uri];
	const currentLine = lines[documentPosition.textDocument.uri][documentPosition.position.line];

	// Blank page...
	if (lines[documentPosition.textDocument.uri].join("").trim().length === 0) {
		completions.push(...openingCompletions(currentLine, parsedScript));
		completions.push(...titlePageCompletions(currentLine, parsedScript));
		completions.push(...sceneCompletions(currentLine, parsedScript));
		return completions;
	}

	// Not a blank page.
	if (isTitlePage(documentPosition, parsedScript)) {
		completions.push(...titlePageCompletions(currentLine, parsedScript));
	} else {
		completions.push(...openingCompletions(currentLine, parsedScript));
		completions.push(...sceneCompletions(currentLine, parsedScript));
		completions.push(...characterCompletions(currentLine, parsedScript));
		completions.push(...dialogueCompletions(currentLine, parsedScript));
		completions.push(...transitionCompletions(currentLine, parsedScript));
		completions.push(...closingCompletions(currentLine, parsedScript));
	}
	return completions;
}
);

// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve(
	(item: CompletionItem): CompletionItem => {
		return item;
	}
);

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
