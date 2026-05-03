import { EL } from "../../constants.js";
import Utils from "./view-utilities.js";
import ViewComponent from "./view-component.js";

export default class LoggerView extends ViewComponent {
    #logList;

    constructor() {
        // Initialize 'root' using super constructor.
        super(EL.SECTION, "log-area");

        // Build and append log.
        this.#buildLog();
    }

    #buildLog() {
        // Build header.
        const header = document.createElement(EL.H3);
        header.textContent = "Log:";

        // Build ordered list (Cached for repeat access).
        this.#logList = document.createElement(EL.OL);
        this.appendAll(header, this.#logList);
    }

    logTurn(turn) {
        // Build log entry.
        const entry = document.createElement(EL.LI);

        // Build log message.
        const message = document.createElement(EL.P);

        // Build message start.
        const msgStart = document.createElement(EL.SPAN);
        msgStart.textContent = `Turn ${turn.num}: ${Utils.capitalize(turn.player)} attacked ${Utils.getCellName(turn.cell, turn.boardsize)} [ `;

        // Build message middle (Separated for styling).
        const hitStatus = document.createElement(EL.SPAN);
        const hitType =
            turn.status === "hit" || turn.status === "sunk" ? "hit" : "miss";
        hitStatus.textContent = hitType;
        hitStatus.classList.add(hitType);

        // Build message end.
        const msgEnd = document.createElement(EL.SPAN);
        msgEnd.textContent = " ]";

        // Append message components.
        message.append(msgStart, hitStatus, msgEnd);

        // If ship was sunk, add too message and append.
        if (turn.shipSunk) {
            const shipSunk = document.createElement(EL.SPAN);
            shipSunk.textContent = ` [ Size ${turn.shipSunk} ship sunk ]`;
            message.append(shipSunk);
        }

        // Append message to log item.
        entry.append(message);

        // Append entry to log list.
        this.#logList.append(entry);

        return this;
    }

    clearLog() {
        this.#logList.replaceChildren();
    }
}
