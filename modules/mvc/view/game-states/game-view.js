// Core Components
import Component from "./../view-component.js";
import MountPoint from "./../mount-point.js";

// Element Library
import { EL } from "../../../constants.js";

// Sub-View Modules
import GameboardView from "./../gameboard/gameboard-view.js";
import GameOptions from "../game-options/game-options-component.js";

// Top level view that displays game UI.
export default class GameView {
    // Controller
    #controller;

    // Mount Point (Needed to remove view)
    #gameArea;

    // Sub-View References
    #logView;

    constructor(controller) {
        // Save reference to controller.
        this.#controller = controller;

        // Build mount targets.
        this.#gameArea = new MountPoint("game-area");

        // |----- GameArea ------|
        // Build game area compnents.
        const gameboardView = new GameboardView(controller);
        const gameOptionsView = new GameOptions();

        // Mount game area components.
        [gameboardView, gameOptionsView].forEach((view) =>
            this.#gameArea.append(view),
        );

        // Mount sub-views.
        this.#gameArea.mount(
            document.querySelector("#battleship header"),
            "after",
        );
    }

    removeView() {
        this.#gameArea.remove();
    }
}
