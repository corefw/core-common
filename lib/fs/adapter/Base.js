/**
 * @file
 * Defines the Core.fs.adapter.Base class.
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
 * A base class that all file system adapters should inherit from.
 *
 * @abstract
 * @memberOf Core.fs.adapter
 * @extends Core.abstract.Component
 */
class Base extends Core.cls( "Core.abstract.Component" ) {


}

module.exports = Base;
