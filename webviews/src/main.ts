import { formatTime } from './formatTime.js';

window.addEventListener("load", main);
window.addEventListener("message", onMessage);

function getPanels(id = "root-panel") {
	return document.getElementById("root-panel") as unknown as { activeid: string };
}

function getDataGrid(id: string) {
	return document.getElementById(id) as unknown as { rowsData: object[] };
}

function updateScenesTable(stats: object[]) {
	getDataGrid('grid-scenes').rowsData = stats.map((row: any) => ({
		...row,
		Duration: formatTime(row.Duration),
	}));
}

function updateLocationsTable(stats: object[]) {
	getDataGrid('grid-locations').rowsData = stats.map((row: any) => ({
		...row,
		Duration: formatTime(row.Duration),
	}));
}

function updateCharacterTable(stats: object[]) {
	getDataGrid('grid-characters').rowsData = stats.map((row: any) => ({
		...row,
		Duration: formatTime(row.Duration),
	}));
}

function onMessage(ev: MessageEvent) {
	// eslint-disable-next-line no-debugger
	if (ev.data.command == "fountain.statistics.characters") {
		updateCharacterTable(ev.data.stats);
	}
	if (ev.data.command == "fountain.statistics.locations") {
		updateLocationsTable(ev.data.stats);
	}
	if (ev.data.command == "fountain.statistics.scenes") {
		updateScenesTable(ev.data.stats);
	}

	if(ev.data.command == "fountain.analyseLocation") {
		getPanels().activeid = "tab-locations";
	}
	if(ev.data.command == "fountain.analyseCharacter") {
		getPanels().activeid = "tab-characters";
	}
	if(ev.data.command == "fountain.analyseScene") {
		getPanels().activeid = "tab-scenes";
	}
}

function main() {
	return;
}