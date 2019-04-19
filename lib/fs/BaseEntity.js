/**
 * @file
 * Defines the Core.fs.BaseEntity class.
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
 * A base class for all file system entities (directories and files).
 *
 * @abstract
 * @memberOf Core.fs
 * @extends Core.abstract.Component
 */
class BaseEntity extends Core.cls( "Core.abstract.Component" ) {

	$construct( absolutePath, fileSystem ) {

		// Require the `absolutePath` class dep
		this._rawAbsolutePath = this.$require( "absolutePath", {
			// todo: support multi-type validation in $require() (string or string[])
		} );

		// Require the `fileSystem` class dep
		this._fileSystem = this.$require( "fileSystem", {
			instanceOf: "Core.fs.FileSystem"
		} );

	}

	/**
	 * A FileSystem class representing the file system to which this entity belongs.
	 *
	 * Note: This is a convenience alias for `this.fileSystem`
	 *
	 * @access public
	 * @default null
	 * @type {Core.fs.FileSystem}
	 */
	get fs() {
		return this.fileSystem;
	}

	/**
	 * A FileSystem class representing the file system to which this entity belongs.
	 *
	 * @access public
	 * @default null
	 * @type {Core.fs.FileSystem}
	 */
	get fileSystem() {
		return this._fileSystem;
	}

	/**
	 * The absolute path of this directory.
	 *
	 * @access public
	 * @default null
	 * @type {string}
	 */
	get path() {

		// The directory object only stores the 'raw' path, so that
		// updates to the context will be automatically propagated
		// to all file system objects. Because of this, we need to
		// resolve the path each time it is requested.
		return this.fs.resolvePath( this._rawAbsolutePath );

	}

}

module.exports = BaseEntity;
