class Gameboard {
    #fleet
    #strikes

    constructor(){
        this.#fleet = []; // Holds player's fleet.
        this.#strikes = Array(100).fill(null); // Holds opponent's attacks.
    }

    newShip(ship){
        this.#fleet.push(ship); // Adds ship to #fleet.
    }

    receiveAttack(cell){
        let struckShip = undefined; // Pointer to struck ship.

        //Check for hit and save struck ship.
        for(let i = 0; i < this.#fleet.length; i++){
            for(let j = 0; j < this.#fleet[i].getPosition().length; j++)
                if(this.#fleet[i].getPosition()[j] == cell){
                    struckShip = this.#fleet[i];
                    i = this.#fleet.length;
                    break;
                }
        }

        struckShip ? this.#strikes[cell] = true : this.#strikes[cell] = false; //Marks tile on opponent attack board.
        if(struckShip)
            struckShip.hit(); //Calls hit on struck ship.
    }

    fleetSunk(){
        for(let i = 0; i < this.#fleet.length; i++) //Queries if fleet is sunk and returns result.
            if (!this.#fleet[i].isSunk())
                return false;
        return true;
    }

    queryStrike(cell){
        return this.#strikes[cell]; //Queries hit status on a specific tile.
    }
}

module.exports = Gameboard;