import { FountainElement } from "./FountainElement";
import { GroupingFountainElement } from "./GroupingFountainElement";
import { FountainToken } from "./FountainTokenType";
import { DialogueElement } from './DialogueElement';
import { getElementsByType } from './getElementsByType';
import { BoneyardElement, LineBreakElement, NotesElement, SynopsesElement } from '.';

export enum LocationType {
    UNKNOWN = 0x0,
    INTERIOR = 0x1,
    EXTERIOR = 0x2,
    MIXED = 0x3,
    OTHER = 0x4
}

export interface LocationData {
    name: string;
    locationType: LocationType;
    timeOfDay: string | undefined;
}

export class SceneElement extends GroupingFountainElement<'scene'> {
    public type: 'scene' = 'scene';
    public location: LocationData | undefined;
    constructor(
        public tokens: FountainToken[],
        public title: string,
        public depth: number,
        public children: FountainElement[]
    ) {
        super('scene', title, tokens, children);
        this.location = this.parseLocationData();
    }

    public get duration() {
        return getElementsByType<DialogueElement>(this.children, "dialogue")
            .reduce((prev, curr) => prev + curr.duration, 0);
    }

    public get characters() {
        return getElementsByType<DialogueElement>(this.children, "dialogue").map(it => it.character).filter((v, i, a) => a.indexOf(v) === i);
    }

    public get synopsis() {
        const synopsis = [];
        for(let i = 0; i < this.children.length; ++i) {
            if (this.children[i] instanceof LineBreakElement) continue;
            if (this.children[i] instanceof BoneyardElement) continue;
            if (this.children[i] instanceof NotesElement) continue;
            if (this.children[i] instanceof SynopsesElement) {
                synopsis.push(this.children[i]);
                continue;
            } else {
                break;
            }
        }
        return synopsis.map(it => it.textContent).join("\n");
    }

    public parseLocationData(): LocationData | undefined {
        const regex = /^(?<interior>EST|INT.?\/EXT|INT|EXT|I.|E.).?\s*(?<name>(?:[^-–—−]+[-–—−]??)*?)[-–—−]\s*(?<time_of_day>[^-–—−]+?)$/i;
        const match = regex.exec(this.title) as RegExpExecArray & {groups: {[k: string]: string}};
        if (match != null && match?.groups) {
            const interior = match.groups.interior.indexOf('I') != -1;
            const exterior = match.groups.interior.indexOf('EX') != -1|| match.groups.interior.indexOf('E.')!= -1;

            let locationType = LocationType.UNKNOWN;
            if (interior) locationType = LocationType.INTERIOR;
            if (exterior) locationType |= LocationType.EXTERIOR;
            if (locationType == LocationType.UNKNOWN) locationType = LocationType.OTHER;

            return {
                name: match.groups.name.trim(),
                locationType: locationType,
                timeOfDay: match.groups.time_of_day.trim()
            };
        }
        return undefined;
    }
}

