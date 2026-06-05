// Default Model Values
import { DEFAULT_VALUES } from "../../constants.js";

// Model Components
import Battleship from "./battleship.js";

export default class Model {
    // Battleship Model
    #battleship;

    constructor() {
        // Represents board size (e.g., 10 x 10).
        this.boardSize = { current: DEFAULT_VALUES.BOARD_SIZE };

        // Set min and max board sizes as read-only fields.
        Object.defineProperties(this.boardSize, {
            min: { value: 7, writable: false },
            max: { value: 12, writable: false },
        });

        // Represents fleet composition for the next game.
        // Defaults to standard Battleship fleet [2, 3, 3, 4, 5].
        this.fleetTemplate = {
            carrier: {
                size: DEFAULT_VALUES.CARRIER.SIZE,
                count: DEFAULT_VALUES.CARRIER.COUNT,
            },
            battleship: {
                size: DEFAULT_VALUES.BATTLESHIP.SIZE,
                count: DEFAULT_VALUES.BATTLESHIP.COUNT,
            },
            cruiser: {
                size: DEFAULT_VALUES.CRUISER.SIZE,
                count: DEFAULT_VALUES.CRUISER.SIZE,
            },
            destroyer: {
                size: DEFAULT_VALUES.DESTROYER.SIZE,
                count: DEFAULT_VALUES.DESTROYER.COUNT,
            },
        };

        // Set ship.size as read-only field.
        for (const ship of Object.values(this.fleetTemplate))
            Object.defineProperty(ship, "size", {
                size: { value: ship.size, writable: false },
            });
    }

    get latestTurn() {
        return this.#battleship.latestTurn;
    }

    // Initialize new game
    newGame(playerFleet) {
        this.#battleship = new Battleship(this.boardSize, playerFleet);

        this.gameState = "ingame";
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
