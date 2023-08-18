import { FountainElement } from "./FountainElement";
import { FountainToken } from "./FountainTokenType";


export class LineBreakElement extends FountainElement<'line-break'> {
    
    constructor(
        public tokens: FountainToken[]) {
        super('line-break', tokens);
    }
}
