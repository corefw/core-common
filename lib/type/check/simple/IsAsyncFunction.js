/**
 * @file
 * Defines the Core.type.check.simple.IsAsyncFunction class.
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
 * A simple check that determines if a target variable is an 'Async Function'.
 *
 * @memberOf Core.type.check.simple
 * @extends Core.type.check.simple.BaseSimpleCheck
 */
class IsAsyncFunction extends Core.cls( "Core.type.check.simple.BaseSimpleCheck" ) {



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
		return 97;
	}

	/**
	 * @inheritDoc
	 */
	static get description() {
		return "Checks if a value is a function declared with the 'async' keyword.";
	}

	/**
	 * @inheritDoc
	 */
	static get checksFor() {
		return "Async Function";
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
	 * Checks if `value` is a function that was declared with the `async` keyword.
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
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is an async function; otherwise it returns FALSE.
	 */
	static evaluateTarget( value ) {

		// First, check to see that it's a function
		if( !this._isFunction( value ) ) {
			return false;
		}

		// Async functions will always have a constructor.name of 'AsyncFunction'
		if( value.constructor !== null && value.constructor !== undefined &&
			value.constructor.name !== null && value.constructor.name !== undefined &&
			value.constructor.name === "AsyncFunction"
		) {
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

	/**
	 * A convenience alias for `Core.type.check.simple.IsBoundFunction::evaluateTarget()`.
	 *
	 * @private
	 * @see `Core.type.check.simple.IsBoundFunction::evaluateTarget()`
	 * @param {*} value - The value to check.
	 * @returns {boolean} TRUE if `value` is an bound function; FALSE otherwise.
	 */
	static _isBoundFunction( value ) {
		return this._doPeerReview( "Core.type.check.simple.IsBoundFunction", value );
	}



	// </editor-fold>

	// <editor-fold desc="--- Target Description ---------------------------------------------------------------------">



	/**
	 * @inheritDoc
	 */
	static describeTarget( value, opts ) {

		// Locals
		let me = this;
		let extraDesc;
		let nameDesc;

		// Start with a default description
		let baseDescription = super.describeTarget( value, opts );

		// Build the extra description info (the info in parenthesis)
		// Start with bound..
		if( me._isBoundFunction( value ) ) {
			extraDesc = "bound; ";
		} else {
			extraDesc = "";
		}

		// Next, consider if its an arrow function
		if( me._isArrowFunction( value ) ) {
			extraDesc += "arrow";
			nameDesc = "; as";
		} else {

			// For non-arrow function, consider if its anonymous or named..
			if( me._isAnonymousFunction( value ) ) {
				extraDesc += "anonymous";
				nameDesc = "; as";
			} else {
				//extraDesc += "named";
				nameDesc = "name";
			}

		}

		// Check for a name
		if( value.name !== undefined && value.name !== null	&& value.name !== "" && value.name !== "bound " ) {

			let finalName;
			if( _.startsWith( value.name, "bound " ) ) {
				finalName = value.name.substr( 6 );
			} else {
				finalName = value.name;
			}

			extraDesc += nameDesc + "=" + finalName;
		}

		// All done
		return baseDescription + " (" + extraDesc + ")";

	}




	// </editor-fold>



}

module.exports = IsAsyncFunction;
