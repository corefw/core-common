/**
 * @file
 * Defines the Core.type.check.simple.IsCoreClass class.
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
 * A simple check that determines if a target variable is a 'Core Class Definition'.
 *
 * @memberOf Core.type.check.simple
 * @extends Core.type.check.simple.BaseSimpleCheck
 */
class IsCoreClass extends Core.cls( "Core.type.check.simple.BaseSimpleCheck" ) {



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
		return 10;
	}

	/**
	 * @inheritDoc
	 */
	static get description() {
		return "Checks if a value is a Core Framework class definition/constructor.";
	}

	/**
	 * @inheritDoc
	 */
	static get checksFor() {
		return "Core Class Definition";
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
	 * Checks if `value` is a Core Framework class constructor/definition.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a Core Framework class constructor/definition; otherwise it returns FALSE.
	 */
	static evaluateTarget( value ) {

		// Classes will ALWAYS be a function.
		if( !this._isFunction( value ) ) {
			return false;
		}

		// Core Classes will ALWAYS have a
		// static property named '$isCoreClass'
		// that resolves to TRUE.
		if( value.$isCoreClass !== true ) {
			return false;
		}

		// Ok, its a Core Class..
		return true;

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
	 * A convenience alias for `Core.type.check.simple.IsNil::evaluateTarget()`.
	 *
	 * @private
	 * @see `Core.type.check.simple.IsNil::evaluateTarget()`
	 * @param {*} value - The value to check.
	 * @returns {boolean} TRUE if `value` is undefined or NULL; FALSE otherwise.
	 */
	static _isNil( value ) {
		return this._doPeerReview( "Core.type.check.simple.IsNil", value );
	}



	// </editor-fold>

	// <editor-fold desc="--- Target Description ---------------------------------------------------------------------">



	/**
	 * @inheritDoc
	 */
	static describeTarget( value, opts ) {

		// Start with a default description
		let ret = super.describeTarget( value, opts );

		// Append prototype info
		if( !this._isNil( value.prototype ) && !this._isNil( value.prototype.$amClassName ) ) {
			ret += " (\"" + value.prototype.$amClassName + "\")";
		}

		// Done
		return ret;

	}





	// </editor-fold>



}

module.exports = IsCoreClass;
