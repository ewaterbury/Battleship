// Model Modules
import Model from "./model/model.js";

// View Modules
import GameboardView from "./view/gameboard-view.js";
import LogView from "./view/log/logger-view.js";
import MenuView from "./view/menu/menu-view.js";

// View Component
import Component from "./view/view-component.js";

import ThemeButton from "./view/buttons/themeButton.js";

export default class Controller {
    #model;

    // Gamboard views
    #playerView;
    #computerView;
    #logView;
    #menuView;

    // Mount Targets
    #gameArea;
    #gameSidebar;

    constructor() {
        // Initialize game model.
        this.#model = new Model();

        // Mount Targets.
        this.#gameArea = document.getElementById("game-area");
        this.#gameSidebar = document.getElementById("game-sidebar");
    }

    setUp() {}

    newGame(boardsize) {
        // Build and mount gameboards.
        this.#playerView = new GameboardView("player", boardsize);
        this.#computerView = new GameboardView("computer", boardsize);
        [this.#playerView, this.#computerView].forEach((board) =>
            board.mount(this.#gameArea),
        );

        // Build and mount log and menu.
        this.#logView = new LogView(boardsize);
        this.#menuView = new MenuView();

        this.#menuView.addSettingsButton(new ThemeButton());

        [(this.#logView, this.#menuView)].forEach((component) =>
            component.mount(this.#gameSidebar),
        );

        // Add buttons
    }

    // ---------- Log ----------
    logTurn(turn) {
        this.#logView.logTurn(turn);
        return this;
    }

    // ---------- Menu ----------
    addGameOption(button) {
        // this.#view.gameMenu.append(button);
    }

    addSetting(button) {
        this.#menuView.addSettingsButton(button);
    }

    // ---------- Helpers ----------
    makeButton() {}
}
