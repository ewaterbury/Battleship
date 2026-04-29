class Utilities {
    // Generate random number, inclusive.
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // Randomly shuffles array (Fisher–Yates shuffle).
    static shuffleInPlace(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const random = Utilities.randomInt(0, i);
            [array[i], array[random]] = [array[random], array[i]];
        }

        return array;
    }
}

export default Utilities;
