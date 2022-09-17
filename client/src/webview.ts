import * as path from 'path';
import * as vscode from 'vscode';
import {readFile} from 'fs/promises';
import {join} from 'path';

async function loadWebviewHtml(context: vscode.ExtensionContext, relativePath: string) {
	const absolutePath = vscode.Uri.file(join(context.extensionPath, relativePath));
	console.log(absolutePath.fsPath);
	return (await readFile(absolutePath.fsPath)).toString('utf-8');
}

const _statsPanels: vscode.WebviewPanel[] = [];
function statsPanel(context: vscode.ExtensionContext, fileName: string) {
	const baseFileName = path.basename(fileName);
	const fileNameParts = baseFileName.split('.');
	const panelName = fileNameParts.splice(0, fileNameParts.length - 1).join(".");

	if (!_statsPanels[panelName]) {
		//The stats panel didn't already exist
		_statsPanels[panelName] = vscode.window.createWebviewPanel(
			'fountain-statistics',
			panelName,
			vscode.ViewColumn.Three,
			{ enableScripts: true, });

		const cssDiskPath = vscode.Uri.file(path.join(context.extensionPath, 'node_modules', 'vscode-codicons', 'dist', 'codicon.css'));
		loadWebviewHtml(context, join("webviews", "stats.html")).then((result) => {
			_statsPanels[panelName].webview.html = result
				.replace("$CODICON_CSS$", _statsPanels[panelName].webview.asWebviewUri(cssDiskPath).toString());
		});
	
	}
	return _statsPanels[panelName];
}

export function analyseCharacter(context: vscode.ExtensionContext): (args: { uri: any; name: any; }) => any  {
	return ({ uri, name }) => {
		console.log("Analyse: " + name);
		statsPanel(context, uri).webview.postMessage({ command: "fountain.analyseCharacter", uri, name });
		return;
	}
};
