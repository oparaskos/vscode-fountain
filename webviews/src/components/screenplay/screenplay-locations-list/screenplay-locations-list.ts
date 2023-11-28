import type { Tag as VSCodeTag } from '@vscode/webview-ui-toolkit';

import { logger } from '@/utils/logger';
import html from './screenplay-locations-list.html';
import style from './screenplay-locations-list.component.scss';
import { CharacterStats } from '@/types/CharacterStats';
import { LocationsStats } from '@/types/LocationsStats';
import { $t } from '@/components/i18n/i18n';
import { formatTime } from '@/utils/formatTime';
import { COLOURS, CONTRAST_COLOURS } from '@/utils/chart-series-backgrounds';

export class ScreenplayLocationsList extends HTMLElement {

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

    get entries(): LocationsStats[] {
        return JSON.parse(this.getAttribute('entries') || '[]');
    }

    get colours(): string[] {
        return COLOURS;
    }
    get contrastColours(): string[] {
        return CONTRAST_COLOURS;
    }

    public setEntries(newValue: LocationsStats[]) {
        logger.trace("setEntries");
        this.setAttribute('entries', JSON.stringify(newValue));
        this.render();
    }

    private render() {
        const container = this.shadow.getElementById("container");
        const largest = this.entries.reduce((a, b) => Math.max(a, b?.Duration || 0), 0.001)
        const smallest = this.entries.reduce((a, b) => Math.min(a, b?.Duration || Infinity), largest)
        container?.replaceChildren(
            ...this.entries.map((c, i) => {
                const duration = c.Duration || 0;
                const node = document.createElement('div')
                node.classList.add('location')
                node.style.backgroundColor = this.colours[i % this.colours.length]
                node.style.color = this.contrastColours[i % this.contrastColours.length]
                node.style.width = `${((duration - smallest) / (largest - smallest) / 2 + 0.5) * 100}%`

                const nameEl = document.createElement('span')
                nameEl.className = "name"
                nameEl.innerText = c.Name
                node.appendChild(nameEl);

                const durationEl = document.createElement('span')
                durationEl.className = "duration"
                durationEl.innerText = $t("SCENE_APPEARS_DURATION", { duration: formatTime(c.Duration || 0), scenes: c.Scenes })
                node.appendChild(durationEl);

                const tagsEl = document.createElement("div")
                tagsEl.classList.add("tags")

                if (i === 0) {
                    const tagEl = document.createElement('vscode-tag') as VSCodeTag
                    tagEl.className = "tag longest"
                    tagEl.innerText = $t("LONGEST_SCENE")
                    tagsEl.appendChild(tagEl);
                }

                if (c.Type === "INTERIOR" || c.Type === "MIXED") {
                    const tagEl = document.createElement('vscode-tag') as VSCodeTag
                    tagEl.className = "tag interior"
                    tagEl.innerText = $t("INT.");
                    tagsEl.appendChild(tagEl);
                }

                if (c.Type === "EXTERIOR" || c.Type === "MIXED") {
                    const tagEl = document.createElement('vscode-tag') as VSCodeTag
                    tagEl.className = "tag exterior"
                    tagEl.innerText = $t("EXT.");
                    tagsEl.appendChild(tagEl);
                }

                node.appendChild(tagsEl);

                return node;
            })
        )
    }
}

// let the browser know about the custom element
customElements.define('screenplay-locations-list', ScreenplayLocationsList);
