// Core Components
import ViewComponent from "../view-component.js";

// Elements Library
import { EL } from "../../../constants.js";

// Imported Components
import Gameboard from "./gameboard-component.js";

export default class PlayerBoard extends ViewComponent {
    constructor(controller) {
        // Initialize container (section) and assign ID using super constructor.
        super(EL.SECTION, "gameboard-area");

        // |----- UI Construction -----|
        this.player = new Gameboard("player", controller);
        this.computer = new Gameboard("computer", controller);

        this.append(this.player).append(this.computer);
    }
}
