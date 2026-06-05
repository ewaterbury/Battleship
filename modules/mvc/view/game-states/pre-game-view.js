// Core Components
import Component from "./../view-component.js";
import MountPoint from "./../mount-point.js";

// Element Library
import { EL } from "../../../constants.js";

// Sub-View Modules
import SetupView from "./../setup/setup-view.js";

// Top level view that displays game UI.
export default class PreGameView {
    // Controller
    #controller;

    // Mount Points (Needed to remove view)
    #setupArea;
    #sidebar;

    constructor(controller) {
        // Save reference to controller.
        this.#controller = controller;

        // Build mount targets.
        this.#setupArea = new MountPoint("setup-area");
        this.#sidebar = new MountPoint("sidebar-area");

        // |----- Setup Area ------|
        this.#setupArea.append(new SetupView(controller));

        // |----- Sidebar ------|
        // This will hold settings menu.

        this.#setupArea.mount(document.querySelector("#battleship"));
    }

    removeView() {
        this.#setupArea.remove();
        this.#sidebar.remove();
    }

    // |----- Audio Methods -----|
}
