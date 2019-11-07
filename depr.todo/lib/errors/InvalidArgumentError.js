/**
 * @file Defines the InvalidArgumentError class.
 */

"use strict";

const StatusCode500Error = require( "./abstract/StatusCode500Error" );

/**
 * This error is thrown when an invalid argument is passed to a method or
 * function.
 *
 * @memberOf Errors
 * @extends Errors.Abstract.StatusCode500Error
 */
class InvalidArgumentError extends StatusCode500Error {

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

module.exports = InvalidArgumentError;

