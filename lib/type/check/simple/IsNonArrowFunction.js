/**
 * @file
 * Defines the Core.type.check.simple.IsNonArrowFunction class.
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
 * A simple check that determines if a target variable is a 'non-Arrow Function'.
 *
 * @memberOf Core.type.check.simple
 * @extends Core.type.check.simple.BaseSimpleCheck
 */
class IsNonArrowFunction extends Core.cls( "Core.type.check.simple.BaseSimpleCheck" ) {



	// <editor-fold desc="--- Static Properties ----------------------------------------------------------------------">



	/**
	 * @inheritDoc
	 */
	static get description() {
		return "Checks if a value is a non-arrow function.";
	}

	/**
	 * @inheritDoc
	 */
	static get checksFor() {
		return "non-Arrow Function";
	}

	/**
	 * @inheritDoc
	 */
	static get source() {
		return "Core Framework";
	}

	/**
	 * @inheritDoc
	 */
	static get failsFor() {
		return "Arrow Function";
	}



	// </editor-fold>

	// <editor-fold desc="--- Target Evaluation ----------------------------------------------------------------------">



	/**
	 * Checks if `value` is a function, but not an arrow function.
	 *
	 * Important Notes:
	 *
	 *    - This method depends on interpreting the contents of the function (using `Function.prototype.toString()`)
	 * 		to determine if the function is an arrow function. Because the `toString()` return is mutated by certain
	 * 		native operations (such as `Function.prototype.bind()`), those operations will render this method
	 * 		ineffective and unable to determine whether or not a function is an arrow function. In such cases, where
	 * 		functions have been converted to "native functions", this method will always return TRUE, regardless of
	 * 		whether or not the function was originally declared using the arrow syntax.
	 *
	 *    - This function is meant to be used for reflective purposes. Implementing it as a way to fork logic based on
	 *    	whether or not a function is an arrow function is almost certainly a very-bad-idea.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is non-arrow function; otherwise it returns FALSE.
	 */
	static evaluateTarget( value ) {

		// First, check to see that it's a function
		if( !this._isFunction( value ) ) {
			return false;
		}

		// From here we can defer to the `IsArrowFunction` check.
		return !this._isArrowFunction( value );

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
	 * A convenience alias for `Core.type.check.simple.IsArrowFunction::evaluateTarget()`.
	 *
	 * @private
	 * @see `Core.type.check.simple.IsArrowFunction::evaluateTarget()`
	 * @param {*} value - The value to check.
	 * @returns {boolean} TRUE if `value` is an arrow function; FALSE otherwise.
	 */
	static _isArrowFunction( value ) {
		return this._doPeerReview( "Core.type.check.simple.IsArrowFunction", value );
	}



	// </editor-fold>

	// <editor-fold desc="--- Target Description ---------------------------------------------------------------------">



	// Note: This check class does not provide a `describeTarget` method, mainly because it is non-descriptive.
	// However, one is provided by its ancestors which can be used to describe "conforming" variables/values.




	// </editor-fold>



}

module.exports = IsNonArrowFunction;
