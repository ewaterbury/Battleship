// Core Components
import Component from "../view-component.js";

// Cell Library, Elements Library, Events Library
import { CELL, EL, EVENT } from "../../../constants.js";

// Utility Libraries
import ViewUtils from "../view-utilities.js";
import ValUtils from "../../../validation-utilities.js";

export default class CellComponent extends Component {
    #controller;

    constructor(cellNumber, player, controller) {
        // |----- Input Validation -----|
        // Validate cellNumber
        if (!ValUtils.isPositiveInt(cellNumber))
            throw new TypeError("cell number must be a positive integer");

        // Validate player
        if (!ValUtils.isString(player))
            throw new TypeError("player must be a string");

        // Validate controller
        if (
            !controller ||
            typeof controller.sendAttack !== "function" ||
            typeof controller.boardsize !== "number" ||
            typeof controller.activePlayer !== "string"
        ) {
            throw new TypeError("Invalid controller interface");
        }

        // Initialize cell and assign ID using super constructor.
        super(
            EL.DIV,
            `${player}-${cellNumber}`,

            // Whitelisted properties (for setProp/readProp):
            "dataset",
        );

        // Save reference to controller.
        this.#controller = controller;

        // Attach data to cell, set cell text, add callback.
        this.addDataset("cell", cellNumber)
            .addDataset("player", player)
            .addDataset("state", CELL.EMPTY)
            .setText(
                ViewUtils.getCellName(cellNumber, this.#controller.boardsize),
            )
            .on(EVENT.CLICK, this.#sendAttack);
    }

    #isValidCell() {
        // Get cell data.
        const cellData = this.readProp("dataset");

        // Return if cell belongs to active player and empty.
        return (
            cellData["player"] === this.#controller.activePlayer &&
            cellData["state"] === CELL.EMPTY
        );
    }

    #sendAttack = () => {
        // Get cell data.
        const cellData = this.readProp("dataset");

        // Check if this cell belongs to active player.
        if (this.#isValidCell()) this.#controller.sendAttack(cellData["cell"]);
    };
}
