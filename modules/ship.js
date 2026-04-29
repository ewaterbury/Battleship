class Ship {
    #position;
    #hits;

    constructor(cells) {
        this.#position = cells; // Holds position of ship.
        this.#hits = 0; // Tracks hit on ship.
    }

    // Calls hit on ship.
    hit() {
        if (!this.isSunk()) this.#hits++;
    }

    // Returns sunk status of ship.
    isSunk() {
        return this.#hits >= this.#position.length;
    }

    // Gets position of ship.
    getPosition() {
        return this.#position;
    }
}

export default Ship;
