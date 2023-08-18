import { Position } from '@/src/types/Position';
import { positionInRange } from '@/src/range';
import { FountainElement } from "./FountainElement";
import { FountainToken } from "./FountainTokenType";
import { getElementsByType } from '@/src/getElementsByType';


export abstract class FountainElementWithChildren<T extends string = string, U extends FountainElement = FountainElement> extends FountainElement<T> {
    constructor(public type: T, public tokens: FountainToken[], public children: U[]) {
        super(type, tokens);
    }

    public override getElementsByType<V extends FountainElement>(type: string): V[] {
        return getElementsByType<V>(this.children, type);
    }

    public override getElementsByPosition(position: Position): FountainElement[] {
        const childrenInRange = this.children
            .filter(it => positionInRange(position, it.range))
            .flatMap(it => it.getElementsByPosition(position));
        return [this, ...childrenInRange];
    }
}
