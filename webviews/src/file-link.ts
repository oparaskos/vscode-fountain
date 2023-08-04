import { InternSet, map, min, max, range } from 'd3-array';
import { axisTop, axisLeft } from 'd3-axis';
import { create } from 'd3-selection';
import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale';
import { schemeSpectral, interpolateSpectral } from 'd3-scale-chromatic';
import { format } from 'd3-format';
import { quantize } from 'd3-interpolate';
import { applySeriesBaackgrounds } from './chart-series-backgrounds';
import { vscode } from './vscode';

export class FileLink extends HTMLElement {

	private shadow: ShadowRoot;

	constructor() {
		// establish prototype chain
		super();

		// attaches shadow tree and returns shadow root reference
		// https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
		this.shadow = this.attachShadow({ mode: 'open' });

		// binding methods
		this.onChange = this.onChange.bind(this);
		this.onClick = this.onClick.bind(this);
		this.onChange();

	}

	onClick() {
		console.log("open file in vscode " + this.href);
		vscode.postMessage({
			command: "open",
			link: this.href
		});

	}

	// add items to the list
	onChange() {
		if (this.href) {
			// appending the container to the shadow DOM
			this.shadow.innerHTML = '';
			const node = document.createElement('button');
			node.textContent = "button";
			node.onclick = this.onClick;

			if(node)
				this.shadow.appendChild(node);
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


	get href(): string|null{
		return this.getAttribute('href');
	}

	setHref(href: string) {
		this.setAttribute('href', href);
		this.onChange();
	}
}

// let the browser know about the custom element
customElements.define('file-link', FileLink);



