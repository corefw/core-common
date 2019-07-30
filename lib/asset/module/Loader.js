/**
 * @file
 * Defines the Core.module.Loader class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

// Load dependencies using the Core Framework
const { _ } = Core.deps( "_" );

/**
 * Loads Core Framework Modules
 *
 * @memberOf Core.module
 * @extends Core.abstract.Component
 */
class Loader extends Core.cls( "Core.abstract.Component" ) {

	load( moduleInitializer ) {

		// Locals
		let me = this;

		if( Array.isArray( moduleInitializer ) ) {
			return me._loadManyModules( moduleInitializer );
		} else {
			return me._loadOneModule( moduleInitializer );
		}

	}

	_loadManyModules( moduleInitializers ) {

		// Locals
		let me = this;

		_.each( moduleInitializers, function( moduleInitializer ) {

			me._loadOneModule( moduleInitializer );

		} );

	}

	_loadOneModule( moduleInitializer ) {

		console.log( moduleInitializer );

	}

}

module.exports = Loader;
