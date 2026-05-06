export default class ViewComponent {
    #root; // Private root DOM element for component.

    constructor(rootElement, rootId) {
        // Validate then create root element.
        if (typeof rootElement !== "string" || rootElement.trim() === "")
            throw new TypeError("Element type must be non-empty string");

        // Validate then assign id.
        this.#root = document.createElement(rootElement);
        if (rootId) {
            if (typeof rootId !== "string" || rootId.trim() === "")
                throw new TypeError("Element id must be non-empty string");
            this.#root.id = rootId;
        }
    }

    get element() {
        // Expose root element.
        return this.#root;
    }

    addClass(className) {
        // Add css class to root element.
        this.#root.classList.add(className);
        return this;
    }

    addDataset(key, value) {
        // Validates key input.
        const regex = /^[a-z][A-Za-z0-9]*$/;
        if (!regex.test(key)) throw new TypeError("Dataset key must camelCase");

        // Validates value input.
        if (!["string", "number", "boolean"].includes(typeof value))
            throw new TypeError("Invalid value type");

        // add data set to component.
        this.#root.dataset[key] = String(value);

        return this;
    }

    append(child, validationCallback) {
        // Append child to root element (Accepts ViewComponent or HTMLElement).

        const node =
            child instanceof ViewComponent
                ? child.element
                : child instanceof HTMLElement
                  ? child
                  : null;

        // Reject invalid node types.
        if (!node) {
            throw new TypeError(
                "append() only accepts ViewComponent or HTMLElement",
            );
        }

        // Call validation fn if sent.
        if (typeof validationCallback === "function") validationCallback(node);

        // Append node.
        this.#root.appendChild(node);

        return this;
    }

    mount(target) {
        // Attach component to a target in the DOM.
        // Accepts ViewComponent, HTMLElement, or selector string.

        // Get target as DOM element.
        const parent =
            target instanceof ViewComponent
                ? target.element
                : target instanceof HTMLElement
                  ? target
                  : typeof target === "string"
                    ? document.querySelector(target)
                    : null;

        // Validate target resolved to DOM element.
        if (!(parent instanceof HTMLElement)) {
            throw new TypeError(`Invalid mount target`);
        }

        // Append component to parent.
        parent.appendChild(this.#root);

        return this;
    }

    remove() {
        // Remove this component's root element from DOM.
        this.#root.remove();

        return this;
    }

    setText(text) {
        if (typeof text !== "string" && typeof text !== "number")
            throw new TypeError("Text must be a string or number");

        this.#root.textContent = text;
        return this;
    }
}
