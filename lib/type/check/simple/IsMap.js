/**
 * @file
 * Defines the Core.type.check.simple.IsMap class.
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
 * A simple check that determines if a target variable is a 'Map Object'.
 *
 * Note: This check is a thin wrapper for the Lodash function `isMap` and its `evaluateTarget` method will
 * behave identically to that function.
 *
 * @memberOf Core.type.check.simple
 * @extends Core.type.check.simple.BaseSimpleCheck
 */
class IsMap extends Core.cls( "Core.type.check.simple.BaseSimpleCheck" ) {



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
		return "Checks if a value is classified as a Map object.";
	}

	/**
	 * @inheritDoc
	 */
	static get checksFor() {
		return "Map Object";
	}

	/**
	 * @inheritDoc
	 */
	static get source() {
		return "LoDash::isMap()";
	}



	// </editor-fold>

	// <editor-fold desc="--- Target Evaluation ----------------------------------------------------------------------">



	/**
	 * Checks if a `value` is classified as a Map object.
	 *
	 * @static
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a map object; otherwise it returns FALSE.
	 */
	static evaluateTarget( value ) {
		return _.isMap( value );
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

		if( value.size === 0 ) {

			if( opts.addIndefiniteArticle === true ) {
				return "an empty " + this.checksFor; // using checksFor (instead of checksForA) is intentional
			} else {
				return "empty " + this.checksFor;
			}

		} else {
			return baseDescription + " (size=" + value.size + ")";
		}

	}






	// </editor-fold>



}

module.exports = IsMap;
