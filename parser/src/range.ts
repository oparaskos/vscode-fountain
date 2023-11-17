import { FountainToken } from './types/FountainTokenType';
import { Range } from './types/Range';
import { Position } from './types/Position';

export function tokensToRange(tokens: FountainToken[]): Range | null {
    if (tokens.length == 0) {
        return null;
    }
    const start = tokens[0].codeLocation.start;
    const end = tokens[tokens.length - 1].codeLocation.end;
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


