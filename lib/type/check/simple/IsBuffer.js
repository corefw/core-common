/**
 * @file
 * Defines the Core.type.check.simple.IsBuffer class.
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
 * A simple check that determines if a target variable is a 'Buffer'.
 *
 * Note: This check is a thin wrapper for the Lodash function `isBuffer` and its `evaluateTarget` method will
 * behave identically to that function.
 *
 * @memberOf Core.type.check.simple
 * @extends Core.type.check.simple.BaseSimpleCheck
 */
class IsBuffer extends Core.cls( "Core.type.check.simple.BaseSimpleCheck" ) {



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
		return 102;
	}

	/**
	 * @inheritDoc
	 */
	static get description() {
		return "Checks if a value is a buffer.";
	}

	/**
	 * @inheritDoc
	 */
	static get checksFor() {
		return "Buffer";
	}

	/**
	 * @inheritDoc
	 */
	static get source() {
		return "LoDash::isBuffer()";
	}



	// </editor-fold>

	// <editor-fold desc="--- Target Evaluation ----------------------------------------------------------------------">



	/**
	 * Checks if a `value` is a buffer.
	 *
	 * @static
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a buffer; otherwise it returns FALSE.
	 */
	static evaluateTarget( value ) {
		return _.isBuffer( value );
	}




	// </editor-fold>

	// <editor-fold desc="--- Target Description ---------------------------------------------------------------------">



	/**
	 * @inheritDoc
	 */
	static describeTarget( value, opts ) {

		// Start with a default description
		let baseDescription = super.describeTarget( value, opts );

		// Append length
		return baseDescription + " (length=" + value.length + ")";

	}





	// </editor-fold>



}

module.exports = IsBuffer;
