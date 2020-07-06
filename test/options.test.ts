import { defaultOptions, validate } from "../src/options";

describe("Options", () => {
    test("Accepts valid options", () => {
        const call = jest.fn(() => validate({ module: "some-module" }));
        expect(call).not.toThrow();
        expect(call).toBeCalled();
    });

    test("Accepts empty options", () => {
        const call = jest.fn(() => validate({}));
        expect(call).not.toThrow();
        expect(call).toBeCalled();
    });

    test("Returns the same object without mutating", () => {
        const originalOptions = { module: "another-module" };
        const clonedOptions = { ...originalOptions };
        const result = validate(originalOptions);
        expect(result).toEqual(clonedOptions);
        expect(result).toStrictEqual(originalOptions);
    });

    test("Rejects invalid options", () => {
        const call = jest.fn(() => validate({ fooBar: "baz" }));
        expect(call).toThrow();
    });

    test("Rejects invalid types on valid options", () => {
        const call = jest.fn(() => validate({ module: 1337 }));
        expect(call).toThrow();
    });

    test("Returns valid default options", () => {
        const call = jest.fn(() => validate(undefined));
        expect(call).not.toThrow();
        expect(call).toBeCalled();

        const result = call();
        expect(result).toBeTruthy();
        expect(typeof result).toBe("object");
        expect(validate(result)).toStrictEqual(result);
    });

    test("Exports valid defaults", () => {
        expect(defaultOptions).toBeTruthy();
        expect(typeof defaultOptions).toBe("object");
        expect(validate(defaultOptions)).toStrictEqual(defaultOptions);
    });
});
