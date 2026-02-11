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
    gameboard.receiveAttack(11);
    expect(mockShip.hit).toHaveBeenCalledTimes(0);
});

test('ReceiveAttack [no hit - hit] Test', () => {
    const gameboard = new Gameboard();
    gameboard.newShip(mockShip);
    mockShip.getPosition.mockReturnValue([0, 1, 2, 3, 4]);
    gameboard.receiveAttack(11);
    expect(mockShip.hit).toHaveBeenCalledTimes(0);
    gameboard.receiveAttack(0);
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
     gameboard.receiveAttack(0);
     gameboard.receiveAttack(11);
     expect(gameboard.queryStrike(0)).toBe(true);
     expect(gameboard.queryStrike(11)).toBe(false);
     expect(gameboard.queryStrike(22)).toBe(null);
});