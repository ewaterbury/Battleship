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
        const label = Utils.makeElement({
            type: EL.H3,
            text: Utils.capitalize(player),
        });

        // Build layout spacer (Formatting only).
        const corner = Utils.makeElement({
            type: EL.DIV,
            classList: "corner",
        });

        // Build column Labels (Top row of board).
        const colLabels = Utils.makeElement({
            type: EL.DIV,
            classList: "col-labels",
        });

        for (let col = 1; col <= boardsize; col++) {
            // Build cells for colLabels.
            colLabels.append(
                Utils.makeElement({
                    type: EL.SPAN,
                    text: col,
                }),
            );
        }

        // Build row labels (Left column of board).
        const rowLabels = Utils.makeElement({
            type: EL.DIV,
            classList: "row-labels",
        });

        for (let row = 0; row < boardsize; row++) {
            const A_CHAR = 65;
            rowLabels.append(
                Utils.makeElement({
                    type: EL.SPAN,
                    text: String.fromCharCode(A_CHAR + row),
                }),
            );
        }

        // Build board grid.
        const boardGrid = Utils.makeElement({
            type: EL.DIV,
            classList: "board-grid",
        });

        for (let cellNum = 1; cellNum <= totalCells; cellNum++) {
            const cell = Utils.makeElement({
                type: EL.DIV,
                text: Utils.getCellName(cellNum, boardsize),
            });

            cell.dataset.cell = cellNum;
            cell.dataset.player = player;
            cell.dataset.state = "empty";

            boardGrid.append(cell);
        }

        // Append components in order.
        this.appendAll(label, corner, colLabels, rowLabels, boardGrid);
    }
}
