// Top Level Model Modules.
import Pregame from "./model/pregame.js";
import Game from "./model/game.js";

// Top Level View Modules.
import SidebarView from "./view/sidebar/sidebar-view.js";
import PregameView from "./view/game-states/pregame-view.js";
import GameView from "./view/game-states/game-view.js";
// import PostGameView from "./view/post-game-view.js"

// Audio Components.
import AudioController from "./controller/audioController.js";

// Utilities.
import Utilities from "../utilities.js";

// Player Library
import { PLAYERS } from "../constants.js";

export default class Controller {
    // Initialize game model.
    #gameStage;

    // Holds active views (Pregame, Game, or Postgame + Sidebar).
    #gameView;
    #sidebarView;

    // Holds reference to document object.
    #document;

    constructor() {
        // Get document.
        this.#document = document;

        this.#initializeTheme();

        this.audio = new AudioController();

        // Initialize pregame game stage.
        this.#gameStage = new Pregame(this);

        // Initialize pregame view and sidebar view.
        this.#gameView = new PregameView(this);
        this.#sidebarView = new SidebarView(this);
    }

    // |---------- Getters ----------|
    // |----- Game State -----|
    #getPregame() {
        return this.#gameStage instanceof Pregame ? this.#gameStage : null;
    }

    #getGame() {
        return this.#gameStage instanceof Game ? this.#gameStage : null;
    }

    // |----- General -----|
    get document() {
        return this.#document;
    }

    get boardSize() {
        return this.#gameStage.boardSize;
    }

    // |----- Pregame -----|
    get fleetTemplate() {
        return this.#getPregame()?.template;
    }

    get placementFleet() {
        return this.#getPregame()?.fleet;
    }

    get selectedShip() {
        return this.#getPregame()?.selectedShip;
    }

    get orientation() {
        return this.#getPregame()?.orientation;
    }

    get occupiedCells() {
        return this.#getPregame()?.occupiedCells;
    }

    // |----- Game -----|
    get gameState() {
        const latest = this.#getGame()?.previousTurn;

        if (!latest) return;

        if (latest.turn === 0) {
            return {
                turn: latest.turn,
                attacker: latest.attacker,
                defender: latest.defender,
                cell: null,
                status: null,
                shipSunk: null,
                gameOver: null,
                winner: null,
            };
        } else {
            return {
                turn: latest.turn + 1,
                attacker: latest.defender,
                defender: latest.attacker,
                cell: latest.cell,
                status: latest.status,
                shipSunk: latest.shipSunk,
                gameOver: latest.gameOver,
                winner: latest.winner,
            };
        }
    }

    get playerBoard() {
        return this.#getGame()?.playerBoard;
    }

    get compBoard() {
        return this.#getGame()?.compBoard;
    }

    // |----- Initialization -----|
    #initializeTheme() {
        // Get previously saved theme.
        const savedTheme = localStorage.getItem("theme");

        // Resolve initial theme: saved -> system preference -> light fallback
        const initialTheme = savedTheme
            ? savedTheme
            : window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "dark"
              : "light";

        // Apply theme to <html> element.
        document.documentElement.setAttribute("data-theme", initialTheme);

        // Save prefered theme in local storage.
        localStorage.setItem("theme", initialTheme);
    }

    // |----- Side Bar -----|
    postLogEntry() {
        // Get turn data from model and post it to log.
        this.#sidebarView.postLogEntry(this.#gameStage.latestTurn);
    }

    // |----- Pregame -----|
    resetToDefaults() {
        this.#gameStage.resetToDefaults();
        this.#gameView.resetToDefaults();
    }

    updateBoardSize(boardSize) {
        // UpdateStatus:
        //  - null on no update
        //  - false on only board update
        //  - true on board and fleet update
        const updateStatus = this.#gameStage.updateBoardSize(boardSize);
        if (updateStatus !== null) this.#gameView.updateBoardSize(updateStatus);
    }

    updateFleetTemplate(templateUpdate) {
        this.#gameView.updateFleetTemplate(
            this.#gameStage.updateFleetTemplate(templateUpdate),
        );
    }

    toggleShipSelect(selectedShip) {
        this.#gameStage.toggleShipSelect(selectedShip);
        this.#gameView.toggleShipSelect();
    }

    toggleOrientation() {
        this.#gameStage.toggleOrientation();
    }

    placeShip(ship) {
        const updateStatus = this.#gameStage.placeShip(ship);
        if (updateStatus) {
            this.#gameView.placeShip();
        } else {
            this.#gameView.failedPlacement();
        }
    }

    autoPlaceShips() {
        this.#gameStage.autoPlaceShips();
        this.#gameView.placeShip();
    }

    getShipFromCell(cell) {
        return this.#gameStage.getShipFromCell(cell);
    }

    launchGame() {
        const gameReady = this.#gameStage.launchGame();
        if (gameReady) {
            // Initialize game with current board size and player fleet.
            this.#gameStage = new Game(
                this.boardSize.current,
                this.placementFleet.map((ship) => ship.location),
            );

            // Remove pregame view and add game view.
            this.#gameView.launchGame();
            this.#gameView = new GameView(this);

            const startingPlayer = this.#gameStage.previousTurn.attacker;

            if (startingPlayer === PLAYERS.COMPUTER) {
                this.#gameStage.playTurn(this.#gameStage.getCompAttack());
                this.#gameView.newTurn();

                const compSummary = this.#gameStage.previousTurn;

                this.audio.playEffect(compSummary.status);
            }

            this.boardLocked = false;
        } else this.#gameView.failedLaunch();
    }

    // |----- In Game -----|
    runTurnCycle = async (attack) => {
        const playerTurn = this.#playTurn(attack);

        if (playerTurn.gameOver) return;

        await new Promise((resolve) =>
            setTimeout(resolve, Utilities.randomInt(1000, 1250)),
        );

        const compTurn = this.#playTurn(this.#gameStage.getCompAttack());

        if (compTurn.gameOver) return;

        this.boardLocked = false;
    };

    #playTurn(attack) {
        this.#gameStage.playTurn(attack);
        this.#gameView.newTurn();

        const summary = this.#gameStage.previousTurn;

        this.audio.playEffect(summary.status);

        return summary;
    }
}
