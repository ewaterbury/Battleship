const Gameboard = require("/modules/gameboard.js");
const Ship = require("/modules/ship.js");
const H = "hit";
const E = null;
const M = "miss";
const S = "sunk";

let mockShip;

beforeEach(() => {
    jest.clearAllMocks();
    mockShip = new Ship();
});

jest.mock("/modules/ship.js", () => {
    return jest.fn().mockImplementation(() => ({
        getPosition: jest.fn(),
        hit: jest.fn(),
        isSunk: jest.fn(),
    }));
});

test("receiveAttack [no hit] Test", () => {
    const gameboard = new Gameboard();
    gameboard.addShip(mockShip);
    mockShip.getPosition.mockReturnValue([0, 1, 2, 3, 4]);
    gameboard.receiveAttack(11);
    expect(mockShip.hit).toHaveBeenCalledTimes(0);
});

test("receiveAttack [no hit - hit] Test", () => {
    const gameboard = new Gameboard();
    gameboard.addShip(mockShip);
    mockShip.getPosition.mockReturnValue([0, 1, 2, 3, 4]);
    gameboard.receiveAttack(11);
    expect(mockShip.hit).toHaveBeenCalledTimes(0);
    gameboard.receiveAttack(0);
    expect(mockShip.hit).toHaveBeenCalledTimes(1);
});

test("fleetSunk Test [one ship]", () => {
    const gameboard = new Gameboard();
    gameboard.addShip(mockShip);
    mockShip.isSunk.mockReturnValueOnce(true).mockReturnValueOnce(false);
    expect(gameboard.fleetSunk()).toBe(true);
    expect(gameboard.fleetSunk()).toBe(false);
});

test("fleetSunk Test [multiple ships]", () => {
    const gameboard = new Gameboard();
    gameboard.addShip(mockShip, mockShip);
    mockShip.isSunk.mockReturnValueOnce(false).mockReturnValueOnce(true);
    expect(gameboard.fleetSunk()).toBe(false);
    mockShip.isSunk.mockReturnValueOnce(true).mockReturnValueOnce(true);
    expect(gameboard.fleetSunk()).toBe(true);
});

test("queryAttack Test [empty]", () => {
    const gameboard = new Gameboard();
    gameboard.addShip(mockShip);
    mockShip.getPosition.mockReturnValue([0, 1]);
    gameboard.receiveAttack(1);
    expect(gameboard.queryCell(11)).toBe(E);
});

test("queryCell Test [no hit]", () => {
    const gameboard = new Gameboard();
    gameboard.addShip(mockShip);
    mockShip.getPosition.mockReturnValue([0, 1]);
    gameboard.receiveAttack(11);
    expect(gameboard.queryCell(11)).toBe(M);
});

test("queryCell Test [hit]", () => {
    const gameboard = new Gameboard();
    gameboard.addShip(mockShip);
    mockShip.getPosition.mockReturnValue([0, 1]);
    gameboard.receiveAttack(1);
    expect(gameboard.queryCell(1)).toBe(H);
});

test("queryCell Test [hit - sunk]", () => {
    const gameboard = new Gameboard();
    gameboard.addShip(mockShip);
    mockShip.getPosition.mockReturnValue([0, 1]);
    mockShip.isSunk.mockReturnValueOnce(false).mockReturnValueOnce(true);
    gameboard.receiveAttack(0);
    expect(gameboard.queryCell(0)).toBe(H);
    gameboard.receiveAttack(1);
    expect(gameboard.queryCell(0)).toBe(S);
    expect(gameboard.queryCell(1)).toBe(S);
});
