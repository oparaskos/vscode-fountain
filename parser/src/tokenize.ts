import { SourceMapElement, FountainToken, FountainTokenType } from "./types/FountainTokenType";

const FountainRegexSceneHeading = /^((?:\*{0,3}_?)?(?:(?:int|ext|est|i\/e)[. ]).+)|^(?:\.(?!\.+))(.+)/i;
const FountainRegexSceneNumber = /( *#(.+)# *)/;
const FountainRegexTransition = /^((?:FADE (?:TO BLACK|OUT)|CUT TO BLACK)\.|.+ TO:)$|^(?:> *)(.+)/;
const FountainRegexCentered = /^(?:> *)(.+)(?: *<)(\n.+)*/g;
const FountainRegexSection = /^(#+)(?: *)(.*)/;
const FountainRegexSynopsis = /^(?:=(?!=+) *)(.*)/;
const FountainRegexPageBreak = /^={3,}$/;
const FountainRegexLineBreak = /^ {2}$/;
const FountainRegexNewlineWithCarriageReturn = /\r\n|\r/g;

// TODO: handle formatting here or in the presentation layer?
// const FountainRegexEmphasis = /(_|\*{1,3}|_\*{1,3}|\*{1,3}_)(.+)(_|\*{1,3}|_\*{1,3}|\*{1,3}_)/g;
// const FountainRegexBoldItalicUnderline = /(_{1}\*{3}(?=.+\*{3}_{1})|\*{3}_{1}(?=.+_{1}\*{3}))(.+?)(\*{3}_{1}|_{1}\*{3})/g;
// const FountainRegexBoldUnderline = /(_{1}\*{2}(?=.+\*{2}_{1})|\*{2}_{1}(?=.+_{1}\*{2}))(.+?)(\*{2}_{1}|_{1}\*{2})/g;
// const FountainRegexItalicUnderline = /(?:_{1}\*{1}(?=.+\*{1}_{1})|\*{1}_{1}(?=.+_{1}\*{1}))(.+?)(\*{1}_{1}|_{1}\*{1})/g;
// const FountainRegexBoldItalic = /(\*{3}(?=.+\*{3}))(.+?)(\*{3})/g;
// const FountainRegexBold = /(\*{2}(?=.+\*{2}))(.+?)(\*{2})/g;
// const FountainRegexItalic = /(\*{1}(?=.+\*{1}))(.+?)(\*{1})/g;
// const FountainRegexUnderline = /(_{1}(?=.+_{1}))(.+?)(_{1})/g;

function findLastNonWhitespace(tokens: FountainToken[]) {
    for(let i = tokens.length - 1; i >= 0; --i) {
        if (tokens[i].type != 'line_break')
            return tokens[i];
    }
    return undefined;
}


function matchCharacter(isFollowedByBlankLine: boolean, lastToken: FountainToken | undefined, line: string, codeLocation: SourceMapElement): FountainToken[] | false {
    // A Character element is any line entirely in uppercase, with one empty line before it and without an empty line after it.
    // Power User: You can force a Character element by preceding it with the "at" symbol @.
    if (!isFollowedByBlankLine && lastToken?.type === 'line_break' && line.toUpperCase() === line) {
        return [{ type: 'character', line, codeLocation, text: line.replace(/^@/, '') }];
    }
    // Parentheticals follow a Character or Dialogue element, and are wrapped in parentheses ().
    if ((lastToken?.type === 'character' || lastToken?.type === 'dialogue')
        && (line.trim().startsWith('(') && line.trim().endsWith(')'))) {
        return [{ type: 'parenthetical', line, codeLocation, text: line.replace(/^\(|\)$/g, '') }];
    }

    // Dialogue is any text following a Character or Parenthetical element.
    if (lastToken?.type === 'character' || lastToken?.type === 'parenthetical' || lastToken?.type === 'dialogue') {
        return [{ type: 'dialogue', line, codeLocation, text: line }];
    }
    return false;
}

function matchSectionHeading(line: string, codeLocation: SourceMapElement): FountainToken[] | false {
    const match = line.match(FountainRegexSection);
    if (match) {
        return [{ type: 'section', line, codeLocation, text: match[2], depth: match[1].length }];
    }
    return false;
}

function matchSceneHeading(line: string, codeLocation: SourceMapElement): FountainToken[] | false {
    const match = line.match(FountainRegexSceneHeading);
    if(!match) return false;

    let text = match[1] || match[2];

    if (text.indexOf('  ') !== text.length - 2) {
        let meta;
        const metaMatch = text.match(FountainRegexSceneNumber);
        if (metaMatch) {
            meta = metaMatch[2];
            text = text.replace(FountainRegexSceneNumber, '');
        }
        return [{ type: 'scene_heading', line, codeLocation, text: text, scene_number: meta }];
    }
    return [];
}

function extractBoneyardTokens(line: string, codeLocation: SourceMapElement, lastToken: FountainToken | undefined,
    lastNonWhitespaceToken: FountainToken | undefined, isFollowedByBlankLine: boolean): FountainToken[] {
    return extractMultilineCommentTokens(line, codeLocation, lastToken, lastNonWhitespaceToken, '/*', '*/', 'boneyard', 'boneyard_begin', 'boneyard_end', isFollowedByBlankLine);
}

function extractNoteTokens(line: string, codeLocation: SourceMapElement, lastToken: FountainToken | undefined,
    lastNonWhitespaceToken: FountainToken | undefined, isFollowedByBlankLine: boolean): FountainToken[] {
    return extractMultilineCommentTokens(line, codeLocation, lastToken, lastNonWhitespaceToken, '[[', ']]', 'note', 'note_begin', 'note_end', isFollowedByBlankLine);
}


function extractMultilineCommentTokens(
    line: string,
    codeLocation: SourceMapElement,
    lastToken: FountainToken | undefined,
    lastNonWhitespaceToken: FountainToken | undefined,
    comment_start_str: string,
    comment_end_str: string,
    comment_type: FountainTokenType,
    comment_start_type: FountainTokenType,
    comment_end_type: FountainTokenType,
    isFollowedByBlankLine: boolean
) {
    const isComment = lastToken?.type === comment_type;
    const commentTokens: FountainToken[] = [];
    if (!isComment && line.indexOf(comment_start_str) > -1) {
        const lineParts = line.split(comment_start_str);
        line = lineParts[0];
        commentTokens.push(...extractToken(line, {
            file: codeLocation.file,
            start: codeLocation.start,
            end: {
                column: codeLocation.start.column + line.length,
                index: codeLocation.start.index + line.length,
                line: codeLocation.start.line,
            },
        }, lastToken, lastNonWhitespaceToken, false));
        commentTokens.push({
            type: comment_start_type, line, codeLocation: {
                file: codeLocation.file,
                start: commentTokens[commentTokens.length - 1].codeLocation.end,
                end: {
                    column: codeLocation.start.column + line.length + comment_start_str.length,
                    index: codeLocation.start.index + line.length + comment_start_str.length,
                    line: codeLocation.start.line,
                },
            }, text: ''
        });
        commentTokens.push({
            type: comment_type, line, codeLocation: {
                file: codeLocation.file,
                start: commentTokens[commentTokens.length - 1].codeLocation.end,
                end: codeLocation.end,
            }, text: lineParts[1]
        });
    }
    if (line.indexOf(comment_end_str) > -1) {
        const lineParts = line.split(comment_end_str);
        line = lineParts[1];
        commentTokens.push({
            type: comment_type, line, codeLocation: {
                file: codeLocation.file,
                start: codeLocation.start,
                end: {
                    column: codeLocation.start.column + lineParts[0].length,
                    index: codeLocation.start.index + lineParts[0].length,
                    line: codeLocation.start.line,
                },
            }, text: lineParts[0]
        });
        const commentEndToken = {
            type: comment_end_type, line, codeLocation: {
                file: codeLocation.file,
                start: commentTokens[commentTokens.length - 1].codeLocation.end,
                end: {
                    column: codeLocation.start.column + line.length + comment_end_str.length,
                    index: codeLocation.start.index + line.length + comment_end_str.length,
                    line: codeLocation.start.line,
                },
            }, text: ''
        };
        commentTokens.push(commentEndToken);
        commentTokens.push(...extractToken(line, {
            file: codeLocation.file,
            start: commentEndToken.codeLocation.end,
            end: codeLocation.end,
        }, commentEndToken, commentEndToken, isFollowedByBlankLine));
    }
    if (isComment && commentTokens.length === 0) {
        commentTokens.push({ type: comment_type, line, codeLocation, text: line });
    }
    return commentTokens;
}


/**
 * Extract a list of tokens from a line.
 * 
 * @param line
 * @param codeLocation 
 * @param lastToken 
 * @param isFollowedByBlankLine 
 * @returns 
 */
 function extractToken(line: string, codeLocation: SourceMapElement, lastToken: FountainToken | undefined, lastNonWhitespaceToken: FountainToken | undefined, isFollowedByBlankLine: boolean): FountainToken[] {
    let match;

    const forcedType = forcesElementType(line, codeLocation);
    if (forcedType !== false) {
        return forcedType;
    }

    // title page
    const titlePage = extractTitlePage(lastNonWhitespaceToken, line, codeLocation, lastToken);
    if(titlePage ) {
        return titlePage;
    }

    if (line.trim().length === 0) {
        return [{
            type: 'line_break',
            line,
            text: '\n',
            codeLocation,
        }];
    }

    // boneyard
    const boneyardTokens: FountainToken[] = extractBoneyardTokens(line, codeLocation, lastToken, lastNonWhitespaceToken, isFollowedByBlankLine);
    if (boneyardTokens.length > 0) {
        return boneyardTokens;
    }

    // note
    const noteTokens: FountainToken[] = extractNoteTokens(line, codeLocation, lastToken, lastNonWhitespaceToken, isFollowedByBlankLine);
    if (noteTokens.length > 0) {
        return noteTokens;
    }


    // section
    const sectionHeading = matchSectionHeading(line, codeLocation);
    if (sectionHeading) { return sectionHeading; }

    // scene headings
    const sceneHeading = matchSceneHeading(line, codeLocation);
    if (sceneHeading) { return sceneHeading; }

    // centered
    match = line.match(FountainRegexCentered);
    if (match) {
        return [{ type: 'centered', line, codeLocation, text: match[0].replace(/>|</g, '') }];
    }

    // transitions
    match = line.match(FountainRegexTransition);
    if (match) {
        return [{ type: 'transition', line, codeLocation, text: line }];
    }

    // character
    const character = matchCharacter(isFollowedByBlankLine, lastToken, line, codeLocation);
    if(character) return character;



    // synopsis
    match = line.match(FountainRegexSynopsis);
    if (match) {
        return [{ type: 'synopsis', line, codeLocation, text: match[1] }];
    }

    // page breaks
    if (FountainRegexPageBreak.test(line)) {
        return [{ type: 'page_break', line, codeLocation }];
    }

    // line breaks
    if (FountainRegexLineBreak.test(line)) {
        return [{ type: 'line_break', line, codeLocation }];
    }

    return [{ type: 'action', text: line, line, codeLocation }];
}

function extractTitlePage(lastNonWhitespaceToken: FountainToken | undefined, line: string, codeLocation: SourceMapElement, lastToken: FountainToken | undefined): FountainToken[] | false {
    if (!lastNonWhitespaceToken || lastNonWhitespaceToken.type === 'title_page') {
        const colonLocation = line.indexOf(':');
        if (colonLocation > -1) {
            return [{
                type: 'title_page',
                line,
                key: line.substring(0, colonLocation).trim(),
                text: line.substring(colonLocation + 1).trim(),
                codeLocation: codeLocation,
            }];
        } else if (lastToken?.type === 'title_page') {
            // title page values can have newlines so this must be a continuation of a previous property
            lastToken.text += '\n' + line;
            lastToken.codeLocation.end = codeLocation.end;
        }
    }
    return false;
}

function forcesElementType(line: string, codeLocation: SourceMapElement): FountainToken[] | false {
    if(line.startsWith('!')) {
        return [{ type: 'action', text: line, line, codeLocation }];
    }

    if (line.startsWith('=')) {
        return [{ type: 'synopsis', line, codeLocation, text: line.substring(1).trim() }];
    }

    if (line.startsWith('@')) {
        return [{ type: 'character', line, codeLocation, text: line.replace(/^@/, '') }];
    }

    return false;
}

/**
 * Extract a flat list of tokens preserving as much as possible the original document.
 *
 * @note this enforces '\n' line endings -- this could cause source locations by index to be a bit mucked up.
 * @param script
 * @returns
 */
 export function tokenize(script: string) {
    const lines = script.replace(FountainRegexNewlineWithCarriageReturn, '\n').split('\n');
    const tokens: Array<FountainToken> = [];

    let characterIndex = 0;
    for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
        const line = lines[lineNumber].trim();
        const lastToken = tokens[tokens.length - 1];
        const lastNonWhitespaceToken = findLastNonWhitespace(tokens);
        const codeLocation: SourceMapElement = {
            file: '',
            start: {
                line: lineNumber,
                column: 0,
                index: characterIndex,
            },
            end: {
                line: lineNumber,
                column: line.length + 1,
                index: characterIndex + line.length + 1,
            },
        };

        const isFollowedByBlankLine = lineNumber + 1 < lines.length && lines[lineNumber + 1].trim() === '';

        const newTokens = extractToken(line, codeLocation, lastToken, lastNonWhitespaceToken, isFollowedByBlankLine);
        tokens.push(...newTokens);
        characterIndex += line.length + 1;
    }
    return tokens;
}
