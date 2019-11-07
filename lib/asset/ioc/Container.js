/**
 * @file
 * Defines the Core.asset.ioc.Container class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

// Unlike most framework classes, this fundamental class must load
// its dependencies directly and is limited to dependencies that are
// defined, explicitly, for "core-common" in its package.json file.
const _ 	= require( "lodash" );
const TIPE 	= require( "tipe" );

/**
 * Stores dependency information for auto-injection.
 *
 * @memberOf Core.asset.ioc
 */
class Container {

	constructor() {

		this._store = {};

	}

	/**
	 * Registers a singleton factory function as a container item.
	 *
	 * The provided `factory` function will be executed once, and only once, when the item is
	 * 'resolved' for the first time. After resolution, the internal store will be updated with
	 * the resolved value.
	 *
	 * @public
	 * @param {string} name - The name of the singleton [factory] being registered.
	 * @param {function} factory - A factory that returns the singleton.
	 * @returns {void}
	 */
	singleton( name, factory ) {

		// Locals
		let me = this;

		/**
		 * Wraps the singleton function to add built-in functionality.
		 *
		 * @private
		 * @returns {*} Proxies the factory result.
		 */
		function factoryWrapper() {

			// Run the factory
			let res = factory.apply( me, [ me ] );

			// Replace this wrapper, and the factory function,
			// with the actual singleton object.
			me._store[ name ] = res;

			// All done
			return res;

		}

		// This helps to identify the factory
		// wrapper within certain framework logic.
		factoryWrapper.$isIocFactory = true;

		// Persist the wrapper..
		me._store[ name ] = factoryWrapper;

	}

	/**
	 * The raw storage object for this IoC container. It will contain both
	 * resolved and unresolved values.
	 *
	 * @access public
	 * @default {}
	 * @type {Object}
	 */
	get store() {

		return this._store;

	}

	/**
	 * Resolves a single class dependency from the container. Only root level actors (such as Application classes)
	 * should use or reference this function.  If non-root actors call this method, then the Ioc container ceases
	 * to be a DI provider and becomes a service locator, which is an anti-pattern.
	 *
	 * @public
	 * @throws Error if the requested dependency is not found.
	 * @param {string} name - The name of the class dependency to resolve.
	 * @returns {*} The requested class dependency.
	 */
	resolve( name ) {

		// Locals
		let me = this;

		// Error if not found..
		if ( !me.has( name ) ) {

			throw new Error(
				"Core.asset.ioc.Container: " +
				"Attempted to resolve an unknown class dependency ('" + name + "')."
			);

		}

		// Get the class dep..
		let ret = me.store[ name ];

		// Execute the factory, if it exists..
		if ( ret.$isIocFactory === true ) {

			ret = ret.apply( me, [ me ] );

		}

		// Return it..
		return ret;

	}

	/**
	 * Resolves and returns one or more values from the IoC container store.
	 *
	 * @public
	 * @param {Set<string>|string[]|Object} names - If an array or a Set is passed, then each element value will
	 * be used as the `name` in a call to `#resolve()`. If an object is passed, then its keys will be used.
	 * @returns {Map} A Map with the resolved value for each IoC item that was found. If any requested item
	 * was not found, it will not be represented (at all) in the return; thus, if no items were found, an empty
	 * Map will be returned.
	 */
	resolveMany( names ) {

		// Locals
		let me = this;
		let ret = new Map();

		// Convert all of the valid types to arrays..
		if ( Array.isArray( names ) ) {

			// Do nothing

		} else if ( _.isSet( names ) ) {

			names = [ ...names ];

		} else if ( _.isPlainObject( names ) ) {

			names = Object.getOwnPropertyNames( names );

		} else {

			throw new Error(
				"Invalid type for parameter `names` in Core.asset.ioc.Container#resolveMany().  " +
				"An array, a Set, or a plain object was expected, but a value with type " +
				"'" + TIPE( names ) + "' was provided."
			);

		}

		// Resolve..
		_.each( names, function ( name ) {

			// Check to see if the value exists
			if ( me.has( name ) ) {

				// Resolve the value and add
				// it to the return Map.
				ret.set( name, me.resolve( name ) );

			}

		} );

		// All done..
		return ret;

	}

	/**
	 * Checks the container to see if a class dependency is defined within the container.
	 *
	 * @public
	 * @param {string} name - The name of the class dependency to check for.
	 * @returns {boolean} TRUE if the class dependency exists in the container, FALSE otherwise.
	 */
	has( name ) {

		// Locals
		let me = this;

		// Check to see if it exists
		if ( me.store[ name ] === undefined || me.store[ name ] === null ) {

			return false;

		}

		return true;

	}

	prop( name, value ) {

		this._store[ name ] = value;

	}

	// <editor-fold desc="--- Something ------------------------------------------------------------------">

	// </editor-fold>

}

module.exports = Container;
