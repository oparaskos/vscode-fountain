/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-extra-non-null-assertion */
/* eslint-disable no-case-declarations */

// fountain-js 0.1.10
// http://www.opensource.org/licenses/mit-license.php

import { DialogueElement } from "@/src/types/DialogueElement";
import { DualDialogueElement } from "@/src/types/DualDialogueElement";
import { FountainElement } from "@/src/types/FountainElement";
import { SceneElement } from "@/src/types/SceneElement";
import { SectionElement } from "@/src/types/SectionElement";
import { filterNotNull } from "./filterNotNull";
import { SourceMapElement, FountainToken, FountainTokenType } from "@/src/types/FountainTokenType";
import { FountainScript } from "@/src/types/FountainScript";
import { FountainTitlePage } from "@/src/types/FountainTitlePage";
import { ActionElement } from "@/src/types/ActionElement";
import { TransitionElement } from "@/src/types/TransitionElement";
import { CenteredTextElement } from "@/src/types/CenteredTextElement";
import { PageBreakElement } from "@/src/types/PageBreakElement";
import { LineBreakElement } from "@/src/types/LineBreakElement";
import { SynopsesElement } from "@/src/types/SynopsesElement";
import { BoneyardElement } from "@/src/types/BoneyardElement";
import { NotesElement } from "@/src/types/index";
import { Range } from './types/Range';

const FountainRegexSceneHeading = /^((?:\*{0,3}_?)?(?:(?:int|ext|est|i\/e)[. ]).+)|^(?:\.(?!\.+))(.+)/i;
const FountainRegexSceneNumber = /( *#(.+)# *)/;
const FountainRegexTransition = /^((?:FADE (?:TO BLACK|OUT)|CUT TO BLACK)\.|.+ TO:)$|^(?:> *)(.+)/;
const FountainRegexCentered = /^(?:> *)(.+)(?: *<)(\n.+)*/g;
const FountainRegexSection = /^(#+)(?: *)(.*)/;
const FountainRegexSynopsis = /^(?:=(?!=+) *)(.*)/;
const FountainRegexPageBreak = /^={3,}$/;
const FountainRegexLineBreak = /^ {2}$/;
// TODO: handle formatting here or in the presentation layer?
// const FountainRegexEmphasis = /(_|\*{1,3}|_\*{1,3}|\*{1,3}_)(.+)(_|\*{1,3}|_\*{1,3}|\*{1,3}_)/g;
// const FountainRegexBoldItalicUnderline = /(_{1}\*{3}(?=.+\*{3}_{1})|\*{3}_{1}(?=.+_{1}\*{3}))(.+?)(\*{3}_{1}|_{1}\*{3})/g;
// const FountainRegexBoldUnderline = /(_{1}\*{2}(?=.+\*{2}_{1})|\*{2}_{1}(?=.+_{1}\*{2}))(.+?)(\*{2}_{1}|_{1}\*{2})/g;
// const FountainRegexItalicUnderline = /(?:_{1}\*{1}(?=.+\*{1}_{1})|\*{1}_{1}(?=.+_{1}\*{1}))(.+?)(\*{1}_{1}|_{1}\*{1})/g;
// const FountainRegexBoldItalic = /(\*{3}(?=.+\*{3}))(.+?)(\*{3})/g;
// const FountainRegexBold = /(\*{2}(?=.+\*{2}))(.+?)(\*{2})/g;
// const FountainRegexItalic = /(\*{1}(?=.+\*{1}))(.+?)(\*{1})/g;
// const FountainRegexUnderline = /(_{1}(?=.+_{1}))(.+?)(_{1})/g;
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
        i = parseToken(token, data, i, tokens, tokenDepth, parent);
    }
    return data;
}

