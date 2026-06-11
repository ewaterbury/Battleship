// Core Components
import MountPoint from "../mount-point.js";

// Elements Library
import { EL, DEFAULT_VALUES } from "../../../constants.js";

// Import components.
import SetupOptions from "./setup-options/setup-options.js";
import PlacementBoard from "./placement-board/placement-board-component.js";
import ShipContainer from "./ship-container.js";

export default class SetupView extends MountPoint {
    constructor(controller) {
        // Initialize container (section - mountable) and assign ID using super constructor.
        super("setup-area");

        // |----- Construct UI -----|
        this.append(new SetupOptions(controller));
        // this.append(new ShipContainer());
        this.append(new PlacementBoard(controller));
    }
}
