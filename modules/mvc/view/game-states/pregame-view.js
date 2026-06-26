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

    // Sub-View References
    #logView;

    constructor(controller) {
        // Save reference to controller.
        this.#controller = controller;

        // Initialize mount point and mount on DOM.
        this.#window = new MountPoint("setup-area").mount(
            controller.document.querySelector("header"),
            "after",
        );

        this.#buildView();

        // |----- Behavior -----|
        controller.document.addEventListener(EVENT.KEYDOWN, this.#rotateOnR);
    }

    #getComponents() {
        return [this.#options, this.#ships, this.#board];
    }

    #buildView() {
        this.#options = new SetupOptions(this.#controller);
        this.#ships = new ShipContainer(this.#controller);
        this.#board = new PlacementBoard(this.#controller);

        this.#getComponents().forEach((component) =>
            this.#window.append(component),
        );

        // Adds resizeObserver to first placement-board cell element.
        cellSizeObserver(
            this.#controller.document.getElementById("placement-1"),
        );
    }

    #refreshView() {
        this.#getComponents().forEach((component) => component.remove());
        this.#buildView();
    }

    #refreshOptions() {
        this.#options.remove();
        this.#options = new SetupOptions(this.#controller);
        this.#window.element.prepend(this.#options.element);
    }

    #refreshBoard() {
        this.#board.remove();
        this.#board = new PlacementBoard(this.#controller);
        this.#window.append(this.#board);

        // Adds resizeObserver to first placement-board cell element.
        cellSizeObserver(
            this.#controller.document.getElementById("placement-1"),
        );
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

        if (fleetUpdated === true) this.#refreshView();
        else this.#refreshBoard();
    }

    // Event Listener Callbacks
    // Listerners attached to global document must be removed on tear down.
    // |----- Placing Ships -----|
    #rotateOnR = (event) => {
        if (event.key === "r" || event.key === "R")
            this.#controller.toggleOrientation();
    };
}
