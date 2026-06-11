// Core Components
import Component from "../../view-component.js";

// Elements Library
import { EL } from "../../../../constants.js";

// Import components.
import BoardSizeIncrementer from "./board-size-incrementer.js"; // Menu item to specify board size.
import FleetComposer from "./fleet-comp/fleet-comp.js"; // Submenu to specfiy fleet composition.
import Button from "../../button.js"; // Button used to reset fleet size and board size to default.

export default class SetupOptions extends Component {
    constructor(controller) {
        // Initialize root element (section) and assign ID using super constructor.
        super(EL.SECTION, "setup-options-area");

        // |----- UI Construction -----|
        // Contoller is passed to relevant components during initialization.
        this.append(new Component(EL.H2).setText("Setup Options:"));
        this.append(new BoardSizeIncrementer(controller));
        this.append(new FleetComposer(controller));
        this.append(
            new Button().setText("Reset Game Options"),
            this.#resetSetup,
        );
    }

    #resetSetup = () => {};
}
