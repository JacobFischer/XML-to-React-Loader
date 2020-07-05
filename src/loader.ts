import { getOptions } from "loader-utils";
import validateOptions from "schema-utils";
import * as webpack from "webpack";
import { JSONSchema7 } from "json-schema";

const schema: JSONSchema7 = {
    type: "object",
    properties: {
        name: {
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
    const rawOptions = getOptions(this);

    validateOptions(schema, rawOptions, { name: "Example Loader" });
    const options = (rawOptions as unknown) as { name: string };

    source = source.replace(/\[name\]/g, options.name);

    // Apply some transformations to the source...

    return `export default ${JSON.stringify(source)}`;
}
