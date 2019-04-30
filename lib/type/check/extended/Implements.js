/**
 * @file
 * Defines the Core.type.check.extended.Implements class.
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
 * Checks to see if a value is implements a Core Interface Class.
 *
 * @memberOf Core.type.check.simple
 * @extends Core.type.check.extended.BaseExtendedCheck
 */
class Implements extends Core.cls( "Core.type.check.extended.BaseExtendedCheck" ) {



	// <editor-fold desc="--- Static Properties ----------------------------------------------------------------------">



	/**
	 * @inheritDoc
	 */
	static get description() {
		return "Checks to see if a value is implements a Core Interface Class.";
	}

	/**
	 * @inheritDoc
	 */
	static get checksFor() {
		return "Interface Implementor"; // todo: reconsider this..
	}

	/**
	 * @inheritDoc
	 */
	static get failsFor() {
		return "Interface non-Implementor"; // todo: reconsider this..
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
	 * Checks if a `value` an instance of `Interface`.
	 *
	 * @static
	 * @public
	 * @param {*} value - The value to check.
	 * @param {function|string} Interface - A constructor to test `value` against. If a string is provided then
	 * a Core Framework Class will be resolved and used for the test.
	 * @returns {boolean} Returns TRUE if `value` is an instance of `Interface`; otherwise it returns FALSE.
	 */
	static evaluateTarget( value, Interface ) {

		if( this._isCoreClassName( Interface ) ) {

			// Convert Core Class Names to class definitions (constructors)
			return this.evaluateTarget( value, Core.cls( Interface ) );

		} else if( this._isString( Interface ) ) {

			// Any other strings are bad...
			throw new Error( "Invalid value for the 'Interface' param in `Core.type.check.extended.Implements::evaluateTarget()`; a string was provided ('" + Interface + "') but it is not a valid Core Framework Class Name." );

		} else if( this._isFunction( Interface ) ) {

			// If we have a function, then it should be a Core Interface Class
			if( Interface.$isCoreInterface !== true ) {
				throw new Error( "Invalid value for the 'Interface' param in `Core.type.check.extended.Implements::evaluateTarget()`; The provided class/constructor is not a valid Core Interface Class." );
			} else {
				return Interface.test( value );
			}

		} else {

			// Anything else is bad..
			throw new Error( "Invalid value for the 'Interface' param in `Core.type.check.extended.Implements::evaluateTarget()`; a valid Core Class Name or a class definition was expected but " + Core.validator.describeA( Interface ) + " was provided." );

		}

	}

	static describeExpectation( negate, Interface ) {

		// Locals
		let me = this;
		let constructorDesc;


		if( me._isCoreClassName( Interface ) ) {
			constructorDesc = Interface;
		} else if( me._isString( Interface ) ) {

			// Any other strings are bad...
			throw new Error( "Invalid value for the 'Interface' param in `Core.type.check.extended.Implements::describeExpectation()`; a string was provided ('" + Interface + "') but it is not a valid Core Framework Class Name." );

		} else if( me._isFunction( Interface ) ) {

			// If we have a function, then it should be a Core Interface Class
			if( Interface.$isCoreInterface !== true ) {
				throw new Error( "Invalid value for the 'Interface' param in `Core.type.check.extended.Implements::describeExpectation()`; The provided class/constructor is not a valid Core Interface Class." );
			} else {
				constructorDesc = Interface.prototype.$amClassName;
			}

		} else {

			// Anything else is bad..
			throw new Error( "Invalid value for the 'Interface' param in `Core.type.check.extended.Implements::describeExpectation()`; a valid Core Class Name or a class definition was expected but " + Core.validator.describeA( Interface ) + " was provided." );

		}

		if( !negate ) {
			return `an implementor of '${constructorDesc}'`;
		} else {
			return `a non-implementor of '${constructorDesc}'`;
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

module.exports = Implements;
