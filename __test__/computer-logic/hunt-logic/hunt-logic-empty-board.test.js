// Mock randomness in Utility.
jest.mock("../../../modules/utilities", () => ({
    randomInt: jest.fn(),
    shuffleInPlace: jest.fn(),
}));

const Utilities = require("../../../modules/utilities");
const HuntLogic = require("../../../modules/computer-logic/hunt-logic.js");

// Bypass shuffling in inital Hunt logic.
beforeAll(() => Utilities.shuffleInPlace.mockImplementation((arr) => arr));

const getRow = (cell, boardSize) => Math.floor(cell / boardSize);
const getCol = (cell, boardSize) => cell % boardSize;
const buildBoard = (cells, check) =>
    Array.from({ length: cells }, (_, i) => (check(i) ? E : M));

const FLEETS = [[2], [3], [4], [5], [2, 3, 3, 4, 5]];
const BOARD_SIZES = [7, 8, 9, 10, 11, 12];
const E = null;
const M = "miss";

describe("Hunt Logic", () => {
    describe.each(BOARD_SIZES)("Gameboard: %d^2", (boardSize) => {
        const totalCells = boardSize ** 2;
        describe.each(FLEETS)("Fleet: %j", (fleet) => {
            fleet = [fleet].flat();

            const minShip = Math.min(...fleet);

            const offsets = [...Array(minShip).keys()]; // Get possible offsets.

            describe.each(offsets)("Offset: %d", (offset) => {
                describe("Empty Board", () => {
                    let attacks;

                    beforeEach(() => {
                        Utilities.randomInt.mockReturnValue(offset); // Mock offset when initalizing huntLogic.

                        const gameboard = buildBoard(totalCells, (i) => true);
                        const huntLogic = new HuntLogic(gameboard, fleet);

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
