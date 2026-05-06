import { EL } from "../../../constants.js";
import Utils from "../view-utilities.js";
import Component from "../view-component.js";
import Message from "./message-component.js";

export default class LoggerView extends Component {
    #logList;

    constructor() {
        // Initialize 'root' using super constructor.
        super(EL.SECTION, "log-area");

        // Build and append log.
        this.#buildLog();
    }

    #buildLog() {
        // Build header.
        const header = new Component(EL.H3).setText("Log");

        // Build ordered list (Cached for repeat access).
        this.#logList = new Component(EL.OL);

        // Append header and log list.
        [header, this.#logList].forEach((component) => this.append(component));
    }

    logTurn(turn) {
        // Build log entry and append message to log item, then append entry to log list.
        this.#logList.append(new Component(EL.LI).append(new Message(turn)));

        return this;
    }

    clearLog() {
        this.#logList.element.replaceChildren();

        return this;
    }
}
