import { FountainToken } from "./FountainTokenType";


export abstract class FountainElement<T = string> {
    constructor(public type: T, public tokens: FountainToken[]) { }

    public get textContent() {
        return this.tokens.map(t => t.text).join(" ");
    }
}
