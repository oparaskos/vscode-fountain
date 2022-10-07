import { formatTime } from './formatTime';

type StatsResult = {
	dialogueBalance: { [gender: string]: number; };
	readingAgeByGender: { [gender: string]: number; };
	numSpeakingRolesByGender: { [gender: string]: number; };
	sentimentByGender: { [gender: string]: number; } ;
}

export function showGenderRepresentationStatistics(stats: { [key: string]: any; }[]) {
	const { dialogueBalance, readingAgeByGender, numSpeakingRolesByGender, sentimentByGender } = generateCharacterStats(stats);

	const genderDonutChart = (document.getElementById("characters-gender-dialogue") as any);
	genderDonutChart.setEntries(dialogueBalance);
	genderDonutChart.setFormat((n: number) => formatTime(n.valueOf()));

	const genderBarChart = (document.getElementById("characters-gender-readingAge") as any);
	genderBarChart.setEntries(Object.keys(readingAgeByGender).map(label => ({ label, value: readingAgeByGender[label] })));

	const speakingRolesBarChart = (document.getElementById("characters-speaking-roles-by-gender") as any);
	speakingRolesBarChart.setEntries(Object.keys(numSpeakingRolesByGender).map(label => ({ label, value: numSpeakingRolesByGender[label] })));

	const sentimentByGenderBarChart = (document.getElementById("characters-sentiment-by-gender") as any);
	sentimentByGenderBarChart.setEntries(Object.keys(sentimentByGender).map(label => ({ label, value: sentimentByGender[label] })));
}

function generateCharacterStats(stats: { [key: string]: any; }[]): StatsResult {
	let totalDialogue = 0;
	const dialogueBalance: { [gender: string]: number; } = {};
	const readingAgeByGender: { [gender: string]: number; } = {};
	const numSpeakingRolesByGender: { [gender: string]: number; } = {};
	const sentimentByGender: { [gender: string]: number; } = {};
	for (const characterStats of stats) {
		const char = characterStats as any;
		const readingAge = char.ReadingAge as number;
		const duration = char.Duration as number;
		const sentiment = char.Sentiment as number;
		let gender = char.Gender as string;
		gender = gender[0].toLocaleUpperCase() + gender.slice(1);


		dialogueBalance[gender] = (dialogueBalance[gender] || 0) + (duration || 0);
		totalDialogue += (duration || 0);

		const numChars = numSpeakingRolesByGender[gender] || 0;
		const averageReadingAge = readingAgeByGender[gender] || 0;
		const averageSentiment = sentimentByGender[gender] || 0;
		const newAverageReadingAge = ((averageReadingAge * numChars) + readingAge) / (numChars + 1);
		readingAgeByGender[gender] = newAverageReadingAge;
		numSpeakingRolesByGender[gender] = numChars + 1;
		sentimentByGender[gender] = ((averageSentiment * numChars) + sentiment) / (numChars + 1);
	}
	return { dialogueBalance, readingAgeByGender, numSpeakingRolesByGender, sentimentByGender };
}
