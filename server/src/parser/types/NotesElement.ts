import { FountainElement } from "./FountainElement";
import { FountainToken } from "./FountainTokenType";


export class NotesElement extends FountainElement<'notes'> {
    
    constructor(
        public tokens: FountainToken[]) {
        super('notes', tokens);
    }
}
