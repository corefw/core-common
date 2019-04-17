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
class Base extends Core.mix( "Core.abstract.Component", "Core.asset.mixin.Parenting" ) {

	$construct( pathManager ) {

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

	/**
	 * Spawns Core.fs.Directory objects.
	 *
	 * @public
	 * @param {string|string[]} absolutePath - The absolute path of the directory, which may include context variable
	 * references. If an array of strings is passed then they will be joined using the internal `path.join()` method.
	 * @returns {Core.fs.Directory} A new directory object.
	 */
	dir( absolutePath ) {

		return this.$spawn( "Core.fs.Directory", {
			fileSystemAdapter : this,
			absolutePath      : absolutePath
		} );

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

}

module.exports = Base;
