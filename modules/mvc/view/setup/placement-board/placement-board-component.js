// Core Components
import ViewComponent from "../../view-component.js";

// Elements Library
import { EL } from "../../../../constants.js";

// VAlidation Library
import ValidationUtilities from "../../../../validation-utilities.js";

// Imported Components
import PlacementCell from "./placement-cell-component.js"; // Used to build board grid.

export default class PlacementBoard extends ViewComponent {
    constructor(controller) {
        const boardSize = controller.boardSize.current; // Save for repeated use.

        // |----- Validation -----|

        // Validate boardsize input.
        if (!ValidationUtilities.isPositiveInt(boardSize))
            throw new TypeError("BoardSize must be a positive integer");
        if (boardSize < 5 || boardSize > 12)
            throw new TypeError("BoardSize must be between 5 and 12");

        // |----- Build Board Container-----|

        // Initialize root element (section) and assign ID using super constructor.
        super(EL.SECTION, "ship-placement-board");

        // |----- Stylesheet -----|

        // Set boardsize on stylesheet (Needed for grid display).
        document.documentElement.style.setProperty("--board-size", boardSize);

        // |----- UI Construction -----|

        const label = new ViewComponent(EL.H3).setText("Place your ships."); // Build board caption.
        const corner = new ViewComponent(EL.DIV).addClass("corner"); // Build layout spacer (Formatting only).
        const colLabels = this.#buildColLabels(boardSize); // Build column Labels (Top row of board).
        const rowLabels = this.#buildRowLabels(boardSize); // Build row labels (Left column of board).
        const boardGrid = this.#buildBoardGrid(controller, boardSize); // Build board grid.

        [label, corner, colLabels, rowLabels, boardGrid].forEach((component) =>
            this.append(component),
        );
    }

    // |----- UI Construction Helpers -----|

    #buildColLabels(boardSize) {
        // Build col labels (Top row of board).
        const colLabels = new ViewComponent(EL.DIV).addClass("col-labels");

        for (let col = 1; col <= boardSize; col++)
            // Build cells for colLabels.
            colLabels.append(new ViewComponent(EL.SPAN).setText(col));

        return colLabels;
    }

    #buildRowLabels(boardsize) {
        // Build row labels (Left column of board).
        const rowLabels = new ViewComponent(EL.DIV).addClass("row-labels");

        for (let row = 0; row < boardsize; row++) {
            const A_CHAR = 65; // ASCII index for 'A'.

            rowLabels.append(
                new ViewComponent(EL.SPAN).setText(
                    String.fromCharCode(A_CHAR + row),
                ),
            );
        }

        return rowLabels;
    }

    #buildBoardGrid(controller, boardSize) {
        // Build board grid.
        const grid = new ViewComponent(EL.DIV).addClass("board-grid");

        // Fill board grid with cell components.
        const totalCells = boardSize ** 2;
        for (let cellNum = 1; cellNum <= totalCells; cellNum++) {
            const cell = new PlacementCell(cellNum, controller);
            grid.append(cell);
        }

        return grid;
    }
}
