/**
 * @file
 * Defines the Core.fs.file.Yaml class.
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
 * An abstraction for YAML files
 *
 * @memberOf Core.fs.file
 * @extends Core.fs.file.BaseConfigFile
 */
class Yaml extends Core.cls( "Core.fs.file.BaseConfigFile" ) {


}

module.exports = Yaml;
