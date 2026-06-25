// Core Components
import ViewComponent from "../../view-component.js";

// Element Library
import { EL } from "../../../../constants.js";

// Imported Components
import AudioLoop from "../../audio/audio-loop-component.js"; // Looping audio controller.
import Button from "../../button.js"; // Reusable button component.

// Validation Library
import ValidationUtilities from "../../../../validation-utilities.js";

export default class MuteLoopSetting extends ViewComponent {
    #audioLoops;
    #muteButton;
    #isMuted = false;

    constructor(buttonLabel, ...audioLoops) {
        // Initialize container (li) using super constructor.
        super(EL.LI);

        // |----- Validation -----|
        // Validate that buttonLabel is a string.
        if (!ValidationUtilities.isString(buttonLabel))
            throw new TypeError("buttonLabel must be non-empty string");

        // Validate that audio inputs are instances of AudioLoop.
        audioLoops.forEach((loop) => {
            if (!(loop instanceof AudioLoop))
                throw new TypeError(
                    "MuteLoopSetting only accepts instances of AudioLoop",
                );
        });

        // Save reference to audio loop for later access.
        this.#audioLoops = audioLoops;

        // |----- UI Construction -----|
        this.append(new ViewComponent(EL.H3).setText(`Toggle ${buttonLabel}:`));

        // Build mute button with attached callback.
        this.#muteButton = new Button(
            `mute-${buttonLabel}`,
            this.#muteCallback,
        ).setText("🔊");

        this.append(this.#muteButton);
    }

    // Toggle loop playback and update button state.
    #muteCallback = () => {
        if (!this.#isMuted) {
            this.#audioLoops.forEach((loop) => loop.stopLoop());
            this.#isMuted = true;
        } else {
            this.#audioLoops.forEach((loop) => loop.startLoop());
            this.#isMuted = false;
        }

        // Sync button text with current mute state.
        this.#muteButton.setText(this.#isMuted ? "🔈" : "🔊");
    };
}
