import { FountainElement } from "./FountainElement";
import { FountainToken } from "./FountainTokenType";
import Sentiment from 'sentiment';
import readabilityScores from "readability-scores";

function mode(array: (number | undefined)[]): number | undefined {
    const mode: { [k: string]: number } = {};
    let max = undefined, count = 0;

    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (element != undefined) {
            const item = element.toFixed(0);

            if (mode[item]) {
                mode[item]++;
            } else {
                mode[item] = 1;
            }

            if (count < mode[item]) {
                max = parseInt(item);
                count = mode[item];
            }
        }
    }

    return max;
}

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

    get readingGrade() {
        const results = readabilityScores(this.dialogue);
        const scores = [
            results.daleChall,
            results.ari,
            results.colemanLiau,
            results.fleschKincaid,
            results.smog,
            results.gunningFog,
        ].filter(it => !!it)
        .map(it => Math.max(it as number, 0));
        const modalReadingGrade = mode(scores as number[]);
        if(modalReadingGrade === undefined) return undefined;
        return Math.min(22, Math.round(modalReadingGrade + 5));
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

    // Valence between negative five and positive five.
    public get sentiment() {
        return new Sentiment().analyze(this.dialogue).score;
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
