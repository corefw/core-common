/**
 * @file
 * Defines the Core.fs.file.Json class.
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
 * An abstraction for JSON files
 *
 * @memberOf Core.fs.file
 * @extends Core.fs.file.BaseConfigFile
 */
class Json extends Core.cls( "Core.fs.file.BaseConfigFile" ) {


}

module.exports = Json;
