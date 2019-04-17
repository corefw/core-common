/**
 * @file
 * Defines the Core.app.Application class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

//const { _ } = Core.deps( "lodash" );

/**
 * An execution container that loads and manages the run-time state, context, and environment for
 * a single execution instance.
 *
 * @memberOf Core.app
 * @extends Core.abstract.Component
 */
class Application extends Core.mix(
	"Core.abstract.Component",
	"Core.logging.mixin.Loggable",
	"Core.asset.mixin.Parenting"
) {

	$construct() {

		// The `Core.asset.mixin.Parenting` mixin creates a `classLoader` class dependency.
		// Since Application objects are, themselves, usually responsible for instantiating the
		// ClassLoader that its subordinates will use, we need to instantiate and inject a new
		// ClassLoader object into `Core.asset.mixin.Parenting::$construct()`, using overrides.
		return {
			classLoader: this._initClassLoader()
		};

	}

	/**
	 * Returns the application-level IoC container. If no IoC container exists, it will be
	 * initialized (via `#_initIocContainer`), and then returned.
	 *
	 * @access public
	 * @type {Core.asset.ioc.Container}
	 */
	get iocContainer() {

		// Locals
		let me = this;

		// Init, if needed..
		if( me._iocContainer === undefined ) {
			me._initIocContainer();
		}

		// Return
		return me._iocContainer;

	}

	/**
	 * Initializes a new, application level, IoC container.
	 *
	 * Note: Applications are among the very few entities that should be able to instantiate (or even interact with
	 * IoC containers). All other classes interact with IoC containers indirectly, by way of the dependencies they
	 * define in their `$construct` methods, which have IoC values automatically injected into them by a `ClassLoader`.
	 *
	 * @private
	 * @returns {Core.asset.ioc.Container} A newly instantiated and initialized IoC container.
	 */
	_initIocContainer() {

		// Locals
		let me = this;

		// Create a new IoC container.
		let ioc = Core.inst( "Core.asset.ioc.Container", {} );

		// Self register in the IoC container.
		ioc.prop( "application", me );

		// Register a singleton factory for our classLoader
		// (we use a factory to mitigate the circular relationship
		// between the ClassLoader and the IoC container)
		if( !ioc.has( "classLoader" ) ) {
			ioc.singleton( "classLoader", function() {
				return me.classLoader;
			} );
		}

		// Persist the new container
		me._iocContainer = ioc;

		// Return the IoC container
		return ioc;

	}

	/**
	 * Initializes a new, application-level, `ClassLoader`.
	 *
	 * @private
	 * @returns {Core.asset.ClassLoader} The newly instantiated ClassLoader.
	 */
	_initClassLoader() {

		// Locals
		let me = this;

		// Create a new ClassLoader
		me._classLoader = Core.inst( "Core.asset.ClassLoader", {
			iocContainer: me.iocContainer
		} );

		// Return it
		return me._classLoader;

	}

}

module.exports = Application;
