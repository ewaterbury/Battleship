// Core Components
import ViewComponent from "../../view-component.js";

// Element Library
import { EL } from "../../../../constants.js";

// Imported Components
import AudioComponent from "../../audio/audio-component.js";
import Button from "../../button.js";

// Validation Library
import ValidationUtilities from "../../../../validation-utilities.js";

export default class MuteAudioSetting extends ViewComponent {
    #audioSources;
    #muteButton;
    #isMuted = false;

    constructor(buttonLabel, ...audioComponents) {
        // Initialize container (li) using super constructor.
        super(EL.LI);

        // |----- Validation -----|
        // Validate that buttonLabel is a string.
        if (!ValidationUtilities.isString(buttonLabel))
            throw new TypeError("buttonLabel must be non-empty string");

        // Validate that audio inputs are instances of AudioComponent.
        audioComponents.forEach((component) => {
            if (!(component instanceof AudioComponent))
                throw new TypeError(
                    "MuteAudioSetting only accepts instances of AudioComponent",
                );
        });

        // Save reference to audio loop for later access.
        this.#audioSources = audioComponents;

        // |----- UI Construction -----|
        this.append(new ViewComponent(EL.H3).setText(`Toggle ${buttonLabel}:`));

        // Build mute button with attached callback.
        this.#muteButton = new Button(
            `mute-${buttonLabel}`,
            this.#muteCallback,
        ).setText("🔊");

        this.append(this.#muteButton);
    }

    // Toggle mute state for all audio sources and update button state.
    #muteCallback = () => {
        if (!this.#isMuted) {
            this.#audioSources.forEach((audio) => audio.mute());
            this.#isMuted = true;
        } else {
            this.#audioSources.forEach((audio) => audio.unmute());
            this.#isMuted = false;
        }

        // Sync button text with current mute state.
        this.#muteButton.setText(this.#isMuted ? "🔈" : "🔊");
    };
}
