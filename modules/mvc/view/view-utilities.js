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

    static makeButton(textContent, id) {
        const button = document.createElement(EL.BUTTON);
        button.textContent = this.capitalize(textContent);
        button.id = id ? id : textContent.toLowerCase();
        return button;
    }
}
