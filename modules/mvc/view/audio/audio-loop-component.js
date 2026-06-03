// Core Components
import AudioComponent from "./audio-component.js";

export default class AudioLoop extends AudioComponent {
    #interval; // Interval in milliseconds between loops.
    #timer = null; // Stores timeout while loop is running (Initialized as null).
    #tick; // Recursive callback used to loop audio.

    constructor(id, src, interval) {
        // Initialize base AudioComponent.
        super(id, src);

        // |----- Validation -----|
        // Validate interval.
        if (!Number.isFinite(interval) || interval <= 0)
            throw new TypeError(
                "Loop interval must be a positive finite number",
            );

        // |----- Behavior -----|
        this.#interval = interval;

        // Recursive timeout callback.
        this.#tick = () => {
            // Plays audio.
            this.play();

            // Queue next loop.
            this.#timer = setTimeout(this.#tick, this.#interval);
        };
    }

    // Arrow function preserves instance context when invoked indirectly.
    play = () => {
        super.play();
    };

    startLoop() {
        // Start recursive timeout loop if not already running.
        if (!this.#timer) this.#tick();

        return this;
    }

    stopLoop() {
        // Stop loop and set #timer to null.
        clearTimeout(this.#timer);
        this.#timer = null;

        // Pause current audio loop.
        this.pause();

        return this;
    }

    isLooping() {
        // Return whether loop is active.
        return this.#timer !== null;
    }
}
