// Core Components
import ViewComponent from "../../view-component.js";

// Elements Library, Events Library
import { EL, EVENT, DEFAULT_VALUES } from "../../../../constants.js";

// Utility Libraries
import ViewUtilities from "../../view-utilities.js";
import ValidationUtilities from "../../../../validation-utilities.js";

export default class PlacementCell extends ViewComponent {
    #controller;

    constructor(cellNumber, controller) {
        // |----- Input Validation -----|
        // Validate cellNumber
        if (!ValidationUtilities.isPositiveInt(cellNumber))
            throw new TypeError("cell number must be a positive integer");

        super(EL.DIV, `placement-${cellNumber}`, "dataset");

        // Save reference to controller.
        this.#controller = controller;

        // |----- UI Construction -----|
        this.addClass("board-cell");

        // Attach data to cell, set cell text, add callback.
        this.addDataset("num", cellNumber)
            .addDataset("state", "empty")
            .setText(
                ViewUtilities.getCellName(
                    cellNumber,
                    this.#controller.boardSize.current,
                ),
            );

        // |----- Behavior -----|
        this.on(EVENT.MOUSE_ENTER, this.#displayShip);

        this.on(EVENT.CLICK, this.#placeShip);
    }

    #displayShip = () => {
        const selectedShip = this.#controller.selectedShip;
        const cell = this.readProp("dataset");

        // Clear highlighted cells.
        document
            .querySelectorAll(".highlight")
            .forEach((el) => el.classList.remove("highlight"));

        // Terminate on invalid cell.
        if (!selectedShip) return;
        if (cell.state !== "empty") return;

        this.#controller.getShipFromCell(cell).forEach((cell) => {
            const el = document.getElementById(`placement-${cell}`);
            el.classList.add("highlight");
        });
    };

    #placeShip = () => {
        const selectedShip = this.#controller.selectedShip;
        const cell = this.readProp("dataset");

        if (selectedShip) {
        }
    };
}
