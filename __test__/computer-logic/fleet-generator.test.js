import FleetGenerator from "/modules/computer-logic/fleet-generator.js";

describe("FleetGenerator", () => {
    const FLEET_TEMPLATE = [2, 3, 3, 4, 5];
    const BOARD_SIZES = [7, 8, 9, 10];

    describe.each(BOARD_SIZES)("Gameboard: %d^2", (gameboard) => {
        for (let i = 0; i < 100; i++) {
            const fleet = FleetGenerator.generateFleet(
                FLEET_TEMPLATE,
                gameboard,
            );

            test("No duplicate cells in fleet.", () => {
                const cellFrequency = new Map();
                for (const ship of fleet)
                    for (const cell of ship)
                        if (!cellFrequency.has(cell))
                            cellFrequency.set(cell, 1);
                        else
                            cellFrequency.set(
                                cell,
                                cellFrequency.get(cell) + 1,
                            );

                Array.from(cellFrequency.values()).forEach((count) =>
                    expect(count).toBe(1),
                );
            });

            test("All cells are in-bounds.", () => {
                for (const ship of fleet)
                    for (const cell of ship) {
                        expect(cell).toBeGreaterThanOrEqual(0);
                        expect(cell).toBeLessThanOrEqual(gameboard ** 2 - 1);
                    }
            });

            test("Correct ships in fleet.", () => {
                const expectedShips = new Map();
                const existingShips = new Map();

                FLEET_TEMPLATE.forEach((ship) => {
                    expectedShips.set(ship, 0);
                    existingShips.set(ship, 0);
                });

                FLEET_TEMPLATE.forEach((ship) =>
                    expectedShips.set(ship, expectedShips.get(ship) + 1),
                );
                fleet.forEach((ship) =>
                    existingShips.set(
                        ship.length,
                        existingShips.get(ship.length) + 1,
                    ),
                );
                expect(existingShips).toEqual(expectedShips);
            });

            test("Ships are contiguous.", () => {
                for (const ship of fleet)
                    if (ship.length > 1)
                        if (ship[1] - ship[0] === 1)
                            for (let i = 0; i < ship.length - 1; i++)
                                expect(ship[i]).toEqual(ship[i + 1] - 1);
                        else if (ship[1] - ship[0] === gameboard)
                            for (let i = 0; i < ship.length - 1; i++)
                                expect(ship[i]).toEqual(
                                    ship[i + 1] - gameboard,
                                );
                        else expect(false).toBe(true);
            });
        }
    });
});
