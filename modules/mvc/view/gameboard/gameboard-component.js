import { EL, PLAYERS } from "../../../constants.js";
import Utils from "../view-utilities.js";
import ValUtils from "../../../validation-utilities.js";
import ViewComponent from "../view-component.js";
import Cell from "./cell-component.js";
import ThemeSetting from "../sidebar/settings/theme/theme-setting.js";

export default class Gameboard extends ViewComponent {
    #controller;
    #grid;

    constructor(player, controller) {
        // |----- Validation -----|
        // Vaildate player input.
        if (!ValUtils.isString(player))
            throw new TypeError("player must be non-empty string");

        // Validate board size input.
        if (!ValUtils.isPositiveInt(controller.boardSize))
            throw new TypeError("boardSize must be a positive integer");

        // Initialize root (section) and assign id using super constructor.
        super(
            EL.SECTION,
            `${player.toLowerCase()}_board`,

            // Whitelisted properties (for setProp/readProp):
            "dataset",
        );

        this.#controller = controller;

        this.addClass("board");
        this.addDataset("owner", player);

        // If first to attack, add attacker class.
        if (this.#isAttacker()) this.addClass(PLAYERS.ATTACKER);

        this.#grid = this.#buildBoardGrid(player);

        // |------ Construct UI -----|
        [
            new ViewComponent(EL.H3).setText(Utils.capitalize(player)), // Build label.
            new ViewComponent(EL.DIV).addClass("corner"), // Build layout spacer (Formatting only).
            this.#buildColLabels(), // Build column Labels (Top row of board).
            this.#buildRowLabels(), // Build row labels (Left column of board).
            this.#grid, // Build board grid.
        ].forEach((component) => this.append(component));
    }

    update() {
        const toggleAttackerStatus = () => {
            if (this.#isAttacker()) {
                this.addClass(PLAYERS.ATTACKER);
            } else {
                this.removeClass(PLAYERS.ATTACKER);
            }
        };

        const refreshGrid = () => {
            this.#grid.remove();

            this.#grid = this.#buildBoardGrid(
                this.#controller.boardSize,
                this.readProp("dataset").owner,
            );

            this.append(this.#grid);
        };

        toggleAttackerStatus();

        // Refresh grid if player defended last turn.
        if (this.#isAttacker()) refreshGrid();
    }

    #buildColLabels() {
        const colLabels = new ViewComponent(EL.DIV).addClass("col-labels");

        for (let col = 1; col <= this.#controller.boardSize; col++)
            // Build cells for colLabels.
            colLabels.append(new ViewComponent(EL.SPAN).setText(col));

        return colLabels;
    }

    #buildRowLabels() {
        // Build row labels (Left column of board).
        const rowLabels = new ViewComponent(EL.DIV).addClass("row-labels");

        for (let row = 0; row < this.#controller.boardSize; row++) {
            const A_CHAR = 65;
            rowLabels.append(
                new ViewComponent(EL.SPAN).setText(
                    String.fromCharCode(A_CHAR + row),
                ),
            );
        }

        return rowLabels;
    }

    #buildBoardGrid() {
        const player = this.readProp("dataset").owner;
        const totalCells = this.#controller.boardSize ** 2;
        const boardData =
            player === PLAYERS.PLAYER
                ? this.#controller.playerBoard
                : this.#controller.compBoard;

        const grid = new ViewComponent(EL.DIV).addClass("board-grid");

        // Fill grid with cell components.
        for (let cellNum = 0; cellNum < totalCells; cellNum++) {
            const cell = new Cell(
                this.#controller,
                cellNum,
                player,
                boardData[cellNum],
            );

            grid.append(cell);
        }

        return grid;
    }

    #isAttacker() {
        return (
            this.#controller.gameState.attacker ===
            this.readProp("dataset").owner
        );
    }
}
