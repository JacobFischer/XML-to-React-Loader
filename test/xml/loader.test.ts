import {
    compile,
    loadParsed,
    LONG_TIMEOUT,
    toJsFile,
} from "./webpack-compile";

describe("Webpack loader", () => {
    test(
        "Works as a webpack loader",
        async () => {
            const stats = await compile("circle.svg");

            const output = stats.toJson();
            const { modules } = output;

            expect(modules).toBeDefined();
            const source = modules && modules[0].source;
            expect(source).toBeTruthy();
            expect(source).toMatchSnapshot();
        },
        LONG_TIMEOUT,
    );

    test(
        "The output is the valid JavaScript shape",
        async () => {
            const result = await loadParsed("note.xml");
            expect(Object.keys(result).length).toEqual(3);

            expect(typeof result).toEqual("object");
            expect(result).not.toStrictEqual(null);

            expect(typeof result.default).toEqual("function");
            expect(result.default.name).toEqual("XmlAsReactComponent");

            expect(result.Component).toStrictEqual(result.default);

            expect(typeof result.rootAttributes).toBe("object");
            expect(result.rootAttributes).not.toStrictEqual(null);

            expect(result.rootAttributes.date).toEqual(
                "2020-07-07T23:04:29+00:00",
            );
            expect(result.rootAttributes.author).toEqual("John Doe");
            expect(Object.keys(result.rootAttributes).length).toEqual(2);
        },
        LONG_TIMEOUT,
    );

    test(
        "Accepts a module option",
        async () => {
            const source = await toJsFile("circle.svg", {
                reactPath: require.resolve("react"),
            });
            expect(source).toMatchSnapshot();
        },
        LONG_TIMEOUT,
    );

    test(
        "Rejects on invalid XML syntax",
        async () => {
            await expect(toJsFile("invalid.xml")).rejects.toBeTruthy();
        },
        LONG_TIMEOUT,
    );

    test(
        "Transforms minimal files",
        async () => {
            const source = await toJsFile("empty.xml");
            expect(source).toMatchSnapshot();
        },
        LONG_TIMEOUT,
    );

    test(
        "Transforms large complex files",
        async () => {
            const source = await toJsFile("gallardo.svg");
            expect(source).toMatchSnapshot();
        },
        LONG_TIMEOUT,
    );
});
