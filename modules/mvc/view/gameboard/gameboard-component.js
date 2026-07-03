import { EL } from "../../../constants.js";
import Utils from "../view-utilities.js";
import ValUtils from "../../../validation-utilities.js";
import ViewComponent from "../view-component.js";
import Cell from "./cell-component.js";

export default class Gameboard extends ViewComponent {
    constructor(player, controller) {
        // |----- Validation -----|
        // Vaildate player input.
        if (!ValUtils.isString(player))
            throw new TypeError("player must be non-empty string");

        // Validate board size input.
        if (!ValUtils.isPositiveInt(controller.boardSize))
            throw new TypeError("boardzise must be a positive integer");

        // |----- Build Board Container-----|
        // Initialize 'root' using super constructor.
        super(EL.SECTION, `${player.toLowerCase()}_board`);

        // Add gameboard class.
        this.addClass("board");

        // |----- Stylesheet -----|
        // Set board size on stylesheet (Needed for grid display).
        document.documentElement.style.setProperty(
            "--board-size",
            controller.boardSize,
        );

        // |------ Build Board Components -----|
        const label = new ViewComponent(EL.H3).setText(
            Utils.capitalize(player),
        ); // Build board caption.
        const corner = new ViewComponent(EL.DIV).addClass("corner"); // Build layout spacer (Formatting only).
        const colLabels = this.#buildColLabels(controller.boardSize); // Build column Labels (Top row of board).
        const rowLabels = this.#buildRowLabels(controller.boardSize); // Build row labels (Left column of board).
        const boardGrid = this.#buildBoardGrid(
            controller.boardSize,
            player,
            controller,
        ); // Build board grid.

        // Append components.
        [label, corner, colLabels, rowLabels, boardGrid].forEach((component) =>
            this.append(component),
        );
    }

    #buildColLabels(boardSize) {
        const colLabels = new ViewComponent(EL.DIV).addClass("col-labels");

        for (let col = 1; col <= boardSize; col++)
            // Build cells for colLabels.
            colLabels.append(new ViewComponent(EL.SPAN).setText(col));

        return colLabels;
    }

    #buildRowLabels(boardSize) {
        // Build row labels (Left column of board).
        const rowLabels = new ViewComponent(EL.DIV).addClass("row-labels");

        for (let row = 0; row < boardSize; row++) {
            const A_CHAR = 65;
            rowLabels.append(
                new ViewComponent(EL.SPAN).setText(
                    String.fromCharCode(A_CHAR + row),
                ),
            );
        }

        return rowLabels;
    }

    #buildBoardGrid(boardSize, player, controller) {
        // Build board grid.
        const grid = new ViewComponent(EL.DIV).addClass("board-grid");

        // Fill board grid with cell components.
        const totalCells = boardSize ** 2;
        for (let cellNum = 0; cellNum < totalCells; cellNum++) {
            const cell = new Cell(cellNum, player, controller);
            grid.append(cell);
        }

        return grid;
    }
}
