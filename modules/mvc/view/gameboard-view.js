import { EL } from "../../constants.js";

class GameboardView {
    #id;
    #boardsize;

    constructor(boardsize, player) {
        this.#id = player.toLowerCase() + "_board";
        this.addGameboard(boardsize, player);
    }

    addGameboard(boardsize, player) {
        const totalCells = boardsize ** 2;

        //Set boardsize.
        document.documentElement.style.setProperty("--board-size", boardsize);

        // Board container.
        const board = document.createElement(EL.SECTION);
        board.id = this.#id;
        board.classList.add("gameboard");

        // Board caption.
        const label = document.createElement(EL.H3);
        label.textContent = player;

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

        for (let row = 1; row <= boardsize; row++) {
            const cell = document.createElement(EL.SPAN);
            cell.textContent = String.fromCharCode(64 + row);
            rowLabels.append(cell);
        }

        // Board Grid
        const boardGrid = document.createElement(EL.DIV);
        boardGrid.classList.add("board-grid");

        for (let cellNum = 1; cellNum <= totalCells; cellNum++) {
            const cell = document.createElement(EL.DIV);

            cell.textContent = this.#getCellName(cellNum, boardsize);

            cell.dataset.cell = cellNum;
            cell.dataset.player = player;
            cell.dataset.state = "empty";

            boardGrid.append(cell);
        }

        board.append(label, corner, colLabels, rowLabels, boardGrid);

        document.getElementById("game-area").append(board);

        return this;
    }

    #getCellName(cell, boardsize) {
        const A_CHAR = 65;
        const row = Math.floor(cell / boardsize);
        const col = cell % boardsize ? cell % boardsize : boardsize;
        return String.fromCharCode(A_CHAR + row) + col;
    }

    delete() {
        document.getElementById(this.#id).remove();
    }
}

export default GameboardView;
