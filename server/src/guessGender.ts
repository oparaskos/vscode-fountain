import { getGender } from "gender-detection-from-name";

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
	"missus",
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

export function guessGender(rawName: string, config: any) {
	if (config?.characters?.[rawName]?.gender) return (config.characters[rawName].gender as string).toLowerCase();
	// Guess based on common english names using a library TODO: find a more comprehensive one..
	const initialGuess = getGender(rawName, config?.Language || 'en');
	if (initialGuess != 'unknown')
		return initialGuess;
	// If no luck look for clues by common gendered words -- problematic because 'postman' is often in place of 'postwoman'.
	const name = rawName.toLocaleLowerCase();
	const femaleness: number = WORDS_INDICATING_FEMALE_CHARACTER.reduce((acc, it) => acc += name.includes(it) ? 1 : 0, 0);
	let maleness: number = WORDS_INDICATING_MALE_CHARACTER.reduce((acc, it) => acc += name.includes(it) ? 1 : 0, 0);
	maleness = fixupMaleManSuffix(name, maleness);
	if (maleness > femaleness)
		return 'male';
	if (femaleness > maleness)
		return 'female';
	return 'unknown';
}

// In cases where -male is part of fe-male then erase its impact on the maleness score.
function fixupMaleManSuffix(name: string, maleness: number) {
	if (name.includes("woman"))
		maleness--;
	if (name.includes("female"))
		maleness--;
	return maleness;
}

