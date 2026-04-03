class Player {
    #gameboard;

    constructor(gameboard) {
        this.#gameboard = gameboard; // Player's gameboard.
    }

    // Adds fleet to #gameboard.
    setFleet(fleet) {
        fleet.forEach((ship) => this.#gameboard.newShip(ship));
    }

    // Calls opponent's attack on player's board.
    receiveAttack(attack) {
        this.#gameboard.receiveAttack(attack);
    }

    // Tests if player's fleet is sunk.
    gameOver() {
        return this.#gameboard.fleetSunk();
    }

    // Returns status of cell.
    queryTile(cell) {
        return this.#gameboard.queryStrike(cell);
    }

    // Returns Player's View
    queryBoard() {
        return this.#gameboard.queryBoard();
    }
}

module.exports = Player;
