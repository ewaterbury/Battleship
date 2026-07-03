// Default Model Values
import { DEFAULT_VALUES } from "../../constants.js";

import FleetGenerator from "./computer-logic/fleet-generator.js";

export default class Pregame {
    #boardSize;

    constructor() {
        // Represents board size for next game (e.g., 10 x 10).
        this.#boardSize = DEFAULT_VALUES.BOARD_SIZE.DEFAULT;

        // Represents fleet composition for next game.
        // Defaults to standard Battleship fleet [2, 3, 3, 4, 5].
        this.template = this.#createFleetTemplate();

        this.#generatePlacementFleet();

        // Set default orientation for placing ships.
        this.orientation = DEFAULT_VALUES.ORIENTATION.VERTICAL;
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
        return this.fleet.find((ship) => ship.selected === true) ?? null;
    }

    get occupiedCells() {
        // Aggregate occupied cells in a set.
        const occupied = new Set();

        for (const ship of this.fleet) {
            if (!ship.location) continue;

            for (const cell of ship.location) occupied.add(cell);
        }

        return occupied;
    }

    // |--------------- Game Settings (Pregame) ---------------|

    // |----- Reset to Default Settings -----|
    resetToDefaults() {
        // Set board to default size.
        this.#boardSize = DEFAULT_VALUES.BOARD_SIZE.DEFAULT;

        // Set fleet counts to default sizes.
        this.template = this.#createFleetTemplate();

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
                this.updateFleetTemplate({
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

        // Refresh fleet (clear placements and selected status).
        this.#generatePlacementFleet();

        // Shrink fleet to be below max fleet size.
        if (this.fleetSize.current > this.fleetSize.max) {
            minifyTemplate();

            // Return true if fleet was updated.
            // Signals controller to redraw fleet.
            return true;
        }

        // Return false if fleet was updated.
        return false;
    }

    // |----- Fleet -----|
    updateFleetTemplate(update) {
        const currentCount = this.template[update.type].count;

        const countChange = update.count - currentCount;

        const updatedFleet = this.fleetSize.current + countChange * update.size;

        // If new fleet size is valid, update ship count.
        // Allow fleets larger than max size when count is descending.
        if (
            (updatedFleet <= this.fleetSize.max || countChange < 0) &&
            updatedFleet > 0
        ) {
            this.template[update.type].count = update.count;

            // Rebuild the placement fleet from the updated template.
            this.#generatePlacementFleet();

            // Return true on fleet update.
            return true;
        }

        // Return false on no update.
        return false;
    }

    #createFleetTemplate() {
        const template = {};

        for (const ship of ["carrier", "battleship", "cruiser", "destroyer"])
            template[ship] = {
                type: DEFAULT_VALUES.SHIPS[ship.toUpperCase()].TYPE,
                size: DEFAULT_VALUES.SHIPS[ship.toUpperCase()].SIZE,
                count: DEFAULT_VALUES.SHIPS[ship.toUpperCase()].COUNT,
            };

        // Make ship identity immutable.
        for (const ship of Object.values(template))
            Object.defineProperties(ship, {
                type: { value: ship.type, writable: false },
                size: { value: ship.size, writable: false },
            });

        return template;
    }

    #generatePlacementFleet() {
        this.fleet = []; // Clear current fleet.

        // Rebuild the placement fleet from template.
        for (const ship of Object.values(this.template)) {
            for (let i = 0; i < ship.count; i++)
                this.fleet.push({
                    type: ship.type,
                    size: ship.size,
                    id: i,
                    selected: false,
                    location: null,
                });
        }
    }

    // |----- Selecting -----|
    toggleShipSelect(selected) {
        const ship = this.fleet.find(
            (ship) => ship.size === selected.size && ship.id === selected.id,
        );
        if (!ship) return;
        if (ship.selected) {
            this.#deselectShips();
        } else {
            this.#selectShip(ship);
        }
    }

