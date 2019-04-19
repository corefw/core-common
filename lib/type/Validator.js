/**
 * @file
 * Defines the Core.type.Validator class.
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
 * Validates things.
 *
 * @memberOf Core.type
 * @extends Core.abstract.Component
 */
class Validator extends Core.cls( "Core.abstract.Component" ) {

	$construct() {
		console.log( "--- Core.type.Validator :: $construct ---" );
	}

	$ready() {
		console.log( "--- Core.type.Validator :: $ready ---" );
	}

}

module.exports = Validator;
