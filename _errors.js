/**
 * @file Provides a number of custom errors.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 5.0.0
 * @requires lodash
 * @requires verror
 * @requires util
 * @license See LICENSE.md for details about licensing.
 * @copyright 2017 C2C Schools, LLC
 */

"use strict";

// FIXME: inject error objects from their respective namespaces/packages/modules?

/**
 * The built in Error object.
 * @external Error
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error|MDN: Error
 */

/**
 * VError is a custom error class provided by the 'VError' module.
 *
 * @external VError
 * @see https://github.com/joyent/node-verror#verror-rich-javascript-errors|The 'VError' Module on GitHub
 */

/**
 * WError is a custom error class provided by the 'VError' module.
 *
 * @external WError
 * @see https://github.com/joyent/node-verror#verror-rich-javascript-errors|The 'VError' Module on GitHub
 */

// <editor-fold desc="--- Dependencies ---------------------------------------">

const _ 		= require( "lodash" );
const VERROR 	= require( "verror" );
const UTIL 		= require( "util" );

// </editor-fold>

// <editor-fold desc="--- Other Initialization Steps -------------------------">

// Init Exports
module.exports = {};

// </editor-fold>


// <editor-fold desc="--- Error Definition Helper Function(s) ----------------">

/**
 * This helper function creates custom error objects by extending
 * the error objects provided by `verror` and, then, automatically
 * exporting them.
 *
 * @private
 * @param {number} statusCode - The HTTP status code that describes this type of error.
 * @param {string} errorName - The name of the new error class/function.
 * @param {?string} [parentErrorClassName="verror"] - The name of the VError base class,
 *     or other error class (defined within this file), to extend.
 * @returns {void} This function modifies 'module.exports' directly.
 */
function addCustomError( statusCode, errorName, parentErrorClassName ) {

	let parentClass;
	let NewErrorClass;

	// Set the default parent class (VError)
	if ( parentErrorClassName === undefined || parentErrorClassName === null ) {

		parentErrorClassName = "verror";
	}

	// Resolve the parent class, which will be extended.
	switch ( parentErrorClassName.toLowerCase() ) {

		case "error":

			// No need to allow this, VErrors offer identical
			// functionality, and more...

			// Falls through

		case "verror":

			// The main/core VError class
			parentClass = VERROR;
			break;

		case "werror":

			// The special VError class: "WError"
			parentClass = VERROR.WError;
			break;

		case "serror":

			// The special VError class: "SError"
			parentClass = VERROR.SError;
			break;

		default:

			// If we're given anything else, we'll assume it belongs
			// to a previously-defined error class.

			if ( module.exports[ parentErrorClassName ] === undefined ) {

				throw new VERROR(
					"The 'parentErrorClassName' provided to #addCustomError ('%s') refers to a non-existent error class.",
					parentErrorClassName
				);

			} else {

				parentClass = module.exports[ parentErrorClassName ];
			}

			break;
	}

	// Create the new error class
	NewErrorClass = function () {

		parentClass.apply( this, Array.prototype.slice.call( arguments ) );
		this.statusCode = statusCode;
	};

	// Extend the parent class...
	UTIL.inherits( NewErrorClass, parentClass );


	NewErrorClass.prototype.name = errorName;

	// Export the new error class
	module.exports[ errorName ] = NewErrorClass;
}

// </editor-fold>

// <editor-fold desc="--- Legacy Code (Needs Refactoring; see note) ----------">

// todo: Refactor these classes into the VError pattern, above.

/**
 * Basic class
 * @deprecated
 * @ignore
 */
// class BasicError extends Error {
//
// 	constructor( message ) {
//
// 		// Calling parent constructor of base Error class.
// 		super( message );
//
// 		const me = this;
//
// 		// Capturing stack trace, excluding constructor call from it.
// 		Error.captureStackTrace( me, me.constructor );
//
// 		// Saving class name in the property of our custom error as a shortcut.
// 		me.name = me.constructor.name;
// 	}
// }
//
// module.exports.BasicError = BasicError;

/**
 * Something unexpected requested for generating config from environment
 * variables
 *
 * @deprecated
 * @ignore
 */
// class UnexpectedConfiguration extends BasicError {
//
// 	constructor( configName, configsInfo ) {
//
// 		super( `Unexpectable requested: "${configName}". ` +
// 			`Only these configs supported: ${_.keys( configsInfo )}` );
// 	}
// }
//
// module.exports.UnexpectedConfiguration = UnexpectedConfiguration;

/**
 * Some of required fields don't exists at environment variables
 *
 * @deprecated
 * @ignore
 */
// class ConfigurationError extends BasicError {
//
// 	constructor( configName, configInfo ) {
//
// 		super( `${configName} connection not configured ` +
// 			`properly. It requires ${configInfo} fields` );
// 	}
// }
//
// module.exports.ConfigurationError = ConfigurationError;

// </editor-fold>
