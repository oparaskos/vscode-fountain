import { FountainElement } from "./FountainElement";
import { FountainToken } from "./FountainTokenType";


export class FountainTitlePage extends FountainElement<'title-page'> {
    
    constructor(
        public tokens: FountainToken[]
    ) {
        super('title-page', tokens);
    }
    public get attributes(): { [s: string]: string; } {
        const keys: string[] = this.tokens.map(t => t.key).filter((k, i, a) => !!k && a.indexOf(k) === i) as string[];
        return keys.map((k: string) => {
            const values = this.tokens.filter(t => t.key === k).map(t => t.text).join('\n');
            return [k, values];
        }).reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
    }

}
