// Core Components
import ViewComponent from "../../../view-component.js";

// Element Library
import { EL } from "../../../../../constants.js";

// Imported Components
import ThemeToggle from "./theme-toggle.js"; // Toggle button for changing page theme.

export default class ThemeSetting extends ViewComponent {
    constructor() {
        // Initialize container (li) using super constructor.
        super(EL.LI);

        // |----- UI Construction -----|
        this.append(new ViewComponent(EL.H3).setText("Toggle Theme:"));
        this.append(new ThemeToggle());
    }
}
