/**
 * @file
 * Defines the Core.type.check.simple.IsMoment class.
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
 * A simple check that determines if a target variable is a 'Moment Object'.
 *
 * @memberOf Core.type.check.simple
 * @extends Core.type.check.simple.BaseSimpleCheck
 */
class IsMoment extends Core.cls( "Core.type.check.simple.BaseSimpleCheck" ) {



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
		return "Checks if a value is a Moment.js Object.";
	}

	/**
	 * @inheritDoc
	 */
	static get checksFor() {
		return "Moment Object";
	}

	/**
	 * @inheritDoc
	 */
	static get source() {
		return "Moment.js";
	}



	// </editor-fold>

	// <editor-fold desc="--- Target Evaluation ----------------------------------------------------------------------">



	/**
	 * Checks if `value` is a Moment.js object.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a Moment.js object; otherwise it returns FALSE.
	 */
	static evaluateTarget( value ) {
		return MOMENT.isMoment( value );
	}



	// </editor-fold>

	// <editor-fold desc="--- Target Description ---------------------------------------------------------------------">



	/**
	 * @inheritDoc
	 */
	static describeTarget( value, opts ) {

		// Start with a default description
		let baseDescription = super.describeTarget( value, opts );

		// Append the date & return
		return baseDescription + " (\"" + value.format() + "\")";

	}






	// </editor-fold>



}

module.exports = IsMoment;
