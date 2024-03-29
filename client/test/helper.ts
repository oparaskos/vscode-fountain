/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as vscode from 'vscode';
import * as path from 'path';

export let doc: vscode.TextDocument;
export let editor: vscode.TextEditor;
export let documentEol: string;
export let platformEol: string;

export const EXTENSION_NAME = "fountain-lsp";
export const EXTENSION_PUBLISHER = "oliverparaskos";


function getExtension<T>(s: string, t?: string): vscode.Extension<T> {
    if(!t) return getExtensionById<T>(s);
    return getExtensionByNameAndPublisher<T>(s, t);
}

function getExtensionByNameAndPublisher<T>(publisher: string, name: string): vscode.Extension<T> {
    return getExtensionById<T>([publisher, name].join('.'));
}

/**
 * @param extensionId is `publisher.name` from package.json
 */ 
function getExtensionById<T>(extensionId: string): vscode.Extension<T> {
	const ext = vscode.extensions.getExtension(extensionId);
	if(!ext) throw new Error(`Could not get extension ${extensionId}`);
	return ext;
}

/**
 * Activates the vscode.lsp-sample extension
 */
export async function activate(docUri: vscode.Uri) {
    console.log({EXTENSION_PUBLISHER, EXTENSION_NAME});
	const ext = getExtension(EXTENSION_PUBLISHER, EXTENSION_NAME);
	await ext.activate();
	try {
		doc = await vscode.workspace.openTextDocument(docUri);
		editor = await vscode.window.showTextDocument(doc);
		await sleep(2000); // Wait for server activation
	} catch (e) {
		console.error(e);
	}
}

async function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export const getDocPath = (p: string) => {
	return path.resolve(__dirname, '../../testFixture', p);
};
export const getDocUri = (p: string) => {
	return vscode.Uri.file(getDocPath(p));
};

export async function setTestContent(content: string): Promise<boolean> {
	const all = new vscode.Range(
		doc.positionAt(0),
		doc.positionAt(doc.getText().length)
	);
	return editor.edit(eb => eb.replace(all, content));
}
