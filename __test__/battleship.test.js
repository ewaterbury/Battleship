// |------ Player Mocks Setup ------|
// Mocked methods used by the Player class.
const createMockController = () => ({
    receiveAttack: jest.fn(),
    gameOver: jest.fn(),
    queryCell: jest.fn(),
    queryBoard: jest.fn(),
    getSunkShip: jest.fn(),
});

// Stores mocked methods used by the player's and computer's mocked Player classes.
let mockPlayer;
let mockComputer;

// Helper, sets gameOver return values for Player mocks.
const mockGameOver = (player, computer) => {
    mockPlayer.gameOver.mockReturnValue(player);
    mockComputer.gameOver.mockReturnValue(computer);
};

// Replaces the Player class with a Jest mock constructor.
// Mock implementations are assigned in before each through Player.mockImplementation block.
jest.mock("/modules/player.js", () => {
    return jest.fn();
});

// |------ Log Mock Setup ------|
const createMockLog = () => {
    let latestValue = null;
    let mockedLog = null;

    return {
        get latest() {
            return latestValue;
        },

        set latest(value) {
            latestValue = value;
        },

        get log() {
            return mockedLog;
        },

        set log(arr) {
            mockedLog = arr;
        },

        addEntry: jest.fn(),
    };
};

let mockLog;

// Replaces the Log class with a Jest mock constructor.
jest.mock("../modules/log", () => {
    return jest.fn();
});

// Import modules (Must be done after mocks).
import Battleship from "/modules/battleship.js";
import Player from "/modules/player.js";
import AttackLogic from "/modules/computer-logic/attack-logic.js";
import Log from "../modules/log";

// Testing Constants
const BOARD_SIZE = 10;
const PLAYER_FIRST = 0.9;
const COMPUTER_FIRST = 0.1;
const FLEET_TEMPLATE = [
    [1, 2],
    [21, 22, 23],
    [41, 42, 43],
    [61, 62, 63, 64],
    [81, 82, 83, 84, 85],
];

let battleship; // Holds Battleship instance.

beforeEach(() => {
    // Clear mock useage data, keep mocks.
    jest.clearAllMocks();

    mockPlayer = createMockController();
    mockComputer = createMockController();
    mockLog = createMockLog();

    // Set mock value for Math.random to make turn order deterministic.
    jest.spyOn(Math, "random").mockReturnValue(PLAYER_FIRST);

    // Callback assigns correct mock when Player classes are initialized.
    // Player instance is initialized first, Computer is initialized second.
    // Mock implementations are assigned in the same order.
    let playersMocked = 0; // Tracks implementation order.
    Player.mockImplementation(() => {
        playersMocked++;
        return playersMocked === 1 ? mockPlayer : mockComputer;
    });

    // Mocks return value of queryBoard (Prevents breaking of attackLogic Module).
    mockPlayer.queryBoard.mockReturnValue([]);

    Log.mockImplementation(() => mockLog);

    // Battleship is initialized.
    battleship = new Battleship(BOARD_SIZE, FLEET_TEMPLATE);
});

describe("getters", () => {
    describe("latestTurn", () => {
        test("Returns arbitrary game turn", () => {
            mockLog.latest = {
                turn: 50,
                attacker: "computer",
                defender: "player",
                cell: 50,
                status: "miss",
                sunkShip: 0,
                gameOver: false,
            };

            expect(battleship.latestTurn).toEqual({
                turn: 50,
                attacker: "computer",
                defender: "player",
                cell: 50,
                status: "miss",
                sunkShip: 0,
                gameOver: false,
            });
        });
    });

    describe("log", () => {
        test("Returns arbitrary log", () => {
            const myLog = [
                {
                    turn: 1,
                    attacker: "computer",
                    defender: "player",
                    cell: 1,
                    status: "miss",
                    sunkShip: 0,
                    gameOver: false,
                },
                {
                    turn: 2,
                    attacker: "player",
                    defender: "computer",
                    cell: 2,
                    status: "miss",
                    sunkShip: 0,
                    gameOver: false,
                },
                {
                    turn: 3,
                    attacker: "computer",
                    defender: "player",
                    cell: 3,
                    status: "miss",
                    sunkShip: 0,
                    gameOver: false,
                },
            ];

            mockLog.log = myLog;
            expect(battleship.log).toEqual(myLog);
        });
    });
});

