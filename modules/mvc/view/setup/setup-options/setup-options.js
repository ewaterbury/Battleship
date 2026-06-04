// Core Components
import Component from "../../view-component.js";

// Elements Library
import { EL } from "../../../../constants.js";

// Import components.
import BoardSizeIncrementer from "./board-size-incrementer.js"; // Menu item to specify board size.
import FleetComp from "./fleet-comp/fleet-comp.js"; // Submenu to specfiy fleet composition.

export default class SetupOptions extends Component {
    constructor(backgroundAudio, ...gameAudio) {
        // Initialize root element (section) and assign ID using super constructor.
        super(EL.SECTION, "setup-options-area");

        // |----- UI Construction -----|
        this.append(new Component(EL.H2).setText("Customize Options:"));
        this.append(new BoardSizeIncrementer());
        this.append(new FleetComp());
    }
}
