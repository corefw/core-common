/**
 * @file
 * Defines the Core.error.DependencyValidationError class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/**
 * Thrown whenever a validation operation on a class dependency fails (and throwErrors=true).
 *
 * @memberOf Core.error
 * @extends Core.error.ValidationError
 */
class DependencyValidationError extends Core.cls( "Core.error.ValidationError" ) {

	static get defaultMessage() {
		return "A class dependency failed validation";
	}

}

module.exports = DependencyValidationError;
