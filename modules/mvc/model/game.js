import Battleship from "./battleship.js";

export default class Game {
    #battleship;

    constructor(boardSize, playerFleet) {
        this.#battleship = new Battleship(boardSize, playerFleet);
    }

    get state() {
        return this.#battleship.state;
    }

    get log() {
        return this.#battleship.log;
    }

    getCompAttack() {
        return this.#battleship.getCompAttack();
    }

    playTurn(attack) {
        this.#battleship.sendAttack(attack);
        this.#battleship.logTurn();
        this.#battleship.newTurn();
    }

    surrender() {
        return this.#battleship.surrender();
    }
}
