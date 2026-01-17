const Gameboard = require('/modules/gameboard.js');
const Ship = require('/modules/ship.js');

//Mocks Ship Class
jest.mock('/modules/ship.js', () => {
    return jest.fn().mockImplementation(() => ({
        getPosition: jest.fn(),
        hit: jest.fn(),
        isSunk: jest.fn()
    }));
});

//Generate Instance of Mock
const mockShip = new Ship();

test('RevieveAttack Test', () => {
    const gameboard = new Gameboard();
    gameboard.newShip(mockShip);
    mockShip.getPosition.mockReturnValue([0, 1, 2, 3, 4]);
    expect(gameboard.recieveAttack(1, 1)).toBeFalsy();
    expect(gameboard.recieveAttack(0, 0)).toBe(mockShip);
});

test('fleetSunk Test', () => {
    const gameboard = new Gameboard();
    gameboard.newShip(mockShip);
    mockShip.isSunk.mockReturnValueOnce(true).mockReturnValueOnce(false);
    expect(gameboard.fleetSunk()).toBe(true);
    expect(gameboard.fleetSunk()).toBe(false);
});