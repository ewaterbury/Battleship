// Mock randomness in Utility.
jest.mock("../../../modules/utilities", () => ({
    randomInt: jest.fn(),
    shuffleInPlace: jest.fn(),
}));

const Utilities = require("../../../modules/utilities");
const HuntLogic = require("../../../modules/computer-logic/hunt-logic.js");

// Mock shuffleInPlace before each test to bypass shuffling.
beforeAll(() => Utilities.shuffleInPlace.mockImplementation((arr) => arr));

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
                describe("Full Board", () => {
                    let attack;

                    beforeEach(() => {
                        Utilities.randomInt.mockReturnValue(offset); // Mock offset when initalizing huntLogic.

                        const gameboard = buildBoard(totalCells, (i) => false);

                        const huntLogic = new HuntLogic(gameboard, fleet);

                        attack = huntLogic.getAttack();
                    });

                    test("Null is returned", () => {
                        expect(attack).toBeNull();
                    });
                });
            });
        });
    });
});
