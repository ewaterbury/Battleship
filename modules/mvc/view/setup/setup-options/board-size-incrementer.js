// Core Components
import Component from "../../view-component.js";

// Elements Library
import { EL } from "../../../../constants.js";

export default class BoardSizeIncrementer extends Component {
    constructor() {
        // Initialize root element (li) using super constructor.
        super(EL.LI);

        // |----- UI Construction -----|
        const form = new Component(EL.FORM);

        const label = new Component(
            EL.LABEL,
            "", // Blank string to bypass ID.

            // Whitelisted attributes (for setAtrr/readAttr):
            "for",
        )
            .setText("Board Size:")
            .setAttr("for", "board-size-count");

        const shipCount = new Component(
            EL.INPUT,
            "board-size-count", // ship count ID.

            // Whitelisted attributes (for setAtrr/readAttr):
            "name",
            "type",
            "min",
            "max",
            "value",
        )
            .setText(10)
            .setAttr("name", "board-size-count")
            .setAttr("type", "number")

            .setAttr("min", 7) // Minimum board size.
            .setAttr("max", 12) // Minimum board size.
            .setAttr("value", 10); // Starting board size.

        [label, shipCount].forEach((component) => form.append(component));

        this.append(form);
    }

    #increment = () => {};

    #decrement = () => {};
}
