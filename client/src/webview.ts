import * as vscode from 'vscode';
import { readFile } from 'fs/promises';
import { join, basename } from 'path';
import { LanguageClient, RequestType } from 'vscode-languageclient/node';
import { ClientRequest } from 'http';
import { Console } from 'console';

async function loadWebviewHtml(context: vscode.ExtensionContext, relativePath: string) {
	const absolutePath = vscode.Uri.file(join(context.extensionPath, relativePath));
	return (await readFile(absolutePath.fsPath)).toString('utf-8');
}

const _statsPanels: {[key: string]: vscode.WebviewPanel} = {};
function webviewPanel(context: vscode.ExtensionContext, fileName: string, onDispose: (arg0: void) => void = (() => {return;})) {
	const baseFileName = basename(fileName);
	const fileNameParts = baseFileName.split('.');
	const panelName = fileNameParts.splice(0, fileNameParts.length - 1).join(".");

	if (!_statsPanels[panelName]) {
		//The stats panel didn't already exist
		_statsPanels[panelName] = vscode.window.createWebviewPanel(
			'fountain-statistics',
			panelName,
			vscode.ViewColumn.Three,
			{ enableScripts: true, });

		_statsPanels[panelName].onDidDispose((e) => {
			delete _statsPanels[panelName];
			onDispose(e);
		});

		const relativePath = join("webviews", "stats.html");
		const baseUri = vscode.Uri.joinPath(context.extensionUri, relativePath);
		const webview = _statsPanels[panelName].webview;

		loadWebviewHtml(context, relativePath).then((result) => {
			webview.html = result
			.replace("${baseUri}", webview.asWebviewUri(baseUri).toString())
			.replace("${pageTitle}", panelName);
		});
	}
	return _statsPanels[panelName];
}

export async function updateLocationStats(webview: vscode.Webview, client: LanguageClient, uri: string) {
	const stats = await client.sendRequest(new RequestType("fountain.statistics.locations"), { uri } );
	webview.postMessage({ command: "fountain.statistics.locations", uri, stats });
	
}

export async function updateCharacterStats(webview: vscode.Webview, client: LanguageClient, uri: string) {
	const stats = await client.sendRequest(new RequestType("fountain.statistics.characters"), { uri } );
	webview.postMessage({ command: "fountain.statistics.characters", uri, stats });
}

export async function updateSceneStats(webview: vscode.Webview, client: LanguageClient, uri: string) {
	const stats = await client.sendRequest(new RequestType("fountain.statistics.scenes"), { uri } );
	webview.postMessage({ command: "fountain.statistics.scenes", uri, stats });
}

export async function updateWebviewStats(webview: vscode.Webview, client: LanguageClient, uri: string) {
	await Promise.all([
		updateCharacterStats(webview, client, uri),
		updateLocationStats(webview, client, uri),
		updateSceneStats(webview, client, uri)
	]);
}

export function statsWebview(context: vscode.ExtensionContext, client: LanguageClient, uri: string) {
	const watcher = vscode.workspace.createFileSystemWatcher('**/*.fountain*');
	watcher.onDidChange((e) => {
		updateWebviewStats(panel.webview, client, uri);
	});
	const panel = webviewPanel(context, uri, () => {
		watcher.dispose();
	});
	return panel.webview;
}

export function analyseCharacter(context: vscode.ExtensionContext, client: LanguageClient): (args: { uri: any; name: any; }) => any  {
	return async ({ uri, name }) => {
		const webview = statsWebview(context, client, uri);
		await updateWebviewStats(webview, client, uri);
		webview.postMessage({ command: "fountain.analyseCharacter", uri, name });
	};
}

export function analyseLocation(context: vscode.ExtensionContext, client: LanguageClient): (args: { uri: any; name: any; }) => any  {
	return async ({ uri, name }) => {
		const webview = statsWebview(context, client, uri);
		await updateWebviewStats(webview, client, uri);
		webview.postMessage({ command: "fountain.analyseLocation", uri, name });
	};
}

export function analyseScene(context: vscode.ExtensionContext, client: LanguageClient): (args: { uri: any; name: any; }) => any  {
	return async ({ uri, name }) => {
		const webview = statsWebview(context, client, uri);
		await updateWebviewStats(webview, client, uri);
		webview.postMessage({ command: "fountain.analyseScene", uri, name });
	};
}
