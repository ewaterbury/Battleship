import { EL } from "../../constants.js";
import Utils from "./view-utilities.js";

export default class LoggerView {
    #parentSelector;
    #id;

    constructor(parentSelector) {
        this.#parentSelector = parentSelector;
        this.#id = "log-area";
        this.#log = null;
        this.#addGameLog();
    }

    #addGameLog() {
        // Log container.
        const container = document.createElement(EL.SECTION);
        container.id = this.#id;

        // Header.
        const header = document.createElement(EL.H3);
        header.textContent = "Log:";

        // Ordered list.
        const log = document.createElement(EL.OL);
        container.append(header, log);
        document.querySelector(this.#parentSelector).after(container);
    }

    logTurn(summary) {
        // Log Entry
        const entry = document.createElement("li");

        // Message
        const message = document.createElement("p");
        const msgStart = document.createElement("span");
        msgStart.textContent = `Turn ${summary.turn}: ${Utils.capitalize(summary.player)} attacked  ${Utils.getCellName(summary.cell, summary.boardsize)} [ `;
        const hitStatus = document.createElement("span");
        const hitType =
            summary.status === "hit" || summary.status === "sunk"
                ? "hit"
                : "miss";
        hitStatus.textContent = hitType;
        hitStatus.classList.add(hitType);
        const msgEnd = document.createElement("span");
        msgEnd.textContent = " ]";
        message.append(msgStart, hitStatus, msgEnd);

        if (summary.shipSunk) {
            const shipSunk = document.createElement("span");
            shipSunk.textContent = ` [ Size ${summary.shipSunk} ship sunk ]`;
            message.append(shipSunk);
        }

        entry.append(message);
        document.querySelector("#log-area ol").append(entry);
    }

    delete() {
        document.getElementById(this.#id).remove();
    }
}