function parseToken(token: FountainToken, data: FountainElement<string>[], i: number, tokens: FountainToken[], tokenDepth: number, parent: FountainToken | null) {
    switch (token.type) {
        case 'transition': data.push(new TransitionElement([token])); break;
        case 'synopsis': data.push(new SynopsesElement([token])); break;
        case 'action': data.push(new ActionElement([token])); break;
        case 'centered': data.push(new CenteredTextElement([token])); break;
        case 'page_break': data.push(new PageBreakElement([token])); break;
        case 'line_break': data.push(new LineBreakElement([token])); break;
        case 'boneyard': parseBoneyard(data, token); break;
        case 'note': parseNote(data, token); break;
        case 'section':
            i = parseSection(tokens, i, tokenDepth, data, token);
            break;
        case 'scene_heading':
            // Go to the next scene heading or section start whichever is closest.
            i = parseSceneHeading(tokens, i, tokenDepth, data, token, parent);
            break;
        // // Group dialogue lines together with the character that is speaking.
        case 'character':
            i = parseCharacter(tokens, i, token, data);
            break;
        default:
        // data.push(token);
    }
    return i;
}

function parseCharacter(tokens: FountainToken[], i: number, token: FountainToken, data: FountainElement<string>[]) {
    let nextNonDialogue = tokens.findIndex((t, id) => id > i && t.type !== 'dialogue' && t.type !== 'parenthetical');
    if (nextNonDialogue === -1) nextNonDialogue = tokens.length; // we must be at the end of the script
    const [nextI, result] = parseDialogue(token, tokens, i, nextNonDialogue);
    data.push(result);
    i = nextI;
    return i;
}

function parseSceneHeading(tokens: FountainToken[], i: number, tokenDepth: number, data: FountainElement<string>[], token: FountainToken, parent: FountainToken | null) {
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
    return i;
}

function parseSection(tokens: FountainToken[], i: number, tokenDepth: number, data: FountainElement<string>[], token: FountainToken) {
    const [sectionTokens, sectionEnd] = tokensBetween(tokens, i, 'section', (t) => (t.depth as number) <= tokenDepth);
    data.push(new SectionElement(
        tokens.slice(i, sectionEnd),
        token.text || 'UNTITLED',
        token.depth as number,
        _parse(sectionTokens, token)
    ));
    i = sectionEnd - 1;
    return i;
}

function parseNote(data: FountainElement<string>[], token: FountainToken) {
    if (data[data.length - 1] instanceof NotesElement) {
        data[data.length - 1].tokens.push(token);
    } else {
        data.push(new NotesElement([token]));
    }
}

