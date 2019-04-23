/**
 * @file
 * Defines the Core.type.check.simple.IsFinite class.
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
 * A simple check that determines if a target variable is a 'finite Number'.
 *
 * Note: This check is a thin wrapper for the Lodash function `isFinite` and its `evaluateTarget` method will
 * behave identically to that function.
 *
 * @memberOf Core.type.check.simple
 * @extends Core.type.check.simple.BaseSimpleCheck
 */
class IsFinite extends Core.cls( "Core.type.check.simple.BaseSimpleCheck" ) {



	// <editor-fold desc="--- Static Properties ----------------------------------------------------------------------">



	/**
	 * @inheritDoc
	 */
	static get description() {
		return "Checks if a value is a finite primitive number.";
	}

	/**
	 * @inheritDoc
	 */
	static get checksFor() {
		return "finite Number";
	}

	/**
	 * @inheritDoc
	 */
	static get failsFor() {
		return "infinite Number";
	}

	/**
	 * @inheritDoc
	 */
	static get source() {
		return "LoDash::isFinite()";
	}



	// </editor-fold>

	// <editor-fold desc="--- Target Evaluation ----------------------------------------------------------------------">



	/**
	 * Checks if a `value` is a finite primitive number.
	 *
	 * @static
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a finite number; otherwise it returns FALSE.
	 */
	static evaluateTarget( value ) {
		return _.isFinite( value );
	}




	// </editor-fold>

	// <editor-fold desc="--- Target Description ---------------------------------------------------------------------">



	// Note: This check class does not provide a `describeTarget` method, mainly because it is non-descriptive.
	// However, one is provided by its ancestors which can be used to describe "conforming" variables/values.




	// </editor-fold>




}

module.exports = IsFinite;
