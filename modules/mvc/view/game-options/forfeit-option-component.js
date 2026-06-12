import Component from "../view-component.js";
import Button from "../button.js";
import { EL } from "../../../constants.js";

export default class ForfeitOption extends Component {
    constructor() {
        // Initialize root element (section) using super constructor.
        super(EL.LI, "surrender");

        this.append(
            new Button("surrender-button", this.#myCallback()).setText(
                "Surrender",
            ),
        );
    }

    #myCallback = () => {};
}
