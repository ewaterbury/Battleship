// Core Components
import Component from "../../../view-component.js";

// Elements Library
import { EL } from "../../../../../constants.js";

// Imported Components
import ShipIncrementer from "./ship-incrementer-component.js"; // Menu item to specify ship count for a ship type.

export default class FleetComposer extends Component {
    constructor(controller) {
        // Initialize root element (li) and assign ID using super constructor.
        super(EL.LI, `fleet-incrementer`);

        // |----- UI Construction -----|
        const form = new Component(EL.FORM);
        const legend = new Component(EL.LEGEND).setText("Fleet Composition:");
        const shipList = new Component(EL.UL);

        // Add instance of ShipIncrementer for each ship.
        Object.values(controller.fleetTemplate).forEach((ship) =>
            shipList.append(new ShipIncrementer(controller, ship)),
        );

        [legend, shipList].forEach((component) => form.append(component));

        this.append(form);
    }
}
