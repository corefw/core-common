/**
 * @file
 * Defines the Core.type.check.simple.IsCoreClassLike class.
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
 * A simple check that determines if a target variable is a 'Core Class-like value'.
 *
 * @memberOf Core.type.check.simple
 * @extends Core.type.check.simple.BaseSimpleCheck
 */
class IsCoreClassLike extends Core.cls( "Core.type.check.simple.BaseSimpleCheck" ) {



	// <editor-fold desc="--- Static Properties ----------------------------------------------------------------------">



	/**
	 * @inheritDoc
	 */
	static get description() {
		return "Checks if a value is either a Core Framework class definition/constructor OR a valid, namespaced, Core Framework class name.";
	}

	/**
	 * @inheritDoc
	 */
	static get checksFor() {
		return "Core Class-like value";
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
	 * Checks if `value` is either a Core Framework class definition/constructor OR a string that represents a Core
	 * Framework class name which includes a full namespace path.
	 *
	 * @see isCoreClass
	 * @see isCoreClassName
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a Core Framework class constructor/definition or a valid Core
	 * Framework class path; otherwise it returns FALSE.
	 */
	static evaluateTarget( value ) {

		if( this._isCoreClass( value ) || this._isCoreClassName( value ) ) {
			return true;
		} else {
			return false;
		}

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
	 * A convenience alias for `Core.type.check.simple.IsCoreClassName::evaluateTarget()`.
	 *
	 * @private
	 * @see `Core.type.check.simple.IsCoreClassName::evaluateTarget()`
	 * @param {*} value - The value to check.
	 * @returns {boolean} TRUE if `value` is a Core Framework Class name; FALSE otherwise.
	 */
	static _isCoreClassName( value ) {
		return this._doPeerReview( "Core.type.check.simple.IsCoreClassName", value );
	}



	// </editor-fold>

	// <editor-fold desc="--- Target Description ---------------------------------------------------------------------">



	// Note: This check class does not provide a `describeTarget` method, mainly because it is non-descriptive.
	// However, one is provided by its ancestors which can be used to describe "conforming" variables/values.




	// </editor-fold>




}

module.exports = IsCoreClassLike;
