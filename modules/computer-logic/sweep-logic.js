const CELL = require("../constants.js");

class SweepLogic {
    #gameboard;
    #boardSize;

    constructor(gameboard) {
        this.#gameboard = gameboard;
        this.#boardSize = Math.sqrt(gameboard.length);
    }

    getAttacks(enemyFleet) {
        const getHitCount = (ship) => {
            let hitCount = 0;
            for (const cell of ship)
                if (this.#gameboard[cell] === CELL.HIT) hitCount++;
            return hitCount;
        };

        // Get possible ships from gameboard.
        const ships = this.#getPlacements(enemyFleet);

        // Exit if no possible ships.
        if (ships === null) return [null];

        const attacks = new Map();

        // Score each attack by number of appearances, hit count, and max ship length.
        for (const ship of ships) {
            for (const cell of ship) {
                const hits = getHitCount(ship);
                const length = ship.length;

                if (this.#gameboard[cell] === CELL.EMPTY) {
                    const existing = attacks.get(cell);

                    if (existing) {
                        existing.count++;
                        existing.hits = Math.max(existing.hits, hits);
                        existing.length = Math.max(existing.length, length);
                    } else
                        attacks.set(cell, {
                            count: 1,
                            hits: hits,
                            length: length,
                        });
                }
            }
        }
        // console.log(attacks);
        this.#filterAttacks(attacks);
        // console.log(attacks);
        if (!attacks.size) return [null];
        return [...attacks.keys()];
    }

    // Scan view board for all possible ships
    #getPlacements(enemyFleet) {
        const totalCells = this.#boardSize ** 2;
        const possibleShips = [];
        const hasHits = this.#gameboard.includes(CELL.HIT);
        let ship = [];

        const validCell = (cell) =>
            hasHits
                ? this.#gameboard[cell] === CELL.HIT ||
                  this.#gameboard[cell] === CELL.EMPTY
                : this.#gameboard[cell] === CELL.EMPTY;

        const validShip = (ship, correctSize) =>
            hasHits
                ? ship.length === correctSize &&
                  ship.some((cell) => this.#gameboard[cell] === CELL.HIT)
                : ship.length === correctSize;

        const addShip = (correctSize) => {
            if (validShip(ship, correctSize)) possibleShips.push([...ship]);
            ship = [];
        };

        const addFullShip = (correctSize) => {
            if (validShip(ship, correctSize)) possibleShips.push([...ship]);
            ship = ship.slice(1);
        };

        // Build horizontal ships.
        for (const enemyShip of enemyFleet) {
            ship = [];
            for (let cell = 0; cell < totalCells; cell++) {
                // Reset ship on new row.
                if (cell % this.#boardSize === 0)
                    if (ship.length) addShip(enemyShip);

                // Reset ship on non-hit cell.
                if (!validCell(cell)) {
                    if (ship.length) addShip(enemyShip);
                }

                // Add consecutive hits to ship.
                else if (ship.length === enemyShip)
                    // Partial reset on full ship.
                    addFullShip(enemyShip);
                ship.push(cell);
            }

            // Push final ship in scan.
            if (validShip(ship, enemyShip)) possibleShips.push([...ship]);

            ship = [];

            // Build vertical ships.
            for (let col = 0; col < this.#boardSize; col++)
                for (let row = 0; row < this.#boardSize; row++) {
                    const cell = row * this.#boardSize + col;
                    // Reset ship on new col.
                    if (row === 0 && ship.length) addShip(enemyShip);

                    // Reset ship on non-hit cell.
                    if (!validCell(cell)) {
                        if (ship.length) addShip(enemyShip);
                    }

                    // Add consecutive hits to ship.
                    else {
                        // Partial reset on full ship.
                        if (ship.length === enemyShip) addFullShip(enemyShip);

                        ship.push(cell);
                    }
                }

            if (validShip(ship, enemyShip)) possibleShips.push([...ship]);
        }
        // Terminate empty search.
        if (!possibleShips.length) return null;

        return possibleShips;
    }

    #filterAttacks(attacks) {
        // Filter by hits.
        const mostHits = Math.max(
            ...[...attacks.values()].map((score) => score.hits),
        );

        for (const [attack, score] of [...attacks])
            if (score.hits < mostHits) attacks.delete(attack);

        // Filter by count.
        const highestCount = Math.max(
            ...[...attacks.values()].map((score) => score.count),
        );

        for (const [attack, score] of [...attacks])
            if (score.count < highestCount) attacks.delete(attack);

        //Filter by size.
        const longestShip = Math.max(
            ...[...attacks.values()].map((score) => score.length),
        );

        for (const [attack, score] of [...attacks])
            if (score.length < longestShip) attacks.delete(attack);

        return attacks;
    }
}

module.exports = SweepLogic;
