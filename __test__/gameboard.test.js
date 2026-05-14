import Gameboard from "../modules/gameboard.js";
const STD_BOARD = 10;
const H = "hit";
const E = null;
const M = "miss";
const S = "sunk";

const createMockShip = () => ({
    getPosition: jest.fn(),
    hit: jest.fn(),
    isSunk: jest.fn(),
});

describe("receiveAttack", () => {
    let mockShip;

    beforeEach(() => {
        mockShip = createMockShip();
    });

    test("Does not call ship.hit() on miss, then calls it on hit.", () => {
        const gameboard = new Gameboard(STD_BOARD);
        gameboard.addShip(mockShip);
        mockShip.getPosition.mockReturnValue([0, 1, 2, 3, 4]);
        gameboard.receiveAttack(11);
        expect(mockShip.hit).not.toHaveBeenCalled();
        gameboard.receiveAttack(0);
        expect(mockShip.hit).toHaveBeenCalledTimes(1);
    });

    test("queryCell returns miss on miss", () => {
        const gameboard = new Gameboard(STD_BOARD);
        gameboard.receiveAttack(11);
        expect(gameboard.queryCell(11)).toBe(M);
    });

    test("queryCell returns hit on hit", () => {
        const gameboard = new Gameboard(STD_BOARD);
        gameboard.addShip(mockShip);
        mockShip.getPosition.mockReturnValue([1]);
        gameboard.receiveAttack(1);
        expect(gameboard.queryCell(1)).toBe(H);
    });

    test("queryCell returns hit on hit and sunk when target sunk", () => {
        const gameboard = new Gameboard(STD_BOARD);
        gameboard.addShip(mockShip);
        mockShip.getPosition.mockReturnValue([0, 1]);
        mockShip.isSunk.mockReturnValueOnce(false).mockReturnValueOnce(true);
        gameboard.receiveAttack(0);
        expect(gameboard.queryCell(0)).toBe(H);
        gameboard.receiveAttack(1);
        expect(gameboard.queryCell(0)).toBe(S);
        expect(gameboard.queryCell(1)).toBe(S);
    });
});

describe("fleetSunk", () => {
    test("Returns false when single ship is not sunk", () => {
        const mockShip = createMockShip();
        const gameboard = new Gameboard(STD_BOARD);
        gameboard.addShip(mockShip);
        mockShip.isSunk.mockReturnValueOnce(false);
        expect(gameboard.fleetSunk()).toBe(false);
    });

    test("Returns true when single ship is sunk", () => {
        const mockShip = createMockShip();
        const gameboard = new Gameboard(STD_BOARD);
        gameboard.addShip(mockShip);
        mockShip.isSunk.mockReturnValueOnce(true);
        expect(gameboard.fleetSunk()).toBe(true);
    });

    test("Returns false when no ships are sunk", () => {
        const gameboard = new Gameboard(STD_BOARD);
        const ships = [createMockShip(), createMockShip(), createMockShip()];
        ships.forEach((ship) => ship.isSunk.mockReturnValue(false));
        ships.forEach((ship) => gameboard.addShip(ship));
        expect(gameboard.fleetSunk()).toBe(false);
    });

    test("Returns false when some ships are sunk", () => {
        const gameboard = new Gameboard(STD_BOARD);
        const ships = [createMockShip(), createMockShip(), createMockShip()];
        ships[0].isSunk.mockReturnValue(true);
        ships[1].isSunk.mockReturnValue(false);
        ships[2].isSunk.mockReturnValue(false);
        ships.forEach((ship) => gameboard.addShip(ship));
        expect(gameboard.fleetSunk()).toBe(false);
    });

    test("Returns true when all ships are sunk", () => {
        const gameboard = new Gameboard(STD_BOARD);
        const ships = [createMockShip(), createMockShip(), createMockShip()];
        ships.forEach((ship) => ship.isSunk.mockReturnValue(true));
        ships.forEach((ship) => gameboard.addShip(ship));
        expect(gameboard.fleetSunk()).toBe(true);
    });
});

describe("queryCell", () => {
    test("queryCell returns null on empty cell", () => {
        const gameboard = new Gameboard(STD_BOARD);
        expect(gameboard.queryCell(1)).toBe(E);
    });
});

describe("queryBoard", () => {
    const BOARD_SIZES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    describe.each(BOARD_SIZES)("Gameboard: %d^2", (boardsize) => {
        test("Returns correct board", () => {
            const gameboard = new Gameboard(boardsize);
            expect(gameboard.queryBoard()).toEqual(
                Array(boardsize ** 2).fill(E),
            );
        });
    });
});

describe("sunkShipAt", () => {
    let mockShip;

    beforeEach(() => {
        mockShip = createMockShip();
    });

    test("Returns null on no sunk ship", () => {
        const gameboard = new Gameboard(STD_BOARD);
        gameboard.addShip(mockShip);
        mockShip.getPosition.mockReturnValue([0, 1]);
        mockShip.isSunk.mockReturnValue(false);
        gameboard.receiveAttack(1);
        expect(gameboard.sunkShipAt(0)).toBe(null);
    });

    test("Returns full position for sunk ship", () => {
        const gameboard = new Gameboard(STD_BOARD);
        gameboard.addShip(mockShip);
        mockShip.getPosition.mockReturnValue([0, 1]);
        mockShip.isSunk.mockReturnValue(true);
        gameboard.receiveAttack(1);
        expect(gameboard.sunkShipAt(0)).toEqual([0, 1]);
        expect(gameboard.sunkShipAt(1)).toEqual([0, 1]);
    });
});
