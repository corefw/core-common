/**
 * @file
 * Defines the Core.type.check.simple.IsNonAsyncFunction class.
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
 * A simple check that determines if a target variable is a 'non-Async Function'.
 *
 * @memberOf Core.type.check.simple
 * @extends Core.type.check.simple.BaseSimpleCheck
 */
class IsNonAsyncFunction extends Core.cls( "Core.type.check.simple.BaseSimpleCheck" ) {



	// <editor-fold desc="--- Static Properties ----------------------------------------------------------------------">



	/**
	 * @inheritDoc
	 */
	static get description() {
		return "Checks if a value is a function that was NOT declared with the 'async' keyword.";
	}

	/**
	 * @inheritDoc
	 */
	static get checksFor() {
		return "non-Async Function";
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
	 * Checks if `value` is a function that was NOT declared using the `async` keyword.
	 *
	 * Important Notes:
	 *
	 *    - Although this method can detect whether or not a function was declared using the `async` keyword, any
	 *      function that returns a promise could be considered to be 'async'. Given that this method does not
	 *      introspect the return values of the target function, it cannot truly tell if a given function is async.
	 *
	 *    - This method is meant to be used for reflective purposes. Implementing it as a way to fork logic based on
	 *      whether or not a function is an async function is almost certainly a very-bad-idea.
	 *
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a non-async function; otherwise it returns FALSE.
	 */
	static evaluateTarget( value ) {

		// First, check to see that it's a function
		if( !this._isFunction( value ) ) {
			return false;
		}

		// From here we can defer to the isAsyncFunction() method
		return !this._isAsyncFunction( value );

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
	 * A convenience alias for `Core.type.check.simple.IsAsyncFunction::evaluateTarget()`.
	 *
	 * @private
	 * @see `Core.type.check.simple.IsAsyncFunction::evaluateTarget()`
	 * @param {*} value - The value to check.
	 * @returns {boolean} TRUE if `value` is an async function; FALSE otherwise.
	 */
	static _isAsyncFunction( value ) {
		return this._doPeerReview( "Core.type.check.simple.IsAsyncFunction", value );
	}



	// </editor-fold>

	// <editor-fold desc="--- Target Description ---------------------------------------------------------------------">



	// Note: This check class does not provide a `describeTarget` method, mainly because it is non-descriptive.
	// However, one is provided by its ancestors which can be used to describe "conforming" variables/values.




	// </editor-fold>



}

module.exports = IsNonAsyncFunction;
