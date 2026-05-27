import AudioComponent from "./audio-component.js";

export default class AudioLoop extends AudioComponent {
    #loop;
    #loopInterval;

    #timer;
    #tick;

    constructor(id, src, loopInterval) {
        super(id, src);
        this.#loopInterval = loopInterval;

        this.#timer = null;

        this.#tick = () => {
            this.play();
            this.#timer = setTimeout(this.#tick, this.#loopInterval);
        };
    }

    // Overwite original play method with arrow function to preserve this on setInterval callback.
    play = () => {
        super.play();
    };

    startLoop() {
        // If no loop, call setInterval with this.play as callback.
        if (!this.#timer) this.#tick();

        return this;
    }

    stopLoop() {
        clearTimeout(this.#timer);
        this.#timer = null;
        this.pause();

        return this;
    }

    isPlaying() {
        return this.#timer !== null;
    }
}
