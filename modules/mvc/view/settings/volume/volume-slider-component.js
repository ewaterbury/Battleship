import { EL } from "../../../constants.js";
import Component from "../view-component.js";

export default class VolumeSlider extends Component {
    #audioSources = [];

    constructor(id, ...audioSources) {
        super(EL.INPUT, id, "type", "min", "max", "step", "value");

        // Saves reference to audio component
        this.#audioSources = audioSources;

        [
            { attr: "type", value: "range" },
            { attr: "min", value: "0" },
            { attr: "max", value: "1" },
            { attr: "step", value: "0.01" },
            { attr: "value", value: "1" },
        ].forEach((pair) => {
            this.setAttr(pair.attr, pair.value);
        });

        this.on("input", (e) => {
            const volume = parseFloat(e.target.value);

            this.#audioSources.forEach((audio) => {
                if (audio.setVolume) {
                    audio.setVolume(volume);
                }
            });
        });
    }
}
