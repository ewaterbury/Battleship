export default class Log {
    #log;

    constructor() {
        this.#log = [];
    }

    get log() {
        // Use copy to prevent outside mutation.
        return [...this.#log];
    }

    get latest() {
        if (this.#log.length > 0) return this.#log[this.#log.length - 1];
        else return null;
    }

    addEntry(turn, attacker, cell, status, sunkShip) {
        this.#log.push({
            turn: turn, // Int
            attacker: attacker, // String
            cell: cell, // Int
            status: status, // String
            shipSunk: sunkShip, // Int
        });
    }
}
