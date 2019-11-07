/**
 * @file
 * Defines the Core.type.check.simple.IsDate class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

// Load dependencies using the Core Framework
const { _, MOMENT } = Core.deps( "_", "moment" );

/**
 * A simple check that determines if a target variable is a 'Date Object'.
 *
 * Note: This check is a thin wrapper for the Lodash function `isDate` and its `evaluateTarget` method will
 * behave identically to that function.
 *
 * @memberOf Core.type.check.simple
 * @extends Core.type.check.simple.BaseSimpleCheck
 */
class IsDate extends Core.cls( "Core.type.check.simple.BaseSimpleCheck" ) {



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
		return "Checks if a value is classified as a date object.";
	}

	/**
	 * @inheritDoc
	 */
	static get checksFor() {
		return "Date Object";
	}

	/**
	 * @inheritDoc
	 */
	static get source() {
		return "LoDash::isDate()";
	}



	// </editor-fold>

	// <editor-fold desc="--- Target Evaluation ----------------------------------------------------------------------">



	/**
	 * Checks if a `value` is classified as a date object (or a Moment.js object).
	 *
	 * @static
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a date object; otherwise it returns FALSE.
	 */
	static evaluateTarget( value ) {

		// First, check to see if it is a Moment.js object
		if( this._isMoment( value ) === true ) {
			return true;
		}

		// Defer to Lodash
		return _.isDate( value );

	}




	// </editor-fold>

	// <editor-fold desc="--- References to other Checks -------------------------------------------------------------">



	/**
	 * A convenience alias for `Core.type.check.simple.IsMoment::evaluateTarget()`.
	 *
	 * @private
	 * @see `Core.type.check.simple.IsMoment::evaluateTarget()`
	 * @param {*} value - The value to check.
	 * @returns {boolean} TRUE if `value` is a moment; FALSE otherwise.
	 */
	static _isMoment( value ) {
		return this._doPeerReview( "Core.type.check.simple.IsMoment", value );
	}



	// </editor-fold>

	// <editor-fold desc="--- Target Description ---------------------------------------------------------------------">



	/**
	 * @inheritDoc
	 */
	static describeTarget( value, opts ) {

		// Start with a default description
		let baseDescription = super.describeTarget( value, opts );

		// Cast to a Moment.js object, if necessary
		let momentObject;
		if( !this._isMoment( value ) ) {
			momentObject = MOMENT( value );
		} else {
			momentObject = value;
		}

		// Append the date & return
		return baseDescription + " (\"" + momentObject.format() + "\")";

	}





	// </editor-fold>



}

module.exports = IsDate;
