declare module "eval" {
    /** Evaluate a module content in the same way as require() but without loading it from a file. Effectively, it mimicks the javascript evil eval function but leverages Node's VM module instead. */
    const _: (
        /** The content to be evaluated. */
        content: string,
        /** Optional dummy name to be given (used in stacktraces). */
        filename?: string,
        /** Scope properties are provided as variables to the content. */
        scope?: Record<string, any>,
        /** (Boolean): allow/disallow global variables (and require) to be supplied to the content (default=false). */
        includeGlobals?: boolean,
    ) => unknown;
    export = _;
}
