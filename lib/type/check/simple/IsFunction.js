/**
 * @file
 * Defines the Core.type.check.simple.IsFunction class.
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
 * A simple check that determines if a target variable is a 'Function'.
 *
 * Note: This check is a thin wrapper for the Lodash function `isFunction` and its `evaluateTarget` method will
 * behave identically to that function.
 *
 * @memberOf Core.type.check.simple
 * @extends Core.type.check.simple.BaseSimpleCheck
 */
class IsFunction extends Core.cls( "Core.type.check.simple.BaseSimpleCheck" ) {



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
		return "Checks if a value is classified as a Function object.";
	}

	/**
	 * @inheritDoc
	 */
	static get checksFor() {
		return "Function";
	}

	/**
	 * @inheritDoc
	 */
	static get source() {
		return "LoDash::isFunction()";
	}



	// </editor-fold>

	// <editor-fold desc="--- Target Evaluation ----------------------------------------------------------------------">



	/**
	 * Checks if a `value` is classified as a Function object.
	 *
	 * @static
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a function; otherwise it returns FALSE.
	 */
	static evaluateTarget( value ) {
		return _.isFunction( value );
	}




	// </editor-fold>

	// <editor-fold desc="--- References to other Checks -------------------------------------------------------------">



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

module.exports = IsFunction;
