// Core Components
import ViewComponent from "../../view-component.js";

// Elements Library
import { EL } from "../../../../constants.js";

// Imported Components
import Ship from "./ship-component.js";

export default class ShipContainer extends ViewComponent {
    #ships;

    constructor(controller) {
        // Initialize root element (section) and assign ID using super constructor.
        super(EL.SECTION, "ship-container-area");

        // |----- UI Construction -----|
        for (const ship of Object.values(controller.fleetTemplate)) {
            for (let i = 0; i < ship.count; i++) this.append(new Ship(ship, i));
        }
    }
}
