import { CharacterStats, IFountainScript } from 'fountain-parser/src/types';
import readabilityScores from 'readability-scores';
import { guessGender } from './guessGender';
import { PostProcessProvider, ProviderOptions } from './TextBlockStatProvider';

export function readingGrade(str: string): number | undefined {
	const results = readabilityScores(str);
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
	if (modalReadingGrade === undefined)
		return undefined;
	return Math.min(22, Math.round(modalReadingGrade + 5));
}

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

export class ReadingGradeProvider extends PostProcessProvider {
	constructor(opts: ProviderOptions) { super(opts, "READING_GRADE"); }
	
	public override statsPerCharacter(stats: CharacterStats[], script: IFountainScript): CharacterStats[] {
		return stats.map((it) => {
			const dialogue = script.dialogueByCharacters[it.Name];
			return {
				...it,
				ReadingAge: readingGrade(dialogue.map(d => d.textContent).join(' ')),
			};
		});
	}
}
