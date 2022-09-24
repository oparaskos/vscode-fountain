import { FountainElement } from "./FountainElement";
import { GroupingFountainElement } from "./GroupingFountainElement";
import { FountainToken } from "./FountainTokenType";
import { DialogueElement } from './DialogueElement';
import { getElementsByType } from './getElementsByType';

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

