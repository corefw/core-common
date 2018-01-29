/**
 * The 'Errors' namespace provides custom error classes that are used throughout
 * the project to provide meaningful information about the various errors that
 * can occur.
 *
 * @namespace Errors
 */

"use strict";

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
