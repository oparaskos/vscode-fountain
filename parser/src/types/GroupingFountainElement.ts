import { FountainElement, FountainElementType } from "./FountainElement";
import { FountainElementWithChildren } from "./FountainElementWithChildren";
import { FountainToken } from "./FountainTokenType";


export class GroupingFountainElement<T extends FountainElementType = FountainElementType> extends FountainElementWithChildren<T, FountainElement> {
    constructor(
        public type: T,
        public title: string,
        public tokens: FountainToken[],
        public children: FountainElement[]
    ) {
        super(type, tokens, children);
    }
}
