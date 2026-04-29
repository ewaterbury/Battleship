jest.mock("../modules/gameboard.js", () => {
    return jest.fn().mockImplementation(() => ({
        addShip: jest.fn(),
        receiveAttack: jest.fn(),
        fleetSunk: jest.fn(),
        queryCell: jest.fn(),
        queryBoard: jest.fn(),
    }));
});

import Player from "../modules/player.js";
import Gameboard from "../modules/gameboard.js";

const BOARD_SIZE = 10;
const FLEET = [[1], [2], [3], [4], [5]];

let mockGameboard;
let player;

describe("Player", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockGameboard = new Gameboard(BOARD_SIZE);
        player = new Player(mockGameboard, FLEET);
    });

    describe("Initialization", () => {
        test("Calls addShip once for each ship in fleet", () => {
            expect(mockGameboard.addShip).toHaveBeenCalledTimes(FLEET.length);
        });
    });

    describe("receiveAttack", () => {
        test("Calls gameboard.receiveAttack with given index", () => {
            player.receiveAttack(0);
            expect(mockGameboard.receiveAttack).toHaveBeenCalledTimes(1);
            expect(mockGameboard.receiveAttack).toHaveBeenCalledWith(0);
        });
    });

    describe("gameOver", () => {
        test("Returns true when fleet is sunk", () => {
            mockGameboard.fleetSunk.mockReturnValueOnce(true);
            expect(player.gameOver()).toBe(true);
        });

        test("Returns false when fleet is not sunk", () => {
            mockGameboard.fleetSunk.mockReturnValueOnce(false);
            expect(player.gameOver()).toBe(false);
        });
    });

    describe("queryCell", () => {
        const empty = null;
        const hit = "hit";
        const miss = "miss";
        const sunk = "sunk";

        test("Returns null for non-attacked cell", () => {
            mockGameboard.queryCell.mockReturnValueOnce(empty);
            expect(player.queryCell(0)).toBe(null);
        });

        test("Returns 'hit' on cell holding hit ship", () => {
            mockGameboard.queryCell.mockReturnValueOnce(hit);
            expect(player.queryCell(0)).toBe("hit");
        });

        test("Returns 'miss' on attacked cell w/ no ship", () => {
            mockGameboard.queryCell.mockReturnValueOnce(miss);
            expect(player.queryCell(0)).toBe("miss");
        });

        test("Returns 'sunk' on cell holding sunk ship", () => {
            mockGameboard.queryCell.mockReturnValueOnce(sunk);
            expect(player.queryCell(0)).toBe("sunk");
        });
    });

    describe("queryBoard", () => {
        test("Returns correct gameboard", () => {
            const board = Array.from(
                { length: BOARD_SIZE ** 2 },
                (_, i) => null,
            );

            mockGameboard.queryBoard.mockReturnValueOnce(board);

            expect(player.queryBoard()).toBe(board);
        });
    });
});
