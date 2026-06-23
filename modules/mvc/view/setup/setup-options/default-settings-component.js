// Core Components
import ViewComponent from "../../view-component.js";

// Elements Library
import { EL } from "../../../../constants.js";

// Imported Componenets
import Button from "../../button.js";

export default class DefaultSettings extends ViewComponent {
    #controller;

    constructor(controller) {
        // Initialize root element (li) using super constructor.
        super(EL.LI, "reset-setup-option");

        this.#controller = controller;

        // |----- UI Construction -----|
        this.append(
            new Button("reset-setup", this.#resetToDefaults).setText(
                "Reset to defaults",
            ),
        );
    }

    // Callback to reset game settings.
    #resetToDefaults = () => {
        this.#controller.resetToDefaults();
    };
}
