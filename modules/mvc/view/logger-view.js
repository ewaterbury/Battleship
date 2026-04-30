import { EL } from "../../constants.js";

export default class LoggerView {
    #parentSelector;
    #id;

    constructor(parentSelector) {
        this.#parentSelector = parentSelector;
        this.#id = "log-area";
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

    delete() {
        document.getElementById(this.#id).remove();
    }
}
