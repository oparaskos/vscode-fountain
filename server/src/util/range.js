"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.positionInRange = exports.tokensToRange = void 0;
function tokensToRange(tokens) {
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
exports.tokensToRange = tokensToRange;
function positionInRange(position, range) {
    if (range.start.line > position.line)
        return false;
    if (range.end.line < position.line)
        return false;
    if (position.line === range.start.line && position.character < range.start.character)
        return false;
    if (position.line === range.end.line && position.character > range.end.character)
        return false;
    return true;
}
exports.positionInRange = positionInRange;
//# sourceMappingURL=range.js.map