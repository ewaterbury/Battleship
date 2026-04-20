class Player {
    #gameboard;

    constructor(gameboard, fleet) {
        this.#gameboard = gameboard; // Player's gameboard.
        fleet.forEach((ship) => this.#gameboard.addShip(ship)); // Adds player's fleet to gameboard.
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
