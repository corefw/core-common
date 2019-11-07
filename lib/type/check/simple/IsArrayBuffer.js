/**
 * @file
 * Defines the Core.type.check.simple.IsArrayBuffer class.
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
 * A simple check that determines if a target variable is an 'ArrayBuffer'.
 *
 * Note: This check is a thin wrapper for the Lodash function `isArrayBuffer` and its `evaluateTarget` method will
 * behave identically to that function.
 *
 * @memberOf Core.type.check.simple
 * @extends Core.type.check.simple.BaseSimpleCheck
 */
class IsArrayBuffer extends Core.cls( "Core.type.check.simple.BaseSimpleCheck" ) {



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
		return 104;
	}

	/**
	 * @inheritDoc
	 */
	static get description() {
		return "Checks if a value is classified as an ArrayBuffer object.";
	}

	/**
	 * @inheritDoc
	 */
	static get checksFor() {
		return "ArrayBuffer";
	}

	/**
	 * @inheritDoc
	 */
	static get source() {
		return "LoDash::isArrayBuffer()";
	}



	// </editor-fold>

	// <editor-fold desc="--- Target Evaluation ----------------------------------------------------------------------">



	/**
	 * Checks if a `value` is classified as an ArrayBuffer object.
	 *
	 * @static
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is an arraybuffer; otherwise it returns FALSE.
	 */
	static evaluateTarget( value ) {
		return _.isArrayBuffer( value );
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
		return baseDescription + " (byteLength=" + value.byteLength + ")";

	}





	// </editor-fold>



}

module.exports = IsArrayBuffer;
