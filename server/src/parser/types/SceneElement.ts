import { FountainElement } from "./FountainElement";
import { GroupingFountainElement } from "./GroupingFountainElement";
import { FountainToken } from "./FountainTokenType";

export interface LocationData {
    name: string;
    locationType: string;
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

    public parseLocationData(): LocationData | undefined {
        const regex = /^(?<interior>EST|INT.?\/EXT|INT|EXT|I.|E.).?\s*(?<name>(?:[^-–—−]+[-–—−]??)*?)[-–—−]\s*(?<time_of_day>[^-–—−]+?)$/i;
        const match = regex.exec(this.title) as RegExpExecArray & {groups: {[k: string]: string}};
        if (match != null && match?.groups) {
            const interior = match.groups.interior.indexOf('I') != -1;
            const exterior = match.groups.interior.indexOf('EX') != -1|| match.groups.interior.indexOf('E.')!= -1;

            let locationType = 'other';
            if (interior && exterior) locationType = 'mixed';
            else if (interior) locationType = 'interior';
            else if (exterior) locationType = 'exterior';

            return {
                name: match.groups.name.trim(),
                locationType: locationType,
                timeOfDay: match.groups.time_of_day.trim()
            }
        }
        return undefined;
    }
}
