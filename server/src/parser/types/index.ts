import { stat } from 'fs';
import { Location } from 'vscode-languageserver';
import { DialogueElement } from "./DialogueElement";
import { FountainElement } from "./FountainElement";
import { FountainToken } from "./FountainTokenType";
import { getElementsByType } from './getElementsByType';
import { LocationType, SceneElement } from "./SceneElement";


export class FountainScript {
    private _characterNames: string[] | undefined;
    private _characterStats: undefined | object[];
    private _dialogueByCharacters: {[k: string]: DialogueElement[]} | undefined;
    private _scenesByLocationName: {[k: string]: SceneElement[]} | undefined;
    constructor(
        public children: FountainElement[],
    ) {}

    public get characterNames(): string[]{
        if (!this._characterNames)
            this._characterNames = this.dialogue
                .map(element => element.character)
                .filter((element, index, array) => array.findIndex(e => e === element) === index);
        return this._characterNames;
    }

    public get characters() {
        if (!this._characterStats) {
            const dialogueByCharacters = this.dialogueByCharacters;
            const characters = Object.keys(dialogueByCharacters).map(characterName => {
                const dialogues = dialogueByCharacters[characterName];
                try {
                    const dialogueStats = dialogues.reduce((prev, curr) => ({
                        Duration: prev.Duration + curr.duration,
                        Lines: prev.Lines + curr.lines.length,
                        Words: prev.Words + curr.words.length,
                        ReadingAge: curr.readingGrade!= undefined ? Math.max(prev.ReadingAge, curr.readingGrade) : prev.ReadingAge,
                        Monologues: prev.Monologues + (curr.duration > 30 ? 1 : 0),
                    }), {Duration: 0, Lines: 0, Words: 0, ReadingAge: 0, Monologues: 0});
                    return {
                        Name: characterName,
                        References: dialogues.length,
                        ...dialogueStats
                    };
                } catch(e) {
                    return {
                        Name: characterName,
                        References: dialogues.length
                    };
                }
            });
            this._characterStats = characters;
        }
        return this._characterStats;
    }

    public get dialogue(): DialogueElement[]{
        return getElementsByType<DialogueElement>(this.children, "dialogue");
    }

    public get dialogueByCharacters() {
        if (!this._dialogueByCharacters) 
            this._dialogueByCharacters = this.characterNames.reduce((acc, curr) => {
                acc[curr] = this.dialogue.filter(it => it.character == curr);
                return acc;
            }, {} as {[k: string]: DialogueElement[]});
        return this._dialogueByCharacters;
    }
    public get scenes() {
        return getElementsByType<SceneElement>(this.children, "scene");
    }

    public get locations() {
        return this.locationNames.map((name) => {
            const locationScenes = this.scenesByLocationName[name];
            const stats = locationScenes.reduce((prev, scene: SceneElement) => ({
                Duration: prev.Duration + scene.duration,
                Type: prev.Type | (scene.location?.locationType || 0)
            }), { Duration: 0, Type: LocationType.UNKNOWN });

            return {
                Name: name,
                Duration: stats.Duration,
                Scenes: locationScenes.length,
                Type: LocationType[stats.Type]
            };
        });
    }

    public get locationNames() {
        return this.scenes.map(it => it.location)
            .filter(it => it != null)
            .map(it => it?.name)
            .filter((v, i, a) => a.indexOf(v) === i)
            .filter(it => !!it) as string[];
    }

    public get scenesByLocationName() {
        if(!this._scenesByLocationName) {
            const locationNames = this.locationNames;
            this._scenesByLocationName = locationNames.reduce((acc, curr) => {
                acc[curr] = this.scenes.filter(it => it.location?.name === curr);
                return acc;
            }, {} as {[k: string]: SceneElement[]});
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
