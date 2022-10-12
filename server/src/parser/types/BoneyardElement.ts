import { FountainElement } from "./FountainElement";
import { FountainToken } from "./FountainTokenType";


export class BoneyardElement extends FountainElement<'boneyard'> {
    
    constructor(
        public tokens: FountainToken[]) {
        super('boneyard', tokens);
    }
}
