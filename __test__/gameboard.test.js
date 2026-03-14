const Gameboard = require('/modules/gameboard.js');
const Ship = require('/modules/ship.js');
let mockShip;

beforeEach(() => {
    jest.clearAllMocks();
    mockShip = new Ship();
});

jest.mock('/modules/ship.js', () => {
    return jest.fn().mockImplementation(() => ({
        getPosition: jest.fn(),
        hit: jest.fn(),
        isSunk: jest.fn()
    }));
});

test('receiveAttack [no hit] Test', () => {
    const gameboard = new Gameboard();
    gameboard.newShip(mockShip);
    mockShip.getPosition.mockReturnValue([0, 1, 2, 3, 4]);
    gameboard.receiveAttack(11);
    expect(mockShip.hit).toHaveBeenCalledTimes(0);
});

test('receiveAttack [no hit - hit] Test', () => {
    const gameboard = new Gameboard();
    gameboard.newShip(mockShip);
    mockShip.getPosition.mockReturnValue([0, 1, 2, 3, 4]);
    gameboard.receiveAttack(11);
    expect(mockShip.hit).toHaveBeenCalledTimes(0);
    gameboard.receiveAttack(0);
    expect(mockShip.hit).toHaveBeenCalledTimes(1);
});

test('fleetSunk Test [one ship]', () => {
    const gameboard = new Gameboard();
    gameboard.newShip(mockShip);
    mockShip.isSunk.mockReturnValueOnce(true).mockReturnValueOnce(false);
    expect(gameboard.fleetSunk()).toBe(true);
    expect(gameboard.fleetSunk()).toBe(false);
});

test('fleetSunk Test [multiple ships]', () => {
    const gameboard = new Gameboard();
    gameboard.newShip(mockShip, mockShip);
    mockShip.isSunk.mockReturnValueOnce(false).mockReturnValueOnce(true);
    expect(gameboard.fleetSunk()).toBe(false);
    mockShip.isSunk.mockReturnValueOnce(true).mockReturnValueOnce(true);
    expect(gameboard.fleetSunk()).toBe(true);
})

test('queryAttack Test [null]', () => {
    const gameboard = new Gameboard();
    gameboard.newShip(mockShip);
    mockShip.getPosition.mockReturnValue([0, 1]);
    gameboard.receiveAttack(1);
    expect(gameboard.queryAttack(11)).toBe(null);
});

test('queryAttack Test [no hit]', () => {
    const gameboard = new Gameboard();
    gameboard.newShip(mockShip);
    mockShip.getPosition.mockReturnValue([0, 1]);
    gameboard.receiveAttack(11);
    expect(gameboard.queryAttack(11)).toBe('miss');
});

test('queryAttack Test [hit]', () => {
    const gameboard = new Gameboard();
    gameboard.newShip(mockShip);
    mockShip.getPosition.mockReturnValue([0, 1]);
    gameboard.receiveAttack(1);
    expect(gameboard.queryAttack(1)).toBe('hit');
});

test('queryAttack Test [hit - sunk]', () => {
    const gameboard = new Gameboard();
    gameboard.newShip(mockShip);
    mockShip.getPosition.mockReturnValue([0, 1]);
    mockShip.isSunk.mockReturnValueOnce(false).mockReturnValueOnce(true);
    gameboard.receiveAttack(0);
    expect(gameboard.queryAttack(0)).toBe('hit');
    gameboard.receiveAttack(1);
    expect(gameboard.queryAttack(0)).toBe('sunk');
    expect(gameboard.queryAttack(1)).toBe('sunk');
});