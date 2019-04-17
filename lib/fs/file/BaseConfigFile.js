/**
 * @file
 * Defines the Core.fs.file.BaseConfigFile class.
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
 * A base class for file type classes that represent files which usually contain structured configuration data.
 *
 * @abstract
 * @memberOf Core.fs.file
 * @extends Core.fs.file.BaseFile
 */
class BaseConfigFile extends Core.cls( "Core.fs.file.BaseFile" ) {


}

module.exports = BaseConfigFile;
