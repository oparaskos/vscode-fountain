import { FountainElement } from "./FountainElement";
import { GroupingFountainElement } from "./GroupingFountainElement";
import { FountainToken } from "./FountainTokenType";


export class SectionElement extends GroupingFountainElement<'section'> {
    public type: 'section' = 'section';
    constructor(
        public tokens: FountainToken[],
        public title: string,
        public depth: number,
        public children: FountainElement[]
    ) {
        super('section', title, tokens, children);
    }
}
