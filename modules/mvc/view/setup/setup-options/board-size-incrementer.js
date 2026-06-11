// Core Components
import Component from "../../view-component.js";

// Elements Library
import { EL } from "../../../../constants.js";

export default class BoardSizeIncrementer extends Component {
    #controller;

    constructor(controller) {
        // Initialize root element (li) using super constructor.
        super(EL.LI);

        // Store a reference to the controller for board size updates.
        this.#controller = controller;

        // |----- UI Construction -----|
        const form = new Component(EL.FORM);

        const label = new Component(
            EL.LABEL,
            "", // Blank string to bypass ID.

            // Whitelisted attributes (for setAtrr/readAttr):
            "for",
        )
            .setText("Board Size:")
            .setAttr("for", "board-size-count");

        const shipCount = new Component(
            EL.INPUT,
            "board-size-count", // ship count ID.

            // Whitelisted attributes (for setAtrr/readAttr):
            "name",
            "type",
            "min",
            "max",
            "value",
        )
            .setText(10)
            .setAttr("name", "board-size-count")
            .setAttr("type", "number")

            .setAttr("min", controller.boardSize.min) // Minimum board size.
            .setAttr("max", controller.boardSize.max) // Minimum board size.
            .setAttr("value", controller.boardSize.current); // Starting board size.

        [label, shipCount].forEach((component) => form.append(component));

        this.append(form);

        // |----- Behavior -----|
        // Add event to update board size on input.
        shipCount.on("input", (e) => {
            // Update board size on controller.
            controller.boardSize.current = e.target.value;

            // Render new ship placement board.
        });
    }
}
