/* eslint-disable @typescript-eslint/no-extra-non-null-assertion */
/* eslint-disable no-case-declarations */
// fountain-js 0.1.10
// http://www.opensource.org/licenses/mit-license.php

import { DialogueElement } from "./types/DialogueElement";
import { DualDialogueElement } from "./types/DualDialogueElement";
import { FountainElement } from "./types/FountainElement";
import { SceneElement } from "./types/SceneElement";
import { SectionElement } from "./types/SectionElement";
import { filterNotNull } from "./filterNotNull";
import { SourceMapElement, FountainToken, FountainTokenType } from "./types/FountainTokenType";
import { ActionElement, BoneyardElement, CenteredTextElement, FountainScript, FountainTitlePage, LineBreakElement, NotesElement, PageBreakElement, SynopsesElement, TransitionElement } from "./types";

const FountainRegexSceneHeading = /^((?:\*{0,3}_?)?(?:(?:int|ext|est|i\/e)[. ]).+)|^(?:\.(?!\.+))(.+)/i;
const FountainRegexSceneNumber = /( *#(.+)# *)/;
const FountainRegexTransition = /^((?:FADE (?:TO BLACK|OUT)|CUT TO BLACK)\.|.+ TO:)$|^(?:> *)(.+)/;
const FountainRegexCentered = /^(?:> *)(.+)(?: *<)(\n.+)*/g;
const FountainRegexSection = /^(#+)(?: *)(.*)/;
const FountainRegexSynopsis = /^(?:=(?!=+) *)(.*)/;
const FountainRegexPageBreak = /^={3,}$/;
const FountainRegexLineBreak = /^ {2}$/;
const FountainRegexEmphasis = /(_|\*{1,3}|_\*{1,3}|\*{1,3}_)(.+)(_|\*{1,3}|_\*{1,3}|\*{1,3}_)/g;
const FountainRegexBoldItalicUnderline = /(_{1}\*{3}(?=.+\*{3}_{1})|\*{3}_{1}(?=.+_{1}\*{3}))(.+?)(\*{3}_{1}|_{1}\*{3})/g;
const FountainRegexBoldUnderline = /(_{1}\*{2}(?=.+\*{2}_{1})|\*{2}_{1}(?=.+_{1}\*{2}))(.+?)(\*{2}_{1}|_{1}\*{2})/g;
const FountainRegexItalicUnderline = /(?:_{1}\*{1}(?=.+\*{1}_{1})|\*{1}_{1}(?=.+_{1}\*{1}))(.+?)(\*{1}_{1}|_{1}\*{1})/g;
const FountainRegexBoldItalic = /(\*{3}(?=.+\*{3}))(.+?)(\*{3})/g;
const FountainRegexBold = /(\*{2}(?=.+\*{2}))(.+?)(\*{2})/g;
const FountainRegexItalic = /(\*{1}(?=.+\*{1}))(.+?)(\*{1})/g;
const FountainRegexUnderline = /(_{1}(?=.+_{1}))(.+?)(_{1})/g;
const FountainRegexNewlineWithCarriageReturn = /\r\n|\r/g;

function findLastNonWhitespace(tokens: FountainToken[]) {
    for(let i = tokens.length - 1; i >= 0; --i) {
        if (tokens[i].type != 'line_break')
            return tokens[i];
    }
    return undefined;
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

/**
 * Generate a structured representation of the script.
 * 
 * @param script 
 * @returns 
 */
export function parse(script: string): FountainScript {
    const tokens = tokenize(script);
    const firstNonTitlePageElementIndex = tokens.findIndex(t => t.type !== 'title_page');
    const titlePageTokens = tokens.slice(0, firstNonTitlePageElementIndex);
    const titlePage: FountainElement = new FountainTitlePage(titlePageTokens);
    const scriptElements: FountainElement[] = _parse(tokens.slice(firstNonTitlePageElementIndex));
    return new FountainScript([titlePage].concat(scriptElements));
}

function _parse(tokens: FountainToken[], parent: null | FountainToken = null): FountainElement[] {
    const data: FountainElement[] = [];
    for (let i = 0; i < tokens.length; ++i) {
        const token = tokens[i];
        const tokenDepth = token.depth || parent?.depth || 1;
        switch (token.type) {
            case 'transition': data.push(new TransitionElement([token])); break;
            case 'synopsis': data.push (new SynopsesElement([token])); break;
            case 'action': data.push (new ActionElement([token])); break;
            case 'centered': data.push (new CenteredTextElement([token])); break;
            case 'page_break': data.push(new PageBreakElement([token])); break;
            case 'line_break': data.push(new LineBreakElement([token])); break;
            case 'boneyard':
                if(data[data.length - 1] instanceof BoneyardElement) {
                    data[data.length - 1].tokens.push(token);
                } else {
                    data.push(new BoneyardElement([token]));
                }
                break;
            case 'note':
                if(data[data.length - 1] instanceof NotesElement) {
                    data[data.length - 1].tokens.push(token);
                } else {
                    data.push(new NotesElement([token]));
                }
                break;
            case 'section':
                const [sectionTokens, sectionEnd] = tokensBetween(tokens, i, 'section', (t) => (t.depth as number) <= tokenDepth);
                data.push(new SectionElement(
                    tokens.slice(i, sectionEnd),
                    token.text || 'UNTITLED',
                    token.depth as number,
                    _parse(sectionTokens, token)
                ));
                i = sectionEnd - 1;
                break;
            case 'scene_heading':
                // Go to the next scene heading or section start whichever is closest.
                const [sceneTokens, sceneEnd] = tokensBetween(tokens, i, 'scene_heading');
                const [sceneSectionTokens, sceneSectionEnd] = tokensBetween(tokens, i, 'section', (t) => (t.depth as number) <= tokenDepth);
                const end = sceneTokens.length < sceneSectionTokens.length ? sceneEnd : sceneSectionEnd;
                const toks = sceneTokens.length < sceneSectionTokens.length ? sceneTokens : sceneSectionTokens;
                data.push(new SceneElement(
                    tokens.slice(i, end),
                    token.text || 'UNTITLED',
                    token.depth || (parent?.depth || 0) + 1,
                    _parse(toks, token)
                ));
                i = end - 1;
                break;
            // // Group dialogue lines together with the character that is speaking.
            case 'character':
                let nextNonDialogue = tokens.findIndex((t, id) => id > i && t.type !== 'dialogue' && t.type !== 'parenthetical');
                if(nextNonDialogue === -1) nextNonDialogue = tokens.length; // we must be at the end of the script
                const [nextI, result] = parseDialogue(token, tokens, i, nextNonDialogue);
                data.push(result);
                i = nextI;
                break;

            default:
                // data.push(token);
        }
    }
    return data;


}

function parseDialogue(token: FountainToken, tokens: FountainToken[], i: number, nextNonDialogue: number): [number, DialogueElement | DualDialogueElement] {
    const hasCharacterExtension = token.text && (/\(.*\)/).test(token.text);
    const extension = hasCharacterExtension ? token.text?.split('(')[1].split(')')[0] : null;
    let characterName = (hasCharacterExtension ? token.text!!.split('(')[0] : token.text!!).trim();
    if (characterName.endsWith('^')) characterName = characterName.substring(0, characterName.length - 2).trim();
    const hasParenthetical = tokens.length > i + 1 && tokens[i + 1].type === 'parenthetical';
    const parenthetical = hasParenthetical ? tokens[i + 1] : null;
    const dialogueTokens = tokens.slice(i + 1, nextNonDialogue ?? tokens.length);
    const dialogueElement: DialogueElement
        = new DialogueElement(filterNotNull([token, parenthetical, ...dialogueTokens]), characterName, extension || null, parenthetical || null, dialogueTokens);

    if (nextNonDialogue >= tokens.length || nextNonDialogue <= -1) return [-1, dialogueElement]; // bail out
    if (tokens[nextNonDialogue].type === 'character' && tokens[nextNonDialogue].text?.trim().endsWith('^')) {
        // This is dual dialogue
        const nextNextNonDialogue = tokens.findIndex((t, id) => id > i && t.type !== 'dialogue' && t.type !== 'parenthetical');
        const [nextTokenIndex, rightDialogue] = parseDialogue(tokens[nextNonDialogue], tokens, nextNonDialogue, nextNextNonDialogue);
        const children = [dialogueElement];
        if (rightDialogue instanceof DualDialogueElement) {
            children.push(...rightDialogue.children);
        } else {
            children.push(rightDialogue);
        }
        const element = new DualDialogueElement(tokens.slice(i, nextTokenIndex), children);
        return [nextTokenIndex, element];
    }
    return [nextNonDialogue, dialogueElement];
}

function tokensBetween(tokens: Array<FountainToken>, index: number, end_type: string, predicate = (t: FountainToken, i: number) => true): [Array<FountainToken>, number] {
    const endIndex = tokens.findIndex((t, idx) => idx > index && t.type === end_type && predicate(t, idx));
    if (endIndex === -1) {
        const slice = tokens.slice(index + 1, tokens.length);
        return [slice, tokens.length];
    }
    const slice = tokens.slice(index + 1, endIndex);
    return [slice, endIndex];
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

    if(line.startsWith('!')) {
        return [{ type: 'action', text: line, line, codeLocation }];
    }

    if (line.startsWith('=')) {
        return [{ type: 'synopsis', line, codeLocation, text: line.substring(1).trim() }];
    }

    // title page
    if (!lastNonWhitespaceToken || lastNonWhitespaceToken.type === 'title_page' ) {
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
    match = line.match(FountainRegexSection);
    if (match) {
        return [{ type: 'section', line, codeLocation, text: match[2], depth: match[1].length }];
    }

    // scene headings
    match = line.match(FountainRegexSceneHeading);
    if (match) {
        let text = match[1] || match[2];

        if (text.indexOf('  ') !== text.length - 2) {
            let meta;
            const metaMatch = text.match(FountainRegexSceneNumber);
            if (metaMatch) {
                meta = metaMatch[2];
                text = text.replace(FountainRegexSceneNumber, '');
            }
            return [{ type: 'scene_heading', line, codeLocation, text: text, scene_number: meta || undefined }];
        }
        return [];
    }

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
    // A Character element is any line entirely in uppercase, with one empty line before it and without an empty line after it.
    // Power User: You can force a Character element by preceding it with the "at" symbol @.
    if (line.startsWith('@') || (!isFollowedByBlankLine && lastToken?.type === 'line_break' && line.toUpperCase() === line)) {
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
