/**
 * @file Defines the StatusCode500Error class.
 */

"use strict";

const BaseError = require( "./BaseError" );

/**
 * The root error for status code 500 errors.
 *
 * @abstract
 * @memberOf Errors.Abstract
 * @extends Errors.Abstract.BaseError
 */
class StatusCode500Error extends BaseError {

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

		const me = this;

		me._statusCode = 500;

	}

}

module.exports = StatusCode500Error;
