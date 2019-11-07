/**
 * @file
 * Defines the Core.type.check.simple.IsWeakMap class.
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
 * A simple check that determines if a target variable is a 'WeakMap Object'.
 *
 * Note: This check is a thin wrapper for the Lodash function `isWeakMap` and its `evaluateTarget` method will
 * behave identically to that function.
 *
 * @memberOf Core.type.check.simple
 * @extends Core.type.check.simple.BaseSimpleCheck
 */
class IsWeakMap extends Core.cls( "Core.type.check.simple.BaseSimpleCheck" ) {



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
		return 104;
	}

	/**
	 * @inheritDoc
	 */
	static get description() {
		return "Checks if a value is classified as a WeakMap object.";
	}

	/**
	 * @inheritDoc
	 */
	static get checksFor() {
		return "WeakMap Object";
	}

	/**
	 * @inheritDoc
	 */
	static get source() {
		return "LoDash::isWeakMap()";
	}



	// </editor-fold>

	// <editor-fold desc="--- Target Evaluation ----------------------------------------------------------------------">



	/**
	 * Checks if a `value` is classified as a WeakMap object.
	 *
	 * @static
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a weakmap object; otherwise it returns FALSE.
	 */
	static evaluateTarget( value ) {
		return _.isWeakMap( value );
	}




	// </editor-fold>

	// <editor-fold desc="--- Target Description ---------------------------------------------------------------------">



	// Note: This check class does not [yet] provide a `describeTarget` method; either because "conforming"
	// variables/values do not need additional notes or because building those notes would be challenging.
	// Thus, for now, this method relies on the `describeTarget` method that it inherits, but a custom
	// `describeTarget` method may be implemented at some point in the future.




	// </editor-fold>



}

module.exports = IsWeakMap;
