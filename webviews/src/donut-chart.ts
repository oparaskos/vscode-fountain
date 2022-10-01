import { pie, arc } from "d3-shape";
import { create } from "d3-selection";
import { range } from "d3-array";
import { format } from "d3-format";
import { scaleOrdinal } from "d3-scale";
import { schemeSpectral, interpolateSpectral } from "d3-scale-chromatic";
import { quantize } from "d3-interpolate";

export class DonutChart extends HTMLElement {

	private shadow: ShadowRoot;
	private formatValue: (null | ((n: number | { valueOf(): number; }) => string)) = null;

	constructor() {
		// establish prototype chain
		super();

		// attaches shadow tree and returns shadow root reference
		// https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
		this.shadow = this.attachShadow({ mode: 'open' });

		// binding methods
		this.onChange = this.onChange.bind(this);
		this.setFormat = this.setFormat.bind(this);
		this.setEntries = this.setEntries.bind(this);
		this.onChange(null);

	}

	// add items to the list
	onChange(e: Event | null) {
		console.log({ entries: this.entries });
		if (this.entries) {
			// Compute values.
			const N = this.names;
			const V = Object.values(this.entries);
			const I = range(this.names.length).filter(i => !isNaN(V[i]));

			// Compute titles.
			const titleFn = (i: number) => `${N[i]}\n${this.format(V[i])}`;

			// Construct arcs.
			const arcs = pie().padAngle(this.padAngle).sort(null).value((i) => V[i.valueOf()])(I);
			const innerArc = arc().innerRadius(this.innerRadius).outerRadius(this.outerRadius);
			const labelArc = arc().innerRadius(this.labelRadius).outerRadius(this.labelRadius);

			const svg = create("svg")
				.attr("width", this.width)
				.attr("height", this.height)
				.attr("viewBox", [-this.width / 2, -this.height / 2, this.width, this.height])
				.attr("style", this.style.cssText + "; max-width: 100%; height: auto; height: intrinsic;");

			if(this.title) {
				svg.append("g")
					.attr("font-family", "sans-serif")
					.attr("font-size", 10)
					.attr("text-anchor", "middle")
					.append("text")
					.selectAll("tspan")
					.data(this.title.split('\n'))
					.join("tspan")
					.attr("x", 0)
					.attr("y", (_, i) => `${i * 1.1}em`)
					.attr("font-weight", (_, i) => i ? null : "bold")
					.text(d => d);
			}

			svg.append("g")
				.attr("stroke", this.stroke)
				.attr("stroke-width", this.strokeWidth)
				.attr("stroke-linejoin", this.strokeLinejoin)
				.selectAll("path")
				.data(arcs)
				.join("path")
				.attr("fill", d => this.colors(N[d.index]) as string)
				.attr("d", innerArc as unknown as string)
				.append("title")
				.text(d => this.names[d.index]);


			svg.append("g")
				.attr("font-family", "sans-serif")
				.attr("font-size", 10)
				.attr("text-anchor", "middle")
				.selectAll("text")
				.data(arcs)
				.join("text")
				.attr("transform", d => `translate(${labelArc.centroid(d as any)})`)
				.selectAll("tspan")
				.data(d => {
					const lines = `${titleFn(d.index)}`.split(/\n/);
					return (d.endAngle - d.startAngle) > 0.25 ? lines : lines.slice(0, 1);
				})
				.join("tspan")
				.attr("x", 0)
				.attr("y", (_, i) => `${i * 1.1}em`)
				.attr("font-weight", (_, i) => i ? null : "bold")
				.text(d => d);
			// appending the container to the shadow DOM
			this.shadow.innerHTML = '';
			this.shadow.appendChild(svg.node()!);
		}
	}

	// fires after the element has been attached to the DOM
	connectedCallback() {
		// const removeElementButtons = [...this.shadowRoot.querySelectorAll('.editable-list-remove-item')];
		// const addElementButton = this.shadowRoot.querySelector('.editable-list-add-item');

		// this.itemList = this.shadowRoot.querySelector('.item-list');

		// this.handleRemoveItemListeners(removeElementButtons);
		// addElementButton.addEventListener('click', this.addListItem, false);
	}


	get entries(): { [key: string]: number } {
		return JSON.parse(this.getAttribute('entries') || '{}') || {};
	}

	setEntries(newEntries: { [key: string]: number }) {
		this.setAttribute('entries', JSON.stringify(newEntries));
		this.onChange(null);
	}

	
	// gathering data from element attributes
	get title() {
		return this.getAttribute('title') || '';
	}

	get width() {
		return parseFloat(this.getAttribute('width') || '450');
	}

	get height() {
		return parseFloat(this.getAttribute('height') || '450');
	}

	// inner radius of pie, in pixels (non-zero for donut)
	get innerRadius() {
		const defaultInnerRadius = Math.min(this.width, this.height) / 3;
		return parseFloat(this.getAttribute('innerRadius') || `${defaultInnerRadius}`);
	}

	// outer radius of pie, in pixels
	get outerRadius(): number {
		const defaultOuterRadius = Math.min(this.width, this.height) / 2;
		return parseFloat(this.getAttribute('outerRadius') || `${defaultOuterRadius}`);
	}

	// center radius of labels
	get labelRadius() {
		const defaultLabelRadius = (this.innerRadius + this.outerRadius) / 2;
		return parseFloat(this.getAttribute('labelRadius') || `${defaultLabelRadius}`);
	}

	// a format specifier for values (in the label)
	get format() {
		return this.formatValue || format(this.getAttribute('format') || ',');
	}

	setFormat(newValueFormatter: ((n: number | { valueOf(): number; }) => string) | null) {
		this.formatValue = newValueFormatter;
		if (!newValueFormatter) {
			this.setAttribute('format', `,`);
		} else {
			this.setAttribute('format', `[Function]`);
		}
		this.onChange(null);
	}

	// array of names (the domain of the color scale)
	get names() { return Object.keys(this.entries); }

	// array of colors for names
	get colors() {
		return scaleOrdinal()
			.domain(Object.keys(this.entries))
			.range(this.colourScheme);
	}

	get colourScheme() {
		return schemeSpectral[this.names.length] || quantize(t => interpolateSpectral(t * 0.8 + 0.1), this.names.length);
	}

	// stroke separating widths
	get stroke() {
		const defaultStroke = this.innerRadius > 0 ? "none" : "white";
		return this.getAttribute('stroke') || defaultStroke;
	}

	// width of stroke separating wedges
	get strokeWidth() {
		return parseFloat(this.getAttribute('strokeWidth') || '1');
	}

	// line join of stroke separating wedges
	get strokeLinejoin() {
		return this.getAttribute('strokeLinejoin') || 'round';
	}

	// angular separation between wedges
	get padAngle() {
		const defaultPadAngle = this.stroke === "none" ? 1 / this.outerRadius : 0;
		return parseFloat(this.getAttribute('padAngle') || `${defaultPadAngle}`);
	}
}

// let the browser know about the custom element
customElements.define('donut-chart', DonutChart);