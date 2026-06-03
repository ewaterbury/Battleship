// Core Components
import Component from "../view-component.js";

// Battleship Library, Element Library
import { CELL, EL } from "../../../constants.js";

// View Utilities Library
import ViewUtilities from "../view-utilities.js";

// Validation Library
import ValidationUtilities from "../../../validation-utilities.js";

export default class MessageComponent extends Component {
    constructor(turn, boardsize) {
        // |----- Validation -----|
        // Validate turn input.
        if (
            !(
                typeof turn === "object" &&
                Number.isInteger(turn.turn) &&
                typeof turn.attacker === "string" &&
                Number.isInteger(turn.cell) &&
                [CELL.HIT, CELL.MISS, CELL.SUNK].includes(turn.status) &&
                Number.isInteger(turn.shipSunk) &&
                turn.shipSunk >= 0
            )
        )
            throw new TypeError(`Invalid input. Input should be:
            turn {
                turn: turn number (int),
                attacker: attacker name (string),
                cell: cell attacked (int),
                status: status of attack (string),
                shipSunk: size of sunken ship (int, 0 if no ship sunk),
            }`);

        // Validate boardsize.
        if (!ValidationUtilities.isPositiveInt(boardsize))
            throw new TypeError("boardsize must be a postive integer");

        // Initialize container (p) using super constructor.
        super(EL.P);

        // |----- UI Construction -----|
        this.#buildMessage(turn, boardsize);
    }

    #buildMessage(turn, boardsize) {
        // Build message start.
        const player = ViewUtilities.capitalize(turn.attacker);
        const cell = ViewUtilities.getCellName(turn.cell, boardsize);

        const msgStart = new Component(EL.SPAN).setText(
            `Turn ${turn.turn}: ${player} attacked ${cell} [ `,
        );

        // Treat SUNK as HIT in the main attack message.
        const attackStatus = turn.status === CELL.MISS ? CELL.MISS : CELL.HIT;

        // Build message middle (separated for styling).
        const attack = new Component(EL.SPAN)
            .setText(attackStatus)
            .addClass(attackStatus);

        // Build message end.
        const msgEnd = new Component(EL.SPAN).setText(" ]");

        // Append message components.
        [msgStart, attack, msgEnd].forEach((component) =>
            this.append(component),
        );

        // Add sunk-ship notification if a ship was destroyed.
        if (turn.shipSunk > 0) {
            const shipSunk = new Component(EL.SPAN).setText(
                ` [ Size ${turn.shipSunk} ship sunk ]`,
            );

            this.append(shipSunk);
        }

        return this;
    }
}
