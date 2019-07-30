/**
 * @file
 * Defines the Core.error.PropertyValidationError class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/**
 * Thrown whenever a validation operation on a [configuration] object fails (and throwErrors=true).
 *
 * @memberOf Core.error
 * @extends Core.error.ValidationError
 */
class PropertyValidationError extends Core.cls( "Core.error.ValidationError" ) {

	static get defaultMessage() {
		return "An object property failed validation";
	}

}

module.exports = PropertyValidationError;
