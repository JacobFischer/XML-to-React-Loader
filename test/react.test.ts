import safeEval from "eval";
import React from "react";
import renderer from "react-test-renderer";
import { toJsFile } from "./webpack-compile";
import { Options } from "../src/options";

/**
 * Attempts to run the webpack loader and eval the resulting react component.
 *
 * @param file - File to fun the loader on.
 * @param options - Optional options to pass to loader.
 * @returns - THe react component webpack created.
 */
async function getReactComponent(
    file: string,
    options?: Options,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<React.FunctionComponent<Record<string, any>>> {
    const source = await toJsFile(file, options);
    const result = safeEval(source, undefined, undefined, true);
    if (typeof result === "object" && result !== null) {
        const obj = result as { default?: unknown };
        if (obj.default && typeof obj.default === "function") {
            return (obj.default as unknown) as React.FunctionComponent;
        }
    }

    throw new Error("Result from eval incorrect shape");
}

const LONG_TIMEOUT = 12500; // for long tests that use puppeteer heavily

describe("React output", () => {
    test(
        "Renders",
        async () => {
            const Component = await getReactComponent("circle.svg");
            expect(
                renderer.create(React.createElement(Component)).toJSON(),
            ).toMatchSnapshot();
        },
        LONG_TIMEOUT,
    );

    test(
        "Accepts a getComponent prop",
        async () => {
            const Component = await getReactComponent("note.xml");
            const getComponent = (tag: string) => {
                /* eslint-disable @typescript-eslint/ban-types */
                switch (tag) {
                    case "note":
                        return (props: {}) =>
                            React.createElement("section", props);
                    case "heading":
                        return (props: {}) => React.createElement("h1", props);
                    default:
                        return (props: {}) => React.createElement("p", props);
                }
                /* eslint-enable @typescript-eslint/ban-types */
            };
            expect(
                renderer
                    .create(React.createElement(Component, { getComponent }))
                    .toJSON(),
            ).toMatchSnapshot();
        },
        LONG_TIMEOUT,
    );
});
