// Mock randomness in Utility for deterministic output.
jest.mock("../../../modules/utilities", () => ({
    randomInt: jest.fn(),
    shuffleInPlace: jest.fn(),
}));

// Imported modules.
const Utilities = require("../../../modules/utilities");
const HuntLogic = require("../../../modules/computer-logic/hunt-logic.js");

// Fleets and boardsizes used in testing.
const FLEETS = [[2], [3], [4], [5], [2, 3, 3, 4, 5]];
const BOARD_SIZES = [7, 8, 9, 10, 11, 12];

// Constants representing cell states on gameboard.
const E = null;
const M = "miss";

// Build a gameboard using a callback function to determine cell status.
const buildBoard = (cells, check) =>
    Array.from({ length: cells }, (_, i) => (check(i) ? E : M));

// Mock shuffleInPlace before each test to bypass shuffling.
beforeAll(() => {
    Utilities.shuffleInPlace.mockImplementation((arr) => arr);
});

describe("Hunt Logic", () => {
    // Iterate through board sizes.
    describe.each(BOARD_SIZES)("Gameboard: %d^2", (boardSize) => {
        const totalCells = boardSize ** 2;

        // Iterate through fleet sizes.
        describe.each(FLEETS)("Fleet: %j", (fleet) => {
            fleet = [fleet].flat();

            const minShip = Math.min(...fleet); // Smallest ship in fleet.

            const offsets = [...Array(minShip).keys()]; // Get possible offsets for smallest ship.

            // Iterate through possible offsets.
            describe.each(offsets)("Offset: %d", (offset) => {
                describe("Full Board", () => {
                    let attack;

                    beforeEach(() => {
                        Utilities.randomInt.mockReturnValue(offset); // Mock offset when initalizing huntLogic.

                        const gameboard = buildBoard(totalCells, (i) => false); // Build gameboard.

                        const huntLogic = new HuntLogic(gameboard, fleet); // Initialize huntLogic.

                        attack = huntLogic.getAttack();
                    });

                    // Ensure that huntLogic returns null on full gameboard.
                    test("Null is returned", () => {
                        expect(attack).toBeNull();
                    });
                });
            });
        });
    });
});
