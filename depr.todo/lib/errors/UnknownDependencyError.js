/**
 * @file Defines the UnknownDependencyError class.
 */

"use strict";

const DependencyError = require( "./abstract/DependencyError" );

/**
 * This error is thrown whenever an object requests a dependency that is not
 * known.
 *
 * @memberOf Errors
 * @extends Errors.Abstract.DependencyError
 */
class UnknownDependencyError extends DependencyError {

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

module.exports = UnknownDependencyError;
