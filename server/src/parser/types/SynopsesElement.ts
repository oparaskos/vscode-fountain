import { FountainElement } from "./FountainElement";
import { FountainToken } from "./FountainTokenType";


export class SynopsesElement extends FountainElement<'synopses'> {
    
    constructor(
        public tokens: FountainToken[]) {
        super('synopses', tokens);
    }

}
