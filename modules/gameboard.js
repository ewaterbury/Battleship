const CELL = require("./constants.js");

class Gameboard {
    #fleet;
    #view;

    constructor(boardSize = 10) {
        this.#fleet = []; // Player's fleet.
        this.#view = Array(boardSize ** 2).fill(null); // Opponent's view of board.
    }

    // Adds new ship to #fleet.
    newShip(ship) {
        this.#fleet.push(ship);
    }

    // Calls opponent's attack on player's board.
    receiveAttack(attack) {
        let struckShip; // Points to struck ship.

        // Checks for hit + Saves struck ship.
        fleetLoop: for (const ship of this.#fleet) {
            for (const cell of ship.getPosition())
                if (cell === attack) {
                    struckShip = ship; // Saves reference to struck ship.
                    break fleetLoop; // Breaks outer loop.
                }
        }

        struckShip
            ? (this.#view[attack] = CELL.HIT)
            : (this.#view[attack] = CELL.MISS); // Records attack on opponent's attack board.

        // If hit, calls hit on struck ship and checks ships status/Records sunk ship on opponent's attack board.
        if (struckShip) {
            struckShip.hit();
            if (struckShip.isSunk())
                struckShip.getPosition().forEach((cell) => {
                    this.#view[cell] = CELL.SUNK;
                });
        }
    }

    // Returns sunk status of fleet.
    fleetSunk() {
        return this.#fleet.every((ship) => ship.isSunk()); // Queries if fleet is sunk and returns result.
    }

    // Returns status of cell.
    queryAttack(cell) {
        return this.#view[cell];
    }

    // Returns status of gameboard.
    queryAttacks() {
        return this.#view;
    }
}

module.exports = Gameboard;
