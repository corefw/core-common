/**
 * @file
 * Defines the Core.type.check.simple.IsNamedFunction class.
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
 * A simple check that determines if a target variable is a 'named Function'.
 *
 * @memberOf Core.type.check.simple
 * @extends Core.type.check.simple.BaseSimpleCheck
 */
class IsNamedFunction extends Core.cls( "Core.type.check.simple.BaseSimpleCheck" ) {



	// <editor-fold desc="--- Static Properties ----------------------------------------------------------------------">



	/**
	 * @inheritDoc
	 */
	static get description() {
		return "Checks if a value is a named function.";
	}

	/**
	 * @inheritDoc
	 */
	static get checksFor() {
		return "named Function";
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
		return "anonymous Function";
	}



	// </editor-fold>

	// <editor-fold desc="--- Target Evaluation ----------------------------------------------------------------------">



	/**
	 * Checks if `value` is named function.
	 *
	 * Important Note: This function is meant to be used for reflective purposes. Implementing it as a way to fork
	 * logic based on whether or not a function is named is almost certainly a very-bad-idea.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a named function; otherwise it returns FALSE.
	 */
	static evaluateTarget( value ) {

		// First, check to see that it's a function
		if( !this._isFunction( value ) ) {
			return false;
		}

		// From here we can defer to the `IsAnonymousFunction` check class.
		return !this._isAnonymousFunction( value );

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
	 * A convenience alias for `Core.type.check.simple.IsAnonymousFunction::evaluateTarget()`.
	 *
	 * @private
	 * @see `Core.type.check.simple.IsAnonymousFunction::evaluateTarget()`
	 * @param {*} value - The value to check.
	 * @returns {boolean} TRUE if `value` is an anonymous function; FALSE otherwise.
	 */
	static _isAnonymousFunction( value ) {
		return this._doPeerReview( "Core.type.check.simple.IsAnonymousFunction", value );
	}



	// </editor-fold>

	// <editor-fold desc="--- Target Description ---------------------------------------------------------------------">



	// Note: This check class does not provide a `describeTarget` method, mainly because it is non-descriptive.
	// However, one is provided by its ancestors which can be used to describe "conforming" variables/values.




	// </editor-fold>



}

module.exports = IsNamedFunction;
