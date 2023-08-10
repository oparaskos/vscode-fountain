import { select } from 'd3-selection';
import { wordToColor } from '@/utils/word2colour';
import { logger } from '@/utils/logger';
import html from './script-timeline.html';
import style from './script-timeline.component.scss';

export class ScriptTimeline extends HTMLElement {

    private shadow: ShadowRoot;
    private zoomSlider: HTMLInputElement;

    constructor() {
        // establish prototype chain
        super();

        this.setEntries = this.setEntries.bind(this);
        this.render = this.render.bind(this);

        // attaches shadow tree and returns shadow root reference
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
        this.shadow = this.attachShadow({ mode: 'open' });
        this.shadow.innerHTML = html;

        const styleTag = document.createElement('style');
        styleTag.innerHTML = style;
        this.shadow.prepend(styleTag);

        this.zoomSlider = this.shadow.getElementById("zoom") as HTMLInputElement;
        this.zoomSlider.addEventListener("input", () => { this.render(); });
        this.render();

    }

    get entries(): { Duration: number; Name: string; Characters: string[] }[] {
        return JSON.parse(this.getAttribute('scenes') || '[]');
    }

    public setEntries(newValue: { Duration: number; Name: string; Characters: string[] }[]) {
        logger.trace("setEntries");
        this.setAttribute('scenes', JSON.stringify(newValue));
        this.render();
    }

    private render() {
        const totalDuration = this.entries.reduce((acc: number, it) => acc + it.Duration, 0);
        const zoomAmount = ((-1 * parseFloat(this.zoomSlider.value)) + 1) * 100
        const totalWidth = (totalDuration / zoomAmount) * 3;
        const container = this.shadow.getElementById("container") as HTMLDivElement;
        container.innerHTML = '';
        return select(container)
            .selectAll('div')
            .data(this.entries)
            .join('div')
            .attr('class', 'scene')
            .attr('part', 'scene')
            .attr('title', d => d.Name)
            .attr('style', d => `width: ${(d.Duration / totalDuration) * totalWidth}rem`)
            .text(d => d.Name)
            .append('div')
            .attr('class', 'characters')
            .attr('part', 'characters-list')
            .selectAll('span')
            .data(d => d.Characters)
            .join('span')
            .attr('class', 'character person-filled')
            .attr('part', 'character')
            .attr('style', d => `background-color: rgb(${wordToColor(d)})`)
            .attr('title', d => d);
    }
}

// let the browser know about the custom element
customElements.define('script-timeline', ScriptTimeline);
