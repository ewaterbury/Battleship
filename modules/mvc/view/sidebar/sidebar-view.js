// Core Components
import Component from "./../view-component.js";
import MountPoint from "./../mount-point.js";

// Element Library, Event Library
import { EL } from "../../../constants.js";

// Sub-View Modules
import SettingsView from "./settings/settings-view.js";
import LogView from "./log/logger-view.js";

export default class SidebarView {
    // Controller
    #controller;

    // Mount Point (Needed to remove view).
    #sidebar;

    // Sub-View References
    #logView;

    constructor(controller) {
        // Save reference to controller.
        this.#controller = controller;

        // Build mount target.
        this.#sidebar = new MountPoint("sidebar-area");

        // |----- Sidebar ------|
        // Build log and settings.
        this.#logView = new LogView(controller);

        // Initialize settings.
        const settingsView = new SettingsView(
            this.#controller.audio.backingAudio,
            this.#controller.audio.gameEffects.hit,
            this.#controller.audio.gameEffects.miss,
            this.#controller.audio.gameEffects.sunk,
        );

        this.#sidebar.append(this.#logView);
        this.#sidebar.append(settingsView);

        this.#sidebar.mount(document.querySelector("#battleship"));
    }

    postLogEntry() {
        this.#logView.postLogEntry(
            this.#controller.state.previous,
            this.#controller.state.boardSize,
        );
    }
}
