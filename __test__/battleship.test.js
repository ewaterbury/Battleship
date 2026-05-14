// Mocked methods used by the Player class.
const createMockController = () => ({
    receiveAttack: jest.fn(),
    gameOver: jest.fn(),
    queryCell: jest.fn(),
    queryBoard: jest.fn(),
});

// Mocked methods used by the player's and computer's mocked Player classes.
const mockPlayerController = createMockController();
const mockComputerController = createMockController();

// Mocked methods used by the computer's mocked AttackLogic class.
const mockAttackLogic = { getAttack: jest.fn() };

// Replaces the Player class with a Jest mock constructor.
// Mock implementations are assigned in before each through Player.mockImplementation.
jest.mock("/modules/player.js", () => {
    return jest.fn();
});

// Replaces AttackLogic with mock implementation each time the class is initialized.
jest.mock("/modules/computer-logic/attack-logic.js", () => {
    return jest.fn().mockImplementation(() => mockAttackLogic);
});

// Import modules (Must be done after mocks).
import Battleship from "/modules/battleship.js";
import Player from "/modules/player.js";
import AttackLogic from "/modules/computer-logic/attack-logic.js";

// Constants
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

//Holds battleship class for each test.
let battleship;

// Helper, sets gameOver return values for Player mocks.
const mockGameOver = (player, computer) => {
    mockPlayerController.gameOver.mockReturnValue(player);
    mockComputerController.gameOver.mockReturnValue(computer);
};

beforeEach(() => {
    // Clear mock useage data, keep mocks.
    jest.clearAllMocks();

    // Set mock value for Math.random to make turn order deterministic.
    jest.spyOn(Math, "random").mockReturnValue(PLAYER_FIRST);

    // Callback assigns correct mock when Player classes are initialized.
    // Player instance is initialized first, Computer is initialized second.
    // Mock implementations are introduced in the same order.
    let playersMocked = 0; // Tracks implementation order.
    Player.mockImplementation(() => {
        playersMocked++;
        return playersMocked === 1
            ? mockPlayerController
            : mockComputerController;
    });

    // Mock return value of queryBoard to prevent breaking attackLogic Module.
    mockPlayerController.queryBoard.mockReturnValue([]);

    // Battleship is initialized.
    // Mocks are initialized.
    battleship = new Battleship(BOARD_SIZE, FLEET_TEMPLATE);
});

describe("getState", () => {
    test("Gets inital game state", () => {
        mockGameOver(false, false);
        expect(battleship.getState()).toEqual({
            attacker: "player",
            defender: "computer",
            gameOver: false,
            winner: null,
        });
    });

    test("Updates attacker/defender status after turn ends", () => {
        mockGameOver(false, false);
        battleship.newTurn();

        expect(battleship.getState()).toEqual({
            attacker: "computer",
            defender: "player",
            gameOver: false,
            winner: null,
        });
    });

    test("Gets winner and shows game is over (player wins)", () => {
        mockGameOver(false, true);
        expect(battleship.getState()).toEqual({
            attacker: "player",
            defender: "computer",
            gameOver: true,
            winner: "player",
        });
    });

    test("Gets winner and shows game is over  (computer wins)", () => {
        mockGameOver(true, false);
        expect(battleship.getState()).toEqual({
            attacker: "player",
            defender: "computer",
            gameOver: true,
            winner: "computer",
        });
    });
});

describe("queryBoard", () => {
    test("Returns player board on query", () => {
        const state = battleship.getState();

        battleship.queryBoard(state.attacker);

        expect(mockPlayerController.queryBoard).toHaveBeenCalledTimes(1);
        expect(mockComputerController.queryBoard).not.toHaveBeenCalled();
    });

    test("Returns computer board on query", () => {
        const state = battleship.getState();

        const initialCallsPlayer =
            mockPlayerController.queryBoard.mock.calls.length;

        const initialCallsComputer =
            mockComputerController.queryBoard.mock.calls.length;

        battleship.queryBoard(state.defender);

        expect(mockPlayerController.queryBoard).toHaveBeenCalledTimes(
            initialCallsPlayer,
        );
        expect(mockComputerController.queryBoard).toHaveBeenCalledTimes(
            initialCallsComputer + 1,
        );
    });

    test("Throws error on invalid id", () => {
        expect(() => battleship.queryBoard()).toThrow("Invalid player id");
    });
});

describe("newTurn", () => {
    test("Attacker and defender swap on new turn", () => {
        mockGameOver(false, false);

        expect(battleship.getState().attacker).toBe("player");
        expect(battleship.getState().defender).toBe("computer");

        battleship.newTurn();

        expect(battleship.getState().attacker).toBe("computer");
        expect(battleship.getState().defender).toBe("player");
    });
});

describe("sendAttack", () => {
    describe("Player Attack", () => {
        test("recieveAttack called on valid attack", () => {
            battleship.sendAttack(1);
            expect(mockComputerController.receiveAttack).toHaveBeenCalledWith(
                1,
            );
            expect(mockComputerController.receiveAttack).toHaveBeenCalledTimes(
                1,
            );
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
                return playersMocked === 1
                    ? mockPlayerController
                    : mockComputerController;
            });

            // Mock return value of queryBoard to prevent breaking attackLogic Module.
            mockPlayerController.queryBoard.mockReturnValue([]);

            // Battleship is re-initialized.
            // Mocks are re-initialized.
            battleship = new Battleship(BOARD_SIZE, FLEET_TEMPLATE);
        });

        test("recieveAttack called on valid attack", () => {
            mockAttackLogic.getAttack.mockReturnValue(1);

            battleship.sendAttack();
            expect(mockPlayerController.receiveAttack).toHaveBeenCalledWith(1);
            expect(mockPlayerController.receiveAttack).toHaveBeenCalledTimes(1);
        });

        test("Error thrown on empty attack", () => {
            mockAttackLogic.getAttack.mockReturnValue();
            expect(() => battleship.sendAttack()).toThrow(
                "Attack is not a number",
            );
        });

        test("Error thrown on out-of-bounds attack", () => {
            mockAttackLogic.getAttack.mockReturnValue(-1);
            expect(() => battleship.sendAttack()).toThrow(
                "Attack is out of bounds",
            );

            mockAttackLogic.getAttack.mockReturnValue(100);
            expect(() => battleship.sendAttack()).toThrow(
                "Attack is out of bounds",
            );
        });
    });
});
