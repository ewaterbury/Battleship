export const CELL = { HIT: "hit", MISS: "miss", EMPTY: null, SUNK: "sunk" };

export const EL = {
    AUDIO: "audio",
    BUTTON: "button",
    DIV: "div",
    FORM: "form",
    H2: "h2",
    H3: "h3",
    INPUT: "input",
    LABEL: "label",
    LEGEND: "legend",
    LI: "li",
    MENU: "menu",
    OL: "ol",
    P: "p",
    SECTION: "section",
    SPAN: "span",
};

export const DEFAULT_VALUES = {
    // Default Board Size
    BOARD_SIZE: 10,

    // Default Ship Counts and Sizes
    BATTLESHIP: { COUNT: 1, SIZE: 4 },
    CARRIER: { COUNT: 1, SIZE: 5 },
    CRUISER: { COUNT: 2, SIZE: 3 },
    DESTROYER: { COUNT: 1, SIZE: 2 },
};
