/**
 * @file Defines the ValidationError class.
 */

"use strict";

const SchemaError = require( "./SchemaError" );

/**
 * An abstract error that serves as a base for child errors that are thrown
 * whenever an object fails validation against a schema.
 *
 * @abstract
 * @memberOf Errors.Abstract
 * @extends Errors.Abstract.SchemaError
 */
class ValidationError extends SchemaError {

	/**
	 * @param {Error} [cause] - An optional Error object that can be provided if
	 *     this error was caused by another.
	 * @param {string} message - An error message that provides clients with a
	 *     description of the error condition and, potentially, how it might be
	 *     resolved.
	 * @param {...*} [args] - Printf style arguments for the message.
	 */
	constructor( cause, message, ...args ) {

		super( cause, message, ...args );
	}
}

module.exports = ValidationError;
