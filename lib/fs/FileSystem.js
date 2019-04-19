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
 * @mixes Core.asset.mixin.Parenting
 */
class FileSystem extends Core.mix( "Core.abstract.Component", "Core.asset.mixin.Parenting" ) {

	$construct( fileSystemAdapter, pathManager ) {

		// Require the `fileSystemAdapter` class dep
		this._fileSystemAdapter = this.$require( "fileSystemAdapter", {
			instanceOf: "Core.fs.adapter.Base",
		} );

		// Require the `pathManager` class dep
		this._pathManager = this.$require( "pathManager", {
			instanceOf: "Core.fs.path.Manager"
		} );

	}

	/**
	 * A path manager object.
	 *
	 * @access public
	 * @default null
	 * @type {Core.fs.path.Manager}
	 */
	get pathManager() {
		return this._pathManager;
	}

	get fileSystemAdapter() {
		return this._fileSystemAdapter;
	}

	/**
	 * Spawns a `Core.fs.Directory` object.
	 *
	 * @public
	 * @param {string|string[]} absolutePath - The absolute path of the directory, which may include context variable
	 * references. If an array of strings is passed then they will be joined using the internal `path.join()` method.
	 * @returns {Core.fs.Directory} A new directory object.
	 */
	dir( absolutePath ) {

		return this.$spawn( "Core.fs.Directory", {
			fileSystem   : this,
			absolutePath : absolutePath
		} );

	}

	file( absolutePath ) {
		throw new Error( "Not yet implemented" );
	}

	/**
	 * Normalizes a path into a single, simple, string while preserving context variable references.
	 *
	 * @param {string|string[]} path - An absolute path represented as either a string or an array of strings.
	 * @returns {string} The normalized path.
	 */
	normalizePath( path ) {
		return this.pathManager.normalizePath.apply( this.pathManager, arguments );
	}


	/**
	 * A convenience alias for `this.pathManager.resolve()`.
	 *
	 * @public
	 * @param {string|string[]} path - The absolute path of a directory, which may include context variable
	 * references. If an array of strings is passed then they will be joined using the internal `path.join()` method.
	 * @returns {string} The resolved, absolute, path.
	 */
	resolvePath( path ) {
		return this.pathManager.resolve.apply( this.pathManager, arguments );
	}

	/**
	 * Evaluates a provided path and determines if it is the root file system path.
	 *
	 * @public
	 * @param {string} path - The path to evaluate.
	 * @returns {boolean} TRUE if the provided `path` is the root file system path; FALSE otherwise.
	 */
	isRootPath( path ) {
		return this.pathManager.isRootPath( path );
	}

	async getDirectoryContents( path, opts = null ) {

		// Locals
		let me = this;
		let fsa = me.fileSystemAdapter;

		// Force `opts` to be a plain object
		if( !_.isPlainObject( opts ) ) {
			opts = {};
		}

		// Apply default options
		opts = _.defaults( {}, opts, {
			returnPaths  : false,
			returnArrays : false
		} );

		// Get the raw contents
		let ret = await fsa.readDir( path );

		// If returnPaths is FALSE, we'll convert the strings
		// returned from the adapter to file and directory objects.
		if( opts.returnPaths !== true ) {

			// Convert file paths to file objects
			let finalFiles = new Set();
			_.each( ret.files, function( absFilePath ) {
				finalFiles.add( me.file( absFilePath ) );
			} );
			ret.files = finalFiles;

			// Convert directory paths to directory objects
			let finalDirs = new Set();
			_.each( ret.directories, function( absFilePath ) {
				finalDirs.add( me.dir( absFilePath ) );
			} );
			ret.directories = finalDirs;

		}

		// If returnArrays is TRUE, we'll convert the Sets to arrays.
		if( opts.returnArrays === true ) {
			ret.files       = [ ...ret.files       ];
			ret.directories = [ ...ret.directories ];
		}

		// All done
		return ret;

	}

	async readDir( path, opts ) {
		return this.getDirectoryContents( path, opts );
	}

	async getDirectoryContentsSimple( path, opts = null ) {

		// Force `opts` to be a plain object
		if( !_.isPlainObject( opts ) ) {
			opts = {};
		}

		// Force returnPaths to TRUE
		opts.returnPaths = true;

		// .. and returnArrays to TRUE
		opts.returnArrays = true;

		// Defer to getDirectoryContents
		return this.getDirectoryContents( path, opts );

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
		let results = await me.glob( searchFor, opts );

		// todo: By default, this method should return File and Directory objects,
		//  but that logic is not yet implemented.
		if( opts.returnObjects === true ) {
			throw new Error( "opts.returnObjects is not yet implemented." );
		}

		// Done
		return results;

	}

	async glob( patterns, opts ) {
		return this.fileSystemAdapter.glob( patterns, opts );
	}

}

module.exports = FileSystem;
