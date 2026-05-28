import { EL } from "../../../constants.js";
import Utils from "../view-utilities.js";
import Component from "../view-component.js";

export default class GameboardView extends Component {
    constructor(player, boardsize) {
        // Vaildate player input.
        if (typeof player !== "string" || player.trim() === "")
            throw new TypeError("player must be non-empty string");

        // Validate boardsize input.
        if (typeof boardsize !== "number")
            throw new TypeError("boardzise must be number");

        // Initialize 'root' using super constructor.
        super(EL.SECTION, `${player.toLowerCase()}_board`);

        // Build gameboard.
        this.#buildBoard(boardsize, player);
    }

    #buildBoard(boardsize, player) {
        const totalCells = boardsize ** 2;

        // Set boardsize on stylesheet.
        document.documentElement.style.setProperty("--board-size", boardsize);

        // Build board container (Cached for repeat access).
        this.addClass("gameboard");

        // Build board caption.
        const label = new Component(EL.H3).setText(Utils.capitalize(player));

        // Build layout spacer (Formatting only).
        const corner = new Component(EL.DIV).addClass("corner");

        // Build column Labels (Top row of board).
        const colLabels = new Component(EL.DIV).addClass("col-labels");

        for (let col = 1; col <= boardsize; col++)
            // Build cells for colLabels.
            colLabels.append(new Component(EL.SPAN).setText(col));

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

        // Build board grid.
        const boardGrid = new Component(EL.DIV).addClass("board-grid");

        for (let cellNum = 1; cellNum <= totalCells; cellNum++) {
            const cell = new Component(EL.DIV)
                .setText(Utils.getCellName(cellNum, boardsize))
                .addDataset("cell", cellNum)
                .addDataset("player", player)
                .addDataset("state", "empty");

            boardGrid.append(cell);
        }

        // Append components in order.
        [label, corner, colLabels, rowLabels, boardGrid].forEach((component) =>
            this.append(component),
        );
    }
}
