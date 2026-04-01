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
            const offsets = [...Array(minShip).keys()]; // Get possible offsets for smallest ship.

            // Iterate through possible offsets.
            describe.each(offsets)("Offset: %d", (offset) => {
                describe("Mixed Board", () => {
                    let huntLogic;

                    // Build array of attacks that will be tested.
                    const getAttacks = (gameboard) => {
                        Utilities.randomInt.mockReturnValue(offset); // Mock offset when initalizing huntLogic.

                        huntLogic = new HuntLogic(gameboard, fleet); // Initialize huntLogic.

                        // Collect all attacks
                        const attacks = [];
                        let next = huntLogic.getAttack();
                        while (next !== null) {
                            attacks.push(next);
                            next = huntLogic.getAttack();
                        }

                        return attacks;
                    };

                    // Functions to build gameboard patterns for testing.
                    const gameboardsFns = {
                        oddCellsEmpty: () =>
                            buildBoard(totalCells, (i) => i % 2),
                        evenCellsEmpty: () =>
                            buildBoard(totalCells, (i) => !(i % 2)),
                        oddRowsEmpty: () =>
                            buildBoard(
                                totalCells,
                                (i) => getRow(i, boardSize) % 2,
                            ),
                        evenRowsEmpty: () =>
                            buildBoard(
                                totalCells,
                                (i) => !(getRow(i, boardSize) % 2),
                            ),
                        oddColsEmpty: () =>
                            buildBoard(
                                totalCells,
                                (i) => getCol(i, boardSize) % 2,
                            ),
                        evenColsEmpty: () =>
                            buildBoard(
                                totalCells,
                                (i) => !(getCol(i, boardSize) % 2),
                            ),
                    };

                    // Run tests for each board pattern
                    describe.each(Object.entries(gameboardsFns))(
                        "%s board",
                        (name, getGameboard) => {
                            let attacks;

                            // Get attacks for current board.
                            beforeEach(() => {
                                attacks = getAttacks(getGameboard());
                            });

                            // Ensure there are no duplicate attacks
                            test("No duplicates", () => {
                                expect(new Set(attacks).size).toEqual(
                                    attacks.length,
                                );
                            });

                            // Ensure attacks occur only on valid empty cells
                            test("Correct cells appear", () => {
                                for (const attack of attacks)
                                    switch (name) {
                                        case "oddCellsEmpty":
                                            expect(attack % 2).toBeTruthy();
                                            break;
                                        case "evenCellsEmpty":
                                            expect(!(attack % 2)).toBeTruthy();
                                            break;
                                        case "oddRowsEmpty":
                                            expect(
                                                getRow(attack, boardSize) % 2,
                                            ).toBeTruthy();
                                            break;
                                        case "evenRowsEmpty":
                                            expect(
                                                !(
                                                    getRow(attack, boardSize) %
                                                    2
                                                ),
                                            ).toBeTruthy();
                                            break;
                                        case "oddColsEmpty":
                                            expect(
                                                getCol(attack, boardSize) % 2,
                                            ).toBeTruthy();
                                            break;
                                        case "evenColsEmpty":
                                            expect(
                                                !(
                                                    getCol(attack, boardSize) %
                                                    2
                                                ),
                                            ).toBeTruthy();
                                            break;
                                    }
                            });
                        },
                    );
                });
            });
        });
    });
});
