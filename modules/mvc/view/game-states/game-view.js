// Core Components
import MountPoint from "./../mount-point.js";

// Sub-View Modules
import PlayerBoards from "../gameboard/player-board-component.js";
import GameOptions from "../game-options/game-options-component.js";

// Top level view that displays game UI.
export default class GameView {
    // Controller
    #controller;

    // Mount Point (Needed to remove view)
    #window;

    // Components
    #gameboards;
    #gameOptions;

    constructor(controller) {
        // Save reference to controller.
        this.#controller = controller;

        // Build mount targets.
        this.#window = new MountPoint("game-area").mount(
            document.querySelector("#battleship header"),
            "after",
        );

        this.#buildView();
    }

    #getComponents() {
        return [this.#gameboards, this.#gameOptions];
    }

    #buildView() {
        this.#gameboards = new PlayerBoards(this.#controller);
        this.#gameOptions = new GameOptions(this.#controller);

        this.#getComponents().forEach((component) =>
            this.#window.append(component),
        );
    }

    #remove() {
        this.#window.remove();
    }

    newTurn() {
        this.#gameboards.update();
    }
}
