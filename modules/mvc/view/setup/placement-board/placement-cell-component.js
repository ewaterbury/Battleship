// Core Components
import ViewComponent from "../../view-component.js";

// Elements Library
import { EL } from "../../../../constants.js";

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

        // Validate controller
        // if (
        //     !controller ||
        //     typeof controller.sendAttack !== "function" ||
        //     typeof controller.boardsize !== "number" ||
        //     typeof controller.activePlayer !== "string"
        // ) {
        //     throw new TypeError("Invalid controller interface");
        // }

        super(EL.DIV, `placement-${cellNumber}`, "dataset");

        // Save reference to controller.
        this.#controller = controller;

        // Attach data to cell, set cell text, add callback.
        this.addDataset("cell", cellNumber)
            .addDataset("state", "empty")
            .setText(
                ViewUtilities.getCellName(
                    cellNumber,
                    this.#controller.boardSize.current,
                ),
            )
            .on("click", this.#placeShip);
    }

    #placeShip = () => {};
}
