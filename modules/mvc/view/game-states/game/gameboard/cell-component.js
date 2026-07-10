// Core Components
import ViewComponent from "../../../view-component.js";

// Cell Library, Elements Library, Events Library
import { CELL, EL, EVENT, PLAYERS } from "../../../../../constants.js";

// Utility Libraries
import ViewUtils from "../../../view-utilities.js";
import ValidationUtilities from "../../../../../validation-utilities.js";

export default class CellComponent extends ViewComponent {
    #controller;

    constructor(controller, cellNumber, player, state) {
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

        this.#controller = controller;

        // |----- UI Construction -----|
        this.addClass("board-cell");

        // Attach data to cell and set cell text.
        this.addDataset("cell", cellNumber)
            .addDataset("player", player)
            .addDataset("state", state)
            .setText(
                ViewUtils.getCellName(cellNumber, this.#controller.boardSize),
            );

        // Attach sendAttack callback to compouter board.
        if (player === PLAYERS.COMPUTER) this.on(EVENT.CLICK, this.#sendAttack);
    }

    #sendAttack = () => {
        const cellData = this.readProp("dataset");
        if (cellData.state !== CELL.EMPTY || this.#controller.boardLocked)
            return;
        this.#controller.boardLocked = true;
        this.#controller.runTurnCycle(Number(cellData.cell));
    };
}
