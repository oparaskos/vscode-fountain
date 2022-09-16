import { FountainElement } from "./FountainElement";
import { FountainToken } from "./FountainTokenType";


export class DialogueElement implements FountainElement<'dialogue'> {
    public type: 'dialogue' = 'dialogue';
    constructor(
        public tokens: FountainToken[],
        public character: string,
        public extension: string | null,
        public parenthetical: FountainToken | null,
        public dialogueTokens: FountainToken[]
    ) { }

    public get lines(): string[] {
        return this.dialogueTokens
            .filter(t => t.type === 'dialogue')
            .filter(t => t.text && t.text.trim().length > 0)
            .map(t => t.text) as string[];
    }
}
