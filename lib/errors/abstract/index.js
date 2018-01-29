/**
 * The 'Errors.Abstract' namespace provides abstract error classes that are
 * meant to be a basis for more specific custom errors classes.
 *
 * @namespace Errors.Abstract
 */

"use strict";

// module.exports = require( "requireindex" )( __dirname );

module.exports = {
	BaseError          : require( "./BaseError" ),
	DependencyError    : require( "./DependencyError" ),
	MissingSchemaError : require( "./MissingSchemaError" ),
	PathError          : require( "./PathError" ),
	SchemaError        : require( "./SchemaError" ),
	StatusCode400Error : require( "./StatusCode400Error" ),
	StatusCode401Error : require( "./StatusCode401Error" ),
	StatusCode500Error : require( "./StatusCode500Error" ),
	ValidationError    : require( "./ValidationError" ),
};
