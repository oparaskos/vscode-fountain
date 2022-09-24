import { FountainElement } from "../parser/types/FountainElement";
import { Position, Range, TextDocumentPositionParams } from "vscode-languageserver";
import { FountainScript, FountainTitlePage } from "../parser/types";

export function elementToRange(element: FountainElement): Range {
    const start = element.tokens[0].codeLocation.start;
    const end = element.tokens[element.tokens.length - 1].codeLocation.end;
    return {
        start: {
            character: start.column,
            line: start.line
        },
        end: {
            line: end.line,
            character: end.column,
        }
    };
}

export function positionInRange(position: Position, range: Range): boolean {
    if (range.start.line > position.line) return false;
    if (range.end.line < position.line) return false;
    if (position.line === range.start.line && position.character < range.start.character) return false;
    if (position.line === range.end.line && position.character > range.end.character) return false;
    return true;
}


export function isTitlePage(documentPosition: TextDocumentPositionParams, parsedScript: FountainScript): boolean {
    const titlePage = parsedScript.children[0];
    if (!(titlePage instanceof FountainTitlePage)) return false;
    const titlePageRange = elementToRange(titlePage);
    if (positionInRange(documentPosition.position, titlePageRange)) return true;
    return false;
}