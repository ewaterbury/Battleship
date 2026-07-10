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
    #getPregame() {
        return this.#gameStage instanceof Pregame ? this.#gameStage : null;
    }

    #getGame() {
        return this.#gameStage instanceof Game ? this.#gameStage : null;
    }

    get state() {
        if (this.#getPregame()) return this.#getPregame().state;
        else if (this.#getGame()) return this.#getGame().state;
    }

    // |----- Initialization -----|

    // |----- Side Bar -----|
    #postLogEntry() {
        // Get turn data from model and post it to log.
        this.#sidebarView.postLogEntry(this.#getGame().previousTurn);
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

    updateTemplate(update) {
        this.#gameView.updateTemplate(
            this.#getPregame()?.updateTemplate(update),
        );
    }

    toggleShipSelect(selected) {
        this.#getPregame()?.toggleShipSelect(selected);
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

    autoPlaceFleet() {
        this.#getPregame()?.autoPlaceFleet();
        this.#gameView.placeShip();
    }

    getPlacement(cell) {
        return this.#getPregame()?.getPlacement(cell);
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

        this.#postLogEntry();

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
        this.#postLogEntry();
        this.#gameView.newTurn();

        const summary = this.#gameStage.previousTurn;

        this.audio.playEffect(summary.status);

        return summary;
    }
}
