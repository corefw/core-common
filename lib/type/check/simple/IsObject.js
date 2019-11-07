/**
 * @file
 * Defines the Core.type.check.simple.IsObject class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

// Load dependencies using the Core Framework
const { _ } = Core.deps( "_" );

/**
 * A simple check that determines if a target variable is an 'Object'.
 *
 * Note: This check is a thin wrapper for the Lodash function `isObject` and its `evaluateTarget` method will
 * behave identically to that function.
 *
 * @memberOf Core.type.check.simple
 * @extends Core.type.check.simple.BaseSimpleCheck
 */
class IsObject extends Core.cls( "Core.type.check.simple.BaseSimpleCheck" ) {



	// <editor-fold desc="--- Static Properties ----------------------------------------------------------------------">



	/**
	 * @inheritDoc
	 */
	static get isDescriptive() {
		return true;
	}

	/**
	 * @inheritDoc
	 */
	static get describePriority() {
		return 210;
	}

	/**
	 * @inheritDoc
	 */
	static get description() {
		return "Checks if a value is the language type of Object. (e.g. arrays, functions, objects, regexes, new Number(0), and new String('')).";
	}

	/**
	 * @inheritDoc
	 */
	static get checksFor() {
		return "Object";
	}

	/**
	 * @inheritDoc
	 */
	static get source() {
		return "LoDash::isObject()";
	}



	// </editor-fold>

	// <editor-fold desc="--- Target Evaluation ----------------------------------------------------------------------">



	/**
	 * Checks if a `value` is the language type of Object. (e.g. arrays, functions, objects, regexes, new Number(0), and new String('')).
	 *
	 * @static
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is an object; otherwise it returns FALSE.
	 */
	static evaluateTarget( value ) {
		return _.isObject( value );
	}




	// </editor-fold>

	// <editor-fold desc="--- References to other Checks -------------------------------------------------------------">



	/**
	 * A convenience alias for `Core.type.check.simple.IsNil::evaluateTarget()`.
	 *
	 * @private
	 * @see `Core.type.check.simple.IsNil::evaluateTarget()`
	 * @param {*} value - The value to check.
	 * @returns {boolean} TRUE if `value` is undefined or NULL; FALSE otherwise.
	 */
	static _isNil( value ) {
		return this._doPeerReview( "Core.type.check.simple.IsNil", value );
	}




	// </editor-fold>

	// <editor-fold desc="--- Target Description ---------------------------------------------------------------------">



	/**
	 * @inheritDoc
	 */
	static describeTarget( value, opts ) {

		// Start with a default description
		let ret = super.describeTarget( value, opts );

		// Append the constructor name, if one exists..
		if( !this._isNil( value.constructor ) && !this._isNil( value.constructor.name ) ) {

			if( value.constructor.name === "Object" ) {
				ret += " (plain)";
			} else {
				ret += " (constructor.name=\"" + value.constructor.name + "\")";
			}

		}

		// Done
		return ret;

	}





	// </editor-fold>



}

module.exports = IsObject;
