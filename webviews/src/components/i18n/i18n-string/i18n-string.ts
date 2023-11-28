import { I18n } from '../i18n';
import { titleCase, sentenceCase } from 'true-case';
export class I18nStringElement extends HTMLElement {
    private _textElement: HTMLSpanElement;
    private startingText: string | null;
    constructor() {
        // establish prototype chain
        super();

        this.render = this.render.bind(this);
        this.startingText = this.textContent;

        // attaches shadow tree and returns shadow root reference
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
        this.attachShadow({ mode: 'open' });
        this._textElement = document.createElement('span');
        this._textElement.textContent = I18n.getOfflineMessageOrDefault(this.messageKey, this.startingText);
        this.shadowRoot?.appendChild(this._textElement);

        this.render();
    }

    private textTransform(message: string): string {
        switch(this.case.toLowerCase()) {
            case 'upper':
                return message.toUpperCase();
            case 'lower':
                return message.toUpperCase();
            case 'title':
                return titleCase(message, {language: this.locale.baseName.toLowerCase()});
            case 'sentence':
                return sentenceCase(message, {language: this.locale.baseName.toLowerCase(), trueCasing: true});
            case 'as-is':
            default:
                return message;
        }
    }

    get case() {
        return this.getAttribute('case') || 'as-is';
    }

    get locale() {
        return new Intl.Locale(this.getAttribute('locale') || I18n.defaultLocale);
    }

    get messageKey() {
        return this.getAttribute('messageKey') || this.textContent?.replace(/\s+/ig, '_')?.replace(/[^\w]+/ig, '')?.toUpperCase() || "";
    }

    private async render() {
        const message = await I18n.getMessageOrDefault(this.messageKey, this.startingText, this.locale);
        if(message) {
            this._textElement.textContent = this.textTransform(message);
        };
    }
}

// let the browser know about the custom element
customElements.define('i18n-string', I18nStringElement);
