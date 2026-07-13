import { CELL, PLAYERS } from "../../constants.js";

export default class Postgame {
    #results;

    constructor(log) {
        this.#results = log;
    }

    // |----- Getters -----|
    get report() {
        const winner = this.#getWinner();
        const loser = this.#getLoser();

        return {
            // Winner stats.
            winner: {
                id: winner,
                attacks: this.#getAttacks(winner),
                hitRatio: this.#getHitRatio(winner),
            },

            // Loser stats.
            loser: {
                id: loser,
                attacks: this.#getAttacks(loser),
                hitRatio: this.#getHitRatio(loser),
            },
        };
    }

    #getWinner() {
        return (
            this.#results[this.#results.length - 1].winner ?? PLAYERS.COMPUTER
        ); // No winner indicates player surrender.
    }

    #getLoser() {
        return this.#getWinner() === PLAYERS.COMPUTER
            ? PLAYERS.PLAYER
            : PLAYERS.COMPUTER; // No winner indicates player surrender.
    }

    #getAttacks(player) {
        const half = Math.floor(this.#results.length / 2);

        return player === this.#getFirstAttacker() ? half + 1 : half;
    }

    #getHitRatio(player) {
        this.#results.forEach((element) => {
            console.log(
                element.attacker === player && element.status === CELL.HIT,
            );
        });
        const hits = this.#results.reduce((total, turn) => {
            return (
                total +
                (turn.attacker === player && turn.status === CELL.HIT ? 1 : 0)
            );
        }, 0);

        return hits / this.#getAttacks(player);
    }

    // |----- Helpers -----|
    #getFirstAttacker() {
        return this.#results[0].attacker;
    }
}
