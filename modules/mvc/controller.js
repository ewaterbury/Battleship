// Model Modules
import Model from "./model/model.js";

// Top Level View Modules
import PreGameView from "./view/pre-game-view.js";
import GameView from "./view/game-view.js";
// import PostGameView from "./view/post-game-view.js"

// Audio Components
import AudioComponent from "./view/audio/audio-component.js";
import AudioLoop from "./view/audio/audio-loop-component.js";

export default class Controller {
    // Initialize game model.
    #model = new Model();

    // Initialize active view.
    #activeView;

    // Initialize boardSize with default value (10);
    #boardSize = 10;

    constructor() {
        this.#initializeTheme();
        this.#initializeBackingAudio();
        this.#initializeEffectsAudio();
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
    startPreGame() {
        this.#updateView(new PreGameView());
    }

    startGame() {
        // Start new game in model.
        // this.#model.newGame();

        // Call update view with initilized GameView.
        this.#updateView(new GameView(10, this));
    }

    startPostGame() {}

    #updateView(view) {
        // Clear current view.
        if (this.#activeView) this.#activeView.remove();

        // Set active view to passed.
        this.#activeView = view;
    }

    // |----- Log -----|
    postLogEntry() {
        // Get turn data from model and post it to log.
        this.#activeView.postLogEntry(this.#model.latestTurn);
    }

    // |----- Audio -----|
    playEffect(status) {
        this.gameEffects[status].play();
    }
}
