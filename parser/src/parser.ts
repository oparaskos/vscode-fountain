/* eslint-disable @typescript-eslint/no-non-null-assertion */
// FIXME: I'm lazy
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
import { FountainToken } from "./types/FountainTokenType";
import { FountainScript } from "./types";
import { FountainTitlePage } from "./types/FountainTitlePage";
import { ActionElement } from "./types/ActionElement";
import { TransitionElement } from "./types/TransitionElement";
import { CenteredTextElement } from "./types/CenteredTextElement";
import { PageBreakElement } from "./types/PageBreakElement";
import { LineBreakElement } from "./types/LineBreakElement";
import { SynopsesElement } from "./types/SynopsesElement";
import { BoneyardElement } from "./types/BoneyardElement";
import { NotesElement } from "./types/NotesElement";
import { tokenize } from './tokenize';

type FountainElementConstructor<T extends FountainElement> = new (tokens: FountainToken[]) => T;
function instanceOfConstructor<T extends FountainElement>(cns: FountainElementConstructor<T>, b: unknown): b is T{
    return !!b && cns.prototype === b?.constructor?.prototype;
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
            case 'boneyard': appendElement<BoneyardElement>(data, token, BoneyardElement); break;
            case 'note': appendElement<NotesElement>(data, token, NotesElement); break;
            case 'section': i = addSectionElement(tokens, i, tokenDepth, data, token); break;
            case 'scene_heading': i = addSceneElement(tokens, i, tokenDepth, data, token, parent); break;
            case 'character': i = addDialogueElement(tokens, i, token, data); break;
            default:
                // data.push(token);
        }
    }
    return data;


}

function addDialogueElement(tokens: FountainToken[], i: number, token: FountainToken, data: FountainElement<string>[]) {
    // Group dialogue lines together with the character that is speaking.
    let nextNonDialogue = tokens.findIndex((t, id) => id > i && t.type !== 'dialogue' && t.type !== 'parenthetical');
    if (nextNonDialogue === -1)
        nextNonDialogue = tokens.length; // we must be at the end of the script
    const [nextI, result] = parseDialogue(token, tokens, i, nextNonDialogue);
    data.push(result);
    i = nextI;
    return i;
}

function addSceneElement(tokens: FountainToken[], i: number, tokenDepth: number, data: FountainElement<string>[], token: FountainToken, parent: FountainToken | null) {
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
    return i;
}

function addSectionElement(tokens: FountainToken[], i: number, tokenDepth: number, data: FountainElement<string>[], token: FountainToken) {
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
function appendElement<T extends FountainElement>(data: FountainElement<string>[], token: FountainToken, ctor: FountainElementConstructor<T>) {
    const elem: FountainElement = data[data.length - 1];
    if (instanceOfConstructor(ctor, elem)) {
        elem.tokens.push(token);
    } else {
        data.push(new ctor([token]));
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
