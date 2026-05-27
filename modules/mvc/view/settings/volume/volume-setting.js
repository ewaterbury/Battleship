import Component from "../view-component.js";
import AudioLoop from "../audio/audio-loop-component.js";
import Button from "../button.js";
import VolumeSlider from "../audio/volume-slider-component.js";
import { EL } from "../../../constants.js";

export default class VolumeSetting extends Component {
    #audioSources;
    #slider;

    constructor(...audioSources) {
        // Initialize container with super constructor.
        super(EL.LI, "volume");

        // Build volume slider.
        this.#slider = new VolumeSlider("volume-slider", ...audioSources);

        // Build and append heading.
        this.append(new Component(EL.H3).setText("Volume:"));

        // Append slider
        this.append(this.#slider);
    }
}
