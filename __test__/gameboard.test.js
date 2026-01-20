const Gameboard = require('/modules/gameboard.js');
const Ship = require('/modules/ship.js');

beforeEach(() => {
    jest.clearAllMocks();
});

jest.mock('/modules/ship.js', () => {
    return jest.fn().mockImplementation(() => ({
        getPosition: jest.fn(),
        hit: jest.fn(),
        isSunk: jest.fn()
    }));
});

const mockShip = new Ship();

test('RevieveAttack [no hit] Test', () => {
    const gameboard = new Gameboard();
    gameboard.newShip(mockShip);
    mockShip.getPosition.mockReturnValue([0, 1, 2, 3, 4]);
    gameboard.recieveAttack(1, 1);
    expect(mockShip.hit).toHaveBeenCalledTimes(0);
});

test('RevieveAttack [no hit - hit] Test', () => {
    const gameboard = new Gameboard();
    gameboard.newShip(mockShip);
    mockShip.getPosition.mockReturnValue([0, 1, 2, 3, 4]);
    gameboard.recieveAttack(1, 1);
    expect(mockShip.hit).toHaveBeenCalledTimes(0);
    gameboard.recieveAttack(0, 0);
    expect(mockShip.hit).toHaveBeenCalledTimes(1);
});

test('fleetSunk Test', () => {
    const gameboard = new Gameboard();
    gameboard.newShip(mockShip);
    mockShip.isSunk.mockReturnValueOnce(true).mockReturnValueOnce(false);
    expect(gameboard.fleetSunk()).toBe(true);
    expect(gameboard.fleetSunk()).toBe(false);
});

test('queryStrike Test', () => {
     const gameboard = new Gameboard();
     gameboard.newShip(mockShip);
     gameboard.recieveAttack(0, 0);
     gameboard.recieveAttack(1, 1);
     expect(gameboard.queryStrike(0,0)).toBe(true);
     expect(gameboard.queryStrike(1,1)).toBe(false);
     expect(gameboard.queryStrike(2,2)).toBe(null);
});