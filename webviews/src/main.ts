import { formatTime } from './formatTime';
import { showGenderRepresentationStatistics } from './genderRepresentation';
import { showRacialIdentityRepresentationStatistics } from './racialIdentityRepresentation';

const fountain = {
	selections: {} as { [key: string]: any },
	statistics: {
		characters: [],
		locations: [],
		scenes: []
	}
};


window.addEventListener("load", main);
window.addEventListener("message", onMessage);

function getPanels(id = "root-panel") {
	return document.getElementById("root-panel") as unknown as { activeid: string };
}

function getDataGrid(id: string) {
	return document.getElementById(id) as HTMLElement & { rowsData: object[] };
}

function onSelectionChanged(name: string, i: number, rowData: object[]) {
	const charactersPanel = document.querySelector("vscode-panel-view#view-characters");
	if (charactersPanel) {
		charactersPanel.getElementsByTagName("h3")[0].innerHTML = fountain.selections[name].Name;
	}
}

function onRowElementClicked(name: string, i: number, rowData: object[]) {
	return (evt: Event) => {
		fountain.selections[name] = rowData[i - 1];
		onSelectionChanged(name, i, rowData);
	};
}

function updateTable(name: string, rowData: object[]) {
	const dataGrid = getDataGrid(name);
	dataGrid.rowsData = rowData;
	setTimeout(() => {
		const rowElements = dataGrid.getElementsByTagName("vscode-data-grid-row");
		for (let i = 0; i < rowElements.length; ++i) {
			const element = rowElements[i];
			element.addEventListener("click", onRowElementClicked(name, i, rowData));
		}
	}, 1);
}

function describeDuration(dialogueActionRatio: number, duration : number) {
	const dialogueRatio = dialogueActionRatio;
	const actionRatio = 1 - dialogueRatio;
	if (dialogueRatio > actionRatio) {
		return `${formatTime(duration)} (${Math.round(dialogueRatio * 100).toFixed(0)}%\u00a0Dialogue)`;
	} if (actionRatio > dialogueRatio) {
		return `${formatTime(duration)} (${Math.round(actionRatio * 100).toFixed(0)}%\u00a0Action)`;
	} else {
		return `${formatTime(duration)} (Balanced\u00a0Action\u00a0/\u00a0Dialogue)`;
	}

}

function updateScenesTable(stats: object[]) {
	updateTable('grid-scenes', stats.map((row: any) => {
		const dialogueRatio = row.DialogueDuration / row.Duration;
		return {
            Name: row.Name,
            Characters: row.Characters,
            Synopsis: row.Synopsis,
			Duration: describeDuration(dialogueRatio, row.Duration),
			Sentiment: sentimentToEmoji(row.Sentiment)
		};
	}));

	console.log("updateScenesTable");
	(document.getElementById("scenes-timeline") as any).setEntries(stats);

	const badge = document.querySelector("vscode-panel-tab#tab-scenes > vscode-badge");
	if (badge) { badge.innerHTML = '' + stats.length; }
}

function updateLocationsTable(stats: object[]) {
	updateTable('grid-locations', stats.map((row: any) => ({
		...row,
		Duration: formatTime(row.Duration),
	})));

	const badge = document.querySelector("vscode-panel-tab#tab-locations > vscode-badge");
	if (badge) { badge.innerHTML = '' + stats.length; }
}

function sentimentToEmoji(sentiment: number | null) {
	if(sentiment !== 0 && !sentiment) return '∅';

	const emojiIndex = Math.max(-5, Math.min(5, Math.round(sentiment))) + 5;
	// Sentimenent is only guessing at good/bad not the difference between angry/sad so this is just a rough 'how good/bad does this character feel at this moment'.
	const emoji = ['🤬', '😫', '😣', '🙁', '😕', '😐', '😏', '🙂', '😀', '😃', '😆'];
	return `${emoji[emojiIndex] || emoji[5]} (${sentiment.toFixed(1)})`;
}

function updateCharacterTable(stats: {[key: string]: any}[]) {
	updateTable('grid-characters', stats.map((row: {[key: string]: any}) => ({
		"Name": row.Name,
		"Gender": row.Gender.toUpperCase(),
		"Length & Duration": [
			`${formatTime(row.Duration)}`,
			`${row.Lines}\u00a0lines`,
			`${row.Words}\u00a0words`,
			`${row.Monologues}\u00a0monologues`
		].join('\u00a0\u00ad\u00a0'),
		"Reading Age": row.ReadingAge,
		"Sentiment": sentimentToEmoji(row.Sentiment)
	})));

	const badge = document.querySelector("vscode-panel-tab#tab-characters > vscode-badge");
	if (badge) { badge.innerHTML = '' + stats.length; }

	showGenderRepresentationStatistics(stats);
	showRacialIdentityRepresentationStatistics(stats);
}

function onMessage(ev: MessageEvent) {
	// eslint-disable-next-line no-debugger
	if (ev.data.command == "fountain.statistics.characters") {
		fountain.statistics.characters = ev.data.stats;
		updateCharacterTable(fountain.statistics.characters);
	}
	if (ev.data.command == "fountain.statistics.locations") {
		fountain.statistics.locations = ev.data.stats;
		updateLocationsTable(fountain.statistics.locations);
	}
	if (ev.data.command == "fountain.statistics.scenes") {
		fountain.statistics.scenes = ev.data.stats;
		updateScenesTable(fountain.statistics.scenes);
	}
	console.log({scriptStats: fountain.statistics});

	if (ev.data.command == "fountain.analyseLocation") {
		getPanels().activeid = "tab-locations";
	}
	if (ev.data.command == "fountain.analyseCharacter") {
		getPanels().activeid = "tab-characters";
	}
	if (ev.data.command == "fountain.analyseScene") {
		getPanels().activeid = "tab-scenes";
	}
}

function main() {
	return;
}