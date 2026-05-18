import Player from "../modules/player.js";
import Gameboard from "../modules/gameboard.js";
import Ship from "../modules/ship.js";
import FleetGenerator from "../modules/computer-logic/fleet-generator.js";
import AttackLogic from "../modules/computer-logic/attack-logic.js";
import Log from "./log.js";
import { CELL } from "./constants.js";

class Battleship {
    #boardsize;
    #player;
    #computer;
    #attacker;
    #defender;
    #turn;
    #log;

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

        // Initialize log saving first attacker/defender.
        this.#log = new Log(this.#attacker, this.#defender);

        // Initialize turn at one (Turn zero already saved in log).
        this.#turn = 1;
    }

    // Getter for private log class.
    get log() {
        return this.#log.log;
    }

    get latestTurn() {
        return this.#log.latest;
    }

    // Returns attack for computer player.
    getCompAttack() {
        return this.#computer.logic.getAttack();
    }

    // Update gamestate for new turn.
    newTurn() {
        // Swap attacker and defender.
        [this.#defender, this.#attacker] = [this.#attacker, this.#defender];

        // Increment turn counter.
        this.#turn++;
    }

    // Sends attack to defender board.
    sendAttack(attack) {
        // Use attack logic to select attack for computer player.
        if (typeof attack !== "number")
            throw new Error("Attack is not a number");
        if (attack < 0 || attack >= this.#boardsize ** 2)
            throw new Error("Attack is out of bounds");

        // Call strike on defender.
        this.#defender.controller.receiveAttack(attack);
    }

    // Log turn.
    logTurn(attack) {
        const attackStatus = this.#defender.controller.queryCell(attack);
        const winner = this.#getWinner();

        this.#log.addEntry(
            this.#turn,
            this.#attacker.id,
            this.#defender.id,
            attack,
            attackStatus,
            attackStatus === CELL.SUNK
                ? this.#defender.controller.getSunkShip(attack)
                : 0,
            winner === null ? false : true,
            winner,
        );
    }

    // Returns winner of game or null on no winner.
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

    // Query gameboard by player id.
    #queryBoard(id) {
        if (id === this.#player.id) return this.#player.controller.queryBoard();
        if (id === this.#computer.id)
            return this.#computer.controller.queryBoard();
        throw new Error("Invalid player id");
    }
}

module.exports = Battleship;
