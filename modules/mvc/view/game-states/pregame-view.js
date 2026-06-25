// Core Components
import Component from "./../view-component.js";
import MountPoint from "./../mount-point.js";

// Element Library, Event Library
import { EL, EVENT } from "../../../constants.js";

// Import Components
import SetupOptions from "../setup/setup-options/setup-options-component.js";
import PlacementBoard from "../setup/placement-board/placement-board-component.js";
import ShipContainer from "../setup/ship-container/ship-container-component.js";

// UI Layout Modules
import { cellSizeObserver } from "../UI-layout/cell-size-observer.js";

// Top level view that displays game UI.
export default class PreGameView {
    // Controller
    #controller;

    // Mount Point (Needed to remove view)
    #setupArea;
    #options;
    #ships;
    #board;

    // Sub-View References
    #logView;

    constructor(controller) {
        // Save reference to controller.
        this.#controller = controller;

        // Initialize mount point and components.
        this.#setupArea = new MountPoint("setup-area");
        this.#options = new SetupOptions(controller);
        this.#ships = new ShipContainer(controller);
        this.#board = new PlacementBoard(controller);

        // ----- Construct UI -----|
        [this.#options, this.#ships, this.#board].forEach((component) =>
            this.#setupArea.append(component),
        );

        this.#setupArea.mount(
            controller.document.querySelector("header"),
            "after",
        );
        // Adds ResizeObserver to first placement-board-cell element to set cell size for ships in ship container.
        cellSizeObserver(document.getElementById("placement-1"));

        // |----- Behavior -----|
        document.addEventListener(EVENT.KEYDOWN, this.#rotateOnR);
    }

    remove() {
        // Remove global event listeners.
        document.removeEventListener(EVENT.KEYDOWN, this.#rotateOnR);

        // Remove mount point.
        this.#setupArea.remove();
    }

    // |----- Placing Ships -----|
    #rotateOnR = (event) => {
        if (event.key === "r" || event.key === "R")
            this.#controller.toggleOrientation();
    };
}
