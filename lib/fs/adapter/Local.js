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
const { _, TIPE, FS, GLOB } = Core.deps( "_", "tipe", "fs", "glob" );

/**
 * A file system adapter for interacting with the local disk.
 *
 * @memberOf Core.fs.adapter
 * @extends Core.fs.adapter.Base
 */
class Local extends Core.cls( "Core.fs.adapter.Base" ) {

	async getDirectoryContents( path, opts = null ) {



	}

	async getDirectoryContentsSimple( path, returnRelPaths = false ) {

		// Locals
		let me = this;
		let ret = {
			directories : [],
			files       : []
		};

		// Get the directory contents
		let rawContents = await FS.readdirAsync( path );

		// Iterate over each result..
		_.each( rawContents, function( relPath ) {

			let returnPath;

			// Convert the relative paths to absolute paths.
			let absPath = me.normalizePath( [ path, relPath ] );

			// Determine if the current entity is a directory
			let isDirectory = FS.isDirectorySync( absPath );

			// Determine the return path
			if( returnRelPaths ) {
				returnPath = relPath;
			} else {
				returnPath = absPath;
			}

			// Store the result
			if( isDirectory ) {
				ret.directories.push( returnPath );
			} else {
				ret.files.push( returnPath );
			}

		} );

		// All done
		return ret;

	}

	async searchIn( searchPath, searchFor, opts ) {

		// Locals
		let me = this;

		// Force `opts` to be a plain object.
		if( !_.isPlainObject( opts ) ) {
			opts = {};
		}

		// Apply default options
		opts = _.defaults( {}, opts, {
			maxDepth         : null,
			ignore           : [],
			allowFiles       : true,
			allowDirectories : true,
			followSymLinks   : true,
			unique           : true,
			absolute         : true,
			cwd              : searchPath,
			returnObjects    : true,
		} );

		// Translate a few settings to match the `fast-glob` API.

		// ..maxDepth -> deep
		// see: https://www.npmjs.com/package/fast-glob#deep
		if( opts.maxDepth === null ) {
			opts.deep = true;
		} else {
			opts.deep = opts.maxDepth;
		}
		delete opts.maxDepth;

		// ..allowFiles,allowDirectories -> onlyFiles,onlyDirectories
		// see: https://www.npmjs.com/package/fast-glob#onlyfiles
		if( opts.allowFiles && opts.allowDirectories ) {
			opts.onlyFiles       = false;
			opts.onlyDirectories = false;
		} else if ( opts.allowFiles ) {
			opts.onlyFiles       = true;
			opts.onlyDirectories = false;
		} else if ( opts.allowDirectories ) {
			opts.onlyFiles       = false;
			opts.onlyDirectories = true;
		} else {
			return [];
		}
		delete opts.allowFiles;
		delete opts.allowDirectories;

		// ..followSymLinks -> followSymlinkedDirectories
		// see: https://www.npmjs.com/package/fast-glob#followsymlinkeddirectories
		opts.followSymlinkedDirectories = opts.followSymLinks;
		delete opts.followSymLinks;

		// Defer to the glob wrapper
		let results = await me._glob( searchFor, opts );

		// todo: By default, this method should return File and Directory objects,
		//  but that logic is not yet implemented.
		if( opts.returnObjects === true ) {
			throw new Error( "opts.returnObjects is not yet implemented." );
		}

		// Done
		return results;

	}

	async _glob( patterns, opts ) {

		opts.markDirectories = true;

		return GLOB.async( patterns, opts );

	}


}

module.exports = Local;
