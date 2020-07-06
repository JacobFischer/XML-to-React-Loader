import { parseStringPromise } from "xml2js";
import { stringifyRequest } from "loader-utils";
import { loader } from "webpack";
import { defaultOptions } from "./options";

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
    svg: SvgNode;
};

const stringify = (str: string) =>
    str.replace(/\\/g, "\\\\").replace(/\r/g, "").replace(/\n/g, "\\n");

const cleanTagName = (tagName: string) =>
    tagName[0].toUpperCase() + tagName.slice(1);

const reactify = (module: boolean) =>
    function recurse(node: SvgNode, tabs = 0): string {
        const indent = "    ".repeat(tabs);
        const tag = node[tagNameKey];

        if (tag === textOnlyNodeName) {
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
    options = defaultOptions,
): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result: Result | undefined = await parseStringPromise(xml, {
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
    if (!result) {
        throw new Error("Could not parse xml!");
    }

    const reactPath = stringifyRequest(loader, require.resolve("react"));
    const modulePath = options.module
        ? stringifyRequest(loader, options.module)
        : "";

    // we need to try to extact the height and width
    let width = "";
    let height = "";
    const svgAttributes = result.svg[attributesKey];
    if (svgAttributes) {
        width = svgAttributes.width;
        height = svgAttributes.height;

        const viewBox = svgAttributes.viewBox;
        if (viewBox) {
            const split = viewBox.split(" ");
            width = width || split[2];
            height = height || split[3];
        }

        width = width || "";
        height = height || "";
    }

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
var mod = _interopRequireDefault(require("${modulePath}"));

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

var SvgAsReactSvg = function SvgAsReactSvg() {
    return (
${reactify(Boolean(module))(result.svg, 2)}
    );
}

var width = "${width}";
exports.width = width;

var height = "${height}";
exports.height = height;

var _default = SvgAsReactSvg;
exports.default = _default;
`;
}
