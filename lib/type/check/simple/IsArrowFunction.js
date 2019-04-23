/**
 * @file
 * Defines the Core.type.check.simple.IsArrowFunction class.
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
 * A simple check that determines if a target variable is an 'Arrow Function'.
 *
 * @memberOf Core.type.check.simple
 * @extends Core.type.check.simple.BaseSimpleCheck
 */
class IsArrowFunction extends Core.cls( "Core.type.check.simple.BaseSimpleCheck" ) {



	// <editor-fold desc="--- Static Properties ----------------------------------------------------------------------">



	/**
	 * @inheritDoc
	 */
	static get description() {
		return "Checks if a value is an arrow function.";
	}

	/**
	 * @inheritDoc
	 */
	static get checksFor() {
		return "Arrow Function";
	}

	/**
	 * @inheritDoc
	 */
	static get source() {
		return "Core Framework";
	}



	// </editor-fold>

	// <editor-fold desc="--- Target Evaluation ----------------------------------------------------------------------">



	/**
	 * Checks if a `value` is an arrow function.
	 *
	 * @static
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is an arrow function; otherwise it returns FALSE.
	 */
	static evaluateTarget( value ) {

		// First, check to see that it's a function
		if( !this._isFunction( value ) ) {
			return false;
		}

		// If the function has been converted to a native function (mutated),
		// then we cannot determine if it was originally an arrow function,
		// and we'll always return FALSE.
		if( this._isNative( value ) ) {
			return false;
		}

		// Now let's see if it's an arrow function
		let fc = value.toString();

		// Remove all the whitespace
		fc = fc.replace( /[\s\r\n]+/g, "" );

		// Define a regular expression that SHOULD be able to detect all
		// variations of arrow functions..
		let rgx = /^(async)*(\(\)|[\$_a-zA-Z]+\w*|\([\$_a-zA-Z]+\w*(,[\$_a-zA-Z]+\w*)*\))=>/;

		// Test the function against the RegEx
		if( rgx.test( fc ) === true ) {
			return true;
		} else {
			return false;
		}

	}




	// </editor-fold>

	// <editor-fold desc="--- References to other Checks -------------------------------------------------------------">



	/**
	 * A convenience alias for `Core.type.check.simple.IsFunction::evaluateTarget()`.
	 *
	 * @private
	 * @see `Core.type.check.simple.IsFunction::evaluateTarget()`
	 * @param {*} value - The value to check.
	 * @returns {boolean} TRUE if `value` is a function; FALSE otherwise.
	 */
	static _isFunction( value ) {
		return this._doPeerReview( "Core.type.check.simple.IsFunction", value );
	}

	/**
	 * A convenience alias for `Core.type.check.simple.IsNative::evaluateTarget()`.
	 *
	 * @private
	 * @see `Core.type.check.simple.IsNative::evaluateTarget()`
	 * @param {*} value - The value to check.
	 * @returns {boolean} TRUE if `value` is a native function; FALSE otherwise.
	 */
	static _isNative( value ) {
		return this._doPeerReview( "Core.type.check.simple.IsNative", value );
	}



	// </editor-fold>

	// <editor-fold desc="--- Target Description ---------------------------------------------------------------------">



	// Note: This check class does not provide a `describeTarget` method, mainly because it is non-descriptive.
	// However, one is provided by its ancestors which can be used to describe "conforming" variables/values.




	// </editor-fold>



}

module.exports = IsArrowFunction;