function parseBoneyard(data: FountainElement<string>[], token: FountainToken) {
    if (data[data.length - 1] instanceof BoneyardElement) {
        data[data.length - 1].tokens.push(token);
    } else {
        data.push(new BoneyardElement([token]));
    }
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

function tokensBetween(tokens: Array<FountainToken>, index: number, end_type: string, predicate: (t: FountainToken, i: number) => boolean = () => true): [Array<FountainToken>, number] {
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
 * @param fullLine
 * @param codeLocation 
 * @param lastToken 
 * @param isFollowedByBlankLine 
 * @returns 
 */
function extractToken(fullLine: string, codeLocation: SourceMapElement, lastToken: FountainToken | undefined, lastNonWhitespaceToken: FountainToken | undefined, isFollowedByBlankLine: boolean, rangeStart = 0, rangeEnd: number|undefined = undefined): FountainToken[] {
    let match;

    const lineSegment = fullLine.substring(rangeStart, rangeEnd);

    if (lineSegment.startsWith('!')) return [createToken('action', fullLine, lineSegment, codeLocation)];
    if (lineSegment.startsWith('=')) return [createSynopsisTokenFromLine(fullLine, lineSegment, codeLocation)];

    // title page
    if (!lastNonWhitespaceToken || lastNonWhitespaceToken.type === 'title_page' ) {
        const colonLocation = fullLine.indexOf(':');
        if (colonLocation > -1) {
            return [createTitlePageToken(fullLine, colonLocation, codeLocation)];
        } else if (lastToken?.type === 'title_page') {
            // title page values can have newlines so this must be a continuation of a previous property
            lastToken.text += '\n' + fullLine;
            lastToken.codeLocation.end = codeLocation.end;
        }
    }

    if (fullLine.trim().length === 0) return [createLineBreakToken(fullLine, codeLocation)];

    // Boneyard can recurse but do not start parsing comments inside comments.
    if(rangeStart === 0 && rangeEnd === undefined) {
        // boneyard
        const boneyardTokens: FountainToken[] = extractBoneyardTokens(fullLine, codeLocation, lastToken, lastNonWhitespaceToken, isFollowedByBlankLine);
        if (boneyardTokens.length > 0) return boneyardTokens;

        // note
        const noteTokens: FountainToken[] = extractNoteTokens(fullLine, codeLocation, lastToken, lastNonWhitespaceToken, isFollowedByBlankLine);
        if (noteTokens.length > 0) return noteTokens;
    }

    // section
    match = lineSegment.match(FountainRegexSection);
    if (match) return [createSectionToken(fullLine, codeLocation, match)];

    // scene headings
    match = lineSegment.match(FountainRegexSceneHeading);
    if (match) return extractSceneHeadingTokens(match, fullLine, codeLocation);

    // centered
    match = lineSegment.match(FountainRegexCentered);
    if (match) return [createCenteredToken(fullLine, codeLocation, match)];

    // transitions
    match = lineSegment.match(FountainRegexTransition);
    if (match) return [createToken('transition', fullLine, lineSegment, codeLocation)];

    // character
    // A Character element is any line entirely in uppercase, with one empty line before it and without an empty line after it.
    // Power User: You can force a Character element by preceding it with the "at" symbol @.
    if (lineSegment.startsWith('@') || (!isFollowedByBlankLine && lastToken?.type === 'line_break' && lineSegment.toUpperCase() === lineSegment)) {
        return [createCharacterToken(fullLine, lineSegment, codeLocation)];
    }

    // Parentheticals follow a Character or Dialogue element, and are wrapped in parentheses ().
    if ((lastToken?.type === 'character' || lastToken?.type === 'dialogue')
        && (lineSegment.trim().startsWith('(') && lineSegment.trim().endsWith(')'))) {
        return [createParentheticalToken(fullLine, lineSegment, codeLocation)];
    }

    // Dialogue is any text following a Character or Parenthetical element.
    if (lastToken?.type === 'character' || lastToken?.type === 'parenthetical' || lastToken?.type === 'dialogue') {
        return [createToken('dialogue', fullLine, lineSegment, codeLocation)];
    }


    // synopsis
    match = lineSegment.match(FountainRegexSynopsis);
    if (match) return [createSynopsisTokenFromMatch(fullLine, codeLocation, match)];

    // page breaks
    if (FountainRegexPageBreak.test(lineSegment))  return [createToken('page_break', fullLine, lineSegment, codeLocation)];

    // line breaks
    if (FountainRegexLineBreak.test(lineSegment))  return [createLineBreakToken(fullLine, codeLocation)];

    return [createToken('action', fullLine, lineSegment, codeLocation)];
}

function createToken(type: FountainTokenType, line: string, text: string, codeLocation: SourceMapElement): FountainToken {
    return { type, line, codeLocation, text};
}

function createSynopsisTokenFromLine(line: string, text: string, codeLocation: SourceMapElement): FountainToken {
    return { ...createToken('synopsis', line, text.substring(1).trim(), codeLocation) };
}

function createSectionToken(line: string, codeLocation: SourceMapElement, match: RegExpMatchArray): FountainToken {
    return {...createToken('section', line, match[2], codeLocation), depth: match[1].length };
}

function createSynopsisTokenFromMatch(line: string, codeLocation: SourceMapElement, match: RegExpMatchArray): FountainToken {
    return createToken('synopsis', line, match[1], codeLocation);
}

function createParentheticalToken(line: string, text: string, codeLocation: SourceMapElement): FountainToken {
    return createToken('parenthetical', line, text.replace(/^\(|\)$/g, ''), codeLocation);
}

function createCharacterToken(line: string, text: string, codeLocation: SourceMapElement): FountainToken {
    return createToken('character', line, text.replace(/^@/, ''), codeLocation);
}

function createCenteredToken(line: string, codeLocation: SourceMapElement, match: RegExpMatchArray): FountainToken {
    return createToken('centered', line, match[0].replace(/>|</g, ''), codeLocation);
}

function createLineBreakToken(line: string, codeLocation: SourceMapElement): FountainToken {
    return createToken('line_break', line, '\n', codeLocation);
}

function createTitlePageToken(line: string, colonLocation: number, codeLocation: SourceMapElement): FountainToken {
    return {...createToken('title_page', line, line, codeLocation), 
        key: line.substring(0, colonLocation).trim(),
        text: line.substring(colonLocation + 1).trim(),
    };
}

function extractSceneHeadingTokens(match: RegExpMatchArray, line: string, codeLocation: SourceMapElement): FountainToken[] {
    let text = match[1] || match[2];

    if (text.indexOf('  ') !== text.length - 2) {
        let meta;
        const metaMatch = text.match(FountainRegexSceneNumber);
        if (metaMatch) {
            meta = metaMatch[2];
            text = text.replace(FountainRegexSceneNumber, '');
        }
        return [{ ...createToken('scene_heading', line, text, codeLocation), scene_number: meta }];
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
    let isComment = lastToken?.type === comment_type || lastToken?.type === comment_start_type;

    // bail early if theres no chance this line includes a comment.
    if(!isComment && !line.includes(comment_start_str)) return [];

    const commentTokens: FountainToken[] = [];

    const lineParts = line.split(comment_start_str);
    let before_comment = null;
    let comment = lineParts[0];
    let after_comment = null;

    if (lineParts.length > 1) {
        before_comment = lineParts[0];
        comment = lineParts[1];
    }
    const commentParts = comment.split(comment_end_str);
    comment = commentParts[0];
    if (commentParts.length > 1) {
        after_comment = commentParts[1];
    }

    const comment_start_position = before_comment != null ? {
        column: codeLocation.start.column + lineParts[0].length,
        index: codeLocation.start.index + lineParts[0].length,
        line: codeLocation.start.line,
    } : codeLocation.start;
    const comment_end_position = after_comment != null ? {
        column: comment_start_position.column + comment.length,
        index: comment_start_position.index + comment.length,
        line: comment_start_position.line,
    } : codeLocation.end;

    if (!isComment && line.indexOf(comment_start_str) > -1) {
        // Anything before the comment starts (inline comments)
        if(before_comment?.trim()?.length)
            commentTokens.push(...extractToken(line, {
                file: codeLocation.file,
                start: codeLocation.start,
                end: comment_start_position,
            }, lastToken, lastNonWhitespaceToken, false, 0, before_comment.length));
        // Comment begin token
        commentTokens.push({
            type: comment_start_type, line, codeLocation: {
                file: codeLocation.file,
                start: comment_start_position,
                end: {
                    column: comment_start_position.column + comment_start_str.length,
                    index: comment_start_position.index + comment_start_str.length,
                    line: comment_start_position.line,
                },
            }, text: ''
        });
        isComment = true;
    }
    if(isComment) {
        // Comment token
        commentTokens.push({
            type: comment_type, line, codeLocation: {
                file: codeLocation.file,
                start: comment_start_position,
                end: comment_end_position,
            }, text: comment
        });
    } // else push nothing and lat extractToken handle empty by continuing parsing
    if (isComment && line.indexOf(comment_end_str) > -1) {
        // Comment end token
        commentTokens.push({
            type: comment_start_type, line, codeLocation: {
                file: codeLocation.file,
                start: comment_end_position,
                end: {
                    column: comment_end_position.column + comment_start_str.length,
                    index: comment_end_position.index + comment_start_str.length,
                    line: comment_end_position.line,
                },
            }, text: ''
        });

        // Anything after the comment ends (inline comments)
        if(after_comment?.trim()?.length)
            commentTokens.push(...extractToken(line, {
                file: codeLocation.file,
                start: comment_end_position,
                end: codeLocation.end,
            }, lastToken, lastNonWhitespaceToken, false, line.indexOf(after_comment)));
    }
    return commentTokens;
}
