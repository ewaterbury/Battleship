// Core Components
import Component from "./../view-component.js";
import MountPoint from "./../mount-point.js";

// Element Library
import { EL } from "../../../constants.js";

// Sub-View Modules
import PlayerBoard from "../gameboard/player-board-component.js";
import GameOptions from "../game-options/game-options-component.js";

// Top level view that displays game UI.
export default class GameView {
    // Controller
    #controller;

    // Mount Point (Needed to remove view)
    #window;

    // Components
    #gameboard;
    #gameOptions;

    // Sub-View References
    #logView;

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
        return [this.#gameboard, this.#gameOptions];
    }

    #buildView() {
        this.#gameboard = new PlayerBoard(this.#controller);
        this.#gameOptions = new GameOptions(this.#controller);

        this.#getComponents().forEach((component) =>
            this.#window.append(component),
        );
    }

    #remove() {
        this.#window.remove();
    }
}
