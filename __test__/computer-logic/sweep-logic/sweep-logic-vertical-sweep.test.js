const SweepLogic = require("/modules/computer-logic/sweep-logic.js");

const BOARD_SIZES = [9, 10];
const FLEET = [2, 3, 3, 4, 5];
const E = null;
const H = "hit";
const longestShip = Math.max(...FLEET);

const getCell = (row, col, boardSize) => row * boardSize + col;

const getShip = (row, col, length, boardSize) =>
    Array.from({ length }, (_, i) => getCell(row + i, col, boardSize));

const makeBoard = (totalCells, ship) => {
    const gameboard = Array(totalCells).fill(E);
    ship.forEach((cell) => (gameboard[cell] = H));
    return gameboard;
};

const getExpectedAttacks = (ship, boardSize) => {
    const filterExpectedAttacks = (attacks, boardSize) => {
        const filtered = [];

        // Define center rows.
        const center = {
            min: Math.floor((boardSize - 1) / 2),
            max: Math.ceil((boardSize - 1) / 2),
            parity: boardSize % 2,
        };

        let minDistance;

        // Perform filter (odd board).
        if (center.parity)
            for (const attack of attacks) {
                const row = Math.floor(attack / boardSize);
                const distance = Math.abs(center.min - row);
                if (minDistance === undefined) minDistance = distance;
                if (distance < minDistance) {
                    minDistance = distance;
                    filtered.length = 0;
                }
                if (minDistance === distance) filtered.push(attack);
            }
        // Perform filter (even board).
        else
            for (const attack of attacks) {
                const row = Math.floor(attack / boardSize);
                const distance = Math.min(
                    Math.abs(row - center.min),
                    Math.abs(row - center.max),
                );

                if (minDistance === undefined) minDistance = distance;
                if (distance < minDistance) {
                    minDistance = distance;
                    filtered.length = 0;
                }
                if (minDistance === distance) filtered.push(attack);
            }

        return filtered;
    };

    const attacks = [];

    // First and last cells of 'ship'.
    const north = ship[0];
    const south = ship[ship.length - 1];

    if (north - boardSize >= 0) attacks.push(north - boardSize);
    if (south + boardSize < boardSize ** 2) attacks.push(south + boardSize);

    // Return filtered attacks.
    return filterExpectedAttacks(attacks, boardSize);
};

describe("Sweep Logic", () => {
    describe.each(BOARD_SIZES)("Gameboard; %d^2", (boardSize) => {
        const totalCells = boardSize ** 2;
        for (let hits = 2; hits < longestShip; hits++) {
            for (let row = 0; row <= boardSize - hits; row++) {
                for (let col = 0; col < boardSize; col++) {
                    const ship = getShip(row, col, hits, boardSize);

                    test(`${ship.length} Hits (Cells ${ship}) [Vertical]`, () => {
                        const gameboard = makeBoard(totalCells, ship);

                        const expectedAttacks = getExpectedAttacks(
                            ship,
                            boardSize,
                        );

                        const generatedAttacks = new SweepLogic(
                            gameboard,
                        ).getAttacks(FLEET);

                        expect(generatedAttacks.sort()).toEqual(
                            expectedAttacks.sort(),
                        );
                    });
                }
            }
        }
    });
});
