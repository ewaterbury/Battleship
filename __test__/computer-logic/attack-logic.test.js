const FleetGenerator = require("/modules/computer-logic/fleet-generator.js");
const AttackLogic = require("/modules/computer-logic/attack-logic.js");
const Gameboard = require("/modules/gameboard.js");
const Ship = require("/modules/ship.js");

describe("Attack Logic", () => {
    const boardSize = 10;
    const fleetContents = [2, 3, 3, 4, 5];
    const turnCounts = {
        lessThan10: 0,
        lessThan20: 0,
        lessThan30: 0,
        lessThan40: 0,
        lessThan50: 0,
        lessThan60: 0,
        lessThan70: 0,
        lessThan80: 0,
        lessThan90: 0,
        moreThan90: 0,
    };

    for (let i = 0; i < 2500; i++) {
        // Opponents gameboard
        const gameboard = new Gameboard(boardSize);

        // Add enemy ships to gameboard.
        const fleet = FleetGenerator.generateFleet(fleetContents, boardSize);
        fleet.forEach((ship) => gameboard.newShip(new Ship(ship)));

        // Holds computer player logic.
        const computerPlayer = new AttackLogic(
            gameboard.queryAttacks(),
            fleetContents,
        );

        let turns = 0;

        while (!gameboard.fleetSunk() && turns <= 100) {
            gameboard.receiveAttack(computerPlayer.sendAttack());
            turns++;
        }

        if (turns < 10) {
            turnCounts.lessThan10++;
        } else if (turns < 20) {
            turnCounts.lessThan20++;
        } else if (turns < 30) {
            turnCounts.lessThan30++;
        } else if (turns < 40) {
            turnCounts.lessThan40++;
        } else if (turns < 50) {
            turnCounts.lessThan50++;
        } else if (turns < 60) {
            turnCounts.lessThan60++;
        } else if (turns < 70) {
            turnCounts.lessThan70++;
        } else if (turns < 80) {
            turnCounts.lessThan80++;
        } else if (turns < 90) {
            turnCounts.lessThan90++;
        } else {
            turnCounts.moreThan90++;
        }
    }
    // console.log(turnCounts);
    test("Game takes more than 10 turns", () => {
        expect(turnCounts.lessThan10).toBe(0);
    });
    test("Game takes fewer than 70 turns", () => {
        const total =
            turnCounts.moreThan90 +
            turnCounts.lessThan90 +
            turnCounts.lessThan80;
        expect(total).toBe(0);
    });
});
