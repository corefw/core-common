/**
 * @file
 * Defines the Core.type.check.simple.IsTypedArray class.
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
 * A simple check that determines if a target variable is a 'TypedArray'.
 *
 * Note: This check is a thin wrapper for the Lodash function `isTypedArray` and its `evaluateTarget` method will
 * behave identically to that function.
 *
 * @memberOf Core.type.check.simple
 * @extends Core.type.check.simple.BaseSimpleCheck
 */
class IsTypedArray extends Core.cls( "Core.type.check.simple.BaseSimpleCheck" ) {



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
		return "Checks if a value is classified as a typed array.";
	}

	/**
	 * @inheritDoc
	 */
	static get checksFor() {
		return "TypedArray";
	}

	/**
	 * @inheritDoc
	 */
	static get source() {
		return "LoDash::isTypedArray()";
	}



	// </editor-fold>

	// <editor-fold desc="--- Target Evaluation ----------------------------------------------------------------------">



	/**
	 * Checks if a `value` is classified as a typed array.
	 *
	 * @static
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a typedarray; otherwise it returns FALSE.
	 */
	static evaluateTarget( value ) {
		return _.isTypedArray( value );
	}




	// </editor-fold>

	// <editor-fold desc="--- Target Description ---------------------------------------------------------------------">



	/**
	 * @inheritDoc
	 */
	static describeTarget( value, opts ) {

		// Start with a default description
		let baseDescription = super.describeTarget( value, opts );

		// Prepend the constructor name (type)
		return baseDescription + " (" + value.constructor.name + "; length=" + value.length + ")";

	}





	// </editor-fold>



}

module.exports = IsTypedArray;
