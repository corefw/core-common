/**
 * @file Defines the UnrecognizedParameterError class.
 */

"use strict";

const ValidationError = require( "./abstract/ValidationError" );

/**
 * This error is thrown whenever a provided parameter, within a request, is not
 * specified or allowed by a request schema.
 *
 * @memberOf Errors
 * @extends Errors.Abstract.ValidationError
 */
class UnrecognizedParameterError extends ValidationError {

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

module.exports = UnrecognizedParameterError;
