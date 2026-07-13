import ViewComponent from "../../../view-component.js";
import ForfeitOption from "./forfeit-option-component.js";
import { EL } from "../../../../../constants.js";

import ViewUtilities from "../../../view-utilities.js";

export default class TurnPanel extends ViewComponent {
    #controller;
    #menu;

    constructor(controller) {
        // Initialize root element (section) and assign ID using super constructor.
        super(EL.SECTION, "turn-panel-area");
        this.#controller = controller;

        this.append(this.#buildMenu());
    }

    #buildMenu() {
        // Remove existing menu.
        if (this.#menu) this.#menu.remove();

        const state = this.#controller.state;

        this.#menu = new ViewComponent(EL.MENU);

        const attacker = new ViewComponent(EL.LI).setText(
            `Attacker: ${ViewUtilities.capitalize(state.attacker)}`,
        );
        const turn = new ViewComponent(EL.LI).setText(`Turn: ${state.turn}`);
        const surrender = new ViewComponent(EL.LI).append(new ForfeitOption());

        [attacker, turn, surrender].forEach((component) =>
            this.#menu.append(component),
        );

        return this.#menu;
    }

    update() {
        this.append(this.#buildMenu());
    }
}
