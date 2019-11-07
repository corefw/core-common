/**
 * @file Defines the BaseError class.
 */

"use strict";

const VError = require( "verror" );

/**
 * The root error from which all other custom errors stem.
 *
 * @abstract
 * @memberOf Errors.Abstract
 * @extends VError
 */
class BaseError extends VError {

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

	/**
	 * Error name. The name property, in addition to the message property, is
	 *     used by the Error.prototype.toString() method to create a string
	 *     representation of the error.
	 * @type {string}
	 * @default The error's class name.
	 * @readonly
	 */
	get name() {

		const me = this;

		return me.constructor.name;

	}

	/**
	 * Indicates the HTTP status code that will be returned by the API/Endpoint
	 * whenever this error is thrown within it.
	 *
	 * @type {number}
	 * @default 500
	 */
	get statusCode() {

		const me = this;

		return me._statusCode;

	}

	set statusCode( /** number */ val ) {

		const me = this;

		me._statusCode = val;

	}

}

module.exports = BaseError;
