// Top Level Model Modules.
import Pregame from "./model/pregame.js";

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

    // |----- Getters -----|
    get document() {
        return this.#document;
    }

    get boardSize() {
        return this.#gameStage.boardSize;
    }

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

    // |----- Initialization Helpers -----|
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

    // |----- Game State Methods -----|
    renderPregame() {
        this.#updateView(new PregameView(this));
    }

    renderGame() {
        // Start new game in model.
        // this.#gameStage.newGame();

        // Call update view with initilized GameView.
        this.#updateView(new GameView(this));
    }

    renderPostGame() {}

    // Game State Helper
    #updateView(view) {
        // Clear current view.
        if (this.#gameView) this.#gameView.remove();

        // Set active view to passed.
        this.#gameView = view;
    }

    // |----- Log -----|
    postLogEntry() {
        // Get turn data from model and post it to log.
        this.#sidebarView.postLogEntry(this.#gameStage.latestTurn);
    }

    // |----- Audio -----|
    playEffect(status) {
        this.gameEffects[status].play();
    }

    // |---------- Game Settings (Pregame) ----------|

    // |----- Reset to Default Settings -----|
    resetToDefaults() {
        this.#gameStage.resetToDefaults();
        this.#gameView.resetToDefaults();
    }

    // |----- Board Size -----|
    updateBoardSize(boardSize) {
        // UpdateStatus:
        //  - null on no update
        //  - false on only board update
        //  - true on board and fleet update
        const updateStatus = this.#gameStage.updateBoardSize(boardSize);
        if (updateStatus !== null) this.#gameView.updateBoardSize(updateStatus);
    }

    // |----- Fleet Template -----|
    updateFleetTemplate(templateUpdate) {
        this.#gameView.updateFleetTemplate(
            this.#gameStage.updateFleetTemplate(templateUpdate),
        );
    }

    // |----- Placing Ships -----|
    toggleShipSelect(selectedShip) {
        this.#gameStage.toggleShipSelect(selectedShip);
        this.renderPregame();
    }

    toggleOrientation() {
        this.#gameStage.toggleOrientation();
    }

    getShipFromCell(cell) {
        return this.#gameStage.getShipFromCell(cell);
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
}
