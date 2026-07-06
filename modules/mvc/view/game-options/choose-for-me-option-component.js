import Component from "../view-component.js";
import Button from "../button.js";
import { EL } from "../../../constants.js";

export default class ChooseForMe extends Component {
    constructor() {
        // Initialize root element (section) using super constructor.
        super(EL.LI, "choose-for-me");

        this.append(
            new Button("choose-for-me-button", this.#attackForMe).setText(
                "Attack For Me",
            ),
        );
    }

    #attackForMe = () => {};
}
