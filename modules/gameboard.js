const Ship = require('/modules/ship.js');

class Gameboard {
    #fleet
    #strikes

    constructor(){
        this.#fleet = []; //Holds Player Fleet
        this.#strikes = Array(100).fill(0); //Holds Opponent Attacks
    }

    newShip(ship){
        this.#fleet.push(ship);
    }

    recieveAttack(row, column){
        const strike = row * 10 + column; //Get strike tile
        let struckShip = undefined; //Pointer to struck ship

        //Check for hit and save struck ship
        for(let i = 0; i < this.#fleet.length; i++){
            
            
            for(let j = 0; j < this.#fleet[i].getPosition().length; j++)
                if(this.#fleet[i].getPosition()[j] == strike){
                    struckShip = this.#fleet[i];
                    i = this.#fleet.length;
                    break;
                }
        }

        struckShip ? this.#strikes[strike] = true : this.#strikes[strike] = false; //Marks tile on opponent attack board.
        if(struckShip)
            return struckShip; //Returns struck ship
    }


    fleetSunk(){
        for(let i = 0; i < this.#fleet.length; i++)
            if (!this.#fleet[i].isSunk())
                return false;
        return true;
    }

}

module.exports = Gameboard;