import { DialogueElement } from "./DialogueElement";
import { FountainElement } from "./FountainElement";
import { FountainElementWithChildren } from "./FountainElementWithChildren";
import { FountainToken } from "./FountainTokenType";
import { SceneElement } from "./SceneElement";

function getElementsByType<T extends FountainElement>(children: FountainElement[], type: string): T[] {
    const base: T[] = children.filter(child => child.type === type) as T[];
    const elementsWithChildren: FountainElementWithChildren[] = children.filter(child => child instanceof FountainElementWithChildren && child.children.length > 0) as FountainElementWithChildren[]
    const nested: T[] = elementsWithChildren.map(child => getElementsByType<T>(child.children, type)).flat();
    return [...base, ...nested];
}

export class FountainScript {
    private _characterNames: string[] | undefined;
    private _dialogueByCharacters: {[k: string]: DialogueElement[]} | undefined;
    private _scenesByLocationName: {[k: string]: SceneElement[]} | undefined;
    constructor(
        public children: FountainElement[],
    ) {}

    public get characterNames(): string[]{
        if (!this._characterNames)
            this._characterNames = this.dialogue
                .map(element => element.character)
                .filter((element, index, array) => array.findIndex(e => e === element) === index)
        return this._characterNames;
    }

    public get dialogue(): DialogueElement[]{
        return getElementsByType<DialogueElement>(this.children, "dialogue")
    }

    public get dialogueByCharacters() {
        if (!this._dialogueByCharacters) 
            this._dialogueByCharacters = this.characterNames.reduce((acc, curr) => {
                acc[curr] = this.dialogue.filter(it => it.character == curr)
                return acc;
            }, {} as {[k: string]: DialogueElement[]})
        return this._dialogueByCharacters;
    }
    public get scenes() {
        return getElementsByType<SceneElement>(this.children, "scene")
    }

    public get locations() {
        return this.scenes.map(it => it.location).filter(it => it != null);
    }

    public get scenesByLocationName() {
        if(!this._scenesByLocationName) {
            const locationNames = this.locations.map(it => it?.name).filter((v, i, a) => a.indexOf(v) === i).filter(it => !!it) as string[];
            this._scenesByLocationName = locationNames.reduce((acc, curr) => {
                acc[curr] = this.scenes.filter(it => it.location?.name === curr)
                return acc;
            }, {} as {[k: string]: SceneElement[]})
        }
        return this._scenesByLocationName;
    }
}

export class FountainTitlePage implements FountainElement<'title-page'> {
    public type: 'title-page' = 'title-page';
    constructor(
        public tokens: FountainToken[],
        ) {}
    public get attributes(): {[s: string]: string} {
        const keys: string[] = this.tokens.map(t => t.key).filter((k, i, a) => !!k && a.indexOf(k) === i) as string[];
        return keys.map((k: string) => {
            const values = this.tokens.filter(t => t.key === k).map(t => t.text).join('\n');
            return [k, values];
        }).reduce((acc, [k, v]) => ({...acc, [k]: v}), {});
    }
    
}

export class ActionElement implements FountainElement<'action'> {
    public type: 'action' = 'action';
    constructor(public tokens: FountainToken[]) {}
}

export class LyricsElement implements FountainElement<'lyrics'> {
    public type: 'lyrics' = 'lyrics';
    constructor(public tokens: FountainToken[]) {}
}

export class TransitionElement implements FountainElement<'transition'> {
    public type: 'transition' = 'transition';
    constructor(
        public tokens: FountainToken[]) {
    }
}

export class CenteredTextElement implements FountainElement<'centered-text'> {
    public type: 'centered-text' = 'centered-text';
    constructor(
        public tokens: FountainToken[]) {
    }
}

export class PageBreakElement implements FountainElement<'page-break'> {
    public type: 'page-break' = 'page-break';
    constructor(
        public tokens: FountainToken[]) {
    }
}

export class LineBreakElement implements FountainElement<'line-break'> {
    public type: 'line-break' = 'line-break';
    constructor(
        public tokens: FountainToken[]) {
    }
}

export class NotesElement implements FountainElement<'notes'> {
    public type: 'notes' = 'notes';
    constructor(
        public tokens: FountainToken[]) {
    }
}

export class BoneyardElement implements FountainElement<'boneyard'> {
    public type: 'boneyard' = 'boneyard';
    constructor(
        public tokens: FountainToken[]) {
    }
}

export class SynopsesElement implements FountainElement<'synopses'> {
    public type: 'synopses' = 'synopses';
    constructor(
        public tokens: FountainToken[]) {
    }
}
