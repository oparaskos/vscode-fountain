import { formatTime } from './formatTime';

window.addEventListener("load", main);
window.addEventListener("message", onMessage);

function getDataGrid(id: string) {
	return document.getElementById(id) as unknown as { rowsData: object[] };
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
}

function main() {
	return;
}