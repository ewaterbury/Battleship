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
            current: DEFAULT_VALUES.BOARD_SIZE.DEFAULT,
        };

        // Set min and max board sizes as read-only fields.
        Object.defineProperties(this.boardSize, {
            min: { value: DEFAULT_VALUES.BOARD_SIZE.MIN, writable: false },
            max: { value: DEFAULT_VALUES.BOARD_SIZE.MAX, writable: false },
        });

        // Represents fleet composition for the next game.
        // Defaults to standard Battleship fleet [2, 3, 3, 4, 5].
        this.fleetTemplate = {
            carrier: {
                type: DEFAULT_VALUES.SHIPS.CARRIER.TYPE,
                size: DEFAULT_VALUES.SHIPS.CARRIER.SIZE,
                count: DEFAULT_VALUES.SHIPS.CARRIER.COUNT,
            },

            battleship: {
                type: DEFAULT_VALUES.SHIPS.BATTLESHIP.TYPE,
                size: DEFAULT_VALUES.SHIPS.BATTLESHIP.SIZE,
                count: DEFAULT_VALUES.SHIPS.BATTLESHIP.COUNT,
            },

            cruiser: {
                type: DEFAULT_VALUES.SHIPS.CRUISER.TYPE,
                size: DEFAULT_VALUES.SHIPS.CRUISER.SIZE,
                count: DEFAULT_VALUES.SHIPS.CRUISER.COUNT,
            },

            destroyer: {
                type: DEFAULT_VALUES.SHIPS.DESTROYER.TYPE,
                size: DEFAULT_VALUES.SHIPS.DESTROYER.SIZE,
                count: DEFAULT_VALUES.SHIPS.DESTROYER.COUNT,
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
            (ship) => (totalCells += ship.count * ship.size),
        );

        return totalCells;
    }

    // |--------------- Pre Game ---------------|

    // |---------- Game Settings ----------|

    // |----- Default Settings -----|
    resetGameSettings() {
        // Set board to default size.
        this.boardSize.current = DEFAULT_VALUES.BOARD_SIZE.DEFAULT;

        // Set fleet counts to default sizes.
        this.fleetTemplate.battleship.count =
            DEFAULT_VALUES.SHIPS.BATTLESHIP.COUNT;
        this.fleetTemplate.carrier.count = DEFAULT_VALUES.SHIPS.CARRIER.COUNT;
        this.fleetTemplate.cruiser.count = DEFAULT_VALUES.SHIPS.CRUISER.COUNT;
        this.fleetTemplate.destroyer.count =
            DEFAULT_VALUES.SHIPS.DESTROYER.COUNT;

        console.log("called");
    }

    // |----- Board Size -----|
    updateBoardSize(boardSize) {
        // Check if board should be updated.
        const updateBoard = boardSize !== this.boardSize.current;

        if (updateBoard) {
            // Update board size
            this.boardSize.current = boardSize;

            // Shrink fleet to be below maxFleetSize threshold.
            if (this.fleetSize > this.maxFleetSize) this.#minifyFleet();
        }

        // Return whether board was updated (Signals controller to update view).
        return updateBoard;
    }

    #minifyFleet() {
        // Add fleet template to iterable structure.
        const fleet = Object.values(this.fleetTemplate);

        // Sort in descending order.
        fleet.sort((a, b) => b.size - a.size);

        // Remove empty ships.
        fleet.forEach((ship) => {
            if (ship.count === 0) fleet.splice(fleet.indexOf(ship), 1);
        });

        while (this.fleetSize > this.maxFleetSize) {
            // Get largest ship.
            const ship = fleet[0];

            // Decrement count.
            ship.count--;

            // Update this.fleetTemplate.
            this.updateFleetTemplate({
                count: ship.count,
                size: ship.size,
                type: ship.type,
            });

            // Remove ship if count is zero.
            if (!fleet[0].count) fleet.splice(0, 1);
        }
    }

    // |----- Fleet Template -----|
    updateFleetTemplate(update) {
        // Current count of ship being updated.
        const currentCount = this.fleetTemplate[update.type].count;

        // Change in count of ship being updated.
        const countChange = update.count - currentCount;

        // updated template size
        const updatedFleet = this.fleetSize + countChange * update.size;

        // If new fleet size is valid, update ship count.
        // Allow fleets larger than max size when count is descending.
        if (
            (updatedFleet <= this.maxFleetSize || countChange < 0) &&
            updatedFleet > 0
        )
            this.fleetTemplate[update.type].count = update.count;
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
