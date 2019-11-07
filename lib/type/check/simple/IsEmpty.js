/**
 * @file
 * Defines the Core.type.check.simple.IsEmpty class.
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
 * A simple check that determines if a target variable is a 'non-empty value'.
 *
 * Note: This check is a thin wrapper for the Lodash function `isEmpty` and its `evaluateTarget` method will
 * behave identically to that function.
 *
 * @memberOf Core.type.check.simple
 * @extends Core.type.check.simple.BaseSimpleCheck
 */
class IsEmpty extends Core.cls( "Core.type.check.simple.BaseSimpleCheck" ) {



	// <editor-fold desc="--- Static Properties ----------------------------------------------------------------------">



	/**
	 * @inheritDoc
	 */
	static get description() {
		return "Checks if value is an empty object, collection, map, or set.\n" +
			"\n" +
			"Objects are considered empty if they have no own enumerable string keyed properties.\n" +
			"\n" +
			"Array-like values such as arguments objects, arrays, buffers, strings, or jQuery-like collections are\n" +
			"considered empty if they have a length of 0. Similarly, maps and sets are considered empty if they have a\n" +
			"size of 0.";
	}

	/**
	 * @inheritDoc
	 */
	static get checksFor() {
		return "non-empty value";
	}

	/**
	 * @inheritDoc
	 */
	static get failsFor() {
		return "empty value";
	}

	/**
	 * @inheritDoc
	 */
	static get source() {
		return "LoDash::isEmpty()";
	}



	// </editor-fold>

	// <editor-fold desc="--- Target Evaluation ----------------------------------------------------------------------">



	/**
	 * Checks if `value` is an empty object, collection, map, or set.
	 *
	 * Objects are considered empty if they have no own enumerable string keyed properties.
	 *
	 * Array-like `value`s such as arguments objects, arrays, buffers, strings, or jQuery-like collections are
	 * considered empty if they have a length of 0. Similarly, maps and sets are considered empty if they have a
	 * size of 0.
	 *
	 * @static
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a non-empty value; otherwise it returns FALSE.
	 */
	static evaluateTarget( value ) {
		return _.isEmpty( value );
	}




	// </editor-fold>

	// <editor-fold desc="--- Target Description ---------------------------------------------------------------------">



	// Note: This check class does not provide a `describeTarget` method, mainly because it is non-descriptive.
	// However, one is provided by its ancestors which can be used to describe "conforming" variables/values.




	// </editor-fold>



}

module.exports = IsEmpty;
