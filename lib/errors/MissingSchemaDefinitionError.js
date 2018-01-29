/**
 * @file Defines the MissingSchemaDefinitionError class.
 */

"use strict";

const MissingSchemaError = require( "./abstract/MissingSchemaError" );

/**
 * This error is thrown whenever a schema 'definition' (sub-part) is referenced
 * but cannot be found.
 *
 * @memberOf Errors
 * @extends Errors.Abstract.MissingSchemaError
 */
class MissingSchemaDefinitionError extends MissingSchemaError {

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

module.exports = MissingSchemaDefinitionError;
