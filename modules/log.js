export default class Log {
    #log;

    constructor(attacker, defender) {
        const turnZero = {
            turn: 0,
            attacker: attacker,
            defender: defender,
        };

        this.#log = [];
    }

    get log() {
        // Use copy to prevent outside mutation.
        return [...this.#log];
    }

    get latest() {
        return this.#log[this.#log.length - 1];
    }

    addEntry(
        turn,
        attacker,
        defender,
        cell,
        status,
        sunkShip,
        gameOver,
        winner,
    ) {
        this.#log.push({
            turn: turn, // Int
            attacker: attacker, // String
            defender: defender,
            cell: cell, // Int
            status: status, // Str  ing
            shipSunk: sunkShip, // Int
            gameOver: gameOver, // Bool
            winner: gameOver === true ? attacker : null, // String
        });
    }
}
