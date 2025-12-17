const Ship = require('/modules/ship.js');

let ship = new Ship(5);

test('Ship Tests', () => {
    for (let i = 0; i<5; i++){
        ship.hit();
        i < 4 ? expect(ship.isSunk()).toBeFalsy : expect(ship.isSunk()).toBeTruthy;
    }
});