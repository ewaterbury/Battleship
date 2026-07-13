import ViewComponent from "../../../view-component.js";
import Button from "../../../button.js";
import { EL } from "../../../../../constants.js";

export default class ForfeitOption extends ViewComponent {
    #controller;

    constructor(controller) {
        // Initialize root element (section) using super constructor.
        super(EL.LI, "surrender");

        this.#controller = controller;

        this.append(
            new Button("surrender-button", this.#surrender).setText(
                "Surrender",
            ),
        );
    }

    #surrender = () => {
        this.#controller.surrender();
    };
}
