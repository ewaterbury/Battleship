import { PROPS } from "./htmlProps.js";

export default class ViewComponent {
    #attrWhiteList;
    #propWhitelist;
    #root; // Private root DOM element for component.

    constructor(rootElement, rootId, ...attrWhiteList) {
        this.#propWhitelist = new Set(PROPS.whiteList);
        this.#attrWhiteList = new Set();

        // Validate then create root element.
        if (typeof rootElement !== "string" || rootElement.trim() === "")
            throw new TypeError("Element type must be non-empty string");

        // Validate then assign id.
        this.#root = document.createElement(rootElement);

        // Assign id if valid.
        if (rootId) {
            if (typeof rootId !== "string" || rootId.trim() === "")
                throw new TypeError("Element id must be non-empty string");
            this.#root.id = rootId;
        }

        // Add passed attributes to whitelist.
        attrWhiteList.forEach((attr) => this.#attrWhiteList.add(attr));
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

    append(node, validationCallback) {
        // Append child to root element (Accepts ViewComponent).
        // Reject invalid node types.
        if (!(node instanceof ViewComponent))
            throw new TypeError("append() only accepts ViewComponents");

        // Call validation fn if sent.
        if (typeof validationCallback === "function") validationCallback(node);

        // Append node.
        this.#root.appendChild(node.exposeRoot());

        return this;
    }

    exposeRoot() {
        return this.#root;
    }

    mount(target) {
        // Attach component to a target in the DOM.
        // Accepts ViewComponent, HTMLElement, or selector string.

        // Get target as DOM element.
        const parent =
            target instanceof ViewComponent
                ? target.exposeRoot()
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

    readProp(prop) {
        // Checks that prop is on whitelist.
        if (!this.#propWhitelist.has(prop))
            throw new Error(`Invalid property.`);

        // Returns prop value.
        return this.#root[prop];
    }

    remove() {
        // Remove this component's root element from DOM.
        this.#root.remove();

        return this;
    }

    scrollTo(options) {
        // Confirm that input is object.
        if (typeof options !== "object")
            throw new TypeError("Options must be an object");

        // Call scrollTo method on root.
        this.#root.scrollTo(options);

        return this;
    }

    setAttr(attr, value) {
        if (!this.#attrWhiteList.has(attr))
            throw new Error("Invalid attribute");

        this.#root.setAttribute(attr, value);
    }

    setText(text) {
        // Accepts strings and ints.
        if (typeof text !== "string" && typeof text !== "number")
            throw new TypeError("Text must be a string or number");

        // Set root's text content.
        this.#root.textContent = text;

        return this;
    }
}
