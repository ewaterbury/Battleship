import AudioComponent from "../view/audio/audio-component.js";
import AudioLoop from "../view/audio/audio-loop-component.js";

export default class AudioController {
    constructor() {
        this.#initializeBackingAudio();
        this.#initializeEffectsAudio();
    }
    // |----- Initialization -----|
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

    playEffect(status) {
        this.gameEffects[status].play();
    }
}
