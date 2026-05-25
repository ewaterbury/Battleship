import Battleship from "./battleship.js";

export default class Model {
    // Battleship Model
    #battleship;

    // Game States
    #preGame;
    #inGame;
    #postGame;

    constructor() {}

    // Initialize new game
    newGame(boardsize, playerFleet) {
        this.#battleship = new Battleship(boardsize, playerFleet);

        this.gameState = this.#inGame;
    }

    takeTurn(attack) {
        // Send attack.
        this.#battleship.sendAttack(attack);

        //Log attack.
        this.#battleship.logAttack(attack);

        // Get turn result before going to next turn.
        const result = this.#battleship.latestTurn;

        // Go to next turn.
        this.#battleship.newTurn();

        return result;
    }
}
