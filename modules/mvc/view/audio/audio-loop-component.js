import AudioComponent from "./audio-component.js";

export default class AudioLoop extends AudioComponent {
    #loop;
    #loopInterval;

    constructor(id, src, loopInterval) {
        super(id, src);
        this.#loopInterval = loopInterval;
    }

    // Overwite original play method with arrow function to preserve this on setInterval callback.
    play = () => {
        super.play();
    };

    startLoop() {
        // If no loop, call setInterval with this.play as callback.
        if (!this.#loop)
            this.#loop = setInterval(this.play, this.#loopInterval);

        return this;
    }

    stopLoop() {
        // If loop is active terminate setInterval and delete reference.
        if (this.#loop) {
            clearInterval(this.#loop);
            this.#loop = null;
        }

        return this;
    }
}
