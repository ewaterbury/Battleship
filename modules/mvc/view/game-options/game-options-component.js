import Component from "../view-component.js";
import ChooseForMe from "./choose-for-me-option-component.js";
import ForfeitOption from "./forfeit-option-component.js";
import { EL } from "../../../constants.js";

export default class GameOptions extends Component {
    constructor() {
        // Initialize root element (section) using super constructor.
        super(EL.SECTION, "game-options-area");

        const options = new Component(EL.MENU, "game-options-menu");

        options.append(new ChooseForMe()).append(new ForfeitOption());

        this.append(options);
    }
}
