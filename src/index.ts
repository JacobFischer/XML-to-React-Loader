import { getOptions } from "loader-utils";
import * as webpack from "webpack";
import { validate } from "./options";
import { transform } from "./transformer";

/**
 * The entry point for this loader to transform XML into a React-style file.
 *
 * @param this - The webpack context.
 * @param source - The source code being imported.
 * @returns Transformed source code as a string.
 */
export default async function XmlToReactLoader(
    this: webpack.loader.LoaderContext,
    source: string,
): Promise<string> {
    const options = validate(getOptions(this));

    const transformed = await transform(this, source, options);
    return transformed;
}

export * from "./typings";
export { defaultOptions, Options } from "./options";
