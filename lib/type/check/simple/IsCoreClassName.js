/**
 * @file
 * Defines the Core.type.check.simple.IsCoreClassName class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

// Load dependencies using the Core Framework
// const { _ } = Core.deps( "_" );

/**
 * A simple check that determines if a target variable is a 'Core Class Name'.
 *
 * @memberOf Core.type.check.simple
 * @extends Core.type.check.simple.BaseSimpleCheck
 */
class IsCoreClassName extends Core.cls( "Core.type.check.simple.BaseSimpleCheck" ) {



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
		return 9;
	}

	/**
	 * @inheritDoc
	 */
	static get description() {
		return "Checks if a value is a valid, namespaced, Core Framework class name.";
	}

	/**
	 * @inheritDoc
	 */
	static get checksFor() {
		return "Core Class Name";
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
	 * Checks if `value` is a string and represents a Core Framework class name that includes
	 * a full namespace path.
	 *
	 * Rules:
	 * - Class names must have at least one dot ('.')
	 * - The top-most namespace must start with a capital letter ("Core" not "core")
	 * - The last node must start with a capital letter ("SomeClass" not "someClass")
	 * - Nodes in the middle can include capital letters but must START with a lower-case letter ("someThing" not "SomeThing")
	 *
	 * @example
	 * isCoreClassName( "Core.Something"            ); // true
	 * isCoreClassName( "Core.ns.Something"         ); // true
	 * isCoreClassName( "Core.something"            ); // false - last node starts with a lower-case letter.
	 * isCoreClassName( "Core"                      ); // false - the path must contain at least 1 dot.
	 * isCoreClassName( "Core.Something.Something"  ); // false - middle nodes cannot start with a capital letter
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a Core Framework class constructor/definition; otherwise it returns FALSE.
	 */
	static evaluateTarget( value ) {

		// Class names will ALWAYS be a string.
		if( !this._isString( value ) ) {
			return false;
		}

		// Use RegEx for the rest..
		return Core.constants.validation.CORE_CLASS_NAME_REGEX.test( value );

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



	// </editor-fold>

	// <editor-fold desc="--- Target Description ---------------------------------------------------------------------">



	/**
	 * @inheritDoc
	 */
	static describeTarget( value, opts ) {

		// Start with a default description
		let baseDescription = super.describeTarget( value, opts );

		// Append the actual class name
		return baseDescription + " (String; \"" + value + "\")";

	}





	// </editor-fold>



}

module.exports = IsCoreClassName;
