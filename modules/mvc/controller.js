// Top Level Model Module.
import Model from "./model/model.js";

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
    #model = new Model();

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
        this.#gameView = new PregameView(this);
        this.#sidebarView = new SidebarView(this);
    }

    // |----- Getters -----|
    get document() {
        return this.#document;
    }

    get boardSize() {
        return this.#model.pregame.boardSize;
    }

    get fleetTemplate() {
        return this.#model.pregame.template;
    }

    get placementFleet() {
        return this.#model.pregame.fleet;
    }

    get selectedShip() {
        return this.#model.pregame.selectedShip;
    }

    get orientation() {
        return this.#model.pregame.orientation;
    }

    get occupiedCells() {
        return this.#model.pregame.occupiedCells;
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
        // this.#model.newGame();

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
        this.#sidebarView.postLogEntry(this.#model.latestTurn);
    }

    // |----- Audio -----|
    playEffect(status) {
        this.gameEffects[status].play();
    }

    // |---------- Game Settings (Pregame) ----------|

    // |----- Reset to Default Settings -----|
    resetToDefaults() {
        this.#model.pregame.resetToDefaults();
        this.#gameView.resetToDefaults();
    }

    // |----- Board Size -----|
    updateBoardSize(boardSize) {
        // UpdateStatus:
        //  - null on no update
        //  - false on only board update
        //  - true on board and fleet update
        const updateStatus = this.#model.pregame.updateBoardSize(boardSize);
        if (updateStatus !== null) this.#gameView.updateBoardSize(updateStatus);
    }

    // |----- Fleet Template -----|
    updateFleetTemplate(templateUpdate) {
        this.#gameView.updateFleetTemplate(
            this.#model.pregame.updateFleetTemplate(templateUpdate),
        );
    }

    // |----- Placing Ships -----|
    selectShip(ship) {
        this.#model.pregame.selectShip(ship);
        this.renderPregame();
    }

    toggleOrientation() {
        this.#model.pregame.toggleOrientation();
    }

    getShipFromCell(cell) {
        return this.#model.pregame.getShipFromCell(cell);
    }

    placeShip(ship) {
        const updateStatus = this.#model.pregame.placeShip(ship);
        if (updateStatus) {
            this.#gameView.placeShip();
        } else {
            this.#gameView.failedPlacement();
        }
    }

    autoPlaceShips() {
        this.#model.pregame.autoPlaceShips();
        this.#gameView.placeShip();
    }
}
