import { EL } from "../../../constants.js";
import Utils from "../view-utilities.js";
import Component from "../view-component.js";
import Log from "./log-component.js";

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
        this.#logList = new Log();

        // Append header and log list.
        [header, this.#logList].forEach((component) => this.append(component));
    }

    logTurn(turn, boardsize) {
        this.#logList.logTurn(turn);

        return this;
    }

    clearLog() {
        this.#logList.exposeRoot().replaceChildren();

        return this;
    }
}
