import { Position } from './Position';
import { positionInRange, tokensToRange } from '../range';
import { FountainToken } from "./FountainTokenType";

export type FountainElementType = 
'title-page' |
'scene' |
'centered-text' |
'transition' |
'dialogue' |
'dual-dialogue' |
'action' |
'boneyard' |
'notes' |
'lyrics' |
'line-break' |
'page-break' |
'section' |
'synopses';

export abstract class FountainElement<T extends FountainElementType = FountainElementType> {
    constructor(public type: T, public tokens: FountainToken[]) { }

    public get textContent() {
        return this.tokens.map(t => t.text).join(" ");
    }

    public get range() {
        return tokensToRange(this.tokens);
    }

    public getElementsByType<V extends FountainElement>(type: string): V[] {
        if(this.type === type) return [this as unknown as V];
        return [];
    }

    public getElementsByPosition(position: Position): FountainElement[] {
        console.trace("getElementsByPosition (FountainElement)")
        if (this.range != null && positionInRange(position, this.range)) return [this];
        return [];
    }
}
