import { CharacterStats } from 'fountain-parser/src/types';
import { getGender } from "gender-detection-from-name";
import { PostProcessProvider, ProviderOptions } from './TextBlockStatProvider';

const WORDS_INDICATING_FEMALE_CHARACTER = [
	"female",
	"woman",
	"girl",
	"mum",
	"mom",
	"aunt",
	"mother",
	"neice",
	"grandma",
	"mistress",
	"mrs",
	"miss",
	"ms",
	"daughter",
	"lady",
	"queen"
];

const WORDS_INDICATING_MALE_CHARACTER = [
	"male",
	"man",
	"boy",
	"dad",
	"uncle",
	"father",
	"nephew",
	"master",
	"mister",
	"mr",
	// "son", // too common in surnames 
	"king"
];


export interface GenderGuesserConfig {
	locale: string;
	characters: {[characterName: string]: {
		gender: string | undefined;
	}} | undefined;
}

export function guessGender(rawName: string, config: GenderGuesserConfig) {
	try {
		if (config?.characters?.[rawName]?.gender) return (config.characters[rawName].gender as string).toLowerCase();
		// Guess based on common english names using a library TODO: find a more comprehensive one..
		const name = rawName.toLocaleLowerCase().replace(/young|old|adult|kid/ig, '');
		const initialGuess = getGender(name, supportedLocale(config));
		if (initialGuess != 'unknown')
			return initialGuess;
		// If no luck look for clues by common gendered words -- problematic because 'postman' is often in place of 'postwoman'.
		const femaleness: number = WORDS_INDICATING_FEMALE_CHARACTER.reduce((acc, it) => acc += name.includes(it) ? 1 : 0, 0);
		let maleness: number = WORDS_INDICATING_MALE_CHARACTER.reduce((acc, it) => acc += name.includes(it) ? 1 : 0, 0);
		maleness = fixupMaleManSuffix(name, maleness);
		if (maleness > femaleness)
			return 'male';
		if (femaleness > maleness)
			return 'female';
		return 'unknown';
	} catch(e) {
		return 'unknown';
	}
}

function supportedLocale(config: GenderGuesserConfig): "en" | "it" | undefined {
	const configuredLocale = config?.locale;
	if(["en", "it"].includes(configuredLocale)) {
		return configuredLocale as "en" | "it";
	} else {
		return "en";
	}
}

// In cases where -male is part of fe-male then erase its impact on the maleness score.
function fixupMaleManSuffix(name: string, maleness: number) {
	if (name.includes("woman"))
		maleness--;
	if (name.includes("female"))
		maleness--;
	return maleness;
}

export class CharacterGenderIdentityProvider extends PostProcessProvider {
	constructor(opts: ProviderOptions) { super(opts, "GENDER_IDENTITY"); }
	
	public override statsPerCharacter(stats: CharacterStats[]): CharacterStats[] {
		const fountainrc = this.opts.fountainrc;
		return stats.map((it) => ({
			...it,
			Gender: guessGender(it.Name, fountainrc)
		}));
	}
}
