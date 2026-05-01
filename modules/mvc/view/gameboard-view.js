import { EL } from "../../constants.js";
import Utils from "./view-utilities.js";

export default class GameboardView {
    #root;

    constructor(boardsize, player, parentSelector) {
        this.#addGameboard(boardsize, player, parentSelector);
    }

    #addGameboard(boardsize, player, parentSelector) {
        const totalCells = boardsize ** 2;

        //Set boardsize.
        document.documentElement.style.setProperty("--board-size", boardsize);

        // Board container (Cached for repeat access).
        this.#root = document.createElement(EL.SECTION);
        this.#root.id = player.toLowerCase() + "_board";
        this.#root.classList.add("gameboard");

        // Board caption.
        const label = document.createElement(EL.H3);
        label.textContent = Utils.capitalize(player);

        // Layout spacer (Formatting only).
        const corner = document.createElement(EL.DIV);
        corner.classList.add("corner");

        // Column Labels (Top Row).
        const colLabels = document.createElement(EL.DIV);
        colLabels.classList.add("col-labels");

        for (let col = 1; col <= boardsize; col++) {
            const cell = document.createElement(EL.SPAN);
            cell.textContent = col;
            colLabels.append(cell);
        }

        // Row Labels (Left Column)
        const rowLabels = document.createElement(EL.DIV);
        rowLabels.classList.add("row-labels");

        for (let row = 0; row < boardsize; row++) {
            const cell = document.createElement(EL.SPAN);
            const A_CHAR = 65;
            cell.textContent = String.fromCharCode(A_CHAR + row);
            rowLabels.append(cell);
        }

        // Board Grid
        const boardGrid = document.createElement(EL.DIV);
        boardGrid.classList.add("board-grid");

        for (let cellNum = 1; cellNum <= totalCells; cellNum++) {
            const cell = document.createElement(EL.DIV);

            cell.textContent = Utils.getCellName(cellNum, boardsize);

            cell.dataset.cell = cellNum;
            cell.dataset.player = player;
            cell.dataset.state = "empty";

            boardGrid.append(cell);
        }

        this.#root.append(label, corner, colLabels, rowLabels, boardGrid);

        const parent = document.querySelector(parentSelector);

        if (!parent) {
            throw new Error(`Parent selector "${parentSelector}" not found`);
        }

        parent.append(this.#root);
    }

    remove() {
        this.#root.remove();
    }
}
