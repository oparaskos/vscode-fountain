import { Position } from 'vscode-languageserver';
import { logger } from '../../logger';
import { positionInRange, tokensToRange } from '../../util/range';
import { FountainToken } from "./FountainTokenType";

export abstract class FountainElement<T extends string = string> {
    constructor(public type: T, public tokens: FountainToken[]) { }

    public get textContent() {
        return this.tokens.map(t => t.text).join(" ");
    }

    public get range() {
        const range = tokensToRange(this.tokens);
        logger.log(`FountainElement: ${JSON.stringify(range)}`);
        return range;
    }

    public getElementsByType<V extends FountainElement>(type: string): V[] {
        if(this.type === type) return [this as unknown as V];
        return [];
    }

    public getElementsByPosition(position: Position): FountainElement[] {
        if (positionInRange(position, this.range)) return [this];
        return [];
    }
}
