import { parseStringPromise } from "xml2js";
import { stringifyRequest } from "loader-utils";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { loader } from "webpack";
import { Options } from "./options";

const tagNameKey = "#name";
const innerTextKey = "$innertext";
const textOnlyNodeName = "__text__";
const childrenKey = "$children";
const attributesKey = "$props";

type SvgNode = {
    [tagNameKey]: string;
    [attributesKey]?: Record<string, string>;
    [childrenKey]?: SvgNode[];
    [innerTextKey]?: string;
};

type Result = {
    [key: string]: SvgNode;
};

const stringify = (str: string) =>
    str.replace(/\\/g, "\\\\").replace(/\r/g, "").replace(/\n/g, "\\n");

const cleanTagName = (tagName: string) =>
    tagName[0].toUpperCase() + tagName.slice(1);

const reactify = (module: boolean) =>
    function recurse(node: SvgNode, tabs: number): string {
        const indent = "    ".repeat(tabs);
        const tag = node[tagNameKey];

        if (tag === textOnlyNodeName) {
            /* istanbul ignore next */ // the || "" is to appease TS
            return `${indent}"${stringify(node[innerTextKey] || "")}"`;
        }

        let attributes = "null";
        const rawAttributes = node[attributesKey];
        if (rawAttributes) {
            attributes = `{ ${[...Object.entries(rawAttributes)]
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([key, value]) => `"${key}": "${stringify(value)}"`)
                .join(", ")} }`;
        }
        let children: string[] | undefined;
        const rawChildren = node[childrenKey];
        if (Array.isArray(rawChildren)) {
            children = rawChildren.map((child) => recurse(child, tabs + 1));
        }

        const tagName = module
            ? `component("${cleanTagName(tag)}")`
            : `"${tag}"`;
        const start = `${indent}/*#__PURE__*/_react.default.createElement(${tagName}, ${attributes}`;
        const middle = children
            ? `,\n${children.map((child) => child + ",\n").join("")}${indent}`
            : "";
        const end = ")";

        return start + middle + end;
    };

/**
 * The good code.
 *
 * @param loader - The context webpack calls this with.
 * @param xml - The xml contents to transform.
 * @param options - The parsed options to this loader.
 * @returns A promise that resolves to the transformed string.
 */
export async function transform(
    loader: loader.LoaderContext,
    xml: string,
    options: Options,
): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result: Result = await parseStringPromise(xml, {
        attrkey: attributesKey,
        explicitArray: true,
        explicitChildren: true,
        explicitRoot: true,
        childkey: childrenKey,
        charkey: innerTextKey,
        charsAsChildren: true,
        preserveChildrenOrder: true,
        // explicitRoot: true,
        // */
    });

    const rootKeys = [...Object.keys(result)];
    // XML should only ever have 1 root node.
    // If a way to trigger this can be found add to tests
    /* istanbul ignore next */
    if (rootKeys.length !== 1) {
        throw new Error(
            `Invalid number of root keys in xml: ${rootKeys.join(", ")}`,
        );
    }

    const root = result[rootKeys[0]];

    const reactPath = stringifyRequest(loader, require.resolve("react"));
    const modulePath = options.module
        ? stringifyRequest(loader, options.module)
        : "";

    return `"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _react = _interopRequireDefault(require(${reactPath}));
${
    options.module
        ? `
var mod = _interopRequireDefault(require(${modulePath}));

function component(str) {
    if (mod[str]) {
        return mod[str];
    }

    if (mod.default && mod.default[str]) {
        return mod.default[str];
    }

    return function NothingForTag() {
        return null;
    }
}
`
        : ""
}

var XmlAsReactComponent = function XmlAsReactComponent() {
    return (
${reactify(Boolean(options.module))(root, 2)}
    );
}

var rootAttributes = ${JSON.stringify(root[attributesKey] || {})};
exports.rootAttributes = rootAttributes;

var _default = XmlAsReactComponent;
exports.default = _default;
`;
}
