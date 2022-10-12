import { CharacterStats } from './CharacterStats';
import { formatTime } from './formatTime';

type StatsResult = {
	durationBy: { [racialIdentity: string]: number; };
	readingAgeBy: { [racialIdentity: string]: number; };
	speakingRolesBy: { [racialIdentity: string]: number; };
	sentimentBy: { [racialIdentity: string]: number; } ;
	hasRacialIdentity: boolean;
}

type ChartElement = {
	setEntries: (entries: unknown) => void;
	setFormat: (entries: unknown) => void;
}

export function showRacialIdentityRepresentationStatistics(stats: CharacterStats[]) {
	const { durationBy, readingAgeBy, speakingRolesBy, sentimentBy , hasRacialIdentity} = generateRacialIdentityStats(stats);


	const racialIdentityPrompt = (document.getElementById("characters-racial-identity-fountainrc") as HTMLElement);
	racialIdentityPrompt.style.visibility = hasRacialIdentity ? "hidden" : "visible";

	const durationDonutChart = (document.getElementById("characters-racial-identity-dialogue") as HTMLElement & ChartElement);
	const readingAgeBarChart = (document.getElementById("characters-racial-identity-readingAge") as HTMLElement & ChartElement);
	const speakingRolesBarChart = (document.getElementById("characters-speaking-roles-by-racial-identity") as HTMLElement & ChartElement);
	const sentimentBarChart = (document.getElementById("characters-sentiment-by-racial-identity") as HTMLElement & ChartElement);

	document.querySelectorAll('.hide-if-no-racial-identity').forEach((element) => { (element as HTMLElement).style.display = hasRacialIdentity ? "initial" : "none"; });

	[durationDonutChart, readingAgeBarChart, speakingRolesBarChart, sentimentBarChart].map(element => {
		element.style.visibility = hasRacialIdentity ? "visible" : "hidden";
	});

	if (hasRacialIdentity){
		durationDonutChart.setEntries(durationBy);
		durationDonutChart.setFormat((n: number) => formatTime(n.valueOf()));
		readingAgeBarChart.setEntries(Object.keys(readingAgeBy).map(label => ({ label, value: readingAgeBy[label] })));
		speakingRolesBarChart.setEntries(Object.keys(speakingRolesBy).map(label => ({ label, value: speakingRolesBy[label] })));
		sentimentBarChart.setEntries(Object.keys(sentimentBy).map(label => ({ label, value: sentimentBy[label] })));
	}
}

function generateRacialIdentityStats(stats: CharacterStats[]): StatsResult {
	const durationBy: { [racialIdentity: string]: number; } = {};
	const readingAgeBy: { [racialIdentity: string]: number; } = {};
	const speakingRolesBy: { [racialIdentity: string]: number; } = {};
	const sentimentBy: { [racialIdentity: string]: number; } = {};
	let hasRacialIdentity = false;
	for (const characterStats of stats) {
		const char = characterStats;
		const readingAge = char.ReadingAge as number;
		const duration = char.Duration as number;
		const sentiment = char.Sentiment as number;
		let racialIdentity = char.RacialIdentity as string;
		if(racialIdentity && racialIdentity !== "unknown") {
			console.log({racialIdentity});
			hasRacialIdentity = true;
		}

		racialIdentity = racialIdentity[0].toLocaleUpperCase() + racialIdentity.slice(1);

		durationBy[racialIdentity] = (durationBy[racialIdentity] || 0) + (duration || 0);

		const numChars = speakingRolesBy[racialIdentity] || 0;
		const averageReadingAge = readingAgeBy[racialIdentity] || 0;
		const averageSentiment = sentimentBy[racialIdentity] || 0;
		const newAverageReadingAge = ((averageReadingAge * numChars) + readingAge) / (numChars + 1);
		readingAgeBy[racialIdentity] = newAverageReadingAge;
		speakingRolesBy[racialIdentity] = numChars + 1;
		sentimentBy[racialIdentity] = ((averageSentiment * numChars) + sentiment) / (numChars + 1);
	}
	return { durationBy, readingAgeBy, speakingRolesBy, sentimentBy, hasRacialIdentity };
}
