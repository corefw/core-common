/**
 * @file
 * Defines the Core.fs.file.BaseFile class.
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
 * A base class for all file type abstractions
 *
 * @abstract
 * @memberOf Core.fs.file
 * @extends Core.fs.BaseEntity
 */
class BaseFile extends Core.cls( "Core.fs.BaseEntity" ) {


}

module.exports = BaseFile;
