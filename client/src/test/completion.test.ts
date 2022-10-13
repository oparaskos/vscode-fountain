/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as vscode from 'vscode';
import * as assert from 'assert';
import { getDocUri, activate } from './helper';
import { CompletionItemKind } from 'vscode-languageclient';

suite('Should do completion', () => {
	const docUri = getDocUri('completion.fountain');

	test('Complete Title Page Properties', async () => {
		await testCompletion(docUri,
			new vscode.Position(0, 0),
			false,
			{
				items: [
					{ label: 'Author', kind: CompletionItemKind.Module },
					{ label: 'Title', kind: CompletionItemKind.Module },
					{ label: 'Source', kind: CompletionItemKind.Module },
					{ label: 'Revision', kind: CompletionItemKind.Module }
				]
			});
	});
});

async function testCompletion(
	docUri: vscode.Uri,
	position: vscode.Position,
	exclusive: boolean,
	expectedCompletionList: vscode.CompletionList
) {
	await activate(docUri);

	// Executing the command `vscode.executeCompletionItemProvider` to simulate triggering completion
	const actualCompletionList = (await vscode.commands.executeCommand(
		'vscode.executeCompletionItemProvider',
		docUri,
		position
	)) as vscode.CompletionList;

	try {
		if (exclusive) assert.ok(actualCompletionList.items.length >= 2);
		expectedCompletionList.items.forEach((expectedItem) => {
			const actualItem = actualCompletionList.items.find(it => it.label === expectedItem.label);
			assert.ok(actualItem);
			if(expectedItem.kind) assert.equal(actualItem.kind, expectedItem.kind);
		});
	} catch(e) {
		throw new assert.AssertionError({
			message: e.message,
			actual: actualCompletionList.items.map(item => ({label: item.label, kind: item.kind})),
			expected: expectedCompletionList.items.map(item => ({label: item.label, kind: item.kind}))
		});
	}
}
