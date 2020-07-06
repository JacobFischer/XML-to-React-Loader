"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.defaultOptions = void 0;
var jsonschema_definer_1 = __importDefault(require("jsonschema-definer"));
var OptionsSchema = jsonschema_definer_1.default.shape({
    module: jsonschema_definer_1.default.string().optional(),
});
/** The safe default options used by the loader. */
exports.defaultOptions = {};
/**
 * Checks if a given object matches the options shape.
 *
 * @param obj - The option to check.
 * @returns The same object, but now with the correct type information.
 */
function validate(obj) {
    if (!obj) {
        return {}; // defaults
    }
    var _a = OptionsSchema.validate(obj), valid = _a[0], errors = _a[1];
    if (!valid) {
        var errorMessage = errors
            ? errors.map(function (err) { return err.message || "Unknown"; }).join(", ")
            : "Unknown";
        throw new Error("Invalid options: " + errorMessage);
    }
    return obj;
}
exports.validate = validate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9vcHRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDBFQUFtQztBQUVuQyxJQUFNLGFBQWEsR0FBRyw0QkFBQyxDQUFDLEtBQUssQ0FBQztJQUMxQixNQUFNLEVBQUUsNEJBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7Q0FDaEMsQ0FBQyxDQUFDO0FBS0gsbURBQW1EO0FBQ3RDLFFBQUEsY0FBYyxHQUFZLEVBQUUsQ0FBQztBQUUxQzs7Ozs7R0FLRztBQUNILFNBQWdCLFFBQVEsQ0FBQyxHQUE2QjtJQUNsRCxJQUFJLENBQUMsR0FBRyxFQUFFO1FBQ04sT0FBTyxFQUFFLENBQUMsQ0FBQyxXQUFXO0tBQ3pCO0lBQ0ssSUFBQSxLQUFrQixhQUFhLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUE1QyxLQUFLLFFBQUEsRUFBRSxNQUFNLFFBQStCLENBQUM7SUFFcEQsSUFBSSxDQUFDLEtBQUssRUFBRTtRQUNSLElBQU0sWUFBWSxHQUFHLE1BQU07WUFDdkIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQyxHQUFHLElBQUssT0FBQSxHQUFHLENBQUMsT0FBTyxJQUFJLFNBQVMsRUFBeEIsQ0FBd0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDMUQsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUNoQixNQUFNLElBQUksS0FBSyxDQUFDLHNCQUFvQixZQUFjLENBQUMsQ0FBQztLQUN2RDtJQUVELE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQztBQWRELDRCQWNDIn0=