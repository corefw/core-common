/**
 * @file
 * Defines the Core.error.GenericError class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

// Load dependencies using the Core Framework
// const { _, TIPE } = Core.deps( "_", "tipe" );

/**
 * Thrown in situations where no specific error fits the context. Ideally, this will not be thrown very often
 * because custom errors should be created for most contexts.
 *
 * @memberOf Core.error
 * @extends Core.error.BaseError
 */
class GenericError extends Core.cls( "Core.error.BaseError" ) {

}

module.exports = GenericError;
