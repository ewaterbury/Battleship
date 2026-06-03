// Core Components
import Component from "../view-component.js";

// Element Library
import { EL } from "../../../constants.js";

// Imported Components
import ThemeSetting from "./theme/theme-setting.js"; // Theme selector.
import MuteAudioSetting from "./mute-audio-setting.js"; // Toggle sound effects.
import MuteLoopSetting from "./mute-loop-setting.js"; // Toggle background music.
import VolumeSetting from "./volume/volume-setting.js"; // Master volume control.

export default class SettingsView extends Component {
    constructor(backgroundAudio, ...effectAudio) {
        // Initialize container (section) and assign ID using super constructor.
        super(EL.SECTION, "settings-area");

        // |----- UI Construction -----|
        // Build and append menu header.
        this.append(new Component(EL.H2).setText("Settings:"));

        // Build menu element.
        const settingsMenu = new Component(EL.MENU, "settings-menu");

        // Add settings and provide audio references so controls can modify playback state.
        settingsMenu
            .append(new ThemeSetting())
            .append(new MuteAudioSetting("Effects", ...effectAudio))
            .append(new MuteLoopSetting("Sonar", backgroundAudio))
            .append(new VolumeSetting(backgroundAudio, effectAudio));

        // Append settings inside section container.
        this.append(settingsMenu);
    }
}
