// Core Components
import ViewComponent from "../../../view-component.js";

// Element Library
import { EL } from "../../../../../constants.js";

// Imported Components
import VolumeSlider from "./volume-slider-component.js"; // Volume control slider for audio sources.

export default class VolumeSetting extends ViewComponent {
    constructor(...audioSources) {
        // Initialize container (li) and assign ID using super constructor.
        super(EL.LI, "volume");

        // |----- UI Construction -----|
        this.append(new ViewComponent(EL.H3).setText("Volume:"));
        const slider = new VolumeSlider("volume-slider", ...audioSources);
        this.append(slider);
    }
}
