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
        );

        // Assign src.
        this.setAttr("src", src);

        // Add controls to componenet if requested.
        if (controls) this.setAttr("controls", "");
    }

    play() {
        this.setProp("currentTime", 0);
        this.element.play();
    }

    adjustPlaybackSpeed(speed) {
        //Set Playback Speed on element.
        this.setProp("playbackRate", 0);

        return this;
    }
}
