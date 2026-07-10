// Core Components
import ViewComponent from "../../view-component.js";

// Elements Library
import { EL } from "../../../../constants.js";

// Imported Components
import Ship from "./ship-component.js";
import Button from "../../button.js";

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

        this.#container = new ViewComponent(EL.DIV).addClass("ship-container");

        for (const ship of Object.values(controller.state.placementFleet))
            this.#ships.push(new Ship(controller, ship));

        this.#ships.forEach((ship) => {
            this.#container.append(ship);
        });

        const autoPlaceButton = new Button(
            "auto-place-ships",
            this.#autoPlaceShips,
        ).setText("Place Ships For Me");

        const rotateButton = new Button(
            "rotate-ships",
            this.#rotateOnClick,
        ).setText("🔄");

        [this.#container, autoPlaceButton, rotateButton].forEach((component) =>
            this.append(component),
        );
    }

    #autoPlaceShips = () => {
        this.#controller.autoPlaceShips();
    };

    #rotateOnClick = () => {
        this.#controller.toggleOrientation();
    };
}
