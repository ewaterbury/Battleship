const SweepLogic = require("/modules/computer-logic/sweep-logic.js");
const H = "hit";
const M = "miss";
const S = "sunk";
const E = null;

describe("Sweep Test", () => {
    describe("Empty Board", () => {
        // Note: Fleet size must be one to not break search algorithm on empty board.
        const fleet = [1];
        const gameboard = Array(100).fill(E);
        const sweepLogic = new SweepLogic(gameboard);
        const totalCells = gameboard.length;
        const attacks = [];

        for (let turn = 0; turn < totalCells; turn++) {
            const attack = sweepLogic.getAttacks(fleet);
            gameboard[attack[0]] = M;
            attacks.push(attack[0]);
        }

        test("Returns all possible possitions", () => {
            const expected = Array.from({ length: 100 }, (_, i) => i);
            expect(attacks.sort((a, b) => a - b)).toEqual(expected);
        });

        test("No duplicate attacks", () => {
            expect(new Set(attacks).size).toBe(attacks.length);
        });
    });

    describe("4x4 Board", () => {
        describe("Edge Cases", () => {
            test("Does not include ships passing through miss cells", () => {
                const fleet = [3];
                const gameboard = [
                    [H, E, E, H],
                    [E, E, E, M],
                    [H, E, E, H],
                    [E, E, E, E],
                ];

                const length = gameboard[0].length;
                expect(
                    new SweepLogic(gameboard.flat(), length).getAttacks(fleet),
                ).toEqual([4]);
            });

            test("Does not include ships passing through sunk cells", () => {
                const fleet = [3];
                const gameboard = [
                    [H, E, E, H],
                    [E, E, S, S],
                    [H, E, E, H],
                    [E, E, E, E],
                ];

                const length = gameboard[0].length;
                expect(
                    new SweepLogic(gameboard.flat(), length).getAttacks(fleet),
                ).toEqual([4]);
            });

            test("Gets final cell", () => {
                const fleet = [3];
                const gameboard = [
                    [H, H, H, H],
                    [H, H, H, H],
                    [H, H, H, H],
                    [H, H, H, E],
                ];

                const length = gameboard[0].length;
                expect(
                    new SweepLogic(gameboard.flat(), length).getAttacks(fleet),
                ).toEqual([15]);
            });

            test("Returns [null] on no valid hits", () => {
                const fleet = [3];
                const gameboard = [
                    [H, H, H, H],
                    [H, H, H, H],
                    [H, H, H, H],
                    [H, H, H, H],
                ];

                const length = gameboard[0].length;
                expect(
                    new SweepLogic(gameboard.flat(), length).getAttacks(fleet),
                ).toEqual([null]);
            });

            test("Does not wrap rows", () => {
                const fleet = [3];
                const gameboard = [
                    [E, E, E, H],
                    [H, H, E, E],
                    [E, E, E, E],
                    [E, E, E, E],
                ];

                const length = gameboard[0].length;
                expect(
                    new SweepLogic(gameboard.flat(), length).getAttacks(fleet),
                ).toEqual([6]);
            });
        });

        describe("Priority Check: Hits -> Count -> Length", () => {
            test("Multiple outputs when all things equal", () => {
                const fleet = [3];
                const gameboard = [
                    [E, E, E, H],
                    [E, H, E, E],
                    [E, E, H, E],
                    [E, E, E, E],
                ];

                const length = gameboard[0].length;
                expect(
                    new SweepLogic(gameboard.flat(), length)
                        .getAttacks(fleet)
                        .sort(),
                ).toEqual([6, 9].sort());
            });

            test("Prefers more hits", () => {
                const fleet = [3];
                const gameboard = [
                    [H, E, E, H],
                    [H, E, E, E],
                    [E, E, E, E],
                    [E, E, E, E],
                ];

                const length = gameboard[0].length;
                expect(
                    new SweepLogic(gameboard.flat(), length).getAttacks(fleet),
                ).toEqual([8]);
            });

            test("Prefers highter count when equal hits", () => {
                const fleet = [3];
                const gameboard = [
                    [H, E, E, E],
                    [H, E, H, E],
                    [E, E, H, E],
                    [E, E, E, E],
                ];

                const length = gameboard[0].length;
                expect(
                    new SweepLogic(gameboard.flat(), length).getAttacks(fleet),
                ).toEqual([8]);
            });

            test("Prefers longer ship when equal count", () => {
                const fleet = [2, 3];
                const gameboard = [
                    [S, S, S, S],
                    [H, S, S, H],
                    [E, S, S, E],
                    [E, S, S, S],
                ];

                const length = gameboard[0].length;
                expect(
                    new SweepLogic(gameboard.flat(), length).getAttacks(fleet),
                ).toEqual([8]);
            });
        });
    });
});
