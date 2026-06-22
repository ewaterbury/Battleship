// Model Components
import Pregame from "./pregame.js";
import Battleship from "./battleship.js";

export default class Model {
    // Pregame Model
    #pregame = new Pregame();

    // Battleship Model
    #battleship;

    constructor() {}

    get pregame() {
        return this.#pregame;
    }

    get latestTurn() {
        return this.#battleship.latestTurn;
    }

    get maxFleetSize() {
        // Max ship count is set to 30% of cells with a floor of 16 cells (total size of standard fleet).
        return Math.max(Math.floor(this.boardSize.current ** 2 * 0.3), 16);
    }

    get fleetSize() {
        let totalCells = 0;

        Object.values(this.fleetTemplate).forEach(
            (ship) => (totalCells += ship.count * ship.size),
        );

        return totalCells;
    }

    // Initialize new game
    newGame(playerFleet) {
        this.#battleship = new Battleship(this.boardSize, playerFleet);

        this.gameState = "ingame";
    }

    takeTurn(attack) {
        // Send attack.
        this.#battleship.sendAttack(attack);

        // Log attack.
        this.#battleship.logAttack(attack);

        // Get turn result before going to next turn.
        const result = this.#battleship.latestTurn;

        // Go to next turn.
        this.#battleship.newTurn();

        return result;
    }
}
