import CELL from "../constants.js";
import Utilities from "../utilities.js";
import SweepLogic from "./sweep-logic.js";
import HuntLogic from "./hunt-logic.js";

class AttackLogic {
    #gameboard;
    #hits;
    #enemyFleet;
    #minShip;
    #latestAttack;
    #sweep;
    #hunt;

    constructor(gameboard, fleet = [2, 3, 3, 4, 5]) {
        this.#gameboard = gameboard;
        this.#hits = new Set();
        this.#enemyFleet = [...fleet.sort((a, b) => a - b)];
        this.#minShip = [Math.min(...fleet)];
        this.#latestAttack = null;
        this.#sweep = new SweepLogic(gameboard);
        this.#hunt = new HuntLogic(gameboard, [...this.#enemyFleet]);
    }

    // Decide next attack.
    getAttack() {
        this.#updateAfterAttack();

        const attacks = [];

        // Use sweep logic if appropriate.
        if (this.#hits.size || Math.min(...this.#enemyFleet) > this.#minShip)
            attacks.push(...[...this.#sweep.getAttacks(this.#enemyFleet)]);

        // If no attack(s) use hunt logic.
        const attack = attacks.length
            ? attacks[Utilities.randomInt(0, attacks.length - 1)]
            : this.#hunt.getAttack(this.#enemyFleet);

        // Save outgoing attack.
        this.#latestAttack = attack;

        return attack;
    }

    // Update hits and fleet after an attack
    #updateAfterAttack() {
        // Add latest attack to hits.
        if (this.#latestAttack !== null) {
            if (this.#gameboard[this.#latestAttack] === CELL.HIT)
                this.#hits.add(this.#latestAttack);

            // Remove sunk ship from hits.
            if (this.#gameboard[this.#latestAttack] === CELL.SUNK) {
                let wreckage = 1;
                for (const hit of this.#hits)
                    if (this.#gameboard[hit] === CELL.SUNK) {
                        this.#hits.delete(hit);
                        wreckage++;
                    }

                // Remove sunk ship from fleet tracker.
                for (let ship = 0; ship < this.#enemyFleet.length; ship++)
                    if (this.#enemyFleet[ship] == wreckage) {
                        this.#enemyFleet.splice(ship, 1);
                        break;
                    }
            }
        }
    }
}

export default AttackLogic;
