// Core Components
import Component from "../view-component.js";

// Element Library
import { EL } from "../../../constants.js";

// Imported Components
import Message from "./message-component.js";

export default class Log extends Component {
    constructor() {
        // Initialize container (ol) using super constructor.
        super(EL.OL);
    }

    logTurn(turn, boardsize) {
        // Append turn message to log.
        this.append(new Component(EL.LI).append(new Message(turn, boardsize)));

        // Scroll log to latest entry.
        this.#scrollToLatest({
            top: this.readProp("scrollHeight"),
            behavior: "smooth",
        });
    }

    #scrollToLatest(options) {
        // Validate scroll options object.
        if (!options || typeof options !== "object")
            throw new TypeError("Options must be an object");

        // Call scrollTo method on element.
        this.element.scrollTo(options);
    }
}
