import { EL } from "../../../constants.js";
import Utils from "../view-utilities.js";
import ValUtils from "../../../validation-utilities.js";
import Component from "../view-component.js";
import Cell from "./cell-component.js";

export default class Gameboard extends Component {
    constructor(player, boardsize, controller) {
        // |----- Validation -----|
        // Vaildate player input.
        if (!ValUtils.isString(player))
            throw new TypeError("player must be non-empty string");

        // Validate boardsize input.
        if (!ValUtils.isPositiveInt(boardsize))
            throw new TypeError("boardzise must be a positive integer");

        // |----- Build Board Container-----|
        // Initialize 'root' using super constructor.
        super(EL.SECTION, `${player.toLowerCase()}_board`);

        // Add gameboard class.
        this.addClass("gameboard");

        // |----- Stylesheet -----|
        // Set boardsize on stylesheet (Needed for grid display).
        document.documentElement.style.setProperty("--board-size", boardsize);

        // |------ Build Board Components -----|
        const label = new Component(EL.H3).setText(Utils.capitalize(player)); // Build board caption.
        const corner = new Component(EL.DIV).addClass("corner"); // Build layout spacer (Formatting only).
        const colLabels = this.#buildColLabels(boardsize); // Build column Labels (Top row of board).
        const rowLabels = this.#buildRowLabels(boardsize); // Build row labels (Left column of board).
        const boardGrid = this.#buildBoardGrid(boardsize, player, controller); // Build board grid.

        // Append components.
        [label, corner, colLabels, rowLabels, boardGrid].forEach((component) =>
            this.append(component),
        );
    }

    #buildColLabels(boardsize) {
        const colLabels = new Component(EL.DIV).addClass("col-labels");

        for (let col = 1; col <= boardsize; col++)
            // Build cells for colLabels.
            colLabels.append(new Component(EL.SPAN).setText(col));

        return colLabels;
    }

    #buildRowLabels(boardsize) {
        // Build row labels (Left column of board).
        const rowLabels = new Component(EL.DIV).addClass("row-labels");

        for (let row = 0; row < boardsize; row++) {
            const A_CHAR = 65;
            rowLabels.append(
                new Component(EL.SPAN).setText(
                    String.fromCharCode(A_CHAR + row),
                ),
            );
        }

        return rowLabels;
    }

    #buildBoardGrid(boardsize, player, controller) {
        // Build board grid.
        const grid = new Component(EL.DIV).addClass("board-grid");

        // Fill board grid with cell components.
        const totalCells = boardsize ** 2;
        for (let cellNum = 1; cellNum <= totalCells; cellNum++) {
            const cell = new Cell(cellNum, player, controller);
            grid.append(cell);
        }

        return grid;
    }
}
