// Core Components
import Component from "../../../view-component.js";

// Elements Library
import { EL } from "../../../../../constants.js";

// Imported Components
import ShipIncrementer from "./ship-incrementer.js"; // Menu item to specify ship count for a ship type.

export default class FleetComp extends Component {
    constructor() {
        // Initialize root element (li) and assign ID using super constructor.
        super(EL.LI, `fleet-incrementer`);

        // |----- UI Construction -----|
        const form = new Component(EL.FORM);
        const legend = new Component(EL.LEGEND).setText("Fleet Composition:");
        const shipList = new Component(EL.MENU);

        // Add instance of ShipIncrementer for each ship.
        [
            { type: "Carrier", size: 5, count: 1 },
            { type: "Battleship", size: 4, count: 1 },
            { type: "Cruiser", size: 3, count: 2 },
            { type: "Destroyer", size: 5, count: 1 },
        ].forEach((ship) => {
            shipList.append(
                new ShipIncrementer(ship.size, ship.type, ship.count),
            );
        });

        [form, legend, shipList].forEach((compnent) => this.append(compnent));
    }
}
