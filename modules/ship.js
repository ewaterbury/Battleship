class Ship {
    #position
    #hits

    constructor(cells){
        this.#position = cells;
        this.#hits = 0;
    }

    getPosition(){
        return this.#position;
    }

    hit(){
        this.#hits++;
    }

    isSunk(){
        return this.#hits == this.#position.length;
    }

}

module.exports = Ship;