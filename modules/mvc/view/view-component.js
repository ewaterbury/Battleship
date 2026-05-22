import { PROPS } from "./htmlProps.js";

export default class ViewComponent {
    // Points to component element.
    #el;

    // White Lists
    #readWhitelist;
    #writeWhiteList;

    constructor(element, id, ...writeWhiteList) {
        this.#readWhitelist = new Set(PROPS.whiteList);
        this.#writeWhiteList = new Set();

        // Validate then create root element.
        if (typeof element !== "string" || element.trim() === "")
            throw new TypeError("Element type must be non-empty string");

        this.#el = document.createElement(element);

        // Assign id if valid.
        if (id)
            if (typeof id !== "string" || id.trim() === "")
                throw new TypeError("Element id must be non-empty string");
            else this.#el.id = id;

        // Add passed attributes to whitelist.
        writeWhiteList.forEach((item) => this.#writeWhiteList.add(item));
    }

    get element() {
        // Gives access to private root element (get only).
        return this.#el;
    }

    addClass(className) {
        // Add css class to root element.
        this.#el.classList.add(className);

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
        this.#el.dataset[key] = String(value);

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
        this.#el.appendChild(node.element);

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
        parent.appendChild(this.element);

        return this;
    }

    readProp(prop) {
        // Checks that prop is on whitelist.
        if (!this.#readWhitelist.has(prop))
            throw new Error(`Invalid property.`);

        // Returns prop value.
        return this.#el[prop];
    }

    remove() {
        // Remove this component's root element from DOM.
        this.#el.remove();

        return this;
    }

    scrollTo(options) {
        // Confirm that input is object.
        if (typeof options !== "object")
            throw new TypeError("Options must be an object");

        // Call scrollTo method on root.
        this.#el.scrollTo(options);

        return this;
    }

    setAttr(attr, value) {
        if (!this.#writeWhiteList.has(attr))
            throw new Error("Invalid attribute");

        this.#el.setAttribute(attr, value);

        return this;
    }

    setText(text) {
        // Accepts strings and ints.
        if (typeof text !== "string" && typeof text !== "number")
            throw new TypeError("Text must be a string or number");

        // Set root's text content.
        this.#el.textContent = text;

        return this;
    }
}
