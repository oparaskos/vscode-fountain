/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as path from 'path';
import { workspace, ExtensionContext } from 'vscode';
import * as vscode from 'vscode';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node';
import { analyseCharacter, analyseLocation, analyseScene } from './webview';
import { FountainPanel } from './FountainPanel';

let client: LanguageClient;


export function activate(context: ExtensionContext) {
	// The server is implemented in node
	const serverModule = context.asAbsolutePath(
		path.join('server', 'dist', 'bundle.cjs.js')
	);
	// The debug options for the server
	// --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
	const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: debugOptions
		}
	};

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [{ language: 'fountain' }],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: workspace.createFileSystemWatcher('**/.fountainrc')
		}
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		'fountain',
		'Fountain',
		serverOptions,
		clientOptions
	);

	if (vscode.window.registerWebviewPanelSerializer) {
		// Make sure we register a serializer in activation event
		vscode.window.registerWebviewPanelSerializer(FountainPanel.viewType, {
			async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: Record<string, unknown> & {uri: string}) {
				// Reset the webview options so we use latest uri for `localResourceRoots`.
				webviewPanel.webview.options = FountainPanel.getWebviewOptions(context.extensionUri);
				FountainPanel.revive(webviewPanel, context.extensionUri, state.uri);
			}

		});
	}

	context.subscriptions.push(vscode.commands.registerCommand("fountain.analyseCharacter", analyseCharacter(context, client)));
	context.subscriptions.push(vscode.commands.registerCommand("fountain.analyseLocation", analyseLocation(context, client)));
	context.subscriptions.push(vscode.commands.registerCommand("fountain.analyseScene", analyseScene(context, client)));

	// Start the client. This will also launch the server
	client.start();
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
