class Player {
    #gameboard;

    constructor(gameboard) {
        this.#gameboard = gameboard; // Player's gameboard.
    }

    // Adds player's fleet to gameboard.
    setFleet(fleet) {
        fleet.forEach((ship) => this.#gameboard.addShip(ship));
    }

    // Calls opponent's attack on player's board.
    receiveAttack(attack) {
        this.#gameboard.receiveAttack(attack);
    }

    // Tests if player's fleet is sunk.
    gameOver() {
        return this.#gameboard.fleetSunk();
    }

    // Returns status of cell on opponent board.
    queryCell(cell) {
        return this.#gameboard.queryCell(cell);
    }

    // Returns player's view of opponent board.
    queryBoard() {
        return this.#gameboard.queryBoard();
    }
}

module.exports = Player;
