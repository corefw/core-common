/**
 * @file
 * Defines the `Core.asset.mixin.Parenting` mixin.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/**
 * Applies class members that enable the spawning of child objects.
 *
 * @memberOf Core.asset.mixin
 */
class Parenting {

	$construct( classLoader ) {

		// Require the `classLoader` class dep
		this._classLoader = this.$require( "classLoader", {
			instanceOf : "Core.asset.ClassLoader"
		} );

	}

	/**
	 * Used to instantiate framework-compatible classes.
	 *
	 * @access public
	 * @default null
	 * @type {Core.asset.ClassLoader}
	 */
	get classLoader() {
		return this._classLoader;
	}

	/**
	 * Spawns a child class object using a `Core.asset.ClassLoader`.
	 *
	 * @private
	 * @param {string} fullClassName - A full, namespaced, class name.
	 * @param {Object} config - A configuration object that will be passed to the new child class.
	 * @returns {Object} The newly instantiated class.
	 */
	$spawn( fullClassName, config ) {

		// Locals
		let me = this;

		// Force a config object
		if( !config ) {
			config = {};
		}

		// .. and framework meta.
		if( !config.$corefw ) {
			config.$corefw = {};
		}

		// Apply parent info..
		config.$corefw.parent = me;

		// Defer to the class loader
		return me.classLoader.instantiateClass( fullClassName, config );

	}


}

module.exports = Parenting;
