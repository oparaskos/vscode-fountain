import * as cloud from 'd3-cloud';

export class WordCloudElement extends HTMLElement {

    private shadow: ShadowRoot;

    constructor() {
        // establish prototype chain
        super();

        // attaches shadow tree and returns shadow root reference
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
        this.shadow = this.attachShadow({ mode: 'open' });
        const loading = document.createElement('div');
        loading.innerText = 'loading...';
        this.shadow.appendChild(loading);
        // binding methods
        this.onChange = this.onChange.bind(this);
        this.setEntries = this.setEntries.bind(this);
        this.onChange();

    }

	setEntries(newEntries: object[]) {
		this.setAttribute('entries', JSON.stringify(newEntries));
		this.onChange();
	}

    // add items to the list
    onChange() {
        if (this.entries) {
            // appending the container to the shadow DOM
            // const canvas = document.createElement("canvas") as HTMLCanvasElement;
            // this.shadow.replaceChildren(canvas);
            // if(!canvas)return;
            // cloud()
            //     .size([960, 500])
            //     .canvas(canvas)
            //     .words(this.entries)
            //     .padding(5)
            //     .on("end", (words: any) => console.log(JSON.stringify(words)))
            //     .fontSize((d: any) => d.size)
            //     .start();
            
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
    get entries() {
        return ["Hello", "world", "normally", "you", "want", "more", "words", "than", "this"]
            .map(function (d) {
                return { text: d, size: 10};
            });
    }

}

// let the browser know about the custom element
customElements.define('word-cloud', WordCloudElement);
