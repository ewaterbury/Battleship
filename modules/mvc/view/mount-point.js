// Core Components
import Component from "./view-component.js";

// Element Library
import { EL } from "../../constants.js";

export default class MountPoint extends Component {
    constructor(id) {
        // Initialize mount point (section) and assign ID using super constructor.
        super(EL.SECTION, id);
    }

    mount(target, method = "appendChild") {
        // Attach component to a target in the DOM.
        // Accepts Component, HTMLElement, or selector string.

        // Get target as DOM element.
        const parent =
            target instanceof Component
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

        // Mount component using requested DOM insertion method.
        parent[method](this.element);

        return this;
    }
}
