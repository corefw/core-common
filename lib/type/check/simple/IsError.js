/**
 * @file
 * Defines the Core.type.check.simple.IsError class.
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
 * A simple check that determines if a target variable is an 'Error Object'.
 *
 * Note: This check is a thin wrapper for the Lodash function `isError` and its `evaluateTarget` method will
 * behave identically to that function.
 *
 * @memberOf Core.type.check.simple
 * @extends Core.type.check.simple.BaseSimpleCheck
 */
class IsError extends Core.cls( "Core.type.check.simple.BaseSimpleCheck" ) {



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
		return "Checks if a value is an Error, EvalError, RangeError, ReferenceError, SyntaxError, TypeError, or URIError object.";
	}

	/**
	 * @inheritDoc
	 */
	static get checksFor() {
		return "Error Object";
	}

	/**
	 * @inheritDoc
	 */
	static get source() {
		return "LoDash::isError()";
	}



	// </editor-fold>

	// <editor-fold desc="--- Target Evaluation ----------------------------------------------------------------------">



	/**
	 * Checks if a `value` is an Error, EvalError, RangeError, ReferenceError, SyntaxError, TypeError, or URIError object.
	 *
	 * @static
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is an error object; otherwise it returns FALSE.
	 */
	static evaluateTarget( value ) {
		return _.isError( value );
	}




	// </editor-fold>

	// <editor-fold desc="--- Target Description ---------------------------------------------------------------------">



	/**
	 * @inheritDoc
	 */
	static describeTarget( value, opts ) {

		// Start with a default description
		let baseDescription = super.describeTarget( value, opts );

		// Append the error message
		if ( value.message === undefined || value.message === null || value.message === "" ) {

			// Handle empty messages
			return baseDescription + " (with an empty message)";

		} else if ( value.message.length < 40 ) {

			// Handle short messages
			return baseDescription + " (\"" + value.message + "\")";

		} else {

			// Handle long messages
			return baseDescription + " (\"" + value.message.substr( 0, 35 ) + "...\")";

		}

	}





	// </editor-fold>



}

module.exports = IsError;
