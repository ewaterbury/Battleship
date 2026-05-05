export default class ViewComponent {
    #root; // Private root DOM element for component.

    constructor(rootElement, rootId) {
        // Validate then create root element.
        if (typeof el.type !== "string" || el.type.trim() === "")
            throw new TypeError("Element type must be non-empty string");

        // Validate then assign id.
        this.#root = document.createElement(rootElement);
        if (rootId) {
            if (typeof rootId !== "string" || rootId.trim() === "")
                throw new TypeError("Element type must be non-empty string");
            this.#root.id = rootId;
        }
    }

    get element() {
        // Expose root element.
        return this.#root;
    }

    makeElement(el) {
        // Validate input is object.
        if (!el || typeof el !== "object")
            throw new TypeError("Argument must be object");

        // Validate type is a string.
        if (typeof el.type !== "string" || el.type.trim() === "")
            throw new TypeError("Element type must be non-empty string");

        // Create and element.
        const element = document.createElement(el.type.toLowerCase());

        // If id, validate and add to element.
        if (el.id !== undefined) {
            if (typeof el.id !== "string")
                throw new TypeError("ID must be a string");
            element.id = el.id;
        }

        // If text, validate and add to element.
        if (el.text !== undefined) {
            if (typeof el.text !== "string")
                throw new TypeError("Text must be a string");
            element.textContent = el.text;
        }

        // If classList, validate and add to element.
        if (el.classList !== undefined) {
            if (typeof el.classList === "string")
                element.classList.add(
                    ...el.classList.split(" ").filter(Boolean),
                );
            else if (Array.isArray(el.classList)) {
                for (const cls of el.classList)
                    if (typeof cls !== "string")
                        throw new TypeError("Classes must be strings");
                element.classList.add(...el.classList);
            } else throw new TypeError("ClassList must be string or array");
        }

        return element;
    }

    addClass(className) {
        // Add css class to root element.
        this.#root.classList.add(className);
        return this;
    }

    append(child) {
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

        // Append node.
        this.#root.appendChild(node);

        return this;
    }

    appendAll(...children) {
        // Append multiple children in order.
        children.forEach((child) => this.append(child));

        return this;
    }

    mount(target) {
        // Attach component to a target in the DOM.
        // Accepts ViewComponenet, HTMLElement, or selector string.

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

        // Append componenet to parent.
        parent.appendChild(this.#root);

        return this;
    }

    remove() {
        // Remove this component's root element from DOM.
        this.#root.remove();

        return this;
    }
}
