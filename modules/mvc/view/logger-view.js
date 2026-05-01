import { EL } from "../../constants.js";
import Utils from "./view-utilities.js";

export default class LoggerView {
    #id;
    #root;
    #logList;

    constructor(parentSelector) {
        this.#id = "log-area";
        this.#addGameLog(parentSelector);
    }

    #addGameLog(parentSelector) {
        // Log container.
        this.#root = document.createElement(EL.SECTION);
        this.#root.id = this.#id;

        // Header.
        const header = document.createElement(EL.H3);
        header.textContent = "Log:";

        // Ordered list (Cached for repeated access).
        this.#logList = document.createElement(EL.OL);
        this.#root.append(header, this.#logList);

        const parent = document.querySelector(parentSelector);

        if (!parent) {
            throw new Error(`Parent selector "${parentSelector}" not found`);
        }

        parent.after(this.#root);
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

    remove() {
        this.#root.remove();
    }
}
