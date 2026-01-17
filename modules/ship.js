class Ship {
    #position
    #hits

    constructor(coordinates){
        this.#position = coordinates;
        this.#hits = 0;
    }

    getPosition(){
        return this.#position;
    }

    hit(){
        this.#hits++;
    }

    isSunk(){
        return this.#hits == this.#position.length ? true : false;
    }

}

module.exports = Ship;