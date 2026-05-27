import { PROPS } from "./htmlProps.js";

export default class ViewComponent {
    // Points to component element.
    #el;

    // White Lists
    #readWhitelist;
    #writeWhitelist;

    constructor(element, id, ...writeWhitelist) {
        this.#readWhitelist = new Set(PROPS.whitelist);
        this.#writeWhitelist = new Set();

        // Validate then create root element.
        if (!this.isString(element))
            throw new TypeError("Element type must be non-empty string");

        this.#el = document.createElement(element);

        // Assign id if valid.
        if (id) {
            if (!this.isString(id))
                throw new TypeError("Element id must be non-empty string");
            this.#el.id = id;
        }

        // Add passed attributes to whitelist.
        writeWhitelist.forEach((item) => this.#writeWhitelist.add(item));
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
        if (!regex.test(key))
            throw new TypeError("Dataset key must be camelCase");

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
        // Attach component to a ViewComponent in the DOM (Accepts ViewComponent).

        // Get target as DOM element.
        const parent = target instanceof ViewComponent ? target.element : null;

        // Validate target resolved to DOM element.
        if (!(parent instanceof HTMLElement)) {
            throw new TypeError(`Invalid mount target`);
        }

        // Append component to parent.
        parent.appendChild(this.element);

        return this;
    }

    on(event, handler, options) {
        if (!this.isString(event))
            throw new TypeError("Event name must be a non-empty string");

        if (typeof handler !== "function")
            throw new TypeError("Event handler must be a function");

        if (options !== undefined && typeof options !== "object")
            throw new TypeError("Event options must be an object");

        this.#el.addEventListener(event, handler, options);

        return this;
    }

    readProp(prop) {
        // Checks that prop is on whitelist.
        if (!this.#readWhitelist.has(prop))
            throw new TypeError(`Invalid property.`);

        // Returns prop value.
        return this.#el[prop];
    }

    remove() {
        // Remove this component's root element from DOM.
        this.#el.remove();

        return this;
    }

    setAttr(attr, value) {
        if (!this.isString(attr))
            throw new TypeError("Attribute must be a string");

        if (!this.#writeWhitelist.has(attr))
            throw new TypeError(`Invalid attribute: ${attr}`);

        if (value === undefined || value === null)
            throw new TypeError("Attribute value cannot be null or undefined");

        this.#el.setAttribute(attr, String(value));

        return this;
    }

    setProp(prop, value) {
        if (!this.isString(prop))
            throw new TypeError("Property name must be non-empty string");

        if (!this.#writeWhitelist.has(prop))
            throw new TypeError(`Invalid property: ${prop}`);

        if (!(prop in this.#el))
            throw new TypeError(`Property does not exist on element: ${prop}`);

        this.#el[prop] = value;

        return this;
    }

    setText(text) {
        // Accepts strings and ints.
        if (!this.isString(text) && typeof text !== "number")
            throw new TypeError("Text must be a string or number");

        // Set root's text content.
        this.#el.textContent = String(text);

        return this;
    }

    isString(value) {
        return typeof value === "string" && value.trim() !== "";
    }
}