describe("newTurn", () => {
    test("Attacker/defender and turn count increments", () => {
        mockGameOver(false, false);
        mockComputer.queryCell.mockReturnValue("miss");
        mockPlayer.queryCell.mockReturnValue("miss");
        battleship.logTurn(1);

        expect(mockLog.addEntry).toHaveBeenCalledWith(
            1,
            "player",
            "computer",
            1,
            "miss",
            0,
            false,
            null,
        );

        battleship.newTurn();
        battleship.logTurn(2);

        const callToInspect = 2;

        expect(mockLog.addEntry).toHaveBeenNthCalledWith(
            callToInspect,
            2,
            "computer",
            "player",
            2,
            "miss",
            0,
            false,
            null,
        );
    });

    test("Winner detected on change of turn", () => {
        mockGameOver(false, true);
        mockComputer.queryCell.mockReturnValue("sunk");
        mockComputer.getSunkShip.mockReturnValue(5);
        battleship.logTurn(1);
        expect(mockLog.addEntry).toHaveBeenCalledWith(
            1,
            "player",
            "computer",
            1,
            "sunk",
            5,
            true,
            "player",
        );
    });
});

describe("sendAttack", () => {
    describe("Player Attack", () => {
        test("receiveAttack called on valid attack", () => {
            battleship.sendAttack(1);
            expect(mockComputer.receiveAttack).toHaveBeenCalledWith(1);
            expect(mockComputer.receiveAttack).toHaveBeenCalledTimes(1);
        });

        test("Error thrown on empty attack", () => {
            expect(() => battleship.sendAttack()).toThrow(
                "Attack is not a number",
            );
        });

        test("Error thrown on out-of-bounds attack", () => {
            expect(() => battleship.sendAttack(-1)).toThrow(
                "Attack is out of bounds",
            );

            expect(() => battleship.sendAttack(100)).toThrow(
                "Attack is out of bounds",
            );
        });
    });

    describe("Computer Attack", () => {
        beforeEach(() => {
            // Clear mock useage data, keep mocks.
            jest.clearAllMocks();

            // Set mock value for Math.random to make turn order deterministic.
            // Swap order so that computer player attaks first.
            jest.spyOn(Math, "random").mockReturnValue(COMPUTER_FIRST);

            // Specify which mock is returned when Player class is initalized.
            let playersMocked = 0;
            Player.mockImplementation(() => {
                playersMocked++;
                return playersMocked === 1 ? mockPlayer : mockComputer;
            });

            // Mock return value of queryBoard to prevent breaking attackLogic Module.
            mockPlayer.queryBoard.mockReturnValue([]);

            // Battleship is re-initialized.
            // Mocks are re-initialized.
            battleship = new Battleship(BOARD_SIZE, FLEET_TEMPLATE);
        });

        test("receiveAttack called on valid attack", () => {
            battleship.sendAttack(1);
            expect(mockPlayer.receiveAttack).toHaveBeenCalledWith(1);
            expect(mockPlayer.receiveAttack).toHaveBeenCalledTimes(1);
        });

        test("Error thrown on empty attack", () => {
            expect(() => battleship.sendAttack()).toThrow(
                "Attack is not a number",
            );
        });

        test("Error thrown on out-of-bounds attack", () => {
            expect(() => battleship.sendAttack(-1)).toThrow(
                "Attack is out of bounds",
            );

            expect(() => battleship.sendAttack(100)).toThrow(
                "Attack is out of bounds",
            );
        });
    });
});

describe("logTurn", () => {
    test("logTurn calls Log.addEntry with correct arguments", () => {
        mockGameOver(false, false);
        mockComputer.queryCell.mockReturnValue("miss");
        mockPlayer.queryCell.mockReturnValue("miss");
        battleship.logTurn(1);

        expect(mockLog.addEntry).toHaveBeenCalledWith(
            1,
            "player",
            "computer",
            1,
            "miss",
            0,
            false,
            null,
        );

        battleship.newTurn();
    });
});
