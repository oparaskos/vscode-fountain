import { FountainToken } from "./FountainTokenType";


export interface FountainElement<T = string> {
    type: T;
    tokens: FountainToken[];
}
