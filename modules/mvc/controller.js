// Model Modules
import Model from "./model/model.js";

// Top Level View Modules
import GameView from "./view/game-view.js";

// Audio Components
import AudioComponent from "./view/audio/audio-component.js";
import AudioLoop from "./view/audio/audio-loop-component.js";

export default class Controller {
    // Game Model
    #model;

    // Views
    #activeView;

    #boardsize = 10;

    constructor() {
        // Initialize game model.
        this.#model = new Model();

        // Initialize effects audio.
        this.gameEffects = {
            hit: new AudioComponent("hit", "./audio/hit.mp3"),
            miss: new AudioComponent("miss", "./audio/miss.wav"),
            sunk: new AudioComponent("sunk", "./audio/sunk.wav"),
        };

        // Initialize backing audio.
        this.backingAudio = new AudioLoop(
            "sonar",
            "./audio/ping.wav",
            2800,
        ).startLoop();
    }

    get boardsize() {
        return this.#boardsize;
    }

    // Application States
    initializeApp() {
        // |---------- Set Inital Theme ----------|

        // Check for previously saved theme.
        const savedTheme = localStorage.getItem("theme");

        // Get prefered theme.
        // Used saved theme if available.
        // Then fall back to system preference.
        // Then default to light.
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

    // |----- Game State Initialization Methods -----|

    startPreGame() {}

    startGame() {
        // Start new game in model.
        this.#model.newGame();

        // Call update view with initilized GameView.
        this.#updateView(new GameView(boardsize, this));
    }

    startPostGame() {}

    #updateView(view) {
        // Clear current view.
        if (this.#activeView) this.#activeView.remove();

        // Set active view to passed.
        this.#activeView = view;
    }

    // |----- Log -----|
    sendlog() {
        // Get turn from model.
        // Send turn to View.
        this.#activeView.logTurn(this.#model.latest);
    }

    // |----- Audio -----|
    effect(status) {
        this.gameEffects[status].play();
    }
}
