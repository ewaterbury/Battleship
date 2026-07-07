export default class Log {
    #log;

    constructor(attacker, defender) {
        // Initialize log with turn zero.
        this.#log = [
            {
                turn: 0,
                attacker: attacker,
                defender: defender,
            },
        ];
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
            status: status, // String
            shipSunk: sunkShip, // Int
            gameOver: gameOver, // Bool
            winner: gameOver === true ? attacker : null, // String
        });
    }
}
