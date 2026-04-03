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
                describe("Mixed Board", () => {
                    let huntLogic;

                    const getAttacks = (gameboard) => {
                        Utilities.randomInt.mockReturnValue(offset); // Mock offset when initalizing huntLogic.

                        huntLogic = new HuntLogic(gameboard, fleet);

                        const attacks = [];

                        let next = huntLogic.getAttack();
                        while (next !== null) {
                            attacks.push(next);
                            next = huntLogic.getAttack();
                        }

                        return attacks;
                    };

                    // Build gameboard patterns for testing.
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

                    describe.each(Object.entries(gameboardsFns))(
                        "%s board",
                        (name, getGameboard) => {
                            let attacks;

                            beforeEach(() => {
                                attacks = getAttacks(getGameboard());
                            });

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
