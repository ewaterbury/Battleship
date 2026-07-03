// Top Level Model Modules.
import Pregame from "./model/pregame.js";
import Game from "./model/battleship.js";

// Top Level View Modules.
import SidebarView from "./view/sidebar/sidebar-view.js";
import PregameView from "./view/game-states/pregame-view.js";
import GameView from "./view/game-states/game-view.js";
// import PostGameView from "./view/post-game-view.js"

// Audio Components.
import AudioComponent from "./view/audio/audio-component.js";
import AudioLoop from "./view/audio/audio-loop-component.js";

export default class Controller {
    // Initialize game model.
    #gameStage;

    // Holds active view (Pregame, Game, or Postgame).
    #gameView;

    #sidebarView;

    // Holds reference to document object.
    #document;

    constructor() {
        // Get document.
        this.#document = document;

        // Initialize audio.
        this.#initializeTheme();
        this.#initializeBackingAudio();
        this.#initializeEffectsAudio();

        // Initialize pregame view.
        this.#gameStage = new Pregame(this);
        this.#gameView = new PregameView(this);
        this.#sidebarView = new SidebarView(this);
    }

    // |---------- Getters ----------|
    // |----- General -----|
    get document() {
        return this.#document;
    }

    get boardSize() {
        return this.#gameStage.boardSize;
    }

    // |----- Pregame -----|
    get fleetTemplate() {
        return this.#gameStage.template;
    }

    get placementFleet() {
        return this.#gameStage.fleet;
    }

    get selectedShip() {
        return this.#gameStage.selectedShip;
    }

    get orientation() {
        return this.#gameStage.orientation;
    }

    get occupiedCells() {
        return this.#gameStage.occupiedCells;
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

    #initializeBackingAudio() {
        // Initialize in public field to allow view access.
        this.backingAudio = new AudioLoop(
            "sonar",
            "./audio/ping.wav",
            2800,
        ).startLoop();
    }

    #initializeEffectsAudio() {
        // Initialize in public field to allow view access.
        this.gameEffects = {
            hit: new AudioComponent("hit", "./audio/hit.mp3"),
            miss: new AudioComponent("miss", "./audio/miss.wav"),
            sunk: new AudioComponent("sunk", "./audio/sunk.wav"),
        };
    }

    // |----- Side Bar -----|
    postLogEntry() {
        // Get turn data from model and post it to log.
        this.#sidebarView.postLogEntry(this.#gameStage.latestTurn);
    }

    // |----- Audio -----|
    playEffect(status) {
        this.gameEffects[status].play();
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
        } else {
            this.#gameView.failedLaunch();
        }
    }
}
