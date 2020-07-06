"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transform = void 0;
var xml2js_1 = require("xml2js");
var loader_utils_1 = require("loader-utils");
var options_1 = require("./options");
var tagNameKey = "#name";
var innerTextKey = "$innertext";
var textOnlyNodeName = "__text__";
var childrenKey = "$children";
var attributesKey = "$props";
var stringify = function (str) {
    return str.replace(/\\/g, "\\\\").replace(/\r/g, "").replace(/\n/g, "\\n");
};
var cleanTagName = function (tagName) {
    return tagName[0].toUpperCase() + tagName.slice(1);
};
var reactify = function (module) {
    return function recurse(node, tabs) {
        if (tabs === void 0) { tabs = 0; }
        var indent = "    ".repeat(tabs);
        var tag = node[tagNameKey];
        if (tag === textOnlyNodeName) {
            return indent + "\"" + stringify(node[innerTextKey] || "") + "\"";
        }
        var attributes = "null";
        var rawAttributes = node[attributesKey];
        if (rawAttributes) {
            attributes = "{ " + __spreadArrays(Object.entries(rawAttributes)).sort(function (_a, _b) {
                var a = _a[0];
                var b = _b[0];
                return a.localeCompare(b);
            })
                .map(function (_a) {
                var key = _a[0], value = _a[1];
                return "\"" + key + "\": \"" + stringify(value) + "\"";
            })
                .join(", ") + " }";
        }
        var children;
        var rawChildren = node[childrenKey];
        if (Array.isArray(rawChildren)) {
            children = rawChildren.map(function (child) { return recurse(child, tabs + 1); });
        }
        var tagName = module
            ? "component(\"" + cleanTagName(tag) + "\")"
            : "\"" + tag + "\"";
        var start = indent + "/*#__PURE__*/_react.default.createElement(" + tagName + ", " + attributes;
        var middle = children
            ? ",\n" + children.map(function (child) { return child + ",\n"; }).join("") + indent
            : "";
        var end = ")";
        return start + middle + end;
    };
};
/**
 * The good code.
 *
 * @param loader - The context webpack calls this with.
 * @param xml - The xml contents to transform.
 * @param options - The parsed options to this loader.
 * @returns A promise that resolves to the transformed string.
 */
function transform(loader, xml, options) {
    if (options === void 0) { options = options_1.defaultOptions; }
    return __awaiter(this, void 0, void 0, function () {
        var result, reactPath, modulePath, width, height, svgAttributes, viewBox, split;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, xml2js_1.parseStringPromise(xml, {
                        attrkey: attributesKey,
                        explicitArray: true,
                        explicitChildren: true,
                        explicitRoot: true,
                        childkey: childrenKey,
                        charkey: innerTextKey,
                        charsAsChildren: true,
                        preserveChildrenOrder: true,
                    })];
                case 1:
                    result = _a.sent();
                    if (!result) {
                        throw new Error("Could not parse xml!");
                    }
                    reactPath = loader_utils_1.stringifyRequest(loader, require.resolve("react"));
                    modulePath = options.module
                        ? loader_utils_1.stringifyRequest(loader, options.module)
                        : "";
                    width = "";
                    height = "";
                    svgAttributes = result.svg[attributesKey];
                    if (svgAttributes) {
                        width = svgAttributes.width;
                        height = svgAttributes.height;
                        viewBox = svgAttributes.viewBox;
                        if (viewBox) {
                            split = viewBox.split(" ");
                            width = width || split[2];
                            height = height || split[3];
                        }
                        width = width || "";
                        height = height || "";
                    }
                    return [2 /*return*/, "\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\nexports.default = void 0;\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\nvar _react = _interopRequireDefault(require(" + reactPath + "));\n" + (options.module
                            ? "\nvar mod = _interopRequireDefault(require(\"" + modulePath + "\"));\n\nfunction component(str) {\n    if (mod[str]) {\n        return mod[str];\n    }\n\n    if (mod.default && mod.default[str]) {\n        return mod.default[str];\n    }\n\n    return function NothingForTag() {\n        return null;\n    }\n}\n"
                            : "") + "\n\nvar SvgAsReactSvg = function SvgAsReactSvg() {\n    return (\n" + reactify(Boolean(module))(result.svg, 2) + "\n    );\n}\n\nvar width = \"" + width + "\";\nexports.width = width;\n\nvar height = \"" + height + "\";\nexports.height = height;\n\nvar _default = SvgAsReactSvg;\nexports.default = _default;\n"];
            }
        });
    });
}
exports.transform = transform;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdHJhbnNmb3JtZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlDQUE0QztBQUM1Qyw2Q0FBZ0Q7QUFFaEQscUNBQTJDO0FBRTNDLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQztBQUMzQixJQUFNLFlBQVksR0FBRyxZQUFZLENBQUM7QUFDbEMsSUFBTSxnQkFBZ0IsR0FBRyxVQUFVLENBQUM7QUFDcEMsSUFBTSxXQUFXLEdBQUcsV0FBVyxDQUFDO0FBQ2hDLElBQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQztBQWEvQixJQUFNLFNBQVMsR0FBRyxVQUFDLEdBQVc7SUFDMUIsT0FBQSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDO0FBQW5FLENBQW1FLENBQUM7QUFFeEUsSUFBTSxZQUFZLEdBQUcsVUFBQyxPQUFlO0lBQ2pDLE9BQUEsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQTNDLENBQTJDLENBQUM7QUFFaEQsSUFBTSxRQUFRLEdBQUcsVUFBQyxNQUFlO0lBQzdCLE9BQUEsU0FBUyxPQUFPLENBQUMsSUFBYSxFQUFFLElBQVE7UUFBUixxQkFBQSxFQUFBLFFBQVE7UUFDcEMsSUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuQyxJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFN0IsSUFBSSxHQUFHLEtBQUssZ0JBQWdCLEVBQUU7WUFDMUIsT0FBVSxNQUFNLFVBQUks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