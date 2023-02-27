import { TextDocumentPositionParams } from "vscode-languageserver";
import { FountainTitlePage } from "fountain-parser";
import { tokensToRange, positionInRange } from './range';
import { IFountainScript } from 'fountain-parser/src/types';



export function isTitlePage(documentPosition: TextDocumentPositionParams, parsedScript: IFountainScript): boolean {
    const titlePage = parsedScript.children[0];
    if (!(titlePage instanceof FountainTitlePage))
        return false;
    const titlePageRange = tokensToRange(titlePage.tokens);
    if (positionInRange(documentPosition.position, titlePageRange))
        return true;
    return false;
}
