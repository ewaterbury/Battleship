import Component from "../../view-component.js";
import ThemeToggle from "./theme-toggle.js";
import { EL } from "../../../../constants.js";

export default class ThemeSetting extends Component {
    constructor() {
        super(EL.LI);
        this.append(new Component(EL.H3).setText("Toggle Theme:"));
        this.append(new ThemeToggle());
    }
}
