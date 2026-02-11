class Player{
    #gameboard

    constructor(gameboard){
        this.#gameboard = gameboard;
    }

    setFleet(fleet){
        fleet.forEach(ship => this.#gameboard.newShip(ship));
    }

    receiveAttack(cell){
        this.#gameboard.receiveAttack(cell);
    }

    gameOver(){
        return this.#gameboard.fleetSunk();
    }

    queryTile(cell){
        return this.#gameboard.queryStrike(cell);
    }
}

module.exports = Player;