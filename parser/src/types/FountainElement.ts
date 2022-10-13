import { positionInRange, tokensToRange } from '../range';
import { FountainToken } from "./FountainTokenType";
import { EmptyLogger, ILogger } from './ILogger';
import { Position } from './Position';

export abstract class FountainElement<T extends string = string> {
    constructor(public type: T, public tokens: FountainToken[], public logger: ILogger = EmptyLogger) { }

    public get textContent() {
        return this.tokens.map(t => t.text).join(" ");
    }

    public get range() {
        const range = tokensToRange(this.tokens);
        this.logger.log(`FountainElement: ${JSON.stringify(range)}`);
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
