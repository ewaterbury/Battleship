// Core Components
import ViewComponent from "../view-component.js";

// Element Library
import { EL } from "../../../constants.js";

// Validation Library
import ValidationUtilities from "../../../validation-utilities.js";

export default class AudioComponent extends ViewComponent {
    constructor(id, src, controls = false) {
        // Initialize audio element and assign ID using super constructor.
        super(
            EL.AUDIO,
            id,

            // Whitelisted attributes (for setAttr/readAttr):
            "src",
            "controls",

            // Whitelisted props (for setProp/readProp):
            "playbackRate",
            "currentTime",
            "muted",
            "volume",
        );

        // |----- Validation -----|
        // Validate src input.
        if (!ValidationUtilities.isString(src))
            throw new TypeError("src must be a non-empty string");

        // |----- Behavior -----|
        // Assign audio source.
        this.setAttr("src", src);

        // Add controls to component if requested.
        if (controls) this.setAttr("controls", "");
    }

    play() {
        // Reset playback position.
        this.setProp("currentTime", 0);

        // Begin playback.
        this.element.play();

        return this;
    }

    stop() {
        // Pause current playback.
        this.element.pause();

        // Reset playback position.
        this.setProp("currentTime", 0);

        return this;
    }

    pause() {
        // Pause current playback.
        this.element.pause();

        return this;
    }

    resume() {
        // Resume playback.
        this.element.play();

        return this;
    }

    mute() {
        // Mute audio output.
        this.setProp("muted", true);

        return this;
    }

    unmute() {
        // Unmute audio output.
        this.setProp("muted", false);

        return this;
    }

    isMuted() {
        // Return current mute state.
        return this.element.muted;
    }

    setPlaybackSpeed(speed) {
        // Set playback speed on element.
        this.setProp("playbackRate", speed);

        return this;
    }

    setVolume(volume) {
        // Set volume level on element.
        this.setProp("volume", volume);

        return this;
    }
}
