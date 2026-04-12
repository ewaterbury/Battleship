// RandomInt is incoming query - assert the result
const Utilities = require("/modules/utilities.js");

describe("RandomInt", () => {
    test("Values are inbounds", () => {
        const floor = 0;
        const ceil = 3;
        const count = 100;

        for (let i = 0; i < count; i++) {
            const rand = Utilities.randomInt(floor, ceil);
            expect(rand).toBeGreaterThanOrEqual(floor);
            expect(rand).toBeLessThanOrEqual(ceil);
        }
    });

    describe("Observed distribution/mean matches expected", () => {
        const count = 10000;

        let results;

        beforeAll(() => {
            results = Array(4).fill(0);
            const floor = 0;
            const ceil = 3;
            for (let i = 0; i < count; i++)
                results[Utilities.randomInt(floor, ceil)]++;
        });

        test("Observed distribution matches expected", () => {
            let chiSquared = 0;

            const expectedFreq = count / results.length;

            for (const observedFreq of results)
                chiSquared += (observedFreq - expectedFreq) ** 2 / expectedFreq;

            const criticalValue = 11.345; // 3 Degrees of Freedom, Significance = 0.01.

            expect(chiSquared).toBeLessThan(criticalValue);
        });

        test("Observed mean matches expected", () => {
            const popSize = results.length;

            let total = 0;
            for (let i = 0; i < popSize; i++) total += i;
            const popMean = total / popSize;

            let deviations = 0;
            for (let i = 0; i < popSize; i++) deviations += (i - popMean) ** 2;
            const popStandardDev = Math.sqrt(deviations / popSize);

            const standardErr = popStandardDev / Math.sqrt(count);

            total = 0;
            for (let i = 0; i < popSize; i++) total += results[i] * i;
            const sampleMean = total / count;

            const zScore = (sampleMean - popMean) / standardErr;

            expect(Math.abs(zScore)).toBeLessThan(4);
        });
    });
});

describe("ShuffleInPlace", () => {
    const count = 10000;
    const results = new Map();

    beforeAll(() => {
        for (let i = 0; i < count; i++) {
            const str = JSON.stringify(
                Utilities.shuffleInPlace(["a", "b", "c"]),
            );
            if (!results.has(str)) results.set(str, 1);
            else results.set(str, results.get(str) + 1);
        }
    });

    test("Correct number of permutations", () => {
        expect(results.size).toBe(6); // Expect 3! permutations.
    });

    test("Observed distribution matches expected", () => {
        let chiSquared = 0;

        const expectedFreq = count / results.size;

        for (const observedFreq of results.values())
            chiSquared += (observedFreq - expectedFreq) ** 2 / expectedFreq;

        const criticalValue = 15.086; // 5 Degrees of Freedom, Significance = 0.01.

        expect(chiSquared).toBeLessThan(criticalValue);
    });
});
