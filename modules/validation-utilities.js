export default class ValidationUtilities {
    static isString(value) {
        return typeof value === "string" && value.trim() !== "";
    }

    static isPositiveInt(value) {
        return Number.isInteger(value) && value > 0;
    }
}
