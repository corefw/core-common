/**
 * @file
 * Defines the Core.type.check.simple.IsInteger class.
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
 * A simple check that determines if a target variable is an 'integer'.
 *
 * Note: This check is a thin wrapper for the Lodash function `isInteger` and its `evaluateTarget` method will
 * behave identically to that function.
 *
 * @memberOf Core.type.check.simple
 * @extends Core.type.check.simple.BaseSimpleCheck
 */
class IsInteger extends Core.cls( "Core.type.check.simple.BaseSimpleCheck" ) {



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
		return 90;
	}

	/**
	 * @inheritDoc
	 */
	static get description() {
		return "Checks if a value is an integer.";
	}

	/**
	 * @inheritDoc
	 */
	static get checksFor() {
		return "integer";
	}

	/**
	 * @inheritDoc
	 */
	static get source() {
		return "LoDash::isInteger()";
	}



	// </editor-fold>

	// <editor-fold desc="--- Target Evaluation ----------------------------------------------------------------------">



	/**
	 * Checks if a `value` is an integer.
	 *
	 * @static
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is an integer; otherwise it returns FALSE.
	 */
	static evaluateTarget( value ) {
		return _.isInteger( value );
	}




	// </editor-fold>

	// <editor-fold desc="--- Target Description ---------------------------------------------------------------------">



	/**
	 * @inheritDoc
	 */
	static describeTarget( value, opts ) {

		// Start with a default description
		let baseDescription = super.describeTarget( value, opts );

		// Append byteLength
		return baseDescription + " (Number; value=" + value + ")";

	}





	// </editor-fold>



}

module.exports = IsInteger;
