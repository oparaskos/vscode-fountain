import { FountainElement } from "./FountainElement";
import { FountainToken } from "./FountainTokenType";


export class ActionElement extends FountainElement<'action'> {
    
    constructor(public tokens: FountainToken[]) {
        super('action', tokens);
    }

    public get duration() {
        // Assumes about 20 characters for 1 second worth of acting.
        return (this.textContent.length) / 20;
    }
}
