import { nPearsonHash } from './nPearsonHash';

export function RGBtoHSV(r: number, g: number, b: number): Array<number>{
	let h = 0;
    const max = Math.max(r, g, b), min = Math.min(r, g, b),
        d = max - min,
        s = (max === 0 ? 0 : d / max),
        v = max / 255;

    switch (max) {
        case min: h = 0; break;
        case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
        case g: h = (b - r) + d * 2; h /= 6 * d; break;
        case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }

    return [h, s, v];
}

export function HSVToRGB(h: number, s: number, v: number): Array<number> {
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
export function wordToColor(word: string, s = 0.5, v = 1): Array<number> {
	const n = 5; //so that colors are spread apart
	const h = nPearsonHash(word, n) / 2 ** (8 - n);
	return HSVToRGB(h, s, v);
}