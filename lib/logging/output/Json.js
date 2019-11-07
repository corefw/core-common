/**
 * @file
 * Defines the Core.logging.output.Json class.
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
 * Provides log output to the console, typically for debugging and development purposes.
 *
 * @memberOf Core.logging.output
 * @extends Core.logging.output.BaseOutput
 */
class Json extends Core.cls( "Core.logging.output.BaseOutput" ) {

	_formatLogEvent( logEvent ) {

	}

}

module.exports = Json;
