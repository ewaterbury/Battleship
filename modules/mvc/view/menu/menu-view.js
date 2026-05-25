import { EL } from "../../../constants.js";
import VU from "../view-utilities.js";
import ViewComponent from "../view-component.js";
import Menu from "./menu-component.js";

export default class MenuView extends ViewComponent {
    #gameOptions;
    #settings;

    constructor() {
        // Initialize 'root' using super constructor.
        super(EL.DIV, "menu-area");

        // Build game and settings menu.
        this.gameOptions = this.#buildMenu("game", "Game Menu:");
        this.settings = this.#buildMenu("settings", "Settings Menu:");
    }

    #buildMenu(menuType, menuHead) {
        const menuContainer = new ViewComponent(EL.DIV).append(
            new ViewComponent(EL.H3).setText(menuHead),
        );

        const menu = new Menu(menuType);

        this.append(menuContainer.append(menu));

        return menu;
    }
}
