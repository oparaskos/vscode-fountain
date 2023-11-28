import { logger } from '@/utils/logger';
import html from './screenplay-profile.html';
import style from './screenplay-profile.component.scss';
import { CharacterStats } from '@/types/CharacterStats';
import { formatTime } from '@/utils/formatTime';

export class ScreenplayProfile extends HTMLElement {

    private shadow: ShadowRoot;

    constructor() {
        // establish prototype chain
        super();

        this.setProfile = this.setProfile.bind(this);
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

    get size(): number {
        return parseFloat(this.getAttribute('size') || '1');
    }

    get color(): string {
        return this.getAttribute('background-color') || '#faafaf';
    }

    get contrastColor(): string {
        return this.getAttribute('foreground-color') || '#0e0e0e';
    }

    get profile(): CharacterStats {
        return JSON.parse(this.getAttribute('profile') || '{}');
    }

    public setProfile(newValue: CharacterStats) {
        logger.trace("setProfile");
        this.setAttribute('profile', JSON.stringify(newValue));
        this.render();
    }

    private render() {
        const container = this.shadow.getElementById("container");
        if (!container) return;
        container.style.backgroundColor = this.color;
        container.style.color = this.contrastColor;
        container.style.width = `${10 * this.size}rem`;
        container.style.height = `${10 * this.size}rem`;
        container.setAttribute('title', this.profile.Name);

        const nameEl = this.shadow.getElementById("profile_name");
        if (nameEl) nameEl.textContent = this.profile.Name;

        const durationEl = this.shadow.getElementById("profile_duration");
        if (durationEl) durationEl.textContent = formatTime(this.profile.Duration || 0);
    }

}

// let the browser know about the custom element
customElements.define('screenplay-profile', ScreenplayProfile);
