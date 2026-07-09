// Default Model Values
import { DEFAULT_VALUES } from "../../constants.js";

import FleetGenerator from "./computer-logic/fleet-generator.js";

export default class Pregame {
    #boardSize;
    #fleet;
    #orientation;
    #template;

    constructor() {
        // Represents board size for next game (e.g., 10 x 10).
        this.#boardSize = DEFAULT_VALUES.BOARD_SIZE.DEFAULT;

        // Represents fleet composition for next game.
        // Defaults to standard Battleship fleet [2, 3, 3, 4, 5].
        this.#template = this.#buildStandardTemplate();

        this.#fleet = this.#generatePlacementFleet();

        // Set default orientation for placing ships.
        this.#orientation = DEFAULT_VALUES.ORIENTATION.VERTICAL;
    }

    // |----- Getters -----|
    get state() {
        return {
            boardSize: this.#getBoardSize(),
            fleetTemplate: this.#template,
            fleetSize: this.#getFleetSize(),
            occupiedCells: this.#getOccupiedCells(),
            orientation: this.#orientation,
            placementFleet: this.#fleet,
            selectedShip: this.#getSelected(),
        };
    }

    #getBoardSize() {
        return {
            current: this.#boardSize,
            min: DEFAULT_VALUES.BOARD_SIZE.MIN,
            max: DEFAULT_VALUES.BOARD_SIZE.MAX,
        };
    }

    #getFleetSize() {
        return {
            current: Object.values(this.#template).reduce(
                (total, ship) => (total += ship.count * ship.size),
                0,
            ),

            max: Math.max(Math.floor(this.#boardSize ** 2 * 0.3), 16),
        };
    }

    #getSelected() {
        return this.#fleet.find((ship) => ship.selected === true) ?? null;
    }

    #getOccupiedCells() {
        // Aggregate occupied cells in a set.
        const occupied = new Set();

        for (const ship of this.#fleet) {
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
        this.#template = this.#buildStandardTemplate();

        // Refresh placement fleet.
        this.#fleet = this.#generatePlacementFleet();
    }

    // |----- Board Size -----|
    updateBoardSize(boardSize) {
        // Shrinks fleet to (or below) max size.
        const minifyTemplate = () => {
            // Add sorted, filtered fleet template to iterable structure.
            const fleet = Object.values(this.#template)
                .filter((ship) => ship.count > 0)
                .sort((a, b) => b.size - a.size);

            let size = this.#getFleetSize();

            while (size.current > size.max) {
                // Get largest ship.
                const ship = fleet[0];

                // Decrement count.
                ship.count--;

                // Update template.
                this.updateTemplate({
                    count: ship.count,
                    size: ship.size,
                    type: ship.type,
                });

                // Remove ship if count is zero.
                if (!fleet[0].count) fleet.splice(0, 1);

                size = this.#getFleetSize();
            }
        };

        // Return null on no update.
        if (boardSize === this.#boardSize) return null;

        this.#boardSize = boardSize;

        // Refresh fleet (clear placements and selected status).
        this.#fleet = this.#generatePlacementFleet();

        // Shrink fleet to be below max fleet size.
        const size = this.#getFleetSize();
        if (size.current > size.max) {
            minifyTemplate();

            // Return true if fleet was updated.
            // Signals controller to redraw fleet.
            return true;
        }

        // Return false if fleet was updated.
        return false;
    }

    // |----- Fleet -----|
    updateTemplate(update) {
        const size = this.#getFleetSize();

        const currentCount = this.#template[update.type].count;

        const countChange = update.count - currentCount;

        const updatedFleet = size.current + countChange * update.size;

        // If new fleet size is valid, update ship count.
        // Allow fleets larger than max size when count is descending.
        if ((updatedFleet <= size.max || countChange < 0) && updatedFleet > 0) {
            this.#template[update.type].count = update.count;

            // Rebuild the placement fleet from the updated template.
            this.#fleet = this.#generatePlacementFleet();

            // Return true on fleet update.
            return true;
        }

        // Return false on no update.
        return false;
    }

    #buildStandardTemplate() {
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
        const fleet = [];

        // Rebuild the placement fleet from template.
        for (const ship of Object.values(this.#template)) {
            for (let i = 0; i < ship.count; i++)
                fleet.push({
                    type: ship.type,
                    size: ship.size,
                    id: i,
                    selected: false,
                    location: null,
                });
        }

        return fleet;
    }

    // |----- Selecting -----|
    toggleShipSelect(selected) {
        const ship = this.#fleet.find(
            (ship) => ship.size === selected.size && ship.id === selected.id,
        );
        if (!ship) return;
        if (ship.selected) {
            this.#deselectShips();
        } else {
            this.#selectShip(ship);
        }
    }

    #selectShip(ship) {
        this.#deselectShips();
        ship.selected = true;
        ship.location = null;
    }

    #deselectShips() {
        // Set selected status to false on all ships.
        for (const ship of this.#fleet) ship.selected = false;
    }

    // |----- Placement -----|
    placeShip(ship) {
        const selected = this.#getSelected();

        const validPlacement = (ship) => {
            // Aggregate occupied cells in a set.
            const occupied = this.#getOccupiedCells();

            // Remove slected ships cells from occupied cells.
            // Allows for smoother ship repositioning.
            if (selected.location) {
                selected.location.forEach((cell) => occupied.delete(cell));
            }

            // Return true on valid placement.
            return !ship.some((cell) => occupied.has(cell));
        };

        if (!selected) return false;

        if (!validPlacement(ship)) return false;

        // Assign location.
        selected.location = ship;

        // DeselctShip after location assignment.
        this.#deselectShips();

        return true;
    }

    autoPlaceFleet() {
        // Prepare input for FleetGenerator.
        const lengths = [];
        for (const ship of Object.values(this.#template))
            for (let i = 0; i < ship.count; i++) lengths.push(ship.size);

        // Get placement tiles from FleetGenerator.
        const locations = FleetGenerator.generateFleet(
            lengths,
            this.#boardSize,
        );

        // Clear current placements.
        this.#fleet = this.#generatePlacementFleet();

        // Assign ships to fleet.
        locations.forEach((placement) => {
            const ship = this.#fleet.find(
                (ship) =>
                    ship.location === null && ship.size === placement.length,
            );

            ship.location = placement;
        });
    }

    getPlacement(cell) {
        const boardSize = this.#boardSize;
        const orientation = this.#orientation;
        const selected = this.#getSelected();
        const ship = [];

        // Callbacks determined by orientation.
        let buildShip;
        let fitShip;

        if (!selected)
            throw new TypeError(
                "Cannot calculate placement without selected ship",
            );

        // Set callbacks (vertical).
        if (orientation === DEFAULT_VALUES.ORIENTATION.VERTICAL) {
            buildShip = (ship) => {
                for (let i = 0; i < selected.size; i++)
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
                for (let i = 0; i < selected.size; i++)
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

    toggleOrientation() {
        this.#orientation =
            this.#orientation === DEFAULT_VALUES.ORIENTATION.VERTICAL
                ? DEFAULT_VALUES.ORIENTATION.HORIZONTAL
                : DEFAULT_VALUES.ORIENTATION.VERTICAL;
    }

    // |----- Launch Game -----|
    launchGame() {
        return this.#fleet.every((ship) => ship.location !== null);
    }
}
