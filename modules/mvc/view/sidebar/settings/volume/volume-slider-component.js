// Core Components
import ViewComponent from "../../../view-component.js";

// Element Library, Events Library
import { EL, EVENT } from "../../../../../constants.js";

export default class VolumeSlider extends ViewComponent {
    #audioSources = [];

    constructor(id, ...audioComponents) {
        // Initialize container (input) and assign ID using super constructor.
        super(
            EL.INPUT,
            id,

            // Whitelisted attributes (for setAttr/readAttr):
            "type",
            "min",
            "max",
            "step",
            "value",
        );

        // Store audio targets for volume updates.
        this.#audioSources = audioComponents;

        // |----- UI Construction -----|
        // Set attributes on input element.
        [
            { attr: "type", value: "range" },
            { attr: "min", value: "0" },
            { attr: "max", value: "1" },
            { attr: "step", value: "0.01" },
            { attr: "value", value: "1" },
        ].forEach((pair) => {
            this.setAttr(pair.attr, pair.value);
        });

        // |----- Behavior -----|
        // Add event listener using on method.
        this.on(EVENT.INPUT, (e) => {
            const volume = parseFloat(e.target.value); // Parse slider value from input event.

            this.#audioSources.forEach((audio) => {
                // Apply volume only to objects that implement setVolume.
                if (audio.setVolume) audio.setVolume(volume);
            });
        });
    }
}
