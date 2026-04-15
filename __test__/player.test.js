const Player = require("/modules/player.js");
const Gameboard = require("/modules/gameboard.js");
let mockGameboard;

beforeEach(() => {
    jest.clearAllMocks();
    mockGameboard = new Gameboard();
});

jest.mock("/modules/gameboard.js", () => {
    return jest.fn().mockImplementation(() => ({
        addShip: jest.fn(),
        receiveAttack: jest.fn(),
        fleetSunk: jest.fn(),
        queryCell: jest.fn(),
    }));
});

test("setFleet Test", () => {
    const player = new Player(mockGameboard);
    const fleet = [[1], [2], [3], [4], [5]];
    player.setFleet(fleet);
    expect(mockGameboard.addShip).toHaveBeenCalledTimes(fleet.length);
});

test("receiveAttack Test", () => {
    const player = new Player(mockGameboard);
    player.receiveAttack(0);
    expect(mockGameboard.receiveAttack).toHaveBeenCalledTimes(1);
});

test("gameOver Test", () => {
    const player = new Player(mockGameboard);
    mockGameboard.fleetSunk
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);
    expect(player.gameOver()).toBe(true);
    expect(player.gameOver()).toBe(false);
});

test("queryCell test", () => {
    const player = new Player(mockGameboard);
    mockGameboard.queryCell
        .mockReturnValueOnce(null)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);
    expect(player.queryCell(0)).toBe(null);
    expect(player.queryCell(0)).toBe(true);
    expect(player.queryCell(0)).toBe(false);
});