    #selectShip(selectedShip) {
        this.#deselectShips();
        selectedShip.selected = true;
        selectedShip.location = null;
    }

    #deselectShips() {
        // Set selected status to false on all ships.
        for (const ship of this.fleet) ship.selected = false;
    }

    // |----- Placement -----|
    toggleOrientation() {
        this.orientation =
            this.orientation === DEFAULT_VALUES.ORIENTATION.VERTICAL
                ? DEFAULT_VALUES.ORIENTATION.HORIZONTAL
                : DEFAULT_VALUES.ORIENTATION.VERTICAL;
    }

    placeShip(ship) {
        const selectedShip = this.selectedShip;

        const validPlacement = (ship) => {
            // Aggregate occupied cells in a set.
            const occupiedCells = this.occupiedCells;

            // Remove slected ships cells from occupied cells.
            // Allows for smoother ship repositioning.
            if (selectedShip.location) {
                selectedShip.location.forEach((cell) =>
                    occupiedCells.delete(cell),
                );
            }

            // Return true on valid placement.
            return !ship.some((cell) => occupiedCells.has(cell));
        };

        if (!selectedShip) return false;

        if (!validPlacement(ship)) return false;

        // Assign location.
        selectedShip.location = ship;

        // deselctShip after location assignment.
        this.#deselectShips();

        return true;
    }

    autoPlaceShips() {
        // Prepare input for FleetGenerator.
        const shipLengths = [];
        for (const ship of Object.values(this.template))
            for (let i = 0; i < ship.count; i++) shipLengths.push(ship.size);

        // Get placement tiles from FleetGenerator.
        const shipLocations = FleetGenerator.generateFleet(
            shipLengths,
            this.#boardSize,
        );

        // Clear current placements.
        this.#generatePlacementFleet();

        // Assign ships to this.fleet.
        shipLocations.forEach((shipPlacement) => {
            const ship = this.fleet.find(
                (ship) =>
                    ship.location === null &&
                    ship.size === shipPlacement.length,
            );

            ship.location = shipPlacement;
        });
    }

    // |----- Launch Game -----|
    launchGame() {
        const shipsPlaced = () =>
            this.fleet.every((ship) => ship.location !== null);

        if (shipsPlaced()) {
            return true;
        }
        return false;
    }

    // |----- Helpers -----|
    getShipFromCell(cell) {
        const boardSize = this.#boardSize;
        const orientation = this.orientation;
        const selectedShip = this.selectedShip;

        const ship = [];

        // Callbacks determined by orientation.
        let buildShip;
        let fitShip;

        // Set callbacks (vertical).
        if (orientation === DEFAULT_VALUES.ORIENTATION.VERTICAL) {
            buildShip = (ship) => {
                for (let i = 0; i < selectedShip.size; i++)
                    ship.push(Number(cell.num) + boardSize * i);
            };
            // Fit ship to board (shift upwards).
            fitShip = (ship) => {
                while (ship[ship.length - 1] >= boardSize ** 2)
                    for (let i = 0; i < ship.length; i++) ship[i] -= boardSize;
            };
        }

        // Set callbacks (horizontal).
        else if (orientation === DEFAULT_VALUES.ORIENTATION.HORIZONTAL) {
            buildShip = (ship) => {
                for (let i = 0; i < selectedShip.size; i++)
                    ship.push(Number(cell.num) + i);
            };

            // Fit ship to board (shift left).
            fitShip = (ship) => {
                const staysInRow = (ship) => {
                    // Get start row of first cell.
                    const startRow = Math.floor(ship[0] / boardSize);

                    // Check that all cells are in the same row.
                    return ship.every(
                        (cell) => Math.floor(cell / boardSize) === startRow,
                    );
                };

                while (!staysInRow(ship))
                    for (let i = 0; i < ship.length; i++) ship[i] -= 1;
            };
        }

        // Throw error on invaild ship orientation.
        else throw new TypeError("Invalid ship orientation");

        buildShip(ship);
        fitShip(ship);
        return ship;
    }
}
