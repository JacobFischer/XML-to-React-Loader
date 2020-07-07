import safeEval from "eval";
import { compile, toJsFile } from "./webpack-compile";

const LONG_TIMEOUT = 12500; // for long tests that use puppeteer heavily

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
        "The output is valid JavaScript",
        async () => {
            const source = await toJsFile("note.xml", {
                module: "@react-pdf/renderer",
            });
            const result = safeEval(source, undefined, undefined, true);
            expect(typeof result).toEqual("object");
            expect(result).not.toStrictEqual(null);
            if (typeof result === "object" && result !== null) {
                // console.log("result", result);
                const obj = result as Record<string, unknown>;
                const { rootAttributes } = obj;
                const defaultExport = obj.default;
                expect(typeof defaultExport).toEqual("function");
                if (typeof defaultExport === "function") {
                    expect(defaultExport.name).toEqual("XmlAsReactComponent");
                }

                expect(typeof rootAttributes).toBe("object");
                expect(rootAttributes).not.toStrictEqual(null);
            }
        },
        LONG_TIMEOUT,
    );

    test(
        "Accepts a module option",
        async () => {
            const source = await toJsFile("circle.svg", {
                module: "@react-pdf/renderer",
            });
            expect(source).toMatchSnapshot();
        },
        LONG_TIMEOUT,
    );

    test(
        "Rejects on invalid SVG files",
        async () => {
            await expect(toJsFile("svgs/test.txt")).rejects.toBeTruthy();
        },
        LONG_TIMEOUT,
    );

    test(
        "Transforms inner text within SVGs",
        async () => {
            const source = await toJsFile("svgs/text.svg");
            expect(source).toMatchSnapshot();
        },
        LONG_TIMEOUT,
    );

    test(
        "Transforms minimal SVGs",
        async () => {
            const source = await toJsFile("svgs/empty.svg");
            expect(source).toMatchSnapshot();
        },
        LONG_TIMEOUT,
    );
});
