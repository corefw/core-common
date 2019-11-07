/**
 * @file
 * Defines the Core.fs.file.Generic class.
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
 * Represents a file whose type could not be recognized
 *
 * @memberOf Core.fs.file
 * @extends Core.fs.file.BaseFile
 */
class Generic extends Core.cls( "Core.fs.file.BaseFile" ) {


}

module.exports = Generic;
