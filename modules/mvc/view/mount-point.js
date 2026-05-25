import Component from "./view-component.js";
import { EL } from "../../constants.js";

export default class MountPoint extends Component {
    constructor(id) {
        super(EL.SECTION, id);
    }

    mount(target, mountType = "appendChild") {
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

        // Append component to parent.
        parent[mountType](this.element);

        return this;
    }
}
