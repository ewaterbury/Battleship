// Mock randomness in Utility for deterministic output.
jest.mock("../../../modules/utilities", () => ({
    randomInt: jest.fn(),
    shuffleInPlace: jest.fn(),
}));

// Import HuntLogic module for testing and Utilities for mocking.
const Utilities = require("../../../modules/utilities");
const HuntLogic = require("../../../modules/computer-logic/hunt-logic.js");

// Fleets and boardsizes used in testing.
const FLEETS = [[2], [3], [4], [5], [2, 3, 3, 4, 5]];
const BOARD_SIZES = [7, 8, 9, 10, 11, 12];

// Constants representing cell states on gameboard.
const E = null;
const M = "miss";

// Get row/col for given cell/gameboard.
const getRow = (cell, boardSize) => Math.floor(cell / boardSize);
const getCol = (cell, boardSize) => cell % boardSize;

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

            // Get possible offsets from smallest possible ship,
            const offsets = [...Array(minShip).keys()];

            // Iterates through possible offsets.
            describe.each(offsets)("Offset: %d", (offset) => {
                describe("Empty Board", () => {
                    let attacks;

                    // Set up gameboard, huntLogic, and attacks array before each test.
                    beforeEach(() => {
                        // Mock randomInt for correct offset.
                        Utilities.randomInt.mockReturnValue(offset);

                        const gameboard = buildBoard(totalCells, (i) => true);
                        const huntLogic = new HuntLogic(gameboard, fleet);

                        // Build array of attacks in huntLogic atack queue.
                        attacks = [];
                        let next = huntLogic.getAttack();
                        while (next !== null) {
                            attacks.push(next);
                            next = huntLogic.getAttack();
                        }
                    });

                    test("No duplicates", () => {
                        expect(new Set(attacks).size).toEqual(attacks.length);
                    });

                    test("Valid row spacing", () => {
                        // Sort attacks
                        const sorted = [...attacks].sort((a, b) => a - b);

                        for (let row = 0; row < boardSize; row++) {
                            const rowCells = sorted.filter(
                                (cell) => getRow(cell, boardSize) === row,
                            );

                            for (let i = 0; i < rowCells.length - 1; i++)
                                expect(rowCells[i + 1] - rowCells[i]).toBe(
                                    minShip,
                                );
                        }
                    });

                    test("Valid column spacing", () => {
                        const sorted = [...attacks].sort((a, b) => a - b);

                        for (let col = 0; col < boardSize; col++) {
                            const colCells = sorted.filter(
                                (cell) => getCol(cell, boardSize) === col,
                            );

                            for (let i = 0; i < colCells.length - 1; i++)
                                expect(colCells[i + 1] - colCells[i]).toBe(
                                    minShip * boardSize,
                                );
                        }
                    });

                    test("Attacks appear in correct order", () => {
                        const followsExpectedOrder = (attacks) => {
                            let front = 0;
                            for (front; front < attacks.length; front++) {
                                const col = getCol(attacks[front], boardSize);
                                if (col % 4 === 0 || col % 4 === 1) break;
                            }
                            for (front; front < attacks.length; front++) {
                                const col = getCol(attacks[front], boardSize);
                                if (col % 4 === 2 || col % 4 === 3)
                                    return false;
                            }

                            return true;
                        };

                        expect(followsExpectedOrder(attacks)).toBe(true);
                    });
                });
            });
        });
    });
});
