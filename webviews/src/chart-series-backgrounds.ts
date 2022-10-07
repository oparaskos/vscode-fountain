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
export function applySeriesBaackgrounds(svg: Selection<SVGSVGElement, undefined, null, undefined>) {
	const size = 10;
	const a = 0.25 * size;
	const b = 0.5 * size;
	const c = 0.75 * size;
	const defs = svg.append("defs");

	pathPattern(defs, [
		`M${b},0l${b},${b}l-${b},${b}l-${b},-${b}l${b},-${b}Z`,
	], size, '#00888d')
		.attr('id', 'chart-series-colour-0');

	pathPattern(defs, [
		`M0,${size}l${size},-${size}l0,${b}l-${b},${b}l-${b},0Z`,
		`M0,${b}l${b},-${b}l-${b},0l0,${b}Z`
	], size, '#740099')
		.attr('id', 'chart-series-colour-1');


	pathPattern(defs, [
		`M0,0l${b},0l0,${b}l-${b},0Z`,
		`M${b},${b}l${b},0l0,${b}l-${b},0Z`,
	], size, '#007acc')
		.attr('id', 'chart-series-colour-2');


	pathPattern(defs, [
		`M0,0l${b},0l0,${size}l-${b},0Z`,
	], size, '#13066b')
		.attr('id', 'chart-series-colour-3');

	pathPattern(defs, [
		`M0,0l0,${b}l${size},0l0,-${b}Z`,
	], size, '#ff1b00')
		.attr('id', 'chart-series-colour-4');

	svg.append("style")
		.html(`
			.chart-series-colour-0 { fill: url(#chart-series-colour-0); }
			.chart-series-colour-1 { fill: url(#chart-series-colour-1); }
			.chart-series-colour-2 { fill: url(#chart-series-colour-2); }
			.chart-series-colour-3 { fill: url(#chart-series-colour-3); }
			.chart-series-colour-3 { fill: url(#chart-series-colour-4); }`);
}
