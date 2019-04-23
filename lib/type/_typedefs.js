/**
 * @file
 * Defines the `Core.type` namespace.
 *
 * Note: This file, like all `_typedefs.js` files, exist solely to provide code meta information for external systems,
 * such as JSDoc. They can be used to define namespaces, custom types, and other, similar, resources that do not fit
 * well in other places.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

/**
 * Contains entities related to variable introspection and validation.
 *
 * @namespace type
 * @memberOf Core
 */


/**
 * An object containing an `$any` property with an array of `ValidationInstruction` objects. During evaluation,
 * each `ValidationInstruction` contained in the collection will be evaluated, in turn, and this collection
 * will PASS validation if ANY of its children PASS their validation check.
 *
 * @typedef {Object} AnyValidationInstructionCollection
 * @memberOf Core.type
 * @property {ValidationInstruction[]} $any - An array of `ValidationInstruction` objects that will be evaluated,
 * in turn, to determine the validity of this collection.
 */

/**
 * An object containing an `$all` property with an array of `ValidationEntity` objects. During evaluation,
 * each `ValidationEntity` contained in the collection will be evaluated, in turn, and this collection
 * will PASS validation if ALL of its children PASS their validation check.
 *
 * @typedef {Object} AllValidationInstructionCollection
 * @memberOf Core.type
 * @property {ValidationInstruction[]} $all - An array of `ValidationInstruction` objects that will be evaluated,
 * in turn, to determine the validity of this collection.
 */

/**
 * An object containing EITHER an `$any` or `$all` property with an array of `ValidationEntity` objects.
 *
 * @typedef {AnyValidationInstructionCollection|AllValidationInstructionCollection} ValidationInstructionCollection
 * @memberOf Core.type
 */

/**
 * An object representing a single validation check.
 *
 * @typedef {Object} ValidationCheckInstruction
 * @memberOf Core.type
 * @property {string} $check - The name of the validation check function that will be executed to determine the
 * validity a target value.
 * @property {Array<*>} $args - Additional arguments that will be passed to the validation check.
 * @property {boolean} $negate - When FALSE (default), the validation check function will be executed and will be
 * expected to return TRUE to indicate that the provided target object is valid. When TRUE, the check function will
 * be expected to return FALSE.
 */

/**
 * An object representing either a single `ValidationCheckInstruction` or a `ValidationInstructionCollection`.
 *
 * @typedef {ValidationCheckInstruction|ValidationInstructionCollection} ValidationInstruction
 * @memberOf Core.type
 */

/**
 * A non-strict representation of a single validation instruction or a collection of validation instructions.
 * `LooseValidationInstruction`s will be converted into `ValidationInstruction` objects before being evaluated.
 *
 * @typedef {number|string|Object|Array<number|string|Object|Array>|ValidationInstruction} LooseValidationInstruction
 * @memberOf Core.type
 */

/**
 * Contains the results of a validation operation performed by `Core.type.Validator::validate()`.
 *
 * @typedef {Object} ValidationResult
 * @memberOf Core.type
 * @property {boolean} success - Will be TRUE when validation succeeds or FALSE if validation fails.
 */
