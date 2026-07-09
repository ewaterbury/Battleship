import Player from "./player.js";
import Gameboard from "./gameboard.js";
import Ship from "./ship.js";
import FleetGenerator from "./computer-logic/fleet-generator.js";
import AttackLogic from "./computer-logic/attack-logic.js";
import Log from "./log.js";
import { CELL, PLAYERS } from "../../constants.js";

export default class Battleship {
    #attack = null; // Initialize attack tracker to null.
    #attacker;
    #boardSize;
    #computer;
    #defender;
    #log;
    #player;
    #turn;

    constructor(boardSize, playerFleet) {
        this.#boardSize = boardSize;

        this.#initializePlayer(playerFleet);
        this.#initializeComputer(playerFleet);

        this.#setTurnOrder();

        // Initialize log saving first attacker/defender.
        this.#log = new Log(this.#attacker.id, this.#defender.id);

        // Initialize turn at one (Turn zero already saved in log).
        this.#turn = 1;
    }

    // |----- Initialization -----|
    #initializePlayer(playerFleet) {
        this.#player = {
            id: PLAYERS.PLAYER,

            controller: new Player(
                new Gameboard(this.#boardSize),
                playerFleet.map((ship) => new Ship(ship)),
            ),

            playerFleet: playerFleet,
        };
    }

    #initializeComputer(playerFleet) {
        this.#computer = {
            id: PLAYERS.COMPUTER,

            controller: new Player(
                new Gameboard(this.#boardSize),
                FleetGenerator.generateFleet(
                    playerFleet.map((ship) => ship.length),
                    this.#boardSize,
                ).map((ship) => new Ship(ship)),
            ),

            logic: new AttackLogic(this.#player.controller.queryBoard()),
        };
    }

    #setTurnOrder() {
        this.#attacker = Math.random() < 0.5 ? this.#computer : this.#player;
        this.#defender =
            this.#attacker === this.#computer ? this.#player : this.#computer;
    }

    // |----- Getters -----|

    get gameState() {
        return {
            boardSize: this.#boardSize,
            turn: this.#turn,
            attacker: this.#attacker.id,
            defender: this.#defender.id,
            playerBoard: this.#getPlayerBoard(),
            computerBoard: this.#getComputerBoard(),
            attack: this.#attack,
            winner: this.#getWinner(),
            previousTurn: this.#log.latest,
        };
    }

    get log() {
        return this.#log.log;
    }

    #getPlayerBoard() {
        const board = [...this.#queryBoard(PLAYERS.PLAYER)];
        const placements = this.#player.playerFleet.flat();

        placements.forEach((cell) => {
            const status = board[cell];
            if (status === CELL.EMPTY) board[cell] = CELL.SHIP;
        });

        return board;
    }

    #getComputerBoard() {
        return [...this.#queryBoard(PLAYERS.COMPUTER)];
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

    #queryBoard(id) {
        if (id === this.#player.id) return this.#player.controller.queryBoard();
        if (id === this.#computer.id)
            return this.#computer.controller.queryBoard();
        throw new Error("Invalid player id");
    }

    getCompAttack() {
        return this.#computer.logic.getAttack();
    }

    // |----- Game Methods -----|
    // Update gamestate for new turn.
    newTurn() {
        // Swap attacker and defender.
        [this.#defender, this.#attacker] = [this.#attacker, this.#defender];

        // Increment turn counter.
        this.#turn++;

        // Clear saved attack.
        this.#attack = null;
    }

    // Sends attack to defender board.
    sendAttack(attack) {
        if (typeof attack !== "number")
            throw new Error("Attack is not a number");
        if (attack < 0 || attack >= this.#boardSize ** 2)
            throw new Error("Attack is out of bounds");

        // Call strike on defender and return true.
        this.#defender.controller.receiveAttack(attack);

        const results = this.#attacker.controller.queryCell(attack);

        // Save attack data.
        this.#attack = {
            cell: attack,
            status: results !== CELL.MISS ? CELL.HIT : CELL.MISS,
            sunk: results === CELL.SUNK ? true : false,
        };
    }

    // Log turn (Called before newTurn).
    logTurn() {
        const gameState = this.gameState;

        this.#log.addEntry(
            gameState.turn,
            gameState.attacker,
            gameState.defender,
            gameState.attack.cell,
            gameState.attack.status,
            gameState.attack.sunk,
            gameState.winner,
        );
    }
}
