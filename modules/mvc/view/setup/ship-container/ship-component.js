// Core Components
import ViewComponent from "../../view-component.js";

// Elements Library
import { EL } from "../../../../constants.js";

export default class Ship extends ViewComponent {
    #controller;

    constructor(controller, ship) {
        // Initialize root element (div), assign ID, and add class using super constructor.
        super(EL.DIV, `${ship.type}-${ship.id}`, "dataset").addClass("ship");

        this.#controller = controller;

        // Add values to ship element.
        this.addDataset("type", ship.type)
            .addDataset("size", ship.size)
            .addDataset("countId", ship.id);

        if (ship.selected) this.addClass("selected");

        for (let i = 0; i < ship.size; i++)
            this.append(
                new ViewComponent(EL.DIV, "", "dataset").addDataset(
                    "shipIndex",
                    i,
                ),
            );

        this.on("click", this.selectShip);
    }

    selectShip = () => {
        const data = this.readProp("dataset");

        this.#controller.selectShip({
            type: data.type,
            size: Number(data.size),
            id: Number(data.countId),
        });
    };
}
