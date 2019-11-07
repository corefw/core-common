/**
 * @file
 * Defines the Core.type.check.simple.IsCoreClassInstance class.
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
 * A simple check that determines if a target variable is a 'Core Class Instance'.
 *
 * @memberOf Core.type.check.simple
 * @extends Core.type.check.simple.BaseSimpleCheck
 */
class IsCoreClassInstance extends Core.cls( "Core.type.check.simple.BaseSimpleCheck" ) {



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
		return "Checks if a value is an instantiated Core Framework class.";
	}

	/**
	 * @inheritDoc
	 */
	static get checksFor() {
		return "Core Class Instance";
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
	 * Checks if `value` is an instantiated Core Framework class.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a Core Framework class instance; otherwise it returns FALSE.
	 */
	static evaluateTarget( value ) {

		// Core Class instances will ALWAYS be objects.
		if( !this._isObject( value ) ) {
			return false;
		}

		// .. and they'll ALWAYS have a `constructor`
		if( value.constructor === undefined || value.constructor === null ) {
			return false;
		}

		// .. and that constructor will resolve as a "Core Class Definition"
		return this._isCoreClass( value.constructor );

	}



	// </editor-fold>

	// <editor-fold desc="--- References to other Checks -------------------------------------------------------------">



	/**
	 * A convenience alias for `Core.type.check.simple.IsCoreClass::evaluateTarget()`.
	 *
	 * @private
	 * @see `Core.type.check.simple.IsCoreClass::evaluateTarget()`
	 * @param {*} value - The value to check.
	 * @returns {boolean} TRUE if `value` is a Core Framework Class; FALSE otherwise.
	 */
	static _isCoreClass( value ) {
		return this._doPeerReview( "Core.type.check.simple.IsCoreClass", value );
	}

	/**
	 * A convenience alias for `Core.type.check.simple.IsObject::evaluateTarget()`.
	 *
	 * @private
	 * @see `Core.type.check.simple.IsObject::evaluateTarget()`
	 * @param {*} value - The value to check.
	 * @returns {boolean} TRUE if `value` is a object; FALSE otherwise.
	 */
	static _isObject( value ) {
		return this._doPeerReview( "Core.type.check.simple.IsObject", value );
	}



	// </editor-fold>

	// <editor-fold desc="--- Target Description ---------------------------------------------------------------------">



	/**
	 * @inheritDoc
	 */
	static describeTarget( value, opts ) {

		// Start with a default description
		let baseDescription = super.describeTarget( value, opts );

		// Append the class name
		return baseDescription + " (\"" + value.className + "\")";

	}





	// </editor-fold>



}

module.exports = IsCoreClassInstance;
