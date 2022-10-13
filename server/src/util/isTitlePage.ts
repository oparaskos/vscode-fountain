import { TextDocumentPositionParams } from "vscode-languageserver";
import { FountainScript, FountainTitlePage } from "fountain-parser";
import { tokensToRange, positionInRange } from './range';



export function isTitlePage(documentPosition: TextDocumentPositionParams, parsedScript: FountainScript): boolean {
    const titlePage = parsedScript.children[0];
    if (!(titlePage instanceof FountainTitlePage))
        return false;
    const titlePageRange = tokensToRange(titlePage.tokens);
    if (positionInRange(documentPosition.position, titlePageRange))
        return true;
    return false;
}
