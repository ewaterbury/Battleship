// Core Components
import Component from "./view-component.js";

// Element Library
import { EL } from "./../../constants.js";

export default class Button extends Component {
    constructor(id, onClick) {
        // Initialize container (button) using super constructor.
        super(EL.BUTTON, id);

        // |----- Behavior -----|
        // Attach click handler to button.
        this.element.addEventListener("click", (e) => {
            onClick(e);
        });
    }
}
