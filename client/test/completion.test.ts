/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as vscode from 'vscode';
import * as assert from 'assert';
import { getDocUri, activate } from './helper';

suite('Should do completion', () => {
    const docUri = getDocUri('completion.fountain');

    test('Completes Title Page Properties', async () => {
        await testCompletion(docUri, vscode.CompletionItemKind.Property, new vscode.Position(0, 0), {
            items: [
                {
                    "label": "Author",
                    "detail": "The name of the author",
                },
                {
                    "label": "BL",
                    "detail": "Bottom Left",
                },
                {
                    "label": "BR",
                    "detail": "Bottom Right",
                },
                {
                    "label": "CC",
                    "detail": "Center Center",
                },
                {
                    "label": "Contact",
                    "detail": "Contact details",
                },
                {
                    "label": "Copyright",
                    "detail": "Copyright information",
                },
                {
                    "label": "Credit",
                    "detail": "How the author is credited",
                },
                {
                    "label": "Date",
                    "detail": "The date of the screenplay",
                },
                {
                    "label": "Draft Date",
                    "detail": "The date of the current draft",
                },
                {
                    "label": "Font",
                    "detail": "The font used in the screenplay",
                },
                {
                    "label": "Footer",
                    "detail": "Header used throughout the document",
                },
                {
                    "label": "Header",
                    "detail": "Header used throughout the document",
                },
                {
                    "label": "Notes",
                    "detail": "Additional notes",
                },
                {
                    "label": "Revision",
                    "detail": "The name of the current and past revisions",
                },
                {
                    "label": "Source",
                    "detail": "An additional source for the screenplay",
                },
                {
                    "label": "TC",
                    "detail": "Top Center",
                },
                {
                    "label": "Title",
                    "detail": "The title of the screenplay",
                },
                {
                    "label": "TL",
                    "detail": "Top Left",
                },
                {
                    "label": "TR",
                    "detail": "Top Right",
                },
                {
                    "label": "Watermark",
                    "detail": "A watermark displayed on every page",
                }
            ]
        });
    });
    test('Completes Scene Transitions', async () => {
        await testCompletion(docUri, vscode.CompletionItemKind.Event,new vscode.Position(0, 0), {
            items: [
                { "label": "FADE IN:" },
            ]
        });
    });

    test('Completes Scene Starters', async () => {
        await testCompletion(docUri, vscode.CompletionItemKind.Class,new vscode.Position(0, 0), {
            items: [
                { "label": "EST. " },
                { "label": "EXT. " },
                { "label": "INT. " },
                { "label": "INT/EXT. " },
            ]
        });
    });
});

async function testCompletion(
    docUri: vscode.Uri,
    kind: vscode.CompletionItemKind,
    position: vscode.Position,
    expectedCompletionList: vscode.CompletionList
) {
    await activate(docUri);

    // Executing the command `vscode.executeCompletionItemProvider` to simulate triggering completion
    const actualCompletionList = (await vscode.commands.executeCommand(
        'vscode.executeCompletionItemProvider',
        docUri,
        position
    )) as vscode.CompletionList;

    assert.ok(actualCompletionList.items.length >= 2);
    expectedCompletionList.items.forEach((expectedItem, i) => {
        const actualItem = actualCompletionList.items.find(it => it.label === expectedItem.label);
        assert.ok(actualItem)
        assert.equal(actualItem?.sortText, expectedItem.label);
        assert.equal(actualItem?.insertText, expectedItem.label);
        assert.equal(actualItem?.kind, kind);
        assert.equal(actualItem?.detail, expectedItem.detail);
    });
}



