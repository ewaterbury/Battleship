import Player from "./player.js";
import Gameboard from "./gameboard.js";
import Ship from "./ship.js";
import FleetGenerator from "./computer-logic/fleet-generator.js";
import AttackLogic from "./computer-logic/attack-logic.js";
import Log from "./log.js";
import { CELL } from "../../constants.js";

export default class Battleship {
    #boardSize;
    #player;
    #computer;
    #attacker;
    #defender;
    #turn;
    #log;

    constructor(boardSize, playerFleet) {
        this.#boardSize = boardSize;

        // Initialize human player.
        this.#player = {
            id: "player",

            controller: new Player(
                new Gameboard(boardSize),
                playerFleet.map((ship) => new Ship(ship)),
            ),
        };

        // Initialize computer player.
        this.#computer = {
            id: "computer",

            controller: new Player(
                new Gameboard(boardSize),
                FleetGenerator.generateFleet(
                    playerFleet.map((ship) => ship.length),
                    boardSize,
                ).map((ship) => new Ship(ship)),
            ),

            logic: new AttackLogic(this.#player.controller.queryBoard()),
        };

        // Set turn order.
        this.#attacker = Math.random() < 0.5 ? this.#computer : this.#player;
        this.#defender =
            this.#attacker === this.#computer ? this.#player : this.#computer;

        // Initialize log saving first attacker/defender.
        this.#log = new Log(this.#attacker.id, this.#defender.id);

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

    get boardSize() {
        return this.#boardSize;
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
    sendAttack(attack, player) {
        // Use attack logic to select attack for computer player.
        if (typeof attack !== "number")
            throw new Error("Attack is not a number");
        if (attack < 0 || attack >= this.#boardSize ** 2)
            throw new Error("Attack is out of bounds");

        console.log(player, this.#attacker);

        // Return false when called with defender board.
        if (player !== this.#attacker.id) return false;

        // Call strike on defender and return true.
        this.#defender.controller.receiveAttack(attack);
        return true;
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
