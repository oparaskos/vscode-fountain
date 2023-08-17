import { DialogueElement } from "./DialogueElement";
import { FountainElementWithChildren } from "./FountainElementWithChildren";
import { FountainToken } from "./FountainTokenType";


export class DualDialogueElement extends FountainElementWithChildren<'dual_dialogue', DialogueElement> {
    public type: 'dual_dialogue' = 'dual_dialogue';
    constructor(
        public tokens: FountainToken[],
        public children: DialogueElement[]
    ) {
        super('dual_dialogue', tokens, children);
    }
}
