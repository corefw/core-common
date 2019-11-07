/**
 * @file Defines the MissingParameterError class.
 */

"use strict";

const ValidationError = require( "./abstract/ValidationError" );

/**
 * This error is thrown whenever a required parameter does not have a value
 * specified in a request.
 *
 * @memberOf Errors
 * @extends Errors.Abstract.ValidationError
 */
class MissingParameterError extends ValidationError {

}

module.exports = MissingParameterError;
