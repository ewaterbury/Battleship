// Core Components
import Component from "../../view-component.js";

// Elements Library, Events Library
import { EL, EVENT } from "../../../../constants.js";

export default class BoardSizeIncrementer extends Component {
    #controller;
    #input;

    constructor(controller) {
        const boardSize = controller.boardSize;

        // Initialize root element (li) using super constructor.
        super(EL.LI);

        // Store a reference to the controller for board size updates.
        this.#controller = controller;

        // |----- UI Construction -----|

        const form = new Component(EL.FORM, "board-size-incrementer");

        const label = new Component(
            EL.LABEL,
            "", // Blank string to bypass ID.

            // Whitelisted attributes (for setAtrr/readAttr):
            "for",
        )
            .setText("Board Size:")
            .setAttr("for", "board-size-count");

        this.#input = new Component(
            EL.INPUT,
            "board-size-count", // ship count ID.

            // Whitelisted attributes (for setAtrr/readAttr):
            "type",
            "min",
            "max",
            "value",
        )
            .setAttr("type", "number")
            .setAttr("min", boardSize.min) // Minimum board size.
            .setAttr("max", boardSize.max) // Minimum board size.
            .setAttr("value", boardSize.current); // Current board size.

        [label, this.#input].forEach((component) => form.append(component));

        this.append(form);

        // |----- Behavior -----|
        this.#input.on(EVENT.INPUT, this.#updateBoardSize);
    }

    #updateBoardSize = (e) => {
        const input = Number(e.target.value);

        // Get board size from input.
        // Defaults to current boardsize on invalid input.
        const boardSize =
            input >= 7 && input <= 12
                ? input
                : this.#controller.boardSize.current;

        // Reset input field on invalid input.
        if (!(input >= 7 && input <= 12))
            this.#input.setAttr("value", boardSize);

        // Direct controller to update board size.
        this.#controller.updateBoardSize(boardSize);
    };
}
