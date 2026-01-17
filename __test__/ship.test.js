const Ship = require('/modules/ship.js');

const position = [0, 1, 2, 3, 4];
const ship = new Ship(position);

test('getPosition() Test', () => {
    expect(ship.getPosition()).toBe(position);
});

test('isSunk/hit() Test', () => {
    for (let i = 0; i < 5; i++){
        ship.hit();
        i < 4 ? expect(ship.isSunk()).toBe(false) : expect(ship.isSunk()).toBe(true);
    }
});