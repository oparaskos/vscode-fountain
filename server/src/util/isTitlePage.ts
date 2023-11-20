import { TextDocumentPositionParams } from "vscode-languageserver";
import { FountainScript, FountainTitlePage,  tokensToRange, positionInRange } from 'fountain-parser';

export function isTitlePage(documentPosition: TextDocumentPositionParams, parsedScript: FountainScript): boolean {
    const titlePage = parsedScript.children[0];
    if (!(titlePage instanceof FountainTitlePage))
        return false;
    const titlePageRange = tokensToRange(titlePage.tokens);
    if (titlePageRange != null && positionInRange(documentPosition.position, titlePageRange))
        return true;
    return false;
}
