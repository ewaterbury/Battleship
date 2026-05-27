import ViewComponent from "../view-component.js";
import { EL } from "../../../constants.js";

export default class AudioComponent extends ViewComponent {
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

        // Add controls to component if requested.
        if (controls) this.setAttr("controls", "");
    }

    play() {
        this.setProp("currentTime", 0);
        this.element.play();

        return this;
    }

    pause() {
        this.element.pause();

        return this;
    }

    stop() {
        this.element.pause();
        this.setProp("currentTime", 0);

        return this;
    }

    mute() {
        this.setProp("muted", true);

        return this;
    }

    unmute() {
        this.setProp("muted", false);

        return this;
    }

    isMuted() {
        return this.element.muted;
    }

    setPlaybackSpeed(speed) {
        // Set Playback Speed on element.
        this.setProp("playbackRate", speed);

        return this;
    }

    setVolume(value) {
        // Set volume on element.
        this.setProp("volume", value);

        return this;
    }
}
