const Utilities = require("../utilities.js");

class FleetGenerator {
    // Generate valid fleet.
    static generateFleet(ships, boardSize) {
        const fleet = [];

        Utilities.shuffleInPlace(ships).forEach((ship) => {
            // Get possible placements.
            const placements = FleetGenerator.#generatePlacements(
                ship,
                boardSize,
            );
            let i = 0;

            // Iterates over placements.
            while (i < placements.length) {
                // Get random placement.
                const rnd = Utilities.randomInt(i, placements.length - 1);

                // Add valid placement to fleet.
                if (FleetGenerator.#checkPlacement(placements[rnd], fleet)) {
                    fleet.push(placements[rnd]);
                    break;
                }
                // Remove invalid placement.
                else
                    [placements[rnd], placements[i]] = [
                        placements[i],
                        placements[rnd],
                    ];
                i++;
            }
        });

        return fleet;
    }

    // Generate potential placements for ship.
    static #generatePlacements(length, boardSize) {
        const totalCells = boardSize ** 2;
        const placements = [];

        for (let cell = 0; cell < totalCells; cell++) {
            // Build horizontal placement.
            if ((cell % boardSize) + length <= boardSize) {
                const horizontal = [];
                for (let i = 0; i < length; i++) horizontal.push(cell + i);
                placements.push(horizontal);
            }

            // Build vertical placement.
            if (cell + boardSize * (length - 1) < totalCells) {
                const vertical = [];
                for (let i = 0; i < length; i++)
                    vertical.push(cell + i * boardSize);
                placements.push(vertical);
            }
        }

        return placements;
    }

    // Check that a placement is compatible.
    static #checkPlacement(placement, fleet) {
        // Get set of occupied cells.
        const occupiedCells = new Set(fleet.flat());

        // Returns validity of placement.
        return !placement.some((cell) => occupiedCells.has(cell));
    }
}

module.exports = FleetGenerator;
