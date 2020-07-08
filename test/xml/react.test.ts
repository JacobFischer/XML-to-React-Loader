import React from "react";
import renderer from "react-test-renderer";
import { loadParsed, LONG_TIMEOUT } from "./webpack-compile";

describe("React output", () => {
    test(
        "Renders",
        async () => {
            const result = await loadParsed("circle.svg");
            expect(
                renderer.create(React.createElement(result.default)).toJSON(),
            ).toMatchSnapshot();
        },
        LONG_TIMEOUT,
    );

    test(
        "Accepts a getComponent prop",
        async () => {
            const result = await loadParsed("note.xml");
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
                    .create(
                        React.createElement(result.default, { getComponent }),
                    )
                    .toJSON(),
            ).toMatchSnapshot();
        },
        LONG_TIMEOUT,
    );
});
