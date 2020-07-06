import path from "path";
import webpack from "webpack";
import { createFsFromVolume, Volume, IFs } from "memfs";
import { Options } from "../src/options";

/**
 * Creates the memfs file system and injects path.join into it for webpack.
 *
 * @returns The proper interface webpack wants.
 */
function createOutputFileSystem(): IFs & { join: typeof path.join } {
    const volume = new Volume();

    // hack-y...
    const ifs: IFs & { join: typeof path.join } = createFsFromVolume(
        volume,
    ) as never;

    ifs.join = path.join.bind(path);
    return ifs;
}

/**
 * Creates a mock webpack compiler in memory for testing.
 *
 * @param fixture - The entry file path,.
 * @param options - The options, if any.
 * @returns A promise to the webpack stats compiled.
 */
function webpackCompile(
    fixture: string,
    options?: Options,
): Promise<webpack.Stats> {
    const compiler = webpack({
        context: __dirname,
        entry: `./${fixture}`,
        output: {
            path: path.resolve(__dirname),
        },
        module: {
            rules: [
                {
                    test: /\.svg$/,
                    use: {
                        loader: path.resolve(__dirname, "../src/index.ts"),
                        options,
                    },
                },
            ],
        },
    });

    compiler.outputFileSystem = createOutputFileSystem();

    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            if (err) {
                reject(err);
            }
            if (stats.hasErrors()) {
                reject(new Error(stats.toJson().errors.join(", ")));
            }

            // HACK: webpack needs time to tear down threads,
            // yet doesn't expose a way I can find to tell when that is done
            setTimeout(() => resolve(stats), 1000);
        });
    });
}

export default webpackCompile;
