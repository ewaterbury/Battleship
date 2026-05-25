import { CELL, EL } from "../../../constants.js";
import Utils from "../view-utilities.js";
import ViewComponent from "../view-component.js";

export default class MessageComponent extends ViewComponent {
    constructor(turn, boardsize) {
        // Validate input.
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
                boardsize: size of gameboard (int),
            }`);

        // Initialize 'root' using super constructor.
        super(EL.P);

        // Build and append log.
        this.#buildMessage(turn);
    }

    #buildMessage(turn, boardsize) {
        // Build message start.
        const player = Utils.capitalize(turn.attacker);
        const cell = Utils.getCellName(turn.cell, boardsize);

        const msgStart = new ViewComponent(EL.SPAN).setText(
            `Turn ${turn.turn}: ${player} attacked ${cell} [ `,
        );

        // Get attack status.
        const attackStatus = turn.status === CELL.MISS ? CELL.MISS : CELL.HIT;

        // Build message middle (Separated for styling).
        const attack = new ViewComponent(EL.SPAN)
            .setText(attackStatus)
            .addClass(attackStatus);

        // Build message end.
        const msgEnd = new ViewComponent(EL.SPAN).setText(" ]");

        // Append message components.
        [msgStart, attack, msgEnd].forEach((component) =>
            this.append(component),
        );

        // If ship was sunk, add too message and append.
        if (turn.shipSunk > 0) {
            const shipSunk = new ViewComponent(EL.SPAN).setText(
                ` [ Size ${turn.shipSunk} ship sunk ]`,
            );

            this.append(shipSunk);
        }

        return this;
    }
}
