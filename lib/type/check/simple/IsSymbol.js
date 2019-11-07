/**
 * @file
 * Defines the Core.type.check.simple.IsSymbol class.
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
 * A simple check that determines if a target variable is a 'Symbol'.
 *
 * Note: This check is a thin wrapper for the Lodash function `isSymbol` and its `evaluateTarget` method will
 * behave identically to that function.
 *
 * @memberOf Core.type.check.simple
 * @extends Core.type.check.simple.BaseSimpleCheck
 */
class IsSymbol extends Core.cls( "Core.type.check.simple.BaseSimpleCheck" ) {



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
		return 102;
	}

	/**
	 * @inheritDoc
	 */
	static get description() {
		return "Checks if a value is classified as a Symbol primitive or object.";
	}

	/**
	 * @inheritDoc
	 */
	static get checksFor() {
		return "Symbol";
	}

	/**
	 * @inheritDoc
	 */
	static get source() {
		return "LoDash::isSymbol()";
	}



	// </editor-fold>

	// <editor-fold desc="--- Target Evaluation ----------------------------------------------------------------------">



	/**
	 * Checks if a `value` is classified as a Symbol primitive or object.
	 *
	 * @static
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a symbol; otherwise it returns FALSE.
	 */
	static evaluateTarget( value ) {
		return _.isSymbol( value );
	}




	// </editor-fold>

	// <editor-fold desc="--- Target Description ---------------------------------------------------------------------">



	/**
	 * @inheritDoc
	 */
	static describeTarget( value, opts ) {

		// Locals
		let ret;

		// Normalize the `opts` param
		opts = this._normalizeDescribeOptions( opts );

		// Prepend "transient" or "global"
		if( Symbol.keyFor( value ) === undefined ) {

			ret = "transient " + value.toString();

		} else {

			ret = "global " + value.toString();

		}

		// Prepend indefinite article, if desired..
		if( opts.addIndefiniteArticle === true ) {
			ret = "a " + ret;
		}

		// Done
		return ret;

	}





	// </editor-fold>



}

module.exports = IsSymbol;
