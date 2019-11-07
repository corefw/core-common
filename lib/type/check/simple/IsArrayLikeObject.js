/**
 * @file
 * Defines the Core.type.check.simple.IsArrayLikeObject class.
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
 * A simple check that determines if a target variable is an 'array-like Object'.
 *
 * Note: This check is a thin wrapper for the Lodash function `isArrayLikeObject` and its `evaluateTarget` method will
 * behave identically to that function.
 *
 * @memberOf Core.type.check.simple
 * @extends Core.type.check.simple.BaseSimpleCheck
 */
class IsArrayLikeObject extends Core.cls( "Core.type.check.simple.BaseSimpleCheck" ) {



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
		return 110;
	}

	/**
	 * @inheritDoc
	 */
	static get description() {
		return "Checks if a value is an array-like object. A value is considered to be an array-like object if it is an object and has a value.length that's an integer greater than or equal to 0 and less than or equal to Number.MAX_SAFE_INTEGER.";
	}

	/**
	 * @inheritDoc
	 */
	static get checksFor() {
		return "array-like Object";
	}

	/**
	 * @inheritDoc
	 */
	static get source() {
		return "LoDash::isArrayLikeObject()";
	}



	// </editor-fold>

	// <editor-fold desc="--- Target Evaluation ----------------------------------------------------------------------">



	/**
	 * Checks if a `value` is an array-like object. A `value` is considered to be an array-like object if it is an object and has a `value`.length that's an integer greater than or equal to 0 and less than or equal to Number.MAX_SAFE_INTEGER.
	 *
	 * @static
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is an array-like object; otherwise it returns FALSE.
	 */
	static evaluateTarget( value ) {
		return _.isArrayLikeObject( value );
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

module.exports = IsArrayLikeObject;
