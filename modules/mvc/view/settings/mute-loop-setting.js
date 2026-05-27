import Component from "../view-component.js";
import AudioLoop from "../audio/audio-loop-component.js";
import Button from "../button.js";
import { EL } from "../../../constants.js";

export default class MuteLoopSetting extends Component {
    #audioLoops;
    #muteButton;
    #isMuted = false;

    constructor(buttonName, ...AudioLoops) {
        // Initialize container with super constructor.
        super(EL.LI);

        // Validate that buttonName is a string.
        if (!this.isString(buttonName))
            throw new TypeError("buttonName must be non-empty string");

        // Validate that audio inputs are instances of AudioComponent.
        AudioComponents.forEach((component) => {
            if (!(component instanceof AudioLoop))
                throw new TypeError(
                    "MuteAudioSetting only accepts instances of AudioLoop",
                );
        });

        // Save reference to audio loop for later access.
        this.#audioLoops = AudioLoops;

        // Build and append header.
        this.append(new Component(EL.H3).setText(`Toggle ${buttonName}:`));

        // Build mute button with attached callback.
        this.#muteButton = new Button(
            `mute-${buttonName}`,
            this.#muteCallback,
        ).setText("🔊");

        this.append(this.#muteButton);
    }

    // Callback that stops loop.
    #muteCallback = () => {
        if (!this.#isMuted) {
            this.#audioLoops.forEach((loop) => loop.startLoop());
            this.#isMuted = true;
        } else {
            this.#audioLoops.forEach((loop) => loop.stopLoop());
            this.#isMuted = true;
        }

        // Synch text to mute state.
        this.#muteButton.setText(this.#isMuted ? "🔈" : "🔊");
    };
}
