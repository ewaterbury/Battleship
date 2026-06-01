// Core Components
import Component from "./view-component.js";
import MountPoint from "./mount-point.js";

// Element Library
import { EL } from "../../constants.js";

// Sub-View Modules
import GameboardView from "./gameboard/gameboard-view.js";
import GameOptions from "./game-options/game-options-view.js";
import LogView from "./log/logger-view.js";
import SettingsView from "./settings/settings-view.js";

// Top level view that displays game UI.
export default class GameView {
    // Controller
    #controller;

    // Mount Points (Needed to remove view)
    #gameArea;
    #gameSidebar;

    // Sub-View References
    #logView;

    constructor(boardsize, controller) {
        // Save reference to controller.
        this.#controller = controller;

        // Build mount targets.
        this.#gameArea = new MountPoint("game-area");
        this.#gameSidebar = new MountPoint("sidebar-area");

        // |----- GameArea ------|
        // Build game area compnents.
        const gameboardView = new GameboardView(boardsize);
        const gameOptionsView = new GameOptions();

        // Mount game area components.
        [gameboardView, gameOptionsView].forEach((view) =>
            this.#gameArea.append(view),
        );

        // |----- GameSidebar ------|
        // Build log and settings.
        this.#logView = new LogView(boardsize);

        // Initialize settings.
        const settingsView = new SettingsView(
            this.#controller.backingAudio,
            this.#controller.gameEffects.hit,
            this.#controller.gameEffects.miss,
            this.#controller.gameEffects.sunk,
        );

        [this.#logView, settingsView].forEach((view) =>
            this.#gameSidebar.append(view),
        );

        // Mount sub-views.
        this.#gameArea.mount(
            document.querySelector("#battleship header"),
            "after",
        );

        this.#gameSidebar.mount(
            document.querySelector("#battleship #game-area"),
            "after",
        );
    }

    removeView() {
        this.#gameArea.remove();
        this.#gameSidebar.remove();
    }

    // |----- Audio Methods -----|

    // |----- Log Methods -----|
    logTurn(turn) {
        this.#logView.logTurn(turn);
        return this;
    }
}
