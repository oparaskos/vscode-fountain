import { FountainElement } from "./FountainElement";
import { FountainToken } from "./FountainTokenType";

export class DialogueElement extends FountainElement<'dialogue'> {
    constructor(
        public tokens: FountainToken[],
        public character: string,
        public extension: string | null,
        public parenthetical: FountainToken | null,
        public dialogueTokens: FountainToken[]
    ) {
        super('dialogue', tokens);
    }

    public get lines(): string[] {
        return this.dialogueTokens
            .filter(t => t.type === 'dialogue')
            .filter(t => t.text && t.text.trim().length > 0)
            .map(t => t.text) as string[];
    }

    public get dialogue(): string {
        return this.lines.join(' ');
    }

    public get words(): string[] {
        return this.dialogue.split(/\s+/ig);
    }

    // yoink: https://github.com/piersdeseilligny/betterfountain/blob/master/src/utils.ts#L92
    public get duration() {
        let duration = 0;
        //According to this paper: http://www.office.usp.ac.jp/~klinger.w/2010-An-Analysis-of-Articulation-Rates-in-Movies.pdf
        //The average amount of syllables per second in the 14 movies analysed is 5.13994 (0.1945548s/syllable)
        const sanitized = this.dialogue.replace(/[^\w]/gi, '');
        duration += ((sanitized.length) / 3) * 0.1945548;
        //duration += syllable(dialogue)*0.1945548;
        //According to a very crude analysis involving watching random movie scenes on youtube and measuring pauses with a stopwatch
        //A comma in the middle of a sentence adds 0.4sec and a full stop/excalmation/question mark adds 0.8 sec.
        const punctuationMatches = this.dialogue.match(/(\.|\?|!|:) |(, )/g);
        if (punctuationMatches) {
            if (punctuationMatches[0]) duration += 0.75 * punctuationMatches[0].length;
            if (punctuationMatches[1]) duration += 0.3 * punctuationMatches[1].length;
        }
        return duration;
    }
}
