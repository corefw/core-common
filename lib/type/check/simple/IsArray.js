/**
 * @file
 * Defines the Core.type.check.simple.IsArray class.
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
 * A simple check that determines if a target variable is an 'Array'.
 *
 * Note: This check is a thin wrapper for the Lodash function `isArray` and its `evaluateTarget` method will
 * behave identically to that function.
 *
 * @memberOf Core.type.check.simple
 * @extends Core.type.check.simple.BaseSimpleCheck
 */
class IsArray extends Core.cls( "Core.type.check.simple.BaseSimpleCheck" ) {



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
		return 100;
	}

	/**
	 * @inheritDoc
	 */
	static get description() {
		return "Checks if a value is classified as an Array object.";
	}

	/**
	 * @inheritDoc
	 */
	static get checksFor() {
		return "Array";
	}

	/**
	 * @inheritDoc
	 */
	static get source() {
		return "LoDash::isArray()";
	}



	// </editor-fold>

	// <editor-fold desc="--- Target Evaluation ----------------------------------------------------------------------">



	/**
	 * Checks if a `value` is classified as an Array object.
	 *
	 * @static
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is an array; otherwise it returns FALSE.
	 */
	static evaluateTarget( value ) {
		return _.isArray( value );
	}




	// </editor-fold>

	// <editor-fold desc="--- Target Description ---------------------------------------------------------------------">



	/**
	 * @inheritDoc
	 */
	static describeTarget( value, opts ) {

		// Start with a default description
		let baseDescription = super.describeTarget( value, opts );

		// Normalize the `opts` param
		opts = this._normalizeDescribeOptions( opts );

		// We'll describe "empty" variables in a special way...
		if( value.length === 0 ) {

			if( opts.addIndefiniteArticle === true ) {
				return "an empty " + this.checksFor;
			} else {
				return "empty " + this.checksFor;
			}

		} else {

			// For non-empty variables, we'll just append a note,
			// in parenthesis, that shows the value of 'length'
			return baseDescription + " (length=" + value.length + ")";

		}

	}





	// </editor-fold>



}

module.exports = IsArray;
