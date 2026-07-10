// Core Components
import Component from "../../view-component.js";

// Element Library
import { EL } from "../../../../constants.js";

// Imported Components
import Log from "./log-component.js";

export default class LoggerView extends Component {
    #logList;

    constructor() {
        // Initialize container (section) and assign ID using super constructor.
        super(EL.SECTION, "log-area");

        // |----- UI Construction -----|
        const header = new Component(EL.H2).setText("Log");
        this.#logList = new Log();
        [header, this.#logList].forEach((component) => this.append(component));
    }

    postLogEntry(turn, boardsize) {
        this.#logList.logTurn(turn, boardsize);

        return this;
    }

    clearLog() {
        // Clear all log entries from DOM
        this.#logList.exposeRoot().replaceChildren();

        return this;
    }
}
