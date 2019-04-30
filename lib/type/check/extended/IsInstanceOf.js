/**
 * @file
 * Defines the Core.type.check.extended.IsInstanceOf class.
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
 * Checks to see if a value is an instance of a specified class or object.
 *
 * @memberOf Core.type.check.simple
 * @extends Core.type.check.extended.BaseExtendedCheck
 */
class IsInstanceOf extends Core.cls( "Core.type.check.extended.BaseExtendedCheck" ) {



	// <editor-fold desc="--- Static Properties ----------------------------------------------------------------------">



	/**
	 * @inheritDoc
	 */
	static get description() {
		return "Checks to see if a value is an instance of a specified class or object.";
	}

	/**
	 * @inheritDoc
	 */
	static get checksFor() {
		return "Object Instances"; // todo: reconsider this..
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
	 * Checks if a `value` an instance of `Constructor`.
	 *
	 * @static
	 * @public
	 * @param {*} value - The value to check.
	 * @param {function|string} Constructor - A constructor to test `value` against. If a string is provided then
	 * a Core Framework Class will be resolved and used for the test.
	 * @returns {boolean} Returns TRUE if `value` is an instance of `Constructor`; otherwise it returns FALSE.
	 */
	static evaluateTarget( value, Constructor ) {

		if( this._isCoreClassName( Constructor ) ) {

			// Convert Core Class Names to class definitions (constructors)
			return this.evaluateTarget( value, Core.cls( Constructor ) );

		} else if( this._isString( Constructor ) ) {

			// Any other strings are bad...
			throw new Error( "Invalid value for the 'Constructor' param in `Core.type.check.extended.IsInstanceOf::evaluateTarget()`; a string was provided ('" + Constructor + "') but it is not a valid Core Framework Class Name." );

		} else if( this._isFunction( Constructor ) ) {

			// If we have a function, defer to the `instanceof` built-in
			return ( value instanceof Constructor );

		} else {

			// Anything else is bad..
			throw new Error( "Invalid value for the 'Constructor' param in `Core.type.check.extended.IsInstanceOf::evaluateTarget()`; a valid Core Class Name, a class definition, or a constructor function was expected but " + Core.validator.describeA( Constructor ) + " was provided." );

		}

	}

	static describeExpectation( negate, Constructor ) {

		// Locals
		let me = this;
		let constructorDesc;


		if( me._isCoreClassName( Constructor ) ) {
			constructorDesc = Constructor;
		} else if( me._isString( Constructor ) ) {

			// Any other strings are bad...
			throw new Error( "Invalid value for the 'Constructor' param in `Core.type.check.extended.IsInstanceOf::describeExpectation()`; a string was provided ('" + Constructor + "') but it is not a valid Core Framework Class Name." );

		} else if( me._isFunction( Constructor ) ) {

			if( Constructor.prototype !== null &&
				Constructor.prototype !== undefined &&
				Constructor.prototype.$amClassName !== undefined ) {

				constructorDesc = Constructor.prototype.$amClassName;

			} else {

				if( Constructor.name !== undefined && Constructor.name !== null && Constructor.name !== "" ) {
					constructorDesc = Constructor.name;
				} else {
					constructorDesc = "<Anonymous" + Constructor.constructor.name + ">";
				}

			}

		} else {

			// Anything else is bad..
			throw new Error( "Invalid value for the 'Constructor' param in `Core.type.check.extended.IsInstanceOf::describeExpectation()`; a valid Core Class Name, a class definition, or a constructor function was expected but " + Core.validator.describeA( Constructor ) + " was provided." );

		}

		if( !negate ) {
			return `an instance of '${constructorDesc}'`;
		} else {
			return `not an instance of '${constructorDesc}'`;
		}

	}



	// </editor-fold>

	// <editor-fold desc="--- References to other Checks -------------------------------------------------------------">



	/**
	 * A convenience alias for `Core.type.check.simple.IsString::evaluateTarget()`.
	 *
	 * @private
	 * @see `Core.type.check.simple.IsString::evaluateTarget()`
	 * @param {*} value - The value to check.
	 * @returns {boolean} TRUE if `value` is a string; FALSE otherwise.
	 */
	static _isString( value ) {
		return this._doPeerReview( "Core.type.check.simple.IsString", value );
	}

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
	 * A convenience alias for `Core.type.check.simple.IsCoreClassName::evaluateTarget()`.
	 *
	 * @private
	 * @see `Core.type.check.simple.IsCoreClassName::evaluateTarget()`
	 * @param {*} value - The value to check.
	 * @returns {boolean} TRUE if `value` is a valid Core Framework Class Name; FALSE otherwise.
	 */
	static _isCoreClassName( value ) {
		return this._doPeerReview( "Core.type.check.simple.IsCoreClassName", value );
	}



	// </editor-fold>

	// <editor-fold desc="--- Target Description ---------------------------------------------------------------------">






	// </editor-fold>



}

module.exports = IsInstanceOf;
