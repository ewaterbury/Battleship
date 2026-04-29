import Player from "../modules/player.js";
import Gameboard from "../modules/gameboard.js";
import Ship from "../modules/ship.js";
import FleetGenerator from "../modules/computer-logic/fleet-generator.js";
import AttackLogic from "../modules/computer-logic/attack-logic.js";

class Battleship {
    #boardsize;
    #player;
    #computer;
    #attacker;
    #defender;

    constructor(boardsize, playerFleet) {
        this.#boardsize = boardsize;

        // Initialize human player.
        this.#player = {
            id: "player",
            controller: new Player(
                new Gameboard(boardsize),
                playerFleet.map((ship) => new Ship(ship)),
            ),
        };

        // Initialize computer player.
        this.#computer = {
            id: "computer",
            controller: new Player(
                new Gameboard(boardsize),
                FleetGenerator.generateFleet(
                    playerFleet.map((ship) => ship.length),
                    boardsize,
                ).map((ship) => new Ship(ship)),
            ),
            logic: new AttackLogic(this.#player.controller.queryBoard()),
        };

        // Set turn order.
        this.#attacker = Math.random() < 0.5 ? this.#computer : this.#player;
        this.#defender =
            this.#attacker === this.#computer ? this.#player : this.#computer;
    }

    sendAttack(cell) {
        // Use attack logic to select attack for computer player.
        const attack =
            this.#attacker === this.#computer
                ? this.#computer.logic.getAttack()
                : cell;

        if (typeof attack !== "number")
            throw new Error("Attack is not a number");
        if (attack < 0 || attack >= this.#boardsize ** 2)
            throw new Error("Attack is out of bounds");

        // Call strike on defender.
        this.#defender.controller.receiveAttack(attack);
    }

    queryBoard(id) {
        if (id === this.#player.id) return this.#player.controller.queryBoard();
        if (id === this.#computer.id)
            return this.#computer.controller.queryBoard();
        throw new Error("Invalid player id");
    }

    newTurn() {
        [this.#defender, this.#attacker] = [this.#attacker, this.#defender];
    }

    getState() {
        const winner = this.#getWinner();
        return {
            attacker: this.#attacker.id,
            defender: this.#defender.id,
            gameOver: winner !== null,
            winner: winner,
        };
    }

    #getWinner() {
        if (
            this.#player.controller.gameOver() &&
            this.#computer.controller.gameOver()
        )
            throw new Error("Two winners");
        if (this.#player.controller.gameOver()) return this.#computer.id;
        if (this.#computer.controller.gameOver()) return this.#player.id;
        return null;
    }
}

module.exports = Battleship;
