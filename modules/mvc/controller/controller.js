// Top Level Model Modules.
import Pregame from "../model/pregame.js";
import Game from "../model/game.js";

// Top Level View Modules.
import SidebarView from "../view/sidebar/sidebar-view.js";
import PregameView from "../view/game-states/pregame-view.js";
import GameView from "../view/game-states/game-view.js";
// import PostGameView from "./view/post-game-view.js"

// Sub Controllers
import AudioController from "./audio-controller.js";
import ThemeController from "./theme-controller.js";

// Utilities.
import Utilities from "../../utilities.js";

// Player Library
import { PLAYERS } from "../../constants.js";

export default class Controller {
    #gameStage;
    #gameView;
    #sidebarView;
    #theme;

    constructor() {
        this.audio = new AudioController();
        this.#theme = new ThemeController();

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

    get pregameState() {
        return this.#getPregame()?.pregameState;
    }

    // |----- Game -----|
    get gameState() {
        const latest = this.#getGame()?.previousTurn;

        if (!latest) return;

        const firstTurn = latest.turn === 0;

        return {
            boardSize: this.#getGame().boardSize,
            turn: firstTurn ? 0 : latest.turn + 1,
            attacker: firstTurn ? latest.attacker : latest.defender,
            defender: firstTurn ? latest.defender : latest.attacker,
            cell: latest.cell ?? null,
            status: latest.status ?? null,
            shipSunk: latest.shipSunk ?? null,
            gameOver: latest.gameOver ?? null,
            winner: latest.winner ?? null,
        };
    }

    get playerBoard() {
        return this.#getGame()?.playerBoard;
    }

    get compBoard() {
        return this.#getGame()?.compBoard;
    }

    // |----- Initialization -----|

    // |----- Side Bar -----|
    postLogEntry() {
        // Get turn data from model and post it to log.
        this.#sidebarView.postLogEntry(this.#gameStage.latestTurn);
    }

    // |----- Pregame -----|
    resetToDefaults() {
        this.#getPregame()?.resetToDefaults();
        this.#gameView.resetToDefaults();
    }

    updateBoardSize(boardSize) {
        // UpdateStatus:
        //  - null on no update
        //  - false on only board update
        //  - true on board and fleet update
        const updateStatus = this.#getPregame()?.updateBoardSize(boardSize);
        if (updateStatus !== null) this.#gameView.updateBoardSize(updateStatus);
    }

    updateFleetTemplate(templateUpdate) {
        this.#gameView.updateFleetTemplate(
            this.#getPregame()?.updateFleetTemplate(templateUpdate),
        );
    }

    toggleShipSelect(selectedShip) {
        this.#getPregame()?.toggleShipSelect(selectedShip);
        this.#gameView.toggleShipSelect();
    }

    toggleOrientation() {
        this.#getPregame()?.toggleOrientation();
    }

    placeShip(ship) {
        const updateStatus = this.#getPregame()?.placeShip(ship);
        if (updateStatus) {
            this.#gameView.placeShip();
        } else {
            this.#gameView.failedPlacement();
        }
    }

    autoPlaceShips() {
        this.#getPregame()?.autoPlaceShips();
        this.#gameView.placeShip();
    }

    getShipFromCell(cell) {
        return this.#getPregame()?.getShipFromCell(cell);
    }

    launchGame() {
        const gameReady = this.#getPregame()?.launchGame();
        if (gameReady) {
            // Initialize game with current board size and player fleet.
            this.#gameStage = new Game(
                this.pregameState.boardSize.current,
                this.pregameState.placementFleet.map((ship) => ship.location),
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
