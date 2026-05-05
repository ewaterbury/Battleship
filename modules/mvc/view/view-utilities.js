import { EL } from "../../constants.js";

export default class ViewUtilities {
    // Capitalize the first letter of a string.
    static capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Convert cell to battleship-style pattern (e.g., 4 -> A4, 21 -> B1)
    static getCellName(cell, boardsize) {
        const A_CHAR = 65;
        const row = Math.floor(cell / boardsize);
        const col = cell % boardsize ? cell % boardsize : boardsize;
        return String.fromCharCode(A_CHAR + row) + col;
    }

    // Sample el object:
    // el = {
    //  type: element type,
    //  id: element id,
    //  text: element text,
    //  classList: list of element classes (string or array)
    // }

    static makeElement(el) {
        // Validate input is object.
        if (!el || typeof el !== "object")
            throw new TypeError("Argument must be object");

        // Validate type is a string.
        if (typeof el.type !== "string" || el.type.trim() === "")
            throw new TypeError("Element type must be non-empty string");

        // Create and element.
        const element = document.createElement(el.type.toLowerCase());

        // If id, validate and add to element.
        if (el.id !== undefined) {
            if (typeof el.id !== "string")
                throw new TypeError("ID must be a string");
            element.id = el.id;
        }

        // If text, validate and add to element.
        if (el.text !== undefined) {
            if (!(typeof el.text === "string" || typeof el.text === "number"))
                throw new TypeError("Text must be a string or number");
            element.textContent = el.text;
        }

        // If classList, validate and add to element.
        if (el.classList !== undefined) {
            if (typeof el.classList === "string")
                element.classList.add(
                    ...el.classList.split(" ").filter(Boolean),
                );
            else if (Array.isArray(el.classList)) {
                for (const cls of el.classList)
                    if (typeof cls !== "string")
                        throw new TypeError("Classes must be strings");
                element.classList.add(...el.classList);
            } else throw new TypeError("ClassList must be string or array");
        }

        return element;
    }
}
