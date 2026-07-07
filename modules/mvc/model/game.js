import Battleship from "./battleship.js";

export default class Game {
    #battleship;

    constructor(boardSize, playerFleet) {
        this.#battleship = new Battleship(boardSize, playerFleet);
    }
    get log() {
        return this.#battleship.log;
    }

    get previousTurn() {
        return this.#battleship.previousTurn;
    }

    get boardSize() {
        return this.#battleship.boardSize;
    }

    get playerBoard() {
        return this.#battleship.playerBoard;
    }

    get compBoard() {
        return this.#battleship.compBoard;
    }

    playTurn(attack) {
        this.#battleship.sendAttack(attack);
        this.#battleship.logTurn(attack);
        this.#battleship.newTurn();
    }

    getCompAttack() {
        return this.#battleship.getCompAttack();
    }
}
