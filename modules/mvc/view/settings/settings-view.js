import { EL } from "../../../constants.js";
import Component from "../view-component.js";

// Import settings menu's components.
import ThemeSetting from "./theme/theme-setting.js"; // Menu item to change site theme.
import MuteAudioSetting from "./mute-audio-setting.js"; // Menu item to mute audio (Game effects).
import MuteLoopSetting from "./mute-loop-setting.js"; // Menu item to mute loop (Background track).
import VolumeSetting from "./volume/volume-setting.js"; // Menu item for application volume (Slider).

export default class SettingsView extends Component {
    constructor(backgroundAudio, ...gameAudio) {
        // Initialize root element (section) using super constructor.
        super(EL.SECTION, "settings-area");

        // Build and append menu header.
        this.append(new Component(EL.H2).setText("Settings:"));

        // Build menu element, store reference in #settings.
        const settings = new Component(EL.MENU, "settings-menu");

        // Add settings to menu (Pass references to audio to correct componenets).
        settings.append(new ThemeSetting());
        settings.append(new MuteAudioSetting("Game-Effects", ...gameAudio));
        settings.append(
            new MuteLoopSetting("Background-Audio", backgroundAudio),
        );
        settings.append(new VolumeSetting(backgroundAudio, gameAudio));
    }
}
