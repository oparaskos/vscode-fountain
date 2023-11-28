import { logger } from '@/utils/logger';
import html from './screenplay-profiles-list.html';
import style from './screenplay-profiles-list.component.scss';
import { CharacterStats } from '@/types/CharacterStats';
import { ScreenplayProfile } from '../screenplay-profile/screenplay-profile';
import { COLOURS, CONTRAST_COLOURS } from '@/utils/chart-series-backgrounds';

export class ScreenplayProfilesList extends HTMLElement {

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

    get entries(): CharacterStats[] {
        return JSON.parse(this.getAttribute('entries') || '{}');
    }

    get colours(): string[] {
        return COLOURS;
    }
    get contrastColours(): string[] {
        return CONTRAST_COLOURS;
    }

    public setEntries(newValue: CharacterStats[]) {
        logger.trace("setEntries");
        this.setAttribute('entries', JSON.stringify(newValue));
        this.render();
    }

    private render() {
        const container = this.shadow.getElementById("container");
        const largest = this.entries.reduce((a, b) => Math.max(a, b?.Duration || 0), 0.001)
        const smallest = this.entries.reduce((a, b) => Math.min(a, b?.Duration || Infinity), largest)
        console.log({ largest, smallest });
        container?.replaceChildren(
            ...this.entries.map((c, i) => {
                const node = document.createElement('screenplay-profile') as ScreenplayProfile
                const duration = c.Duration || 0;
                node.setAttribute('background-color', this.colours[i % this.colours.length])
                node.setAttribute('foreground-color', this.contrastColours[i % this.contrastColours.length])
                node.setAttribute('size', ((duration - smallest) / (largest - smallest) / 2 + 0.5).toFixed(2))
                node.setProfile(c);
                return node;
            })
        )
    }
}

// let the browser know about the custom element
customElements.define('screenplay-profiles-list', ScreenplayProfilesList);
