// Core Components
import MountPoint from "./../../mount-point.js";

// Sub-View Modules
import PlayerBoards from "./gameboard/player-board-component.js";
import TurnPanel from "./turn-panel/turn-panel-view.js";

// Top level view that displays game UI.
export default class GameView {
    // Controller
    #controller;

    // Mount Point (Needed to remove view)
    #window;

    // Components
    #gameboards;
    #turnPanel;

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
        return [this.#gameboards, this.#turnPanel];
    }

    #buildView() {
        this.#gameboards = new PlayerBoards(this.#controller);
        this.#turnPanel = new TurnPanel(this.#controller);

        this.#getComponents().forEach((component) =>
            this.#window.append(component),
        );
    }

    #remove() {
        this.#window.remove();
    }

    newTurn() {
        this.#gameboards.update();
        this.#turnPanel.update();
    }
}
