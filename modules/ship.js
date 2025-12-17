class Ship {
    #length
    #hits

    constructor(length){
        this.#length = length;
        this.#hits = 0;
    }

    hit(){
        this.#hits++;
    }

    isSunk(){
        return this.#hits == this.#length ? true : false;
    }

}

module.exports = Ship;