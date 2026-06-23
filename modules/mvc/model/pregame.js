// Default Model Values
import { DEFAULT_VALUES } from "../../constants.js";

export default class Pregame {
    #boardSize;

    constructor() {
        // |----- Board Size -----|
        // Represents board size for next game (e.g., 10 x 10).
        this.#boardSize = DEFAULT_VALUES.BOARD_SIZE.DEFAULT;

        // |----- Fleet Template -----|
        // Represents fleet composition for next game.
        // Defaults to standard Battleship fleet [2, 3, 3, 4, 5].
        this.template = {
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

        // Set ship size as read-only field.
        for (const ship of Object.values(this.template))
            Object.defineProperties(ship, {
                type: { value: ship.type, writable: false },
                size: { value: ship.size, writable: false },
            });

        // |----- Placement Fleet -----|
        // Tracks placement status of individual ships.
        this.fleet = this.#generatePlacementFleet();
    }

    get boardSize() {
        return this.#boardSize;
    }

    get minBoardSize() {
        return DEFAULT_VALUES.BOARD_SIZE.MIN;
    }

    get maxBoardSize() {
        return DEFAULT_VALUES.BOARD_SIZE.MAX;
    }

    get fleetSize() {
        return Object.values(this.template).reduce(
            (total, ship) => (total += ship.count * ship.size),
            0,
        );
    }

    get maxFleetSize() {
        // Max ship count is set to 30% of cells with a floor of 16 cells (total size of standard fleet).
        return Math.max(Math.floor(this.#boardSize ** 2 * 0.3), 16);
    }
    // |---------- Game Settings (Pregame) ----------|

    // |----- Reset to Default Settings -----|
    resetToDefaults() {
        // Set board to default size.
        this.#boardSize = DEFAULT_VALUES.BOARD_SIZE.DEFAULT;

        // Set fleet counts to default sizes.
        this.template.battleship.count = DEFAULT_VALUES.SHIPS.BATTLESHIP.COUNT;
        this.template.carrier.count = DEFAULT_VALUES.SHIPS.CARRIER.COUNT;
        this.template.cruiser.count = DEFAULT_VALUES.SHIPS.CRUISER.COUNT;
        this.template.destroyer.count = DEFAULT_VALUES.SHIPS.DESTROYER.COUNT;

        this.#refreshFleet();
    }

    // |----- Board Size -----|
    updateBoardSize(boardSize) {
        // Check if board should be updated.
        if (boardSize === this.#boardSize) return false;

        this.#boardSize = boardSize;

        // Shrink fleet to be below maxFleetSize.
        if (this.fleetSize > this.maxFleetSize) this.#minifyTemplate();

        this.#refreshFleet();

        // Return if update was performed (Signals controller to update view).
        return true;
    }

    #minifyTemplate() {
        // Add sorted, filtered fleet template to iterable structure.
        const fleet = Object.values(this.template)
            .filter((ship) => ship.count > 0)
            .sort((a, b) => b.size - a.size);

        while (this.fleetSize > this.maxFleetSize) {
            // Get largest ship.
            const ship = fleet[0];

            // Decrement count.
            ship.count--;

            // Update this.template.
            this.updateTemplate({
                count: ship.count,
                size: ship.size,
                type: ship.type,
            });

            // Remove ship if count is zero.
            if (!fleet[0].count) fleet.splice(0, 1);
        }
    }

    // |----- Fleet Template -----|
    updateTemplate(update) {
        // Current count of ship being updated.
        const currentCount = this.template[update.type].count;

        // Change in count of ship being updated.
        const countChange = update.count - currentCount;

        // updated template size
        const updatedFleet = this.fleetSize + countChange * update.size;

        // If new fleet size is valid, update ship count.
        // Allow fleets larger than max size when count is descending.
        if (
            (updatedFleet <= this.maxFleetSize || countChange < 0) &&
            updatedFleet > 0
        ) {
            this.template[update.type].count = update.count;
            // Refresh placement fleet.
            this.#refreshFleet();
        }
    }

    // |----- Placement Fleet -----|
    #generatePlacementFleet() {
        const fleet = []; //  Represents individual ships for upcoming game.

        for (const ship of Object.values(this.template)) {
            for (let i = 0; i < ship.count; i++)
                fleet.push({
                    type: ship.type,
                    size: ship.size,
                    id: i,
                    selected: false,
                });
        }

        return fleet;
    }

    #refreshFleet() {
        // Refresh placement fleet.
        this.fleet = this.#generatePlacementFleet();
    }

    // |----- Placing Ships -----|
    selectShip(selected) {
        // Set selected status to false on ships.
        this.fleet.forEach((ship) => {
            ship.selected = false;
        });

        const ship = this.fleet.find(
            (ship) => ship.size === selected.size && ship.id === selected.id,
        );

        if (!ship) throw RangeError("Selected ship not found");

        ship.selected = true;
    }
}
