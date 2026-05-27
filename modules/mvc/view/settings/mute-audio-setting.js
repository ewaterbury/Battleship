import Component from "../view-component.js";
import AudioComponent from "../audio/audio-component.js";
import Button from "../button.js";

import { EL } from "../../../constants.js";

export default class MuteAudioSetting extends Component {
    #audioSources;
    #muteButton;
    #isMuted = false;

    constructor(buttonName, ...AudioComponents) {
        // Initialize container with super constructor.
        super(EL.LI);

        // Validate that buttonName is a string.
        if (!this.isString(buttonName))
            throw new TypeError("buttonName must be non-empty string");

        // Validate that audio inputs are instances of AudioComponent.
        AudioComponents.forEach((component) => {
            if (!(component instanceof AudioComponent))
                throw new TypeError(
                    "MuteAudioSetting only accepts instances of AudioComopnent",
                );
        });

        // Save reference to audio loop for later access.
        this.#audioSources = AudioComponents;

        // Build and append header.
        this.append(new Component(EL.H3).setText(`Toggle ${buttonName}:`));

        // Build mute button with attached callback.
        this.#muteButton = new Button(
            `mute-${buttonName}`,
            this.#muteCallback,
        ).setText("🔊");

        this.append(this.#muteButton);
    }

    // Callback to mute/unmute audio.
    #muteCallback = () => {
        if (!this.#isMuted) {
            this.#audioSources.forEach((audio) => audio.mute());
            this.#isMuted = true;
        } else {
            this.#audioSources.forEach((audio) => audio.unmute());
            this.#isMuted = false;
        }

        // Synch text to mute state.
        this.#muteButton.setText(this.#isMuted ? "🔈" : "🔊");
    };
}
