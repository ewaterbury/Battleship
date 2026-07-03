// Core Components
import Component from "../view-component.js";

// Cell Library, Elements Library, Events Library
import { CELL, EL, EVENT } from "../../../constants.js";

// Utility Libraries
import ViewUtils from "../view-utilities.js";
import ValidationUtilities from "../../../validation-utilities.js";

export default class CellComponent extends Component {
    #controller;

    constructor(cellNumber, player, controller) {
        // |----- Input Validation -----|
        // Validate cellNumber
        if (!ValidationUtilities.isPositiveInt(cellNumber) && cellNumber !== 0)
            throw new TypeError(
                "cell number must be a integer greater than or equal to zero",
            );

        // Validate player
        if (!ValidationUtilities.isString(player))
            throw new TypeError("player must be a string");

        // Initialize cell and assign ID using super constructor.
        super(
            EL.DIV,
            `${player}-${cellNumber}`,

            // Whitelisted properties (for setProp/readProp):
            "dataset",
        );

        // Save reference to controller.
        this.#controller = controller;

        // |----- UI Construction -----|
        this.addClass("board-cell");

        // Attach data to cell, set cell text, add callback.
        this.addDataset("cell", cellNumber)
            .addDataset("player", player)
            .addDataset("state", CELL.EMPTY)
            .setText(
                ViewUtils.getCellName(cellNumber, this.#controller.boardSize),
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
