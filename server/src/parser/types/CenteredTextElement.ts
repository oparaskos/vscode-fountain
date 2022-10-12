import { FountainElement } from "./FountainElement";
import { FountainToken } from "./FountainTokenType";


export class CenteredTextElement extends FountainElement<'centered-text'> {
    
    constructor(
        public tokens: FountainToken[]) {
        super('centered-text', tokens);
    }
}
