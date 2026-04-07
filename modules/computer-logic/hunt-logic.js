const CELL = require("../constants.js");

const Utilities = require("../utilities.js");

class HuntLogic {
    #gameboard;
    #boardSize;
    #minShip;
    #initialOffset;
    #attackQueue;
    #front;

    constructor(gameboard, fleet) {
        this.#gameboard = gameboard;
        this.#boardSize = Math.sqrt(gameboard.length);
        this.#minShip = Math.min(...fleet);
        this.#initialOffset = Utilities.randomInt(0, this.#minShip - 1);
        this.#attackQueue = this.#makeAttackQueue();
        this.#front = 0;
    }

    #makeAttackQueue() {
        const gap = this.#minShip - 1;

        // Randomize starting offset for first row.
        let offset = this.#initialOffset;

        // Holds cells grouped by column mod 4.
        const passA = [];
        const passB = [];
        const passC = [];
        const passD = [];

        // Loop through each row of board.
        for (let row = 0; row < this.#boardSize; row++) {
            //Loop through columns of the row.
            for (
                let col = offset;
                col < this.#boardSize;
                col += this.#minShip
            ) {
                const cell = row * this.#boardSize + col;

                // Distribute cells into 4 passes based on column mod 4
                if (col % 4 === 0) passA.push(cell);
                else if (col % 4 === 1) passB.push(cell);
                else if (col % 4 === 2) passC.push(cell);
                else if (col % 4 === 3) passD.push(cell);
            }
            // Increment offset for next row (wrap if offset exceeds gap).
            offset = offset === gap ? 0 : offset + 1;
        }

        // Shuffle passes individually.
        [passA, passB, passC, passD].forEach((pass) =>
            Utilities.shuffleInPlace(pass),
        );

        // Combine passes into single array.
        let passes = [];

        // Shuffle C and D passes, then add to queue
        Utilities.shuffleInPlace([passC, passD]).forEach((pass) =>
            passes.push(pass),
        );

        // Shuffle A and B passes, then add to queue
        Utilities.shuffleInPlace([passA, passB]).forEach((pass) =>
            passes.push(pass),
        );

        // Flatten array of arrays into single 1D array.
        passes = passes.flat();

        return passes;
    }

    updateAttackQueue(fleet) {
        this.#minShip = Math.min(...fleet);
        this.#attackQueue = this.#makeAttackQueue();
        this.#front = 0;
    }

    getAttack() {
        // Search for valid attack location.
        while (
            this.#front < this.#attackQueue.length &&
            this.#gameboard[this.#attackQueue[this.#front]] !== CELL.EMPTY
        )
            this.#front++;

        // Send attack.
        return this.#front < this.#attackQueue.length
            ? this.#attackQueue[this.#front++]
            : null;
    }
}

module.exports = HuntLogic;
