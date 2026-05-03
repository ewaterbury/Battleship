import { EL } from "../../constants.js";
import Utils from "./view-utilities.js";
import ViewComponent from "./view-component.js";

export default class LoggerView extends ViewComponent {
    #logList;

    constructor(parentSelector) {
        // Initialize 'root' using super constructor.
        super(EL.SECTION, "log-area");

        // Build and append log.
        this.#addGameLog(parentSelector);
    }

    #addGameLog(parentSelector) {
        // Header.
        const header = document.createElement(EL.H3);
        header.textContent = "Log:";

        // Ordered list (Cached for repeat access).
        this.#logList = document.createElement(EL.OL);
        this.appendAll(header, this.#logList);

        this.mount(parentSelector);
    }

    logTurn(summary) {
        // Log Entry
        const entry = document.createElement(EL.LI);

        // Message
        const message = document.createElement(EL.P);

        const msgStart = document.createElement(EL.SPAN);
        msgStart.textContent = `Turn ${summary.turn}: ${Utils.capitalize(summary.player)} attacked ${Utils.getCellName(summary.cell, summary.boardsize)} [ `;

        const hitStatus = document.createElement(EL.SPAN);
        const hitType =
            summary.status === "hit" || summary.status === "sunk"
                ? "hit"
                : "miss";
        hitStatus.textContent = hitType;
        hitStatus.classList.add(hitType);

        const msgEnd = document.createElement(EL.SPAN);
        msgEnd.textContent = " ]";
        message.append(msgStart, hitStatus, msgEnd);

        if (summary.shipSunk) {
            const shipSunk = document.createElement(EL.SPAN);
            shipSunk.textContent = ` [ Size ${summary.shipSunk} ship sunk ]`;
            message.append(shipSunk);
        }

        entry.append(message);
        this.#logList.append(entry);
    }

    clearLog() {
        this.#logList.replaceChildren();
    }
}
