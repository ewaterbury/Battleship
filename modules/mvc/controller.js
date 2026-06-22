// Top Level Model Module.
import Model from "./model/model.js";

// Top Level View Modules.
import PregameView from "./view/game-states/pregame-view.js";
import GameView from "./view/game-states/game-view.js";
// import PostGameView from "./view/post-game-view.js"

// Audio Components.
import AudioComponent from "./view/audio/audio-component.js";
import AudioLoop from "./view/audio/audio-loop-component.js";

export default class Controller {
    // Initialize game model.
    #model = new Model();

    // Holds active view (Pregame, game, or Postgame).
    #view;

    constructor() {
        // Initialize audio.
        this.#initializeTheme();
        this.#initializeBackingAudio();
        this.#initializeEffectsAudio();
    }

    get boardSize() {
        return this.#model.pregame.boardSize;
    }

    get fleetTemplate() {
        return this.#model.pregame.template;
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
        if (this.#view) this.#view.remove();

        // Set active view to passed.
        this.#view = view;
    }

    // |----- Log -----|
    postLogEntry() {
        // Get turn data from model and post it to log.
        this.#view.postLogEntry(this.#model.latestTurn);
    }

    // |----- Audio -----|
    playEffect(status) {
        this.gameEffects[status].play();
    }

    // |---------- Game Settings (Pregame) ----------|

    // |----- Reset to Default Settings -----|
    resetGameSettings() {
        this.#model.pregame.resetGameSettings();
        this.renderPregame();
    }

    // |----- Board Size -----|
    updateBoardSize(boardSize) {
        if (this.#model.pregame.updateBoardSize(boardSize))
            this.renderPregame();
    }

    // |----- Fleet Template -----|
    updateFleetTemplate(templateUpdate) {
        this.#model.pregame.updateTemplate(templateUpdate);
        this.renderPregame();
    }

    // |----- Placing Ships -----|
    selectShip(ship) {
        this.#model.pregame.selectShip(ship);
        this.#view.selectShip(ship);
    }
}
