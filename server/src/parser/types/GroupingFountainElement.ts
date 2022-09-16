import { FountainElement } from "./FountainElement";
import { FountainElementWithChildren } from "./FountainElementWithChildren";
import { FountainToken } from "./FountainTokenType";


export class GroupingFountainElement<T = string> extends FountainElementWithChildren<T, FountainElement> {
    constructor(
        public type: T,
        public title: string,
        public tokens: FountainToken[],
        public children: FountainElement[]
    ) {
        super(type, tokens, children);
    }
}
