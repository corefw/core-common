/**
 * @file
 * Defines the Core.fs.path.Manager class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

// Load dependencies using the Core Framework
const { _, TIPE, PATH } = Core.deps( "_", "tipe", "path" );

/**
 * The path manager augments a `Core.context.Context` object by adding functionality that is specifically
 * geared towards file system paths.
 *
 * @memberOf Core.fs.path
 * @extends Core.abstract.Component
 */
class Manager extends Core.cls( "Core.abstract.Component" ) {

	$construct( context, initialPaths ) {

		// Require the `context` class dep
		// The path manager stores its data inside of a Context object, at a specific location ('path.');
		// it also uses the Context object for interpolation.
		this._context = this.$require( "context", {
			instanceOf: "Core.context.Context"
		} );

		// Process initial paths, if provided
		if( initialPaths !== null ) {
			this.addPaths( initialPaths );
		}

	}

	/**
	 * The Context object that this path manager uses to store paths in; it also
	 * uses the Context object for interpolation.
	 *
	 * @access public
	 * @default null
	 * @type {Core.context.Context}
	 */
	get context() {
		return this._context;
	}

	/**
	 * A convenience alias for `this.$setPaths()`.
	 *
	 * @param {Object} paths - An object containing one or more paths where each key in the object
	 * represents the name of the path and each value is an absolute path represented as a either a string
	 * or an array of strings.
	 * @returns {void}
	 */
	addPaths( paths ) {
		return this.setPaths( paths );
	}

	/**
	 * A convenience alias for `this.$setPath()`.
	 *
	 * @public
	 * @param {string} name - The name of the path to set.
	 * @param {string|string[]} path - An absolute path, represented as either a string or an array of strings.
	 * @returns {void}
	 */
	addPath( name, path ) {
		return this.setPath( name, path );
	}

	/**
	 * Sets the value of one or more paths within the attached `Context`.
	 *
	 * @public
	 * @param {Object} paths - An object containing one or more paths where each key in the object
	 * represents the name of the path and each value is an absolute path represented as a either a string
	 * or an array of strings.
	 * @returns {void}
	 */
	setPaths( paths ) {

		// Locals
		let me  = this;
		let ctx = me.context;

		// Normalize the paths
		paths = me.normalizePaths( paths );

		// Store the new paths in the Context object
		ctx.setValues( paths, {
			prefix: "path."
		} );

	}

	/**
	 * Sets the value of a single path within the attached `Context`.
	 *
	 * @public
	 * @param {string} name - The name of the path to set.
	 * @param {string|string[]} path - An absolute path, represented as either a string or an array of strings.
	 * @returns {void}
	 */
	setPath( name, path ) {

		// Locals
		let me  = this;
		let ctx = me.context;

		// Normalize the paths
		path = me.normalizePath( path );

		// Store the new paths in the Context object
		ctx.setValue( name, path, {
			prefix: "path."
		} );

	}

	/**
	 * Normalizes a path into a single, simple, string while preserving context variable references.
	 *
	 * @param {string|string[]} path - An absolute path represented as either a string or an array of strings.
	 * @returns {string} The normalized path.
	 */
	normalizePath( path ) {

		// Locals
		let me = this;

		if( TIPE( path ) === "string" ) {

			// Send strings back in as arrays.
			// (to ensure consistency)
			return me.normalizePath( [ path ] );

		} else if( TIPE( path ) === "array" ) {

			// Flatten the array
			path = _.flattenDeep( path );

			// Defer to path.join()
			return PATH.join.apply( null, path );

		} else {
			throw new Error( "Invalid `path` parameter passed to Core.fs.path.Manager::normalizePath(). A string or an array of strings was expected, but a variable of type '" + TIPE( path ) + "' was provided." );
		}

	}

	/**
	 * Normalizes one or more paths within an object.
	 *
	 * @public
	 * @see `this.normalizePath()`
	 * @param {Object} paths - An object containing one or more paths where each key in the object
	 * represents the name of the path and each value is an absolute path represented as a either a string
	 * or an array of strings.
	 * @returns {Object} A new object with all paths normalized.
	 */
	normalizePaths( paths ) {

		// Locals
		let me = this;
		let ret = {};

		// Iterate over each path
		_.each( paths, function( path, name ) {
			ret[ name ] = me.normalizePath( path );
		} );

		// All done
		return ret;

	}

	/**
	 * Resolves the value of a `path` by injecting context values, giving special priority and localization to
	 * _paths_ stored within the context (values at 'path.*').
	 *
	 * Note: This method defers most of its logic to the `Core.context.Context::resolve()` method, but provides
	 * a bit of wrapping logic/settings that optimize for path resolution.
	 *
	 * @public
	 * @param {string|string[]} path - An absolute path represented as either a string or an array of strings.
	 * @returns {string} The resolved path.
	 */
	resolve( path ) {

		// Normalize the Path
		path = this.normalizePath( path );

		// Resolve through the Context
		return this.context.resolve( path, {
			use: "path"
		} );

	}

}

module.exports = Manager;
