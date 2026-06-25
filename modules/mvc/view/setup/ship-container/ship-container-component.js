// Core Components
import ViewComponent from "../../view-component.js";

// Elements Library
import { EL } from "../../../../constants.js";

// Imported Components
import Ship from "./ship-component.js";

export default class ShipContainer extends ViewComponent {
    #container;
    #ships = [];
    #controller;

    constructor(controller) {
        // Initialize root element (section) and assign ID using super constructor.
        super(EL.SECTION, "ship-container-area");

        this.#controller = controller;

        // |----- UI Construction -----|
        this.append(new ViewComponent(EL.H2).setText("Fleet:"));

        this.#container = new ViewComponent(EL.DIV);

        for (const ship of Object.values(controller.placementFleet))
            this.#ships.push(new Ship(controller, ship));

        this.#ships.forEach((ship) => {
            this.#container.append(ship);
        });

        this.append(this.#container);
    }
}
