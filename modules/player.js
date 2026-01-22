const Gameboard = require('/modules/gameboard.js');

class Player{
    #gameboard

    constructor(gameboard){
        this.#gameboard = gameboard;
    }

    setFleet(fleet){
        fleet.forEach((ship) => {this.#gameboard.newShip(ship)});
    }

    recieveAttack(row, column){
        this.#gameboard.recieveAttack(row, column);
    }

    gameOver(){
        return this.#gameboard.fleetSunk();
    }

    queryTile(row, column){
        return this.#gameboard.queryStrike(row, column);
    }
}

module.exports = Player;