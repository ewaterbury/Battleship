import Component from "../view-component.js";
import { EL } from "../../../constants.js";

export default class Button extends Component {
    constructor(id, callback) {
        super(EL.BUTTON, id);
        this.element.addEventListener("click", (e) => {
            callback(e);
        });
    }
}
