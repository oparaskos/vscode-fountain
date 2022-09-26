import { formatTime } from './formatTime.js';

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
		};
	}));

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

function updateCharacterTable(stats: object[]) {
	updateTable('grid-characters', stats.map((row: any) => ({
		...row,
		Duration: formatTime(row.Duration),
	})));

	const badge = document.querySelector("vscode-panel-tab#tab-characters > vscode-badge");
	if (badge) { badge.innerHTML = '' + stats.length; }

	let totalDialogue = 0;
	const dialogueBalance: {[gender: string]: number} = {};
	for (const characterStats of stats) {
		const char = characterStats as any;
		dialogueBalance[char.Gender] = (dialogueBalance[char.Gender] || 0) + (char.Duration || 0);
		totalDialogue += (char.Duration || 0);
	}
	const observations = [];
	for (const gender in dialogueBalance) {
		observations.push(`${gender} characters speak for ${formatTime(dialogueBalance[gender])} (${Math.round(100 * (dialogueBalance[gender] / totalDialogue))}%)`);
	}
	document.getElementById("characters-observations")!.innerHTML = observations.join("<br />");
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