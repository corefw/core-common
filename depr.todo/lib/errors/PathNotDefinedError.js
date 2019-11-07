/**
 * @file Defines the PathNotDefinedError class.
 */

"use strict";

const PathError = require( "./abstract/PathError" );

/**
 * This error is thrown whenever a path, which is required for some reason, has
 * not been defined as expected.
 *
 * @memberOf Errors
 * @extends Errors.Abstract.PathError
 */
class PathNotDefinedError extends PathError {

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

module.exports = PathNotDefinedError;
