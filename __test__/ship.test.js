const Ship = require('/modules/ship.js');

test('hit/isSunk Test', () => {
    const position = [0, 1, 2, 3, 4];
    const ship = new Ship(position);

    for (let i = 0; i < position.length - 1; i++){
        expect(ship.isSunk()).toBe(false);
        ship.hit();
    }

    ship.hit();
    expect(ship.isSunk()).toBe(true);
});

test('getPosition Test', () => {
    const position = [0];
    const ship = new Ship(position);
    expect(ship.getPosition()).toEqual(position);
})