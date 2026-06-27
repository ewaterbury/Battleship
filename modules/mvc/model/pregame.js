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
        this.template = {};
        for (const ship of ["carrier", "battleship", "cruiser", "destroyer"])
            this.template[ship] = {
                type: DEFAULT_VALUES.SHIPS[ship.toUpperCase()].TYPE,
                size: DEFAULT_VALUES.SHIPS[ship.toUpperCase()].SIZE,
                count: DEFAULT_VALUES.SHIPS[ship.toUpperCase()].COUNT,
            };

        // Set ship size as read-only field.
        for (const ship of Object.values(this.template))
            Object.defineProperties(ship, {
                type: { value: ship.type, writable: false },
                size: { value: ship.size, writable: false },
            });

        // Build placement fleet.
        // Tracks placement status of individual ships.
        this.#generatePlacementFleet();

        // Set default orientation for placing ships.
        this.orientation = "vertical";
    }

    get boardSize() {
        return {
            current: this.#boardSize,
            min: DEFAULT_VALUES.BOARD_SIZE.MIN,
            max: DEFAULT_VALUES.BOARD_SIZE.MAX,
        };
    }

    get fleetSize() {
        return {
            current: Object.values(this.template).reduce(
                (total, ship) => (total += ship.count * ship.size),
                0,
            ),

            max: Math.max(Math.floor(this.#boardSize ** 2 * 0.3), 16),
        };
    }

    get selectedShip() {
        const selected = this.fleet.find((ship) => ship.selected === true);

        return selected ? selected : null;
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

        // Refresh placement fleet.
        this.#generatePlacementFleet();
    }

    // |----- Board Size -----|
    updateBoardSize(boardSize) {
        // Shrinks fleet to (or below) max size.
        const minifyTemplate = () => {
            // Add sorted, filtered fleet template to iterable structure.
            const fleet = Object.values(this.template)
                .filter((ship) => ship.count > 0)
                .sort((a, b) => b.size - a.size);

            while (this.fleetSize.current > this.fleetSize.max) {
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
        };

        // Return null on no update.
        if (boardSize === this.#boardSize) return null;

        this.#boardSize = boardSize;

        // Shrink fleet to be below max fleet size.
        if (this.fleetSize.current > this.fleetSize.max) {
            minifyTemplate();

            // Refresh placement fleet.
            this.#generatePlacementFleet();

            // Return true if fleet was updated.
            // Signals controller to redraw fleet.
            return true;
        }

        // Return false if fleet was updated.
        return false;
    }

    // |----- Fleet Template -----|
    updateFleetTemplate(update) {
        // Current count of ship being updated.
        const currentCount = this.template[update.type].count;

        // Change in count of ship being updated.
        const countChange = update.count - currentCount;

        // updated template size
        const updatedFleet = this.fleetSize.current + countChange * update.size;

        // If new fleet size is valid, update ship count.
        // Allow fleets larger than max size when count is descending.
        if (
            (updatedFleet <= this.fleetSize.max || countChange < 0) &&
            updatedFleet > 0
        ) {
            this.template[update.type].count = update.count;

            // Refresh placement fleet.
            this.#generatePlacementFleet();

            // Return true on fleet update.
            return true;
        }

        // Return false on no update.
        return false;
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

    toggleOrientation() {
        this.orientation =
            this.orientation === DEFAULT_VALUES.ORIENTATION.VERTICAL
                ? DEFAULT_VALUES.ORIENTATION.HORIZONTAL
                : DEFAULT_VALUES.ORIENTATION.VERTICAL;
    }

    // |----- Placement Fleet -----|
    #generatePlacementFleet() {
        this.fleet = []; // Clear current fleet.

        // Add new ships to fleet.
        for (const ship of Object.values(this.template)) {
            for (let i = 0; i < ship.count; i++)
                this.fleet.push({
                    type: ship.type,
                    size: ship.size,
                    id: i,
                    selected: false,
                });
        }
    }
}
