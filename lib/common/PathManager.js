/**
 * @file Defines the PathManager class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @author Kevin Sanders <kevin@c2cschools.com>
 * @since 5.0.0
 * @license See LICENSE.md for details about licensing.
 * @copyright 2017 C2C Schools, LLC
 */

"use strict";

const BaseClass	= require( "./BaseClass" );
const ERRORS	= require( "../errors" );

/**
 * This utility class stores, manages, and manipulates file system paths that
 * are useful and relevant to endpoints and their supporting libraries.
 *
 * @memberOf Common
 * @extends Common.BaseClass
 */
class PathManager extends BaseClass {

	/**
	 * @inheritDoc
	 */
	_initialize( cfg ) {

		// const me = this;

		// Call parent
		super._initialize( cfg );

		// Add local paths
		// me._addLocalPaths();
	}

	/**
	 * This special private function adds paths to the path manager that can be
	 * resolved relative to this class definition file (using the special
	 * `__dirname` variable).
	 *
	 * @private
	 * @returns {void}
	 */
	// _addLocalPaths() {
	//
	// 	const me = this;
	//
	// 	// FIXME: how will this work now that we're splitting up classes into
	// 	// separate repos?
	// 	// TODO: _dirname up one dir
	// 	me.setPath( "commonLib", __dirname );
	// }

	/**
	 * Stores all of the local file system paths.
	 *
	 * @public
	 * @type {string}
	 */
	get paths() {

		const me = this;

		return me.getConfigValue( "paths", {} );
	}

	set paths( /** string */ val ) {

		const me = this;

		me.setConfigValue( "paths", val );
	}

	/**
	 * Sets one file system path in the {@link Common.PathManager#paths} object.
	 *
	 * @public
	 * @param {string} pathName - The name/alias of the path to set.
	 * @param {string} path - An absolute file system path.
	 * @returns {void}
	 */
	setPath( pathName, path ) {

		const me = this;

		me.paths[ pathName ] = path;
	}

	/**
	 * Returns one file system path from the {@link Common.PathManager#paths}
	 * object when provided a path name/alias.
	 *
	 * @public
	 * @param {string} pathName - The name/alias of the path that should be
	 *     returned.
	 * @returns {?string} An absolute file system path or NULL if the path has
	 *     not been defined.
	 */
	getPath( pathName ) {

		const me = this;

		if ( me.hasPath( pathName ) ) {

			return me.paths[ pathName ];
		}

		return null;
	}

	/**
	 * Checks to see if a path has been defined.
	 *
	 * @public
	 * @param {string} pathName - The name/alias of the path to check.
	 * @returns {boolean} TRUE if the path has been defined; FALSE otherwise.
	 */
	hasPath( pathName ) {

		const me = this;

		return me.paths[ pathName ] !== undefined;
	}

	/**
	 * Adds a new path definition by applying (joining) a sub-path to an
	 * existing, defined, path.
	 *
	 * @public
	 * @throws {Errors.PathNotDefinedError} If the provided parent path does not
	 *     exist.
	 * @param {string} pathName - The name of the new path.
	 * @param {string} parentPathName - The name of the existing, defined, path
	 *     to join the new path to.
	 * @param {string} subPath - The sub-path to apply (join) to the existing
	 *     path.
	 * @returns {void}
	 */
	setSubPath( pathName, parentPathName, subPath ) {

		const me = this;

		// Apply the join
		let finalPath = me.join( parentPathName, subPath );

		// Save it...
		me.setPath( pathName, finalPath );
	}

	/**
	 * Alias for {@link Common.PathManager#hasPath}.
	 *
	 * @public
	 * @param {string} pathName - The name/alias of the path to check.
	 * @returns {boolean} TRUE if the path has been defined; FALSE otherwise.
	 */
	isPathDefined( pathName ) {

		const me = this;

		return me.hasPath( pathName );
	}

	/**
	 * Checks to see if a path has been defined and throws an error if it has
	 * not been.
	 *
	 * @private
	 * @throws {Errors.PathNotDefinedError} If the provided path does not exist.
	 * @param {string} pathName - The name of the path to check for.
	 * @returns {void}
	 */
	_ensurePathIsDefined( pathName ) {

		const me = this;

		// Check for the path
		let defined = me.isPathDefined( pathName );

		// Throw if it is not defined
		if ( !defined ) {

			throw new ERRORS.PathNotDefinedError(
				"Attempted to read a path (named '%s') that has not been " +
				"defined in this PathManager.",
				pathName
			);
		}
	}

	/**
	 * Applies (joins) a sub-path to an existing, defined, path.
	 *
	 * @public
	 * @throws {Errors.PathNotDefinedError} If the provided parent path does not
	 *     exist.
	 * @param {?string} parentPathName - The name of an existing, defined, path.
	 * @param {string} subPath - The path to apply (join) to the existing path.
	 * @returns {string} The resulting path, after joining.
	 */
	join( parentPathName, subPath ) {

		const me = this;

		// Dependencies
		const PATH = me.$dep( "path" );

		// Skip joining if NULL is passed
		// for the parent path.
		if ( parentPathName === null ) {

			return subPath;
		}

		// Ensure the parent path is defined
		me._ensurePathIsDefined( parentPathName );

		// Get the parent path
		let parentPath = me.getPath( parentPathName );

		// Defer to the 'path' module.
		return PATH.join( parentPath, subPath );
	}

	/**
	 * A simple debugging method that shows all of the paths defined within this PathManager.
	 *
	 * @returns {void}
	 */
	dumpPaths() {
		this.$inspect( this.paths );
	}

}

module.exports = PathManager;
