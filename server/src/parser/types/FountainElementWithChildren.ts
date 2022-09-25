import { FountainElement } from "./FountainElement";
import { FountainToken } from "./FountainTokenType";


export abstract class FountainElementWithChildren<T = string, U = FountainElement> extends FountainElement<T> {
    constructor(public type: T, public tokens: FountainToken[], public children: U[]) {
        super(type, tokens);
    }
}
