// Core Components
import Component from "../../view-component.js";

// Elements Library
import { EL } from "../../../../constants.js";

// Import components.
import BoardsizeIncrementer from "./boardsize.js"; // Incrementer input to set boardsize.
import FleetComp from "./fleet-comp/fleet-comp.js"; // Menu to specfiy fleet composition.

export default class SetupOptions extends Component {
    constructor(backgroundAudio, ...gameAudio) {
        // Initialize root element (section) and assign ID using super constructor.
        super(EL.SECTION, "setup-options-area");

        // |----- UI Construction -----|
        this.append(new Component(EL.H2).setText("Customize Options:"));
        this.append(new BoardsizeIncrementer());
        this.append(new FleetComp());
    }
}
