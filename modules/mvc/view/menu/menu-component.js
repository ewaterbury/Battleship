import { EL } from "../../../constants.js";
import ViewComponent from "../view-component.js";

export default class MenuComponent extends ViewComponent {
    #validateButton;

    constructor(menuType) {
        // Initialize 'root' using super constructor.
        super(EL.MENU, `${menuType}_menu`);
    }

    append(element) {
        // Create li element as ViewComponent.
        const li = new ViewComponent(EL.LI);

        // Validate and append element into li.
        li.append(element);

        // Append li to menu.
        return super.append(li);
    }
}
