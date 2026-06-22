// Core Components
import Component from "./../view-component.js";
import MountPoint from "./../mount-point.js";

// Element Library
import { EL } from "../../../constants.js";

// Sub-View Modules
import SetupView from "./../setup/setup-view.js";
import SettingsView from "./../settings/settings-view.js";
import LogView from "./../log/logger-view.js";

// Functions
import { cellSizeObserver } from "../setup/placement-board/cell-size-observer.js";

// Top level view that displays game UI.
export default class PreGameView {
    // Controller
    #controller;

    // Mount Points (Needed to remove view)
    #setupArea;
    #sidebar;

    // Sub-View References
    #logView;

    constructor(controller) {
        // Save reference to controller.
        this.#controller = controller;

        // Build mount targets.
        this.#setupArea = new SetupView(controller);
        this.#sidebar = new MountPoint("sidebar-area");

        // |----- Sidebar ------|
        // Build log and settings.
        this.#logView = new LogView(controller);

        // Initialize settings.
        const settingsView = new SettingsView(
            this.#controller.backingAudio,
            this.#controller.gameEffects.hit,
            this.#controller.gameEffects.miss,
            this.#controller.gameEffects.sunk,
        );

        this.#sidebar.append(this.#logView);
        this.#sidebar.append(settingsView);

        this.#setupArea.mount(
            document.querySelector("#battleship header"),
            "after",
        );

        // Adds ResizeObserver to first placement-board-cell element to set cell size for ships in ship container.
        cellSizeObserver(document.getElementById("placement-1"));

        this.#sidebar.mount(
            document.querySelector("#battleship #setup-area"),
            "after",
        );
    }

    remove() {
        this.#setupArea.remove();
        this.#sidebar.remove();
    }

    // |----- Placing Ships -----|
    selectShip() {}
}
