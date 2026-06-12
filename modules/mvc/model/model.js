// Default Model Values
import { DEFAULT_VALUES } from "../../constants.js";

// Model Components
import Battleship from "./battleship.js";

export default class Model {
    // Battleship Model
    #battleship;

    constructor() {
        // Represents board size (e.g., 10 x 10).
        this.boardSize = {
            current: DEFAULT_VALUES.BOARD_SIZE,
        };

        // Set min and max board sizes as read-only fields.
        Object.defineProperties(this.boardSize, {
            min: { value: 7, writable: false },
            max: { value: 12, writable: false },
        });

        // Represents fleet composition for the next game.
        // Defaults to standard Battleship fleet [2, 3, 3, 4, 5].
        this.fleetTemplate = {
            carrier: {
                type: DEFAULT_VALUES.CARRIER.TYPE,
                size: DEFAULT_VALUES.CARRIER.SIZE,
                count: DEFAULT_VALUES.CARRIER.COUNT,
            },

            battleship: {
                type: DEFAULT_VALUES.BATTLESHIP.TYPE,
                size: DEFAULT_VALUES.BATTLESHIP.SIZE,
                count: DEFAULT_VALUES.BATTLESHIP.COUNT,
            },

            cruiser: {
                type: DEFAULT_VALUES.CRUISER.TYPE,
                size: DEFAULT_VALUES.CRUISER.SIZE,
                count: DEFAULT_VALUES.CRUISER.COUNT,
            },

            destroyer: {
                type: DEFAULT_VALUES.DESTROYER.TYPE,
                size: DEFAULT_VALUES.DESTROYER.SIZE,
                count: DEFAULT_VALUES.DESTROYER.COUNT,
            },
        };

        // Set ship.size as read-only field.
        for (const ship of Object.values(this.fleetTemplate))
            Object.defineProperties(ship, {
                type: { value: ship.type, writable: false },
                size: { value: ship.size, writable: false },
            });
    }

    get latestTurn() {
        return this.#battleship.latestTurn;
    }

    get maxFleetSize() {
        // Max ship count is set to 30% of cells with a floor of 16 cells (total size of standard fleet).
        return Math.max(Math.floor(this.boardSize.current ** 2 * 0.3), 16);
    }

    get fleetSize() {
        let totalCells = 0;

        Object.values(this.fleetTemplate).forEach(
            (ship) => (total += ship.count * ship.size),
        );

        return totalCells;
    }

    // |--------------- Pre Game ---------------|

    // |---------- Game Settings ----------|

    // |----- Board Size -----|
    updateBoardSize(boardSize) {
        if (boardSize !== this.boardSize.current) {
            this.boardSize.current = boardSize;

            return true;
        }

        return false;
    }

    // |----- Fleet Template -----|
    updateFleetTemplate(templateUpdate) {
        // Current count of ship being updated.
        const currentCount = this.fleetTemplate[templateUpdate.type].count;

        // Change in count of ship being updated.
        const countChange =
            currentCount + (templateUpdate.count - currentCount);

        // updated template size
        const updatedTemplateSize =
            this.fleetSize + countChange * templateUpdate.size;

        // If new fleet size is valid, update ship count.
        if (
            updatedTemplateSize <= this.maxFleetSize &&
            this.updatedTemplateSize > 0
        ) {
            this.fleetTemplate[templateUpdate.type].count += countChange;
            return true;
        } else {
            return false;
        }
    }

    // Initialize new game
    newGame(playerFleet) {
        this.#battleship = new Battleship(this.boardSize, playerFleet);

        this.gameState = "ingame";
    }

    takeTurn(attack) {
        // Send attack.
        this.#battleship.sendAttack(attack);

        // Log attack.
        this.#battleship.logAttack(attack);

        // Get turn result before going to next turn.
        const result = this.#battleship.latestTurn;

        // Go to next turn.
        this.#battleship.newTurn();

        return result;
    }
}
