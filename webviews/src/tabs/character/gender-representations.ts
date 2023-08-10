import type { BarChart, DonutChart } from '@/components/charts';
import type { CharacterStats } from '@/types/CharacterStats';
import { formatTime } from '@/utils/formatTime';

export type StatsResult = {
	dialogueBalance: { [gender: string]: number; };
	readingAgeByGender: { [gender: string]: number; };
	numSpeakingRolesByGender: { [gender: string]: number; };
	sentimentByGender: { [gender: string]: number; } ;
}

export function showGenderRepresentationStatistics(stats: CharacterStats[]) {
	const { dialogueBalance, readingAgeByGender, numSpeakingRolesByGender, sentimentByGender } = generateCharacterStats(stats);

	const genderDonutChart = (document.getElementById("characters-gender-dialogue") as DonutChart);
	genderDonutChart.setEntries(dialogueBalance);
	genderDonutChart.setFormat((n) => formatTime(n.valueOf()));

	const genderBarChart = (document.getElementById("characters-gender-readingAge") as BarChart);
	genderBarChart.setEntries(Object.keys(readingAgeByGender).map(label => ({ label, value: readingAgeByGender[label] })));

	const speakingRolesBarChart = (document.getElementById("characters-speaking-roles-by-gender") as BarChart);
	speakingRolesBarChart.setEntries(Object.keys(numSpeakingRolesByGender).map(label => ({ label, value: numSpeakingRolesByGender[label] })));

	const sentimentByGenderBarChart = (document.getElementById("characters-sentiment-by-gender") as BarChart);
	sentimentByGenderBarChart.setEntries(Object.keys(sentimentByGender).map(label => ({ label, value: sentimentByGender[label] })));
}

function generateCharacterStats(stats: CharacterStats[]): StatsResult {
	const dialogueBalance: { [gender: string]: number; } = {};
	const readingAgeByGender: { [gender: string]: number; } = {};
	const numSpeakingRolesByGender: { [gender: string]: number; } = {};
	const sentimentByGender: { [gender: string]: number; } = {};
	for (const characterStats of stats) {
		const char = characterStats;
		const readingAge = char.ReadingAge as number;
		const duration = char.Duration as number;
		const sentiment = char.Sentiment as number;
		let gender = char.Gender as string;
		gender = gender[0].toLocaleUpperCase() + gender.slice(1);


		dialogueBalance[gender] = (dialogueBalance[gender] || 0) + (duration || 0);

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
