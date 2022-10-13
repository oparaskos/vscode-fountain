import { FountainElement } from "./FountainElement";
import { FountainElementWithChildren } from "./FountainElementWithChildren";
import { FountainToken } from "./FountainTokenType";
import { EmptyLogger, ILogger } from './ILogger';


export class GroupingFountainElement<T extends string = string> extends FountainElementWithChildren<T, FountainElement> {
    constructor(
        public type: T,
        public title: string,
        public tokens: FountainToken[],
        public children: FountainElement[],
        public logger: ILogger = EmptyLogger
    ) {
        super(type, tokens, children, logger);
    }
}
