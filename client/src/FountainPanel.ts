import { readFile } from 'fs/promises';
import { basename, join } from 'path';
import * as vscode from 'vscode';
import { URI, Utils } from 'vscode-uri';

export function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

export class FountainPanel {
	/**
	 * Track the currently panel. Only allow a single panel to exist at a time.
	 */
	public static currentPanel: FountainPanel | undefined;

	public static readonly viewType = 'vscode-fountain.fountainStats';

	private readonly _panel: vscode.WebviewPanel;
	private readonly _extensionUri: vscode.Uri;
	private _disposables: vscode.Disposable[] = [];

	public static getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
		return {
			// Enable javascript in the webview
			enableScripts: true,
	
			// And restrict the webview to only loading content from our extension's `media` directory.
			localResourceRoots: [vscode.Uri.joinPath(extensionUri)]
		};
	}

	public static createOrShow(extensionUri: vscode.Uri, uri: string) {
		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

		// If we already have a panel, show it.
		if (FountainPanel.currentPanel) {
			FountainPanel.currentPanel._panel.reveal(column);
			FountainPanel.currentPanel.setUri(uri);
			return FountainPanel.currentPanel;
		}

		// Otherwise, create a new panel.
		const panel = vscode.window.createWebviewPanel(
			FountainPanel.viewType,
			basename(uri),
			column || vscode.ViewColumn.One,
			this.getWebviewOptions(extensionUri),
		);

		FountainPanel.currentPanel = new FountainPanel(panel, extensionUri, uri);
		return FountainPanel.currentPanel;
	}

	public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, uri: string) {
		FountainPanel.currentPanel = new FountainPanel(panel, extensionUri, uri);
	}

	private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, uri: string) {
		this._panel = panel;
		this._extensionUri = extensionUri;

		// Set the webview's initial html content
		this._update().then(() => {
			// Listen for when the panel is disposed
			// This happens when the user closes the panel or when the panel is closed programmatically
			this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

			// Update the content based on view changes
			this._panel.onDidChangeViewState(
				e => {
					if (this._panel.visible) {
						return this._update();
					}
				},
				null,
				this._disposables
			);

			// Handle messages from the webview
			this._panel.webview.onDidReceiveMessage(
				message => {
					switch (message.command) {
						case 'alert':
							return vscode.window.showErrorMessage(message.text);
						case 'open':
							return this.handleOpenLink(message, uri);
					}
				},
				null,
				this._disposables
			);

			this.setUri(uri);
		})
	}

	public updateSceneStats(uri: string, stats: unknown) {
		this._panel.webview.postMessage({ command: "fountain.statistics.scenes", uri, stats });
	}
	public updateCharacterStats(uri: string, stats: unknown) {
		this._panel.webview.postMessage({ command: "fountain.statistics.characters", uri, stats });
	}
	public updateLocationStats(uri: string, stats: unknown) {
		this._panel.webview.postMessage({ command: "fountain.statistics.locations", uri, stats });
	}
	public analyseScene(uri: string, name: string) {
		this._panel.webview.postMessage({ command: "fountain.analyseScene", uri, name });
	}
	public analyseLocation(uri: string, name: string) {
		this._panel.webview.postMessage({ command: "fountain.analyseLocation", uri, name });
	}
	public analyseCharacter(uri: string, name: string) {
		this._panel.webview.postMessage({ command: "fountain.analyseCharacter", uri, name });
	}
	public setUri(uri) {
		// Send a message to the webview webview.
		// You can send any JSON serializable data.
		this._panel.webview.postMessage({ command: 'opened', uri });
	}

	private async handleOpenLink(message: any, uri: string) {
		const link = URI.parse(message.link);

		console.log("Open file `" + message.link + "` relative to `" + uri + '`')
		
		let base = URI.parse(uri);
		const fileToOpen = Utils.joinPath(Utils.dirname(base), link.path);
		console.log(fileToOpen)

		const line = (+link.fragment.substring(1)) - 1;
		
		const editor = await vscode.window.showTextDocument(fileToOpen, {});
		editor.revealRange(new vscode.Range(line, 0, line, 0), vscode.TextEditorRevealType.InCenterIfOutsideViewport);
	}

	public dispose() {
		FountainPanel.currentPanel = undefined;

		// Clean up our resources
		this._panel.dispose();

		while (this._disposables.length) {
			const x = this._disposables.pop();
			if (x) {
				x.dispose();
			}
		}
	}

	private async _update() {
		const webview = this._panel.webview;
		this._panel.webview.html = await this._getHtmlForWebview(webview);
	}

	private async _loadHtmlFromDisk(extensionPath: string, relativePath: string) {
		const absolutePath = vscode.Uri.file(join(extensionPath, relativePath));
		return (await readFile(absolutePath.fsPath)).toString('utf-8');
	}

	private async _getHtmlForWebview(webview: vscode.Webview) {
		const relativePath = join("webviews", "stats.html");
		const baseUri = vscode.Uri.joinPath(this._extensionUri, relativePath);

		return this._loadHtmlFromDisk(this._extensionUri.fsPath, relativePath)
			.then((result) =>  result
				.replace("${baseUri}", webview.asWebviewUri(baseUri).toString())
				.replace("${webview.cspSource}", webview.cspSource)
				.replace("${nonce}", getNonce()) // Use a nonce to only allow specific scripts to be run
				.replace("${pageTitle}", this._panel.title)
			);
	}
}