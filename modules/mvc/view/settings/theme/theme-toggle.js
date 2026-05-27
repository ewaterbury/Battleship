import Button from "../../button.js";

export default class ThemeToggle extends Button {
    constructor() {
        // Check for previously saved theme.
        const savedTheme = localStorage.getItem("theme");

        // Get prefered theme.
        // Used saved theme if available.
        // Then fall back to system preference.
        // Then default to light.
        const initialTheme = savedTheme
            ? savedTheme
            : window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "dark"
              : "light";

        // Apply theme to <html> element.
        document.documentElement.setAttribute("data-theme", initialTheme);

        // Save prefered theme in local storage.
        localStorage.setItem("theme", initialTheme);

        // Initialize Button class with suport constructor.
        // Builds button and attaches callback to event handler.
        super("theme-button", () => {
            this.#toggleTheme();
            this.#updateText();
        });

        // Set button text.
        this.#updateText();
    }

    // Read current theme from the data-theme attribute.
    #getTheme() {
        return document.documentElement.getAttribute("data-theme");
    }

    // Toggle between themes.
    #toggleTheme() {
        const next = this.#getTheme() === "dark" ? "light" : "dark";

        // Apply theme to <html> element.
        document.documentElement.setAttribute("data-theme", next);

        // Save prefered theme in local storage.
        localStorage.setItem("theme", next);
    }

    // Update button display.
    // 🌙 displays on light mode and ☀️ displays on dark mode.
    #updateText() {
        this.setText(this.#getTheme() === "light" ? "🌙" : "☀️");
    }
}
