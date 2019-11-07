/**
 * @file
 * Defines the Core.type.check.simple.IsPlainObject class.
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
 * A simple check that determines if a target variable is a 'Plain Object'.
 *
 * Note: This check is a thin wrapper for the Lodash function `isPlainObject` and its `evaluateTarget` method will
 * behave identically to that function.
 *
 * @memberOf Core.type.check.simple
 * @extends Core.type.check.simple.BaseSimpleCheck
 */
class IsPlainObject extends Core.cls( "Core.type.check.simple.BaseSimpleCheck" ) {



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
		return 200;
	}

	/**
	 * @inheritDoc
	 */
	static get description() {
		return "Checks if a value is a plain object, that is, an object created by the Object constructor or one with a [[Prototype]] of NULL.";
	}

	/**
	 * @inheritDoc
	 */
	static get checksFor() {
		return "Plain Object";
	}

	/**
	 * @inheritDoc
	 */
	static get source() {
		return "LoDash::isPlainObject()";
	}



	// </editor-fold>

	// <editor-fold desc="--- Target Evaluation ----------------------------------------------------------------------">



	/**
	 * Checks if a `value` is a plain object, that is, an object created by the Object constructor or one with a [[Prototype]] of NULL.
	 *
	 * @static
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a plain object; otherwise it returns FALSE.
	 */
	static evaluateTarget( value ) {
		return _.isPlainObject( value );
	}




	// </editor-fold>

	// <editor-fold desc="--- Target Description ---------------------------------------------------------------------">



	/**
	 * @inheritDoc
	 */
	static describeTarget( value, opts ) {

		// Start with a default description
		let baseDescription = super.describeTarget( value, opts );

		// Normalize the `opts` param
		opts = this._normalizeDescribeOptions( opts );

		// Fetch the keys for our object
		let keys = Object.getOwnPropertyNames( value );

		// Format according to the number of keys present.
		if( keys.length === 0 ) {

			// Handle empty objects.

			if( opts.addIndefiniteArticle === true ) {
				return "an empty " + this.checksFor;  // using 'checksFor' (instead of 'checksForA' is intentional)
			} else {
				return "empty " + this.checksFor;
			}

		} else if( keys.length < 5 ) {

			// Handle objects with a small number of keys
			return baseDescription + " (keys=\"" + keys.join( "\",\"" ) + "\")";

		} else {

			// Handle objects with a large number of keys
			let truncatedKeys = keys.slice( 0, 3 );
			return baseDescription + " (keys=\"" + truncatedKeys.join( "\",\"" ) + "\"...; total=" + keys.length + ")";

		}

	}





	// </editor-fold>



}

module.exports = IsPlainObject;
