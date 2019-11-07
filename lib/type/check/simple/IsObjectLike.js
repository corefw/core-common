/**
 * @file
 * Defines the Core.type.check.simple.IsObjectLike class.
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
 * A simple check that determines if a target variable is an 'object-like value'.
 *
 * Note: This check is a thin wrapper for the Lodash function `isObjectLike` and its `evaluateTarget` method will
 * behave identically to that function.
 *
 * @memberOf Core.type.check.simple
 * @extends Core.type.check.simple.BaseSimpleCheck
 */
class IsObjectLike extends Core.cls( "Core.type.check.simple.BaseSimpleCheck" ) {



	// <editor-fold desc="--- Static Properties ----------------------------------------------------------------------">



	/**
	 * @inheritDoc
	 */
	static get description() {
		return "Checks if a value is object-like. A value is object-like if it's not null and has a typeof result of \"object\".";
	}

	/**
	 * @inheritDoc
	 */
	static get checksFor() {
		return "object-like value";
	}

	/**
	 * @inheritDoc
	 */
	static get source() {
		return "LoDash::isObjectLike()";
	}



	// </editor-fold>

	// <editor-fold desc="--- Target Evaluation ----------------------------------------------------------------------">



	/**
	 * Checks if a `value` is object-like. A `value` is object-like if it's not null and has a typeof result of "object".
	 *
	 * @static
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is an object-like value; otherwise it returns FALSE.
	 */
	static evaluateTarget( value ) {
		return _.isObjectLike( value );
	}




	// </editor-fold>

	// <editor-fold desc="--- Target Description ---------------------------------------------------------------------">



	// Note: This check class does not provide a `describeTarget` method, mainly because it is non-descriptive.
	// However, one is provided by its ancestors which can be used to describe "conforming" variables/values.




	// </editor-fold>




}

module.exports = IsObjectLike;
