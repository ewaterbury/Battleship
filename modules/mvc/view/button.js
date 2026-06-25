// Core Components
import Component from "./view-component.js";

// Element Library, Events Library
import { EL, EVENT } from "./../../constants.js";

export default class Button extends Component {
    constructor(id, onClick) {
        // Initialize container (button) using super constructor.
        super(EL.BUTTON, id);

        // |----- Behavior -----|
        // Attach click handler to button.
        this.element.addEventListener(EVENT.INPUT, (e) => {
            onClick(e);
        });
    }
}
