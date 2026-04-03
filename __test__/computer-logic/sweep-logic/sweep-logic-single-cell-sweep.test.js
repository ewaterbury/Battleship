const SweepLogic = require("/modules/computer-logic/sweep-logic.js");

const BOARD_SIZES = [9, 10];
const FLEET = [2, 3, 3, 4, 5];
const E = null;
const H = "hit";

const getCell = (row, col, boardSize) => row * boardSize + col;

const makeBoard = (totalCells, cell) => {
    const gameboard = Array(totalCells).fill(E);
    gameboard[cell] = H;
    return gameboard;
};

const getExpectedAttacks = (cell, boardSize) => {
    // Helpers for getting adjacent cells.
    const N = () => cell - boardSize;
    const S = () => cell + boardSize;
    const E = () => cell + 1;
    const W = () => cell - 1;

    const row = Math.floor(cell / boardSize);
    const col = cell % boardSize;

    const attacks = [];

    // Define center columns/rows.
    const center = {
        min: Math.floor((boardSize - 1) / 2),
        max: Math.ceil((boardSize - 1) / 2),
        parity: boardSize % 2,
    };

    // Hold center columns in iterative structure.
    const centerArr = [center.min, center.max];

    const isCenter = () => centerArr.includes(row) && centerArr.includes(col);

    const isCenterAdj = () => {
        if (center.parity) {
            const isAdj = [
                Math.abs(row - center.min),
                Math.abs(col - center.min),
            ];
            return isAdj.includes(0) && isAdj.includes(1);
        } else {
            const rowAdj = [
                Math.abs(row - center.min),
                Math.abs(row - center.max),
            ];

            const colAdj = [
                Math.abs(col - center.min),
                Math.abs(col - center.max),
            ];

            return (
                !isDiagonal() &&
                (rowAdj.includes(0) || rowAdj.includes(1)) &&
                (colAdj.includes(0) || colAdj.includes(1))
            );
        }
    };

    const isCenterTrack = () =>
        (centerArr.includes(row) && !centerArr.includes(col)) ||
        (!centerArr.includes(row) && centerArr.includes(col));

    const isDiagonal = () => {
        if (col === row) return true;
        return boardSize - Math.max(row, col) === Math.min(row, col) + 1;
    };
    // Determine expected attacks based on cell position category.

    // Center cell (attack all directions).
    if (isCenter()) attacks.push(...[N(), S(), E(), W()]);
    // Adjacent to center (attack away from center).
    else if (isCenterAdj()) {
        if (row < center.min) attacks.push(...[S(), E(), W()]);
        else if (row > center.max) attacks.push(...[N(), E(), W()]);
        else if (col > center.max) attacks.push(...[N(), S(), W()]);
        else attacks.push(...[N(), S(), E()]);
    }

    // On center row/column (attack N/S or E/W directions).
    else if (isCenterTrack()) {
        if (centerArr.includes(row)) attacks.push(N(), S());
        else attacks.push(E(), W());
    }
    // On diagonal (attack toward center, two attacks).
    else if (isDiagonal()) {
        if (row === col) {
            if (row < center.min) attacks.push(S(), E());
            else attacks.push(N(), W());
        } else {
            if (row < col) attacks.push(S(), W());
            if (row > col) attacks.push(N(), E());
        }
    } else {
        if (center.parity) {
            if (Math.abs(row - center.min) < Math.abs(col - center.min)) {
                if (row > center.min) attacks.push(N());
                else attacks.push(S());
            } else {
                if (col > center.min) attacks.push(W());
                else attacks.push(E());
            }
        }

        // All other cells (attack toward center, single attack).
        else {
            if (
                Math.min(
                    Math.abs(center.min - row),
                    Math.abs(center.max - row),
                ) <
                Math.min(Math.abs(center.min - col), Math.abs(center.max - col))
            ) {
                if (row > center.min) attacks.push(N());
                else attacks.push(S());
            } else {
                if (col > center.max) attacks.push(W());
                else attacks.push(E());
            }
        }
    }

    return attacks;
};
describe("Sweep Logic", () => {
    describe.each(BOARD_SIZES)("Gameboard; %d^2", (boardSize) => {
        const totalCells = boardSize ** 2;
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const cell = getCell(row, col, boardSize);

                test(`Single Hit (Cell ${cell})`, () => {
                    const gameboard = makeBoard(totalCells, cell);

                    const expectedAttacks = getExpectedAttacks(cell, boardSize);

                    const generatedAttacks = new SweepLogic(
                        gameboard,
                    ).getAttacks(FLEET);

                    expect(generatedAttacks.sort()).toEqual(
                        expectedAttacks.sort(),
                    );
                });
            }
        }
    });
});
