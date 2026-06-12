// Core Components
import ViewComponent from "../../view-component.js";

// Elements Library
import { EL } from "../../../../constants.js";

export default class Ship extends ViewComponent {
    constructor(ship, count) {
        super(EL.DIV, `${ship.type}-${count}`, "draggable");

        this.setAttr("draggable", true);

        for (let i = 0; i < ship.size; i++)
            this.append(new ViewComponent(EL.DIV));
    }
}
