// Core Components
import Component from "../../view-component.js";

// Element Library
import { EL } from "../../../../constants.js";

// Imported Components
import VolumeSlider from "./volume-slider-component.js"; // Volume control slider for audio sources.

export default class VolumeSetting extends Component {
    constructor(...audioSources) {
        // Initialize container (li) and assign ID using super constructor.
        super(EL.LI, "volume");

        // |----- UI Construction -----|
        // Build and append heading.
        this.append(new Component(EL.H3).setText("Volume:"));

        // Build and append volume slider.
        const slider = new VolumeSlider("volume-slider", ...audioSources);
        this.append(slider);
    }
}
