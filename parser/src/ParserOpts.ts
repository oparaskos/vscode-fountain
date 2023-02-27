import { FountainScript } from './types';
import { FountainElement } from './types/FountainElement';
import { FountainToken } from './types/FountainTokenType';

export interface ParserOpts<
	FElement extends FountainElement = FountainElement,
	FScript extends FountainScript = FountainScript,
	FToken extends FountainToken = FountainToken> {

	elementTransform?: (elem: FountainElement) => FElement,
	scriptTransform?: (script: FountainScript) => FScript,
	tokenTransform?: (token: FountainToken) => FToken
}