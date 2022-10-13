import { positionInRange } from '../range';
import { FountainElement } from "./FountainElement";
import { FountainToken } from "./FountainTokenType";
import { getElementsByType } from './getElementsByType';
import { EmptyLogger, ILogger } from './ILogger';
import { Position } from './Position';


export abstract class FountainElementWithChildren<T extends string = string, U extends FountainElement = FountainElement> extends FountainElement<T> {
    constructor(public type: T, public tokens: FountainToken[], public children: U[], public logger: ILogger = EmptyLogger) {
        super(type, tokens, logger);
    }

    public override getElementsByType<V extends FountainElement>(type: string): V[] {
        return getElementsByType<V>(this.children, type);
    }

    public override getElementsByPosition(position: Position): FountainElement[] {
        this.logger.log(`FountainElementWithChildren: getElementsByPosition`);
        const childrenInRange = this.children
            .filter(it => positionInRange(position, it.range))
            .flatMap(it => it.getElementsByPosition(position));
        return [this, ...childrenInRange];
    }
}
