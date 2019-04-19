/**
 * @file
 * Defines the Core.fs.Directory class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

// Load dependencies using the Core Framework
const { _ } = Core.deps( "_" );


/**
 * Represents a single file system directory.
 *
 * @memberOf Core.fs
 * @extends Core.abstract.Component
 */
class Directory extends Core.cls( "Core.fs.BaseEntity" ) {

	/**
	 * Indicates whether or not this directory represents the root directory
	 * of its associated file system.
	 *
	 * @access public
	 * @default false
	 * @type {boolean}
	 */
	get isRoot() {
		return this.fs.isRootPath( this.path );
	}

	async searchUp( searchFor, allowFiles = true, allowDirectories = true ) {

		// Locals
		let me = this;

		// First, check to see if this directory has the `searchFor` entity.
		let hasChild = await me.hasChild( searchFor, allowFiles, allowDirectories );

		if( hasChild === true ) {

			// If we found a match, then we'll
			// return this directory.
			return me;

		} else {

			// If we're the root directory, then
			// we can end the search; we'll return
			// NULL to indicate that the search failed.
			if( me.isRoot ) {

				return null;

			} else {

				// We'll continue our search upward...
				let myParent = await me.getParent();
				return myParent.searchUp( searchFor, allowFiles, allowDirectories );

			}


		}

	}

	async searchIn( searchFor, opts ) {
		return this.fs.searchIn( this.path, searchFor, opts );
	}

	get parentPath() {

		// Locals
		let me = this;

		// We won't have a parent path if we're root..
		if( me.isRoot ) {
			return null;
		}

		return me.fs.normalizePath( [ me.path, ".." ] );

	}

	async getParent() {

		// Locals
		let me = this;
		let parentPath = me.parentPath;

		if( parentPath === null ) {
			return null;
		} else {
			return me.fs.dir( parentPath );
		}

	}

	async hasChild( searchFor, allowFiles = true, allowDirectories = true ) {

		// Locals
		let me = this;
		let ret = false;

		// Get my contents
		let contents = await me.getSimpleContents();

		// File/directory filtering logic
		let checkForTypes = [];
		if( allowFiles ) {
			checkForTypes.push( "files" );
		}
		if( allowDirectories ) {
			checkForTypes.push( "directories" );
		}

		// Check for a match
		// todo: consider adding support for regex and glob matches
		_.each( checkForTypes, function( contentProp ) {

			_.each( contents[ contentProp ], function( item ) {

				// Found it! Stop searching..
				if( item.indexOf( searchFor ) !== -1 ) {
					ret = true;
					return false;
				}

			} );

			// If found, stop searching..
			if( ret === true ) {
				return false;
			}

		} );

		// All done
		return ret;

	}

	async getContents( opts = null ) {
		return this.fs.getDirectoryContents( this.path, opts );
	}

	async getSimpleContents() {
		return this.fs.getDirectoryContentsSimple( this.path, {} );
	}

	async exists() {

	}


}

module.exports = Directory;
