export default class ViewComponent {
    #root; // Private root DOM element for this component.

    constructor(rootElement, rootId) {
        // Create the root element and assign its id.
        this.#root = document.createElement(rootElement);
        this.#root.id = rootId;
    }
}
