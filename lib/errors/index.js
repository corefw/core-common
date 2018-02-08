/**
 * The 'Errors' namespace provides custom error classes that are used throughout
 * the project to provide meaningful information about the various errors that
 * can occur.
 *
 * @namespace Errors
 */

"use strict";

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

// module.exports = require( "requireindex" )( __dirname );

module.exports = {
	abstract                     : require( "./abstract" ),
	InvalidArgumentError         : require( "./InvalidArgumentError" ),
	InvalidDataTypeError         : require( "./InvalidDataTypeError" ),
	InvalidParameterError        : require( "./InvalidParameterError" ),
	MissingDependencyError       : require( "./MissingDependencyError" ),
	MissingParameterError        : require( "./MissingParameterError" ),
	MissingSchemaDefinitionError : require( "./MissingSchemaDefinitionError" ),
	PathManagerRequiredError     : require( "./PathManagerRequiredError" ),
	PathNotDefinedError          : require( "./PathNotDefinedError" ),
	UnknownDependencyError       : require( "./UnknownDependencyError" ),
	UnrecognizedParameterError   : require( "./UnrecognizedParameterError" ),
	UnsupportedClassError        : require( "./UnsupportedClassError" ),
};
