/**
 * @file Defines the UnsupportedClassError class.
 */

"use strict";

const StatusCode500Error = require( "./abstract/StatusCode500Error" );

/**
 * This error is thrown when a class is not supported by an operation or method.
 *
 * @memberOf Errors
 * @extends Errors.Abstract.StatusCode500Error
 */
class UnsupportedClassError extends StatusCode500Error {

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

module.exports = UnsupportedClassError;
