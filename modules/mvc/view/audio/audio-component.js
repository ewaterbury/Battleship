import ViewComponent from "../view-component.js";
import { EL } from "../../../constants.js";

export default class AudioComponent extends ViewComponent {
    // Tracks mute state.
    #muted = false;

    constructor(id, src, controls = false) {
        // Initialize class with super constructor.
        super(
            EL.AUDIO,
            id,

            // Whitelisted attributes
            "src",
            "controls",

            // Whitelisted props
            "playbackRate",
            "currentTime",
            "muted",
            "volume",
        );

        // Assign src.
        this.setAttr("src", src);

        // Add controls to componenet if requested.
        if (controls) this.setAttr("controls", "");
    }

    play() {
        this.setProp("currentTime", 0);
        this.element.play();

        return this;
    }

    pause() {
        this.element.pause();
        this.setProp("currentTime", 0);
    }

    stop() {
        this.element.stop();

        return this;
    }

    mute() {
        this.setProp("muted", true);
        this.#muted = true;

        return this;
    }

    unmute() {
        this.setProp("muted", false);
        this.#muted = false;

        return this;
    }

    isMuted() {
        return this.#muted;
    }

    setPlaybackSpeed(speed) {
        // Set Playback Speed on element.
        this.setProp("playbackRate", 0);

        return this;
    }

    setVolume(value) {
        // Set volume on element.
        this.setProp("volume", value);

        return this;
    }
}
