/**
 * @file
 * Defines the Core.fs.FileSystem class.
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
 * Represents a local or remote file system.
 *
 * @memberOf Core.fs
 * @extends Core.abstract.Component
 */
class FileSystem extends Core.cls( "Core.abstract.Component" ) {

	$construct( fileSystemAdapter ) {

		// Require the `fileSystemAdapter` class dep
		this._fileSystemAdapter = this.$require( "fileSystemAdapter", {
			instanceOf: "Core.fs.adapter.Base",
		} );

	}

	$ready() {
		console.log( "--- Core.fs.FileSystem :: $ready ---" );
	}

}

module.exports = FileSystem;
