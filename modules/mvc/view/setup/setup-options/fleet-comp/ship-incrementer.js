// Core Components
import Component from "../../../view-component.js";

// Elements Library
import { EL } from "../../../../../constants.js";

export default class ShipIncrementer extends Component {
    constructor(size, name, startingCount) {
        // Initialize root element (li) and assign ID using super constructor.
        super(EL.LI, `${name}-incrementer`);

        // |----- UI Construction -----|
        const label = new Component(
            EL.LABEL,
            "", // Empty string to bypass ID.

            // Whitelisted attributes (for setAtrr/readAttr):
            "for",
        )
            .setText(name + ":")
            .setAttr("for", name);

        const shipCount = new Component(
            EL.INPUT,
            `${name}-count`,

            // Whitelisted attributes (for setAtrr/readAttr):
            "name",
            "type",
            "min",
            "value",
        )
            .setAttr("name", name)
            .setAttr("type", "number")
            .setAttr("min", 0)
            .setAttr("value", startingCount);

        [label, shipCount].forEach((component) => this.append(component));
    }

    #increment = () => {};

    #decrement = () => {};
}
