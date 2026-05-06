import { EL } from "../../../constants.js";
import ViewComponent from "../view-component.js";

export default class MenuComponent extends ViewComponent {
    #validateButton;

    constructor(menuType) {
        // Initialize 'root' using super constructor.
        super(EL.MENU, `${menuType}_menu`);

        // Validation for adding buttons.
        this.#validateButton = (element) => {
            const isButton =
                element.tagName === "BUTTON" ||
                (element.tagName === "INPUT" &&
                    ["button", "submit", "reset"].includes(
                        element.getAttribute("type"),
                    ));

            if (!isButton)
                throw new TypeError(
                    "Only buttons can be appened to menu element",
                );
        };
    }

    append(button) {
        // Create li element as ViewComponent.
        const li = new ViewComponent(EL.LI);

        // Validate and append button into li.
        li.append(button, this.#validateButton);

        // Append li to menu.
        return super.append(li);
    }

    appendAll(buttonList) {
        buttonList.forEach((button) => this.append(button));
        return this;
    }
}
