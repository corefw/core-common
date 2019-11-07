/**
 * @file
 * Defines the Core.type.check.simple.IsArrayLike class.
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
 * A simple check that determines if a target variable is an 'array-like value'.
 *
 * Note: This check is a thin wrapper for the Lodash function `isArrayLike` and its `evaluateTarget` method will
 * behave identically to that function.
 *
 * @memberOf Core.type.check.simple
 * @extends Core.type.check.simple.BaseSimpleCheck
 */
class IsArrayLike extends Core.cls( "Core.type.check.simple.BaseSimpleCheck" ) {



	// <editor-fold desc="--- Static Properties ----------------------------------------------------------------------">



	/**
	 * @inheritDoc
	 */
	static get description() {
		return "Checks if a value is array-like. A value is considered array-like if it's not a function and has a value.length that's an integer greater than or equal to 0 and less than or equal to Number.MAX_SAFE_INTEGER.";
	}

	/**
	 * @inheritDoc
	 */
	static get checksFor() {
		return "array-like value";
	}

	/**
	 * @inheritDoc
	 */
	static get source() {
		return "LoDash::isArrayLike()";
	}



	// </editor-fold>

	// <editor-fold desc="--- Target Evaluation ----------------------------------------------------------------------">



	/**
	 * Checks if a `value` is array-like. A `value` is considered array-like if it's not a function and has a `value`.length that's an integer greater than or equal to 0 and less than or equal to Number.MAX_SAFE_INTEGER.
	 *
	 * @static
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is an array-like value; otherwise it returns FALSE.
	 */
	static evaluateTarget( value ) {
		return _.isArrayLike( value );
	}




	// </editor-fold>

	// <editor-fold desc="--- Target Description ---------------------------------------------------------------------">



	// Note: This check class does not provide a `describeTarget` method, mainly because it is non-descriptive.
	// However, one is provided by its ancestors which can be used to describe "conforming" variables/values.




	// </editor-fold>




}

module.exports = IsArrayLike;
