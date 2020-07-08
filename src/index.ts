import { getOptions } from "loader-utils";
import * as webpack from "webpack";
import { validate } from "./options";
import { transform } from "./transformer";

/**
 * Hello?
 *
 * @param this - The webpack context.
 * @param source - The source code being imported.
 * @returns Transformed source code?
 */
export default async function XmlToReactLoader(
    this: webpack.loader.LoaderContext,
    source: string,
): Promise<string> {
    const options = validate(getOptions(this));

    const transformed = await transform(this, source, options);
    // console.log("TRANSFORMED", transformed);
    return transformed;
}

export * from "./typings";
