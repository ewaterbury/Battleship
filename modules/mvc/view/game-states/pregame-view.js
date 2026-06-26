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
    #window;
    #options;
    #ships;
    #board;

    // Array of all components in apped order.
    #componentsList;

    // Sub-View References
    #logView;

    constructor(controller) {
        // Save reference to controller.
        this.#controller = controller;

        // Initialize mount point and components.
        this.#window = new MountPoint("setup-area");
        this.#options = new SetupOptions(controller);
        this.#ships = new ShipContainer(controller);
        this.#board = new PlacementBoard(controller);

        this.#componentsList = [this.#options, this.#ships, this.#board];

        // ----- Construct UI -----|
        this.#componentsList.forEach((component) => {
            this.#window.append(component);
        });

        this.#window.mount(
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
        this.#controller.document.removeEventListener(
            EVENT.KEYDOWN,
            this.#rotateOnR,
        );

        // Remove mount point.
        this.#window.remove();
    }

    updateBoardSize(fleetUpdated) {
        const controller = this.#controller;

        if (fleetUpdated) {
            // Remove compnents.
            this.#componentsList.forEach((component) => component.remove());

            this.#options = new SetupOptions(controller);
            this.#ships = new ShipContainer(controller);
            this.#board = new PlacementBoard(controller);
        }

        this.#componentsList.forEach((component) =>
            this.#window.append(component),
        );
    }

    // Event Listener Callbacks
    // Listerners attached to global document must be removed on tear down.
    // |----- Placing Ships -----|
    #rotateOnR = (event) => {
        if (event.key === "r" || event.key === "R")
            this.#controller.toggleOrientation();
    };
}
