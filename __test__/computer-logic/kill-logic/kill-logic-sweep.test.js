const KillLogic = require("/modules/computer-logic/kill-logic.js");
const BOARDSIZES = [7, 8, 9, 10, 11, 12];
const FLEET = [2, 3, 3, 4, 5];
const HIT = "hit";
const longestShip = Math.max(...FLEET);

const getCell = (row, col, boardSize) => row * boardSize + col;

const getShip = {
    horizontal: function (row, col, length, boardSize) {
        const ship = [];
        for (let i = 0; i < length; i++)
            ship.push(getCell(row, col + i, boardSize));
        return ship;
    },

    vertical: function (row, col, length, boardSize) {
        const ship = [];
        for (let i = 0; i < length; i++)
            ship.push(getCell(row + i, col, boardSize));
        return ship;
    },
};

const getExpected = {
    single: function (cell, boardSize) {
        const attacks = [];

        // North Cell
        if (cell - boardSize >= 0) attacks.push(cell - boardSize);

        // South Cell
        if (cell + boardSize < boardSize ** 2) attacks.push(cell + boardSize);

        // East Cell
        if ((cell + 1) % boardSize > 0) attacks.push(cell + 1);

        // West Cell
        if (cell % boardSize > 0) attacks.push(cell - 1);

        return attacks;
    },

    horizontal: function (ship, boardSize) {
        const attacks = [];
        const front = ship[0];
        const rear = ship[ship.length - 1];

        // East Cell
        if ((rear + 1) % boardSize > 0) attacks.push(rear + 1);

        // West Cell
        if (front % boardSize > 0) attacks.push(front - 1);

        return attacks;
    },

    vertical: function (ship, boardSize) {
        const attacks = [];
        const front = ship[0];
        const rear = ship[ship.length - 1];

        // North Cell
        if (front - boardSize >= 0) attacks.push(front - boardSize);

        // South Cell
        if (rear + boardSize < boardSize ** 2) attacks.push(rear + boardSize);

        return attacks;
    },
};

for (const boardSize of BOARDSIZES) {
    describe(`Sweep Check, ${boardSize}x${boardSize}`, () => {
        const totalCells = boardSize ** 2;
        // Single Hits
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const cell = getCell(row, col, boardSize);

                test(`Single Hit (Cell ${cell})`, () => {
                    const view = Array(totalCells).fill(null);
                    view[cell] = HIT;

                    const expectedAttacks = getExpected.single(cell, boardSize);

                    expect(expectedAttacks).toContain(
                        new KillLogic(view, boardSize).attack(FLEET),
                    );
                });
            }
        }

        // Horizontal
        for (let hits = 2; hits < longestShip; hits++) {
            for (let row = 0; row < boardSize; row++) {
                for (let col = 0; col <= boardSize - hits; col++) {
                    const ship = getShip.horizontal(row, col, hits, boardSize);

                    test(`${ship.length} Hits (Cells ${ship}) [Horizontal]`, () => {
                        const view = Array(totalCells).fill(null);

                        ship.forEach((cell) => {
                            view[cell] = HIT;
                        });

                        const expectedAttacks = getExpected.horizontal(
                            ship,
                            boardSize,
                        );

                        expect(expectedAttacks).toContain(
                            new KillLogic(view, boardSize).attack(FLEET),
                        );
                    });
                }
            }
        }

        // Vertical
        for (let hits = 2; hits < longestShip; hits++) {
            for (let row = 0; row <= boardSize - hits; row++) {
                for (let col = 0; col < boardSize; col++) {
                    const ship = getShip.vertical(row, col, hits, boardSize);

                    test(`${ship.length} Hits (Cells ${ship}) [Vertical]`, () => {
                        const view = Array(totalCells).fill(null);

                        ship.forEach((cell) => {
                            view[cell] = HIT;
                        });

                        const expectedAttacks = getExpected.vertical(
                            ship,
                            boardSize,
                        );

                        expect(expectedAttacks).toContain(
                            new KillLogic(view, boardSize).attack(FLEET),
                        );
                    });
                }
            }
        }
    });
}
