/**
 * @file Defines the PathManagerRequiredError class.
 */

"use strict";

const StatusCode500Error = require( "./abstract/StatusCode500Error" );

/**
 * This error is thrown by any child of BaseClass that attempts to invoke
 * `BaseClass#$spawn` without, first, having an initialized {PathManager}.
 *
 * @memberOf Errors
 * @extends Errors.Abstract.StatusCode500Error
 */
class PathManagerRequiredError extends StatusCode500Error {

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

module.exports = PathManagerRequiredError;
