/**
 * @file Defines the MissingSchemaError class.
 */

"use strict";

const SchemaError = require( "./SchemaError" );

/**
 * This error is thrown whenever a schema object/document is expected, but
 * cannot be found.
 *
 * @abstract
 * @memberOf Errors.Abstract
 * @extends Errors.Abstract.SchemaError
 */
class MissingSchemaError extends SchemaError {

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

module.exports = MissingSchemaError;
