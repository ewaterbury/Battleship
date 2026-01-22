const Player = require('/modules/player.js');
const Gameboard = require('/modules/gameboard.js');

beforeEach(() => {
    jest.clearAllMocks();
});

jest.mock('/modules/gameboard.js', () => {
    return jest.fn().mockImplementation(() => ({
        newShip: jest.fn(),
        recieveAttack: jest.fn(),
        fleetSunk: jest.fn(),
        queryStrike: jest.fn(),
    }));
});

const mockGameboard = new Gameboard();

test('setFleet', () => {
    const player = new Player(mockGameboard);
    const fleet = [[1], [2], [3], [4], [5]];
    player.setFleet(fleet);
    expect(mockGameboard.newShip).toHaveBeenCalledTimes(fleet.length);
});

test('recieveAttack Test', () => {
    const player = new Player(mockGameboard);
    player.recieveAttack(0, 0);
    expect(mockGameboard.recieveAttack).toHaveBeenCalledTimes(1);
});

test('gameOver Test', () => {
    const player = new Player(mockGameboard);
    mockGameboard.fleetSunk.mockReturnValueOnce(true).mockReturnValueOnce(false);
    expect(player.gameOver()).toBe(true);
    expect(player.gameOver()).toBe(false);
});

test('queryTile test', () => {
    const player = new Player(mockGameboard);
    mockGameboard.queryStrike.
    mockReturnValueOnce(null).
    mockReturnValueOnce(true).
    mockReturnValueOnce(false)
    expect(player.queryTile(0, 0)).toBe(null);
    expect(player.queryTile(0, 0)).toBe(true);
    expect(player.queryTile(0, 0)).toBe(false);
});