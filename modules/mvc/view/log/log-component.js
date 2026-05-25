import { EL } from "../../../constants.js";
import Utils from "../view-utilities.js";
import Component from "../view-component.js";
import Message from "./message-component.js";

export default class Log extends Component {
    constructor() {
        // Initialize 'root' using super constructor.
        super(EL.OL);
    }

    logTurn(turn, boardsize) {
        // Build log entry and append message to log item, then append entry to log list.
        this.append(new Component(EL.LI).append(new Message(turn, boardsize)));

        // Autoscroll to new entry.
        this.#scrollTo({
            top: this.readProp("scrollHeight"),
            behavior: "smooth",
        });
    }

    #scrollTo(options) {
        // Confirm that input is object.
        if (!options || typeof options !== "object")
            throw new TypeError("Options must be an object");

        // Call scrollTo method on element.
        this.element.scrollTo(options);
    }
}
