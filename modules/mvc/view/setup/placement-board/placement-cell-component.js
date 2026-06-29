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

        this.#buildShip(cell, selectedShip).forEach((cell) => {
            const el = document.getElementById(`placement-${cell}`);
            el.classList.add("highlight");
        });
    };

    #placeShip = () => {
        if (this.#controller.selectedShip) {
        }
    };

    // |----- Helpers -----|
    #buildShip(cell, selectedShip) {
        const boardSize = this.#controller.boardSize.current;
        const orientation = this.#controller.orientation;

        const ship = [];

        // Callbacks determined by orientation.
        let buildShip;
        let fitShip;

        // Set callbacks (vertical).
        if (orientation === DEFAULT_VALUES.ORIENTATION.VERTICAL) {
            buildShip = (cell, count) => Number(cell) + boardSize * count;

            // Fit ship to board (shift upwards).
            fitShip = (ship) => {
                while (ship[ship.length - 1] > boardSize ** 2)
                    for (let i = 0; i < ship.length; i++) ship[i] -= boardSize;

                return ship;
            };
        }

        // Set callbacks (horizontal).
        else if (orientation === DEFAULT_VALUES.ORIENTATION.HORIZONTAL) {
            buildShip = (cell, count) => Number(cell) + count;

            // Fit ship to board (shift left).
            fitShip = (ship) => {
                const staysInRow = (ship) => {
                    const startRow = Math.floor((ship[0] - 1) / boardSize);

                    return ship.every(
                        (cell) =>
                            Math.floor((cell - 1) / boardSize) === startRow,
                    );
                };

                while (!staysInRow(ship))
                    for (let i = 0; i < ship.length; i++) ship[i] -= 1;

                return ship;
            };
        }

        // Throw error on invaild ship orientation.
        else throw new TypeError("Invalid ship orientation");

        for (let i = 0; i < selectedShip.size; i++)
            ship.push(buildShip(cell.num, i));

        return fitShip(ship);
    }
}
