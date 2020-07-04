import { readFile } from "fs-extra";
import { resolve, join } from "path";
import { transformer } from "./transformer";

const path = resolve(join(__dirname, "../src/Freesample.svg"));

/**
 *
 */
export async function test(): Promise<void> {
    const file = await readFile(path);

    const transformed = await transformer(
        file.toString(),
        "@react-pdf/renderer",
    );

    console.log("transformed", transformed);
}
