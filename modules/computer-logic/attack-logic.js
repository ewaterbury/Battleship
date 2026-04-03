const CELL = require("../constants.js");
const Utilities = require("../utilities.js");
const GuaranteedLogic = require("./guaranteed-logic.js");
const SweepLogic = require("./sweep-logic.js");
const HuntLogic = require("./hunt-logic.js");

class AttackLogic {
    #gameboard;
    #hits;
    #enemyFleet;
    #latestAttack;
    #guaranteed;
    #sweep;
    #hunt;

    constructor(
        gameboard = new Array(100).fill(null),
        fleet = [2, 3, 3, 4, 5],
    ) {
        this.#gameboard = gameboard;
        this.#hits = new Set();
        this.#enemyFleet = [...fleet.sort((a, b) => a - b)];
        this.#latestAttack = null;
        this.#guaranteed = new GuaranteedLogic(gameboard, [
            ...this.#enemyFleet,
        ]);
        this.#sweep = new SweepLogic(gameboard);
        this.#hunt = new HuntLogic(gameboard, [...this.#enemyFleet]);
    }

    // Decide next attack.
    sendAttack() {
        this.#updateAfterAttack();

        const attacks = [];

        // If hits, use guaranteed logic
        if (this.#hits.size)
            attacks.push(...[...this.#guaranteed.getAttacks(this.#enemyFleet)]);

        // If no attack(s), use sweep logic if appropriate
        if (!attacks.length)
            if (this.#hits.size || this.#enemyFleet[0] > 2)
                attacks.push(...[...this.#sweep.getAttacks(this.#enemyFleet)]);

        // If no attack(s) use hunt logic.
        const attack = attacks.length
            ? attacks[Utilities.randomInt(0, attacks.length - 1)]
            : this.#hunt.getAttack(this.#enemyFleet);

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

module.exports = AttackLogic;
