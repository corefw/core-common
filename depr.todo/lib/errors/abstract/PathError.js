/**
 * @file Defines the PathError class.
 */

"use strict";

const StatusCode500Error = require( "./StatusCode500Error" );

/**
 * An abstract error that serves as a base for child errors related to
 * filesystem paths.
 *
 * @abstract
 * @memberOf Errors.Abstract
 * @extends Errors.Abstract.StatusCode500Error
 */
class PathError extends StatusCode500Error {

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

module.exports = PathError;
