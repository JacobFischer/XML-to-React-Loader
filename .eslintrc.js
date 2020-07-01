// @ts-check
/* eslint-env node */

const { resolve } = require("path");

process.env.ESLINT_PATH_TSCONFIG = resolve("./tsconfig.eslint.json");

/** @type {import("eslint").Linter.Config} */
const baseEslintConfig = {
    extends: ["jacobfischer"],
    rules: {
        // "@typescript-eslint/explicit-module-boundary-types": "off",
    },
};

module.exports = baseEslintConfig;
