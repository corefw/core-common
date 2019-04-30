/**
 * @file
 * Defines the Core.error.ValidationError class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

// Load dependencies using the Core Framework
// const { _, TIPE } = Core.deps( "_", "tipe" );

/**
 * Thrown whenever a validation operation fails (and throwErrors=true).
 *
 * @memberOf Core.error
 * @extends Core.error.BaseError
 */
class ValidationError extends Core.cls( "Core.error.BaseError" ) {

	static get defaultMessage() {
		return "A validation error occurred";
	}

}

module.exports = ValidationError;
