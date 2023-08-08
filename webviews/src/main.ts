/* eslint-disable @typescript-eslint/no-explicit-any */
import { CharacterStats } from './CharacterStats';
import { formatTime } from './formatTime';
import { showGenderRepresentationStatistics } from './genderRepresentation';
import { LocationsStats } from './LocationsStats';
import { showRacialIdentityRepresentationStatistics } from './racialIdentityRepresentation';
import { ScenesStats } from './ScenesStats';
import { vscode } from './vscode';
import './style.scss';

let state = vscode.getState();

function patchState(ob: object) {
    state = {...state, ...ob};
    vscode.setState(state);
    console.log({state});
}

if(!state) state = {};
if(!state.statistics) {
	state.statistics= {
		characters: [],
		locations: [],
		scenes: []
	};
}

function getPanels(id = "root-panel") {
	return document.getElementById(id) as unknown as { activeid: string };
}

function getDataGrid(id: string) {
	return document.getElementById(id) as HTMLElement & { rowsData: object[] };
}


function updateTable(name: string, rowData: object[]) {
	const dataGrid = getDataGrid(name);
	dataGrid.rowsData = rowData;
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

function updateScenesTable(stats: ScenesStats[]) {
	updateTable('grid-scenes', stats.map((row) => {
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

function updateLocationsTable(stats: LocationsStats[]) {
	updateTable('grid-locations', stats.map((row) => ({
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

function updateCharacterTable(stats: CharacterStats[]) {
	updateTable('grid-characters', stats.map((row) => ({
		"Name": row.Name,
		"Gender": row.Gender?.toUpperCase(),
		"Duration": [
			`${row?.Duration ? formatTime(row.Duration) : ''}`,
			`${row.Lines}\u00a0lines`,
			`${row.Words}\u00a0words`,
			`${row.Monologues}\u00a0monologues`
		].filter(v => !!v).join('\u00a0\u00ad\u00a0'),
		"Reading Age": row.ReadingAge,
		"Sentiment": row?.Sentiment ? sentimentToEmoji(row.Sentiment) : undefined
	})));

	const badge = document.querySelector("vscode-panel-tab#tab-characters > vscode-badge");
	if (badge) { badge.innerHTML = '' + stats.length; }

	showGenderRepresentationStatistics(stats);
	showRacialIdentityRepresentationStatistics(stats);
}

function onMessage(ev: MessageEvent) {
	// eslint-disable-next-line no-debugger
	if (ev.data.command == "fountain.statistics.characters") {
		state.statistics.characters = ev.data.stats;
		updateCharacterTable(state.statistics.characters);
		patchState(state);
	}
	if (ev.data.command == "fountain.statistics.locations") {
		state.statistics.locations = ev.data.stats;
		updateLocationsTable(state.statistics.locations);
		patchState(state);
	}
	if (ev.data.command == "fountain.statistics.scenes") {
		state.statistics.scenes = ev.data.stats;
		updateScenesTable(state.statistics.scenes);
		patchState(state);
	}
	console.log({scriptStats: state.statistics});

	if (ev.data.command == "fountain.analyseLocation") {
		getPanels().activeid = "tab-locations";
	}
	if (ev.data.command == "fountain.analyseCharacter") {
		getPanels().activeid = "tab-characters";
	}
	if (ev.data.command == "fountain.analyseScene") {
		getPanels().activeid = "tab-scenes";
	}

	if(ev.data.command == "opened") {
		patchState({ ...state, uri: ev.data.uri });
	}
}

function handleHrefButton(e: Event) {
	const href = (e.target as HTMLElement).getAttribute('data-href');
	vscode.postMessage({
		command: "open",
		link: href
	});
}


function main() {
	console.log("main");
	
	document.querySelectorAll('vscode-button[data-href]').forEach((it) => it.addEventListener('click', handleHrefButton))
	
	if (state.statistics) {
		updateCharacterTable(state.statistics.characters);
		updateLocationsTable(state.statistics.locations);
		updateScenesTable(state.statistics.scenes);
	}

	vscode.postMessage({ type: 'ready' });
}


window.addEventListener('DOMContentLoaded', main);
window.addEventListener("load", main);
window.addEventListener("message", onMessage);
