import * as vscode from 'vscode';
import { LanguageClient, RequestType } from 'vscode-languageclient/node';
import { FountainPanel } from './FountainPanel';

export async function updateLocationStats(panel: FountainPanel, client: LanguageClient, uri: string) {
	const stats = await client.sendRequest(new RequestType("fountain.statistics.locations"), { uri } );
	panel.updateLocationStats(uri, stats);
}

export async function updateCharacterStats(panel: FountainPanel, client: LanguageClient, uri: string) {
	const stats = await client.sendRequest(new RequestType("fountain.statistics.characters"), { uri } );
	panel.updateCharacterStats(uri, stats);

}

export async function updateSceneStats(panel: FountainPanel, client: LanguageClient, uri: string) {
	const stats = await client.sendRequest(new RequestType("fountain.statistics.scenes"), { uri } );
	panel.updateSceneStats(uri, stats);
	
}

export async function updateWebviewStats(panel: FountainPanel, client: LanguageClient, uri: string) {
	await Promise.all([
		updateCharacterStats(panel, client, uri),
		updateLocationStats(panel, client, uri),
		updateSceneStats(panel, client, uri)
	]);
}

export function statsWebview(context: vscode.ExtensionContext, client: LanguageClient, uri: string) {
	const panel = FountainPanel.createOrShow(context.extensionUri, uri);

	const watcher = vscode.workspace.createFileSystemWatcher('**/*.fountain*');
	watcher.onDidChange(() => {
		updateWebviewStats(panel, client, uri);
	});

	return panel;
}

export function analyseCharacter(context: vscode.ExtensionContext, client: LanguageClient): (args: { uri: string; name: string; }) => Promise<void> {
	return async ({ uri, name }) => {
		const webview = statsWebview(context, client, uri);
		await updateWebviewStats(webview, client, uri);
		webview.analyseCharacter(uri, name);
	};
}

export function analyseLocation(context: vscode.ExtensionContext, client: LanguageClient): (args: { uri: string; name: string; }) => Promise<void> {
	return async ({ uri, name }) => {
		const webview = statsWebview(context, client, uri);
		await updateWebviewStats(webview, client, uri);
		webview.analyseLocation(uri, name );
	};
}

export function analyseScene(context: vscode.ExtensionContext, client: LanguageClient): (args: { uri: string; name: string; }) => Promise<void> {
	return async ({ uri, name }) => {
		const webview = statsWebview(context, client, uri);
		await updateWebviewStats(webview, client, uri);
		webview.analyseScene(uri, name);
	};
}
