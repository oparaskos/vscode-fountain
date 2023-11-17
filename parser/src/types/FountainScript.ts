import { positionInRange } from '../range';
import { Position } from './Position';
import { Range } from './Range';
import { getElementsByType } from '../getElementsByType';
import { DialogueElement } from "./DialogueElement";
import { FountainElement } from "./FountainElement";
import { LocationType, SceneElement } from "./SceneElement";
import { CharacterStats } from './CharacterStats';
import { FountainTitlePage } from './FountainTitlePage';


export class FountainScript {
    private _characterNames: string[] | undefined;
    private _characterStats: undefined | CharacterStats[];
    private _dialogueByCharacters: { [k: string]: DialogueElement[]; } | undefined;
    private _scenesByLocationName: { [k: string]: SceneElement[]; } | undefined;
    constructor(
        public children: FountainElement[]
    ) { }

    public get characterNames(): string[] {
        if (!this._characterNames)
            this._characterNames = this.dialogue
                .map(element => element.character)
                .filter((element, index, array) => array.findIndex(e => e === element) === index);
        return this._characterNames;
    }

    public get range(): Range | null {
        if(this.children.length <= 0) return null;
        const start = this.children[0].range?.start;
        const end = this.children[this.children.length - 1].range?.end;
        if(start == null) return null;
        if(end == null) return null;
        return { start, end };
    }

    public getElementsByPosition(position: Position): FountainElement[] {
        console.trace("getElementsByPosition (FountainScript)")
        return this.children
            .filter(it => it.range != null && positionInRange(position, it.range))
            .flatMap(it => it.getElementsByPosition(position));
    }

    public get statsPerCharacter(): CharacterStats[] {
        if (!this._characterStats) {
            const dialogueByCharacters = this.dialogueByCharacters;
            const characters: CharacterStats[] = Object.keys(dialogueByCharacters).map(characterName => {
                const dialogues = dialogueByCharacters[characterName];
                try {
                    return this.generateCharacterDialogueStats(dialogues, characterName);
                } catch (e) {
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

    private generateCharacterDialogueStats(dialogues: DialogueElement[], characterName: string): CharacterStats {
        const dialogueStats = dialogues.reduce((prev, curr) => ({
            Duration: prev.Duration + curr.duration,
            Lines: prev.Lines + curr.lines.length,
            Words: prev.Words + curr.words.length,
            ReadingAge: curr.readingGrade != undefined ? Math.max(prev.ReadingAge, curr.readingGrade) : prev.ReadingAge,
            Monologues: prev.Monologues + (curr.duration > 30 ? 1 : 0),
            Sentiment: prev.Sentiment + curr.sentiment,
        }), { Duration: 0, Lines: 0, Words: 0, ReadingAge: 0, Monologues: 0, Sentiment: 0 });
        return {
            Name: characterName,
            References: dialogues.length,
            ...dialogueStats,
            Sentiment: dialogueStats.Sentiment / dialogues.length,
        };
    }

    public get titlePage(): FountainTitlePage {
        return getElementsByType<FountainTitlePage>(this.children, 'title-page')[0];
    }

    public get dialogue(): DialogueElement[] {
        return getElementsByType<DialogueElement>(this.children, "dialogue");
    }

    public get dialogueByCharacters() {
        if (!this._dialogueByCharacters)
            this._dialogueByCharacters = this.characterNames.reduce((acc, curr) => {
                acc[curr] = this.dialogue.filter(it => it.character == curr);
                return acc;
            }, {} as { [k: string]: DialogueElement[]; });
        return this._dialogueByCharacters;
    }
    public get scenes() {
        return getElementsByType<SceneElement>(this.children, "scene");
    }

    public get statsPerScene() {
        return this.scenes.map((scene) => ({
            Name: scene.title,
            Duration: scene.duration,
            Characters: scene.characters,
            Synopsis: scene.synopsis,
            DialogueDuration: scene.dialogueDuration,
            ActionDuration: scene.actionDuration,
            Sentiment: scene.sentiment,
        }));
    }

    public get statsPerLocation() {
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
        if (!this._scenesByLocationName) {
            const locationNames = this.locationNames;
            this._scenesByLocationName = locationNames.reduce((acc, curr) => {
                acc[curr] = this.scenes.filter(it => it.location?.name === curr);
                return acc;
            }, {} as { [k: string]: SceneElement[]; });
        }
        return this._scenesByLocationName;
    }
}
