import S from "jsonschema-definer";

const OptionsSchema = S.shape({
    module: S.string().optional(),
});

/**
 * Checks if a given object matches the options shape.
 *
 * @param obj - The option to check.
 * @returns The same object, but now with the correct type information.
 */
export function validate(
    obj: Record<string, unknown>,
): typeof OptionsSchema.type {
    const [valid, errors] = OptionsSchema.validate(obj);

    if (!valid) {
        const errorMessage = errors
            ? errors.map((err) => err.message || "Unknown").join(", ")
            : "Unknown";
        throw new Error(`Invalid options: ${errorMessage}`);
    }

    return obj;
}
