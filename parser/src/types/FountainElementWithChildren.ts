import { Position } from './Position';
import { positionInRange } from '../range';
import { FountainElement, FountainElementType } from "./FountainElement";
import { FountainToken } from "./FountainTokenType";
import { getElementsByType } from '../getElementsByType';


export abstract class FountainElementWithChildren<T extends FountainElementType = FountainElementType, U extends FountainElement = FountainElement> extends FountainElement<T> {
    constructor(public type: T, public tokens: FountainToken[], public children: U[]) {
        super(type, tokens);
    }

    public override getElementsByType<V extends FountainElement<W>, W extends FountainElementType>(type: W): V[] {
        return getElementsByType<V, W>(this.children, type);
    }

    public override getElementsByPosition(position: Position): FountainElement[] {
        console.trace("getElementsByPosition (FountainElementWithChildren)")
        const childrenInRange = this.children
            .filter(it => it.range != null && positionInRange(position, it.range))
            .flatMap(it => it.getElementsByPosition(position));
        return [this, ...childrenInRange];
    }
}
