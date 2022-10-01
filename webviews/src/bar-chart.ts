import { InternSet, map, max, range } from 'd3-array';
import { axisTop, axisLeft } from 'd3-axis';
import { create } from 'd3-selection';
import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale';
import { schemeSpectral, interpolateSpectral } from 'd3-scale-chromatic';
import { format } from 'd3-format';
import { quantize } from 'd3-interpolate';

export class BarChart extends HTMLElement {

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
			// Construct scales and axes.
			const xScale = this.xType(this.xDomain, this.xRange);
			const yScale = scaleBand(this.yDomain, this.yRange).padding(this.yPadding);
			const xAxis = axisTop(xScale).ticks(this.width / 80, this.format);
			const yAxis = axisLeft(yScale).tickSizeOuter(0);

			const svg = create("svg")
				.attr("width", this.width)
				.attr("height", this.height)
				.attr("viewBox", [0, 0, this.width, this.height])
				.attr("style", this.style.cssText + "; max-width: 100%; height: auto; height: intrinsic;");

			svg.append("g")
				.attr("transform", `translate(0,${this.marginTop})`)
				.call(xAxis)
				.call(g => g.select(".domain").remove())
				.call(g => g.selectAll(".tick line").clone()
					.attr("y2", this.height - this.marginTop - this.marginBottom)
					.attr("stroke-opacity", 0.1))
				.call(g => g.append("text")
					.attr("x", this.width - this.marginRight)
					.attr("y", -22)
					.attr("fill", "currentColor")
					.attr("text-anchor", "end")
					.text(this.xLabel));

			svg.append("g")
				.selectAll("rect")
				.data(this.I)
				.join("rect")
				.attr("x", xScale(0))
				.attr("y", i => yScale(this.Y[i])!)
				.attr("fill", i => this.colors(this.Y[i]) as string)
				.attr("width", i => xScale(this.X[i]) - xScale(0))
				.attr("height", yScale.bandwidth());

			svg.append("g")
				.attr("fill", this.titleColor)
				.attr("text-anchor", "end")
				.attr("font-family", "sans-serif")
				.attr("font-size", 10)
				.selectAll("text")
				.data(this.I)
				.join("text")
				.attr("x", i => xScale(this.X[i]))
				.attr("y", i => yScale(this.Y[i])! + yScale.bandwidth() / 2)
				.attr("dy", "0.35em")
				.attr("dx", -4)
				.text(this.title)
				.call(text => text.filter(i => xScale(this.X[i]) - xScale(0) < 20) // short bars
					.attr("dx", +4)
					.attr("fill", this.titleAltColor)
					.attr("text-anchor", "start"));

			svg.append("g")
				.attr("transform", `translate(${this.marginLeft},0)`)
				.call(yAxis);

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


	get entries(): object[] {
		return JSON.parse(this.getAttribute('entries') || '[]') || [];
	}

	setEntries(newEntries: object[]) {
		this.setAttribute('entries', JSON.stringify(newEntries));
		this.onChange(null);
	}


	// gathering data from element attributes
	get title() {
		return this.getAttribute('title') || '';
	}

	get width() {
		return parseFloat(this.getAttribute('width') || '640');
	}

	get height() {
		const defaultHeight = Math.ceil((this.yDomain.size + this.yPadding) * 25) + this.marginTop + this.marginBottom;
		return parseFloat(this.getAttribute('height') || `${defaultHeight}`);
	}

	// a format specifier for values (in the label)
	get format() {
		return this.formatValue || format(this.getAttribute('format') || 'd');
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

	get quantitativeFunction() {
		const attributeValue = this.getAttribute("quantitativeFunction") || 'value';
		return (datum: any, index: number) => datum[attributeValue];
	}

	get ordinalFunction() {
		const attributeValue = this.getAttribute("ordinalFunction") || 'label';
		return (datum: any, index: number) => datum[attributeValue];
	}

	get marginTop() {
		return parseFloat(this.getAttribute("marginTop") || '30');
	}

	get marginRight() {
		return parseFloat(this.getAttribute("marginRight") || '0');
	}

	get marginBottom() {
		return parseFloat(this.getAttribute("marginBottom") || '10');
	}

	get marginLeft() {
		return parseFloat(this.getAttribute("marginLeft") || '30');
	}

	get xType() {
		return scaleLinear;
	}
	get xRange() {
		return [this.marginLeft, this.width - this.marginRight];
	}
	get xLabel() {
		return null;
	}
	get xPadding() {
		return 0.1;
	}
	get color() {
		return "currentColor";
	}
	get titleColor() {
		return "white";
	}
	get titleAltColor() {
		return "currentColor";
	}
	get xDomain() {
		return [0, max(this.X)];
	}
	get yDomain() {
		return new InternSet(this.Y);
	}
	// Compute values.
	get X() { return map(this.entries, this.quantitativeFunction); }
	get Y() { return map(this.entries, this.ordinalFunction); }
	// Omit any data not present in the y-domain.
	get I() { return range(this.X.length).filter(i => this.yDomain?.has(this.Y[i])); }

	get yRange() {
		return [this.marginTop, this.height - this.marginBottom];
	}

	get yPadding() { return 0; }
	// array of colors for names
	get colors() {
		return scaleOrdinal()
			.domain(this.Y)
			.range(this.colourScheme);
	}

	get colourScheme() {
		return schemeSpectral[this.names.length] || quantize(t => interpolateSpectral(t * 0.8 + 0.1), this.names.length);
	}

}

// let the browser know about the custom element
customElements.define('bar-chart', BarChart);