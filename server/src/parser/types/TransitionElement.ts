import { FountainElement } from "./FountainElement";
import { FountainToken } from "./FountainTokenType";


export class TransitionElement extends FountainElement<'transition'> {
    
    constructor(
        public tokens: FountainToken[]) {
        super('transition', tokens);
    }
}
