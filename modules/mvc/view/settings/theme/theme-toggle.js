// Core Components
import Button from "../../button.js";

export default class ThemeToggle extends Button {
    constructor() {
        // Initialize button with click handler for theme toggling.
        super("theme-button", () => {
            this.#toggleTheme();
            this.#updateText();
        });

        this.#resolveInitialTheme();
        this.#updateText();
    }

    #resolveInitialTheme() {
        // Get previously saved theme.
        const savedTheme = localStorage.getItem("theme");

        // Resolve initial theme: saved → system preference → light fallback
        const initialTheme = savedTheme
            ? savedTheme
            : window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "dark"
              : "light";

        // Apply theme to <html> element.
        document.documentElement.setAttribute("data-theme", initialTheme);

        // Save preferred theme in local storage.
        localStorage.setItem("theme", initialTheme);
    }

    // Read current theme from the data-theme attribute.
    #getCurrentTheme() {
        return document.documentElement.getAttribute("data-theme");
    }

    // Toggle between themes.
    #toggleTheme() {
        const next = this.#getCurrentTheme() === "dark" ? "light" : "dark";

        // Apply theme to <html> element.
        document.documentElement.setAttribute("data-theme", next);

        // Save preferred theme in local storage.
        localStorage.setItem("theme", next);
    }

    // Update button display.
    // 🌙 displays on light mode and ☀️ displays on dark mode.
    #updateText() {
        this.setText(this.#getCurrentTheme() === "light" ? "🌙" : "☀️");
    }
}
