window.addEventListener("load", main);
window.addEventListener("message", onMessage);
//Simple n-bit hash
function nPearsonHash(message: string, n = 8): number {
	// Ideally, this table would be shuffled...
	// 256 will be the highest value provided by this hashing function
	const table = [...new Array(2 ** n)].map((_, i) => i);


	return message.split('').reduce((hash, c) => {
		return table[(hash + c.charCodeAt(0)) % (table.length - 1)];
	}, message.length % (table.length - 1));

}

function HSVToRGB(h: number, s: number, v: number): Array<number> {
	let [r, g, b] = [0, 0, 0];

	const i = Math.floor(h * 6);
	const f = h * 6 - i;
	const p = v * (1 - s);
	const q = v * (1 - f * s);
	const t = v * (1 - (1 - f) * s);
	switch (i % 6) {
		case 0: r = v, g = t, b = p; break;
		case 1: r = q, g = v, b = p; break;
		case 2: r = p, g = v, b = t; break;
		case 3: r = p, g = q, b = v; break;
		case 4: r = t, g = p, b = v; break;
		case 5: r = v, g = p, b = q; break;
	}
	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

//We are using colors with same value and saturation as highlighters
function wordToColor(word: string, s = 0.5, v = 1): Array<number> {
	const n = 5; //so that colors are spread apart
	const h = nPearsonHash(word, n) / 2 ** (8 - n);
	return HSVToRGB(h, s, v);

}


function formatTime(seconds: number) {
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = Math.round(seconds % 60);
	return [
		h,
		m > 9 ? m : (h ? '0' + m : m || '0'),
		s > 9 ? s : '0' + s
	].filter(Boolean).join(':');
}

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