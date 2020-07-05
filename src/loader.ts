import { getOptions } from "loader-utils";
import validateOptions from "schema-utils";
import * as webpack from "webpack";
import { JSONSchema7 } from "json-schema";

const schema: JSONSchema7 = {
    type: "object",
    properties: {
        test: {
            type: "string",
        },
    },
};

/**
 * Hello?
 *
 * @param this - The webpack context.
 * @param source - The source code being imported.
 * @returns Transformed source code?
 */
export default function SvgToReactLoader(
    this: webpack.loader.LoaderContext,
    source: string,
): string {
    const options = getOptions(this);

    validateOptions(schema, options, { name: "Example Loader" });

    // Apply some transformations to the source...

    return `export default ${JSON.stringify(source)}`;
}
