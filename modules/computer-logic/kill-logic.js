const Utilities = require("../utilities.js");
let name;

class KillLogic {
    #myView;
    #boardSize;

    constructor(view, boardSize) {
        this.#myView = view;
        this.#boardSize = boardSize;
    }

    // Determine attack location for killer profile.
    attack(enemyFleet) {
        // Get best strikes.
        const attacks = this.#getAttacks(enemyFleet);

        // Check for hits.
        if (attacks === null) return attacks;

        // Randomly select a strike.
        return attacks[Utilities.randomInt(0, attacks.length - 1)];
    }

    #getAttacks(enemyFleet) {
        const attacksByProbability = new Map();
        const attacksBySize = [];
        const largestShip = Math.max(...enemyFleet);

        for (let i = 0; i < largestShip - 1; i++) attacksBySize[i] = new Set();

        // Get potential attacks.
        const ships = this.#getPossibleShips(enemyFleet);

        // Returns null if there are no valid targets
        if (ships === null) return null;

        for (const ship of ships) {
            for (const attack of this.#getPossibleAttacks(ship)) {
                // Add to attacks by probability.
                if (!attacksByProbability.has(attack))
                    attacksByProbability.set(attack, 1);
                else
                    attacksByProbability.set(
                        attack,
                        attacksByProbability.get(attack) + 1,
                    );

                // Add to attacks by size.
                attacksBySize[ship.length - 1].add(attack);
            }
        }

        const mostLikelyAttacks = [];
        let mostOccurrences = 0;

        for (const [cell, occurrences] of attacksByProbability) {
            if (occurrences > mostOccurrences) {
                mostLikelyAttacks.length = 0;
                mostLikelyAttacks.push(cell);
                mostOccurrences = occurrences;
            } else if (occurrences === mostOccurrences)
                mostLikelyAttacks.push(cell);
        }

        if (mostOccurrences > 1) return mostLikelyAttacks;

        // Return attacks on largest ship size.
        for (let i = attacksBySize.length - 1; i >= 0; i--)
            if (attacksBySize[i].size > 0) return [...attacksBySize[i]];
    }

    #getPossibleShips(enemyFleet) {
        const boardCells = this.#boardSize ** 2;
        const largestShip = Math.max(...enemyFleet);
        let possibleShips = [];
        let ship = [];

        // Build horizontal ships.
        for (let cell = 0; cell < boardCells; cell++) {
            // Reset on new row.
            if (cell % this.#boardSize === 0)
                if (ship.length > 0) {
                    possibleShips.push([...ship]);
                    ship = [];
                }

            // Reset on non-hit cell.
            if (this.#myView[cell] !== "hit") {
                if (ship.length !== 0) {
                    possibleShips.push([...ship]);
                    ship = [];
                }
            }

            // Add consecutive hits ship
            else {
                // Reset on full ship.
                if (ship.length === largestShip - 1) {
                    possibleShips.push([...ship]);
                    ship = ship.slice(1);
                }

                ship.push(cell);
            }
        }

        if (ship.length > 0) possibleShips.push([...ship]);

        ship = [];

        // Build vertical ships.
        for (let col = 0; col < this.#boardSize; col++) {
            for (let row = 0; row < this.#boardSize; row++) {
                const cell = row * this.#boardSize + col;
                // Reset on new col.
                if (row === 0)
                    if (ship.length > 0) {
                        possibleShips.push([...ship]);
                        ship = [];
                    }

                // Reset on non-hit cell.
                if (this.#myView[cell] !== "hit") {
                    if (ship.length !== 0) {
                        possibleShips.push([...ship]);
                        ship = [];
                    }
                }
                // Add consecutive hits ship
                else {
                    // Reset on full ship.
                    if (ship.length === largestShip - 1) {
                        possibleShips.push([...ship]);
                        ship = ship.slice(1);
                    }

                    ship.push(cell);
                }
            }
        }

        if (ship.length > 0) possibleShips.push([...ship]);

        // Handle empty search.
        if (possibleShips.length === 0) return null;

        // Filter duplicates.
        let filter = new Set();
        possibleShips.forEach((ship) => filter.add(JSON.stringify(ship)));
        possibleShips = [];
        filter.forEach((ship) => possibleShips.push(JSON.parse(ship)));

        return possibleShips;
    }

    #getPossibleAttacks(ship) {
        const possibleAttacks = [];

        // Size-one ship search.
        if (ship.length === 1) {
            const cell = ship[0];

            // North check.
            if (
                cell - this.#boardSize >= 0 &&
                this.#myView[cell - this.#boardSize] === null
            )
                possibleAttacks.push(cell - this.#boardSize);

            // South check.
            if (
                cell + this.#boardSize < this.#boardSize ** 2 &&
                this.#myView[cell + this.#boardSize] === null
            )
                possibleAttacks.push(cell + this.#boardSize);

            // East check.
            if (
                (cell % this.#boardSize) + 1 < this.#boardSize &&
                this.#myView[cell + 1] === null
            )
                possibleAttacks.push(cell + 1);

            // West check.
            if (
                (cell % this.#boardSize) - 1 >= 0 &&
                this.#myView[cell - 1] === null
            )
                possibleAttacks.push(cell - 1);
        }

        // Horizontal ship search.
        else if (ship[1] - ship[0] === 1) {
            const leftEdge = ship[0];
            const rightEdge = ship[ship.length - 1];

            if (leftEdge % this.#boardSize !== 0)
                if (this.#myView[leftEdge - 1] === null)
                    possibleAttacks.push(leftEdge - 1);

            if (rightEdge % this.#boardSize !== this.#boardSize - 1)
                if (this.#myView[rightEdge + 1] === null)
                    possibleAttacks.push(rightEdge + 1);
        }

        // Vertical ship search.
        else {
            const top = ship[0];
            const bottom = ship[ship.length - 1];

            if (top - this.#boardSize >= 0)
                if (this.#myView[top - this.#boardSize] === null)
                    possibleAttacks.push(top - this.#boardSize);

            if (bottom + this.#boardSize < this.#boardSize ** 2)
                if (this.#myView[bottom + this.#boardSize] === null)
                    possibleAttacks.push(bottom + this.#boardSize);
        }

        return possibleAttacks;
    }
}

module.exports = KillLogic;
