import { logger } from '@/utils/logger';
import html from './screenplay-scenes-list.html';
import style from './screenplay-scenes-list.component.scss';
import type { ScenesStats } from '@/types/ScenesStats';
import { COLOURS, CONTRAST_COLOURS } from '@/utils/chart-series-backgrounds';

export class ScreenplayScenesList extends HTMLElement {

    private shadow: ShadowRoot;

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

        this.render();

    }

    get entries(): ScenesStats[] {
        return JSON.parse(this.getAttribute('entries') || '{}');
    }

    get colours(): string[] {
        return COLOURS;
    }
    get contrastColours(): string[] {
        return CONTRAST_COLOURS;
    }

    public setEntries(newValue: ScenesStats[]) {
        logger.trace("setEntries");
        this.setAttribute('entries', JSON.stringify(newValue));
        this.render();
    }

    private render() {
        const container = this.shadow.getElementById("container");
        const largest = this.entries.reduce((a, b) => Math.max(a, b?.Duration || 0), 0.001);
        const smallest = this.entries.reduce((a, b) => Math.min(a, b?.Duration || Infinity), largest);
        container?.replaceChildren(
            ...this.entries.map((c, i) => {
                const node = document.createElement('div');
                node.innerText = c.Name;
                return node;
            })
        );
    }
}

// let the browser know about the custom element
customElements.define('screenplay-scenes-list', ScreenplayScenesList);
