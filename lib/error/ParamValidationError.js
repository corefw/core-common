/**
 * @file
 * Defines the Core.error.ParamValidationError class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/**
 * Thrown whenever a validation operation on a method or function parameter fails (and throwErrors=true).
 *
 * @memberOf Core.error
 * @extends Core.error.ValidationError
 */
class ParamValidationError extends Core.cls( "Core.error.ValidationError" ) {

	static get defaultMessage() {
		return "A method/function parameter failed validation";
	}

}

module.exports = ParamValidationError;
