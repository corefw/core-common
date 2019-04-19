/**
 * @file
 * Defines the Core.fs.adapter.Local class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

// Load dependencies using the Core Framework
const { _, TIPE, FS, GLOB, PATH } = Core.deps( "_", "tipe", "fs", "glob", "path" );

/**
 * A file system adapter for interacting with the local disk.
 *
 * @memberOf Core.fs.adapter
 * @extends Core.fs.adapter.Base
 */
class Local extends Core.cls( "Core.fs.adapter.Base" ) {

	async readDir( absolutePath ) {

		// Locals
		let me  = this;
		let ret = {
			directories : new Set(),
			files       : new Set()
		};

		// Get the directory contents
		let rawContents = await FS.readdirAsync( absolutePath );

		// Iterate over each result..
		_.each( rawContents, async function( relPath ) {

			// Convert the relative paths to absolute paths.
			let absPath = PATH.join( absolutePath, relPath );

			// Determine if the current entity is a directory
			let isDirectory = await me.isDirectory( absPath );

			// Store the result
			if( isDirectory ) {
				ret.directories.add( absPath );
			} else {
				ret.files.add( absPath );
			}

		} );

		// All done
		return ret;

	}

	async isDirectory( absolutePath ) {
		return FS.isDirectorySync( absolutePath );
	}

	/**
	 * Evaluates a provided path and determines if it is the root file system path.
	 *
	 * @public
	 * @param {string} absolutePath - The path to evaluate.
	 * @returns {boolean} TRUE if the provided `absolutePath` is the root file system path; FALSE otherwise.
	 */
	isRootPath( absolutePath ) {

		if( absolutePath === "/" ) {
			return true;
		} else {
			return false;
		}

	}

	async glob( patterns, opts ) {

		opts.markDirectories = true;

		return GLOB.async( patterns, opts );

	}

}

module.exports = Local;
