import { Selection } from 'd3-selection';

function pathPattern(defs: Selection<SVGDefsElement, undefined, null, undefined>, paths: string[], size: number, colour: string) {
	const pattern = defs
		.append("pattern")
		.attr("width", size)
		.attr("height", size)
		.attr("patternUnits", "userSpaceOnUse");
	pattern
		.call(f => f.append('rect').attr('width', size).attr('height', size).attr('style', `fill: ${colour};`))
		.selectAll('path')
		.data(paths)
		.join('path')
		.attr('d', d => d)
		.attr('style', 'fill:#fff;fill-opacity:0.25;');
	return pattern;
}


export const FRENCH_BLUE = '#007accff';
export const LIGHT_CYAN = '#c9f9ffff';
export const THULIAN_PINK = '#e56399ff';
export const SANDY_BROWN = '#ee964bff';
export const APPLE_GREEN = '#a5be00ff';

export const COLOURS = [
    FRENCH_BLUE,
    LIGHT_CYAN,
    THULIAN_PINK,
    SANDY_BROWN,
    APPLE_GREEN
];


export const CONTRAST_COLOURS = ['#fff', '#0f0f0f', '#fff', '#0f0f0f', '#0f0f0f']

export function applySeriesBaackgrounds(svg: Selection<SVGSVGElement, undefined, null, undefined>, visualImpaired = false) {
	const size = 10;
	const halfSize = 0.5 * size;
	const defs = svg.append("defs");

	pathPattern(defs, [
		`M${halfSize},0l${halfSize},${halfSize}l-${halfSize},${halfSize}l-${halfSize},-${halfSize}l${halfSize},-${halfSize}Z`,
	], size, COLOURS[0])
		.attr('id', 'chart-series-colour-0');

	pathPattern(defs, [
		`M0,${size}l${size},-${size}l0,${halfSize}l-${halfSize},${halfSize}l-${halfSize},0Z`,
		`M0,${halfSize}l${halfSize},-${halfSize}l-${halfSize},0l0,${halfSize}Z`
	], size, COLOURS[1])
		.attr('id', 'chart-series-colour-1');


	pathPattern(defs, [
		`M0,0l${halfSize},0l0,${halfSize}l-${halfSize},0Z`,
		`M${halfSize},${halfSize}l${halfSize},0l0,${halfSize}l-${halfSize},0Z`,
	], size, COLOURS[2])
		.attr('id', 'chart-series-colour-2');


	pathPattern(defs, [
		`M0,0l${halfSize},0l0,${size}l-${halfSize},0Z`,
	], size, COLOURS[3])
		.attr('id', 'chart-series-colour-3');

	pathPattern(defs, [
		`M0,0l0,${halfSize}l${size},0l0,-${halfSize}Z`,
	], size, COLOURS[4])
		.attr('id', 'chart-series-colour-4');

	svg.append("style")
		.html(`
			.chart-series-colour-0 { fill: ${visualImpaired ? 'url(#chart-series-colour-0);' : COLOURS[0]} }
			.chart-series-colour-1 { fill: ${visualImpaired ? 'url(#chart-series-colour-1);' : COLOURS[1]} }
			.chart-series-colour-2 { fill: ${visualImpaired ? 'url(#chart-series-colour-2);' : COLOURS[2]} }
			.chart-series-colour-3 { fill: ${visualImpaired ? 'url(#chart-series-colour-3);' : COLOURS[3]} }
			.chart-series-colour-3 { fill: ${visualImpaired ? 'url(#chart-series-colour-4);' : COLOURS[4]} }`);
}
