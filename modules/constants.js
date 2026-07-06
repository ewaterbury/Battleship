export const CELL = { HIT: "hit", MISS: "miss", EMPTY: "empty", SUNK: "sunk" };

export const PLAYERS = { ATTACKER: "attacker", PLAYER: "player" };

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
    UL: "ul",
};

export const EVENT = {
    CLICK: "click",
    INPUT: "input",
    KEYDOWN: "keydown",
    MOUSE_ENTER: "mouseenter",
    MOUSE_LEAVE: "mouseleave",
};

export const DEFAULT_VALUES = {
    // Default Board Size
    BOARD_SIZE: {
        DEFAULT: 10,
        MIN: 7,
        MAX: 12,
    },

    // Default Ship Counts and Sizes
    SHIPS: {
        BATTLESHIP: { TYPE: "battleship", COUNT: 1, SIZE: 4 },
        CARRIER: { TYPE: "carrier", COUNT: 1, SIZE: 5 },
        CRUISER: { TYPE: "cruiser", COUNT: 2, SIZE: 3 },
        DESTROYER: { TYPE: "destroyer", COUNT: 1, SIZE: 2 },
    },

    // Possible Ship Orientations
    ORIENTATION: {
        VERTICAL: "vertical",
        HORIZONTAL: "horizontal",
    },
};
