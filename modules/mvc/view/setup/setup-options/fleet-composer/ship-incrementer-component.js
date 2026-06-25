// Core Components
import Component from "../../../view-component.js";

// Elements Library, Events Library
import { EL, EVENT } from "../../../../../constants.js";

// View Utitilities Library
import ViewUtilities from "../../../view-utilities.js";

export default class ShipIncrementer extends Component {
    #controller;
    #input;

    constructor(controller, ship) {
        // Initialize root element (li) and assign ID using super constructor.
        super(EL.LI);

        // Store a reference to the controller for fleet updates.
        this.#controller = controller;

        // |----- UI Construction -----|
        const inputName = `${ship.type}-counter`;

        const label = new Component(
            EL.LABEL,
            "", // Empty string to bypass ID.

            // Whitelisted attributes (for setAtrr/readAttr):
            "for",
        )
            .setText(`${ViewUtilities.capitalize(ship.type)}:`)
            .setAttr("for", inputName);

        this.#input = new Component(
            EL.INPUT,
            inputName, // Blank string to bypass id.

            // Whitelisted attributes (for setAtrr/readAttr):
            "type",
            "min",
            "value",
            "dataset",
        )
            .setAttr("type", "number")
            .setAttr("min", 0) // Minimum input value.
            .setAttr("value", ship.count)
            .addDataset("shipType", ship.type) // Add custom data-attribute to track ship type.
            .addDataset("shipSize", ship.size); // Add custom data-attribute to track ship size.

        [label, this.#input].forEach((component) => this.append(component));

        // |----- Behavior -----|
        // Add event to update board size on input.
        this.#input.on(EVENT.INPUT, (e) => {
            // Get custom data attributes from input element.
            const data = this.#input.readProp("dataset");

            // Build template update object (sent to controller -> model).
            const templateUpdate = {
                count: Number(e.data),
                size: Number(data.shipSize),
                type: data.shipType,
            };

            // Send fleet template update to controller.
            const result = this.#controller.updateFleetTemplate(templateUpdate);
        });
    }
}
