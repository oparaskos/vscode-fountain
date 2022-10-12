import { FountainElement } from "./FountainElement";
import { FountainToken } from "./FountainTokenType";


export class PageBreakElement extends FountainElement<'page-break'> {
    
    constructor(
        public tokens: FountainToken[]) {
        super('page-break', tokens);
    }
}
