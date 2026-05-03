import { EL } from "../../constants.js";
import Utils from "./view-utilities.js";
import ViewComponent from "./view-component.js";

export default class GameboardView extends ViewComponent {
    constructor(boardsize, player) {
        // Initialize 'root' using super constructor.
        super(EL.SECTION, `${player.toLowerCase()}_board`);

        // Build gameboard.
        this.#buildBoard(boardsize, player);
    }

    #buildBoard(boardsize, player, parentSelector) {
        const totalCells = boardsize ** 2;

        // Set boardsize on stylesheet.
        document.documentElement.style.setProperty("--board-size", boardsize);

        // Build board container (Cached for repeat access).
        this.addClass("gameboard");

        // Build board caption.
        const label = document.createElement(EL.H3);
        label.textContent = Utils.capitalize(player);

        // Build layout spacer (Formatting only).
        const corner = document.createElement(EL.DIV);
        corner.classList.add("corner");

        // Build column Labels (Top row of board).
        const colLabels = document.createElement(EL.DIV);
        colLabels.classList.add("col-labels");

        for (let col = 1; col <= boardsize; col++) {
            const cell = document.createElement(EL.SPAN);
            cell.textContent = col;
            colLabels.append(cell);
        }

        // Build row labels (Left column of board).
        const rowLabels = document.createElement(EL.DIV);
        rowLabels.classList.add("row-labels");

        for (let row = 0; row < boardsize; row++) {
            const cell = document.createElement(EL.SPAN);
            const A_CHAR = 65;
            cell.textContent = String.fromCharCode(A_CHAR + row);
            rowLabels.append(cell);
        }

        // Build board grid.
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

        // Append components in order.
        this.appendAll(label, corner, colLabels, rowLabels, boardGrid);
    }
}
