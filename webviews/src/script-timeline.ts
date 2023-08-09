import { select } from 'd3-selection';
import { wordToColor } from './word2colour';
import { logger } from './logger';

export class ScriptTimeline extends HTMLElement {

	private shadow: ShadowRoot;
	private zoomSlider: HTMLInputElement;

	constructor() {
		// establish prototype chain
		super();

		this.setEntries = this.setEntries.bind(this);

		// attaches shadow tree and returns shadow root reference
		// https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
		this.shadow = this.attachShadow({ mode: 'open' });

		this.shadow.innerHTML = `
			<style>
				#container {
					display:flex;
					flex-direction:row;
					overflow-y: scroll;
				}
				#container .scene {
					padding: 0.1rem;
					background: grey;
					margin: 0.5px;
					min-height: 2rem;
					color: white;
					font-size: 50%;
					white-space: nowrap;
					text-overflow: ellipsis;
				  }
				#container .scene .characters {
				  display: flex;
				  flex-direction: row;
				  margin: 0.1rem;
				  justify-content: right;
				}
				#container .scene .characters .character {
				  width: 0.5rem;
				  height: 0.5rem;
				  border-radius: 0.5rem;
				  margin:0  0.1rem;
				}
			</style>
			<div id="layout">
				<div id="container" ></div>
				<input type="range" id="zoom" min="10" max="300" value="150" style="float: right;"/>
			</div>
		`;

		const renderFn = this.render.bind(this);
		this.zoomSlider = this.shadow.getElementById("zoom") as HTMLInputElement;
		this.zoomSlider.addEventListener("input", () => { renderFn(); });
		this.render();

	}

	get entries(): { Duration: number; Name: string; Characters: string[]}[] {
		return JSON.parse(this.getAttribute('scenes') || '[]');
	}

	public setEntries(newValue: { Duration: number; Name: string; Characters: string[]}[] ) {
		logger.trace("setEntries");
		this.setAttribute('scenes', JSON.stringify(newValue));
		this.render();
	}

	private render() {
		const totalDuration = this.entries.reduce((acc: number, it) => acc + it.Duration, 0);
		const totalWidth = (totalDuration / parseFloat(this.zoomSlider.value)) * 3; // 30 minutes = 3rem
		const container = this.shadow.getElementById('container') as HTMLDivElement;
		container.innerHTML = '';
		return select(container)
			.selectAll('div')
			.data(this.entries)
			.join('div')
				.attr('class', 'scene')
				.attr('title', d => d.Name)
				.attr('style', d => `width: ${(d.Duration / totalDuration) * totalWidth}rem`)
				.text(d => d.Name)
				.append('div')
					.attr('class', 'characters')
					.selectAll('span')
					.data(d => d.Characters)
					.join('span')
						.attr('class', 'character')
						.attr('style', d => `background: rgb(${wordToColor(d)})`)
						.attr('title', d => d);
	}
}

// let the browser know about the custom element
customElements.define('script-timeline', ScriptTimeline);
