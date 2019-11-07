/**
 * @file
 * Defines the Core.template.Parser class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

// Load dependencies using the Core Framework
const { _, TIPE } = Core.deps( "_", "tipe" );

/**
 * Replaces variables in templates with values.
 *
 * @memberOf Core.template
 * @extends Core.abstract.Component
 */
class Parser extends Core.cls( "Core.abstract.Component" ) {

	// todo: all of this

	resolve( target, values ) {

		// Locals
		let me = this;

		// Route to the appropriate resolver method.
		switch( TIPE( target ) ) {

			case "string":
				return me._parseString( target, values );

			default:
				throw new Error( "Invalid 'target' type passed to Core.template.Parser::resolve()." );

		}

	}

	_parseString( str, values ) {

		// Compile the str using Lodash's template engine
		let compiled = _.template( str );

		// Replace values..
		return compiled( values );

	}

}

module.exports = Parser;
