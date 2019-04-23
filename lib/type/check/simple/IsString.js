/**
 * @file
 * Defines the Core.type.check.simple.IsString class.
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
 * A simple check that determines if a target variable is a 'String'.
 *
 * Note: This check is a thin wrapper for the Lodash function `isString` and its `evaluateTarget` method will
 * behave identically to that function.
 *
 * @memberOf Core.type.check.simple
 * @extends Core.type.check.simple.BaseSimpleCheck
 */
class IsString extends Core.cls( "Core.type.check.simple.BaseSimpleCheck" ) {



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
		return "Checks if a value is classified as a String primitive or object.";
	}

	/**
	 * @inheritDoc
	 */
	static get checksFor() {
		return "String";
	}

	/**
	 * @inheritDoc
	 */
	static get source() {
		return "LoDash::isString()";
	}



	// </editor-fold>

	// <editor-fold desc="--- Target Evaluation ----------------------------------------------------------------------">



	/**
	 * Checks if a `value` is classified as a String primitive or object.
	 *
	 * @static
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a string; otherwise it returns FALSE.
	 */
	static evaluateTarget( value ) {
		return _.isString( value );
	}




	// </editor-fold>

	// <editor-fold desc="--- Target Description ---------------------------------------------------------------------">



	/**
	 * @inheritDoc
	 */
	static describeTarget( value, opts ) {

		// Locals
		let me = this;

		// Start with a default description
		let ret = super.describeTarget( value, opts );

		// Normalize the `opts` param
		opts = me._normalizeDescribeOptions( opts );

		// Handle empty strings..
		if( value.length === 0 ) {

			if( opts.addIndefiniteArticle === true ) {
				ret = "an empty " + me.checksFor;  // using checksFor (instead of checksForA) is intentional
			} else {
				ret = "empty " + me.checksFor;
			}

		} else if( value.length <= 20 ) {
			ret += ` ("${value}")`;
		} else {
			let sub = value.substr( 0, 10 );
			ret += ` ("${sub}...", length=${value.length})`;
		}

		return ret;

	}





	// </editor-fold>



}

module.exports = IsString;
