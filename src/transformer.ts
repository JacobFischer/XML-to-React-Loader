import { parseStringPromise } from "xml2js";
import { readFile } from "fs";
import { resolve } from "path";

const path = resolve("./src/gallardo.svg");

/**
 *
 */
export function transfomer(): any {
    return new Promise((res, rej) => {
        readFile(path, (err, file) => {
            if (err) {
                return rej(err);
            }
            void parseStringPromise(file.toString()).then(res);
        });
    });
}
