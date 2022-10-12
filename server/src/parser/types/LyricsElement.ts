import { FountainElement } from "./FountainElement";
import { FountainToken } from "./FountainTokenType";


export class LyricsElement extends FountainElement<'lyrics'> {
    
    constructor(public tokens: FountainToken[]) {
        super('lyrics', tokens);
    }
}
