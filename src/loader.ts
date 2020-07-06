import { getOptions } from "loader-utils";
import * as webpack from "webpack";
import { validate } from "./options";

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
    const options = validate(getOptions(this));

    source = source.replace(/\[name\]/g, options.module || "unknown");

    // Apply some transformations to the source...

    return `export default ${JSON.stringify(source)}`;
}
