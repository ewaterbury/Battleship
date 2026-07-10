// Core Components
import ViewComponent from "../../view-component.js";

// Elements Library
import { EL } from "../../../../constants.js";

// Import Components.
import BoardSizeIncrementer from "./board-size-incrementer-component.js"; // Menu item to specify board size.
import FleetComposer from "./fleet-composer/fleet-composer-component.js"; // Submenu to specfiy fleet composition.
import DefaultSettings from "./default-settings-component.js";

export default class SetupOptions extends ViewComponent {
    constructor(controller) {
        // Initialize root element (section) and assign ID using super constructor.
        super(EL.SECTION, "setup-options-area");

        // |----- UI Construction -----|
        // Contoller is passed to relevant components during initialization.
        this.append(new ViewComponent(EL.H2).setText("Setup Options:"));

        const menu = new ViewComponent(EL.MENU);

        menu.append(new BoardSizeIncrementer(controller))
            .append(new FleetComposer(controller))
            .append(new DefaultSettings(controller));

        this.append(menu);
    }

    #resetSetup = () => {};
}
