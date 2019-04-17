/**
 * @file
 * Defines the Core.asset.ClassLoader class.
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
 * Instantiates framework classes within an application run-time context.
 *
 * @memberOf Core.asset
 */
class ClassLoader extends Core.cls( "Core.abstract.Component" ) {

	$construct( iocContainer ) {

		// Require the `iocContainer` class dep
		this._iocContainer = this.$require( "iocContainer", {
			instanceOf: "Core.asset.ioc.Container",
		} );

	}

	/**
	 * Returns the attached IoC container.
	 *
	 * @access public
	 * @type {Core.asset.ioc.Container}
	 */
	get iocContainer() {
		return this._iocContainer;
	}

	/**
	 * A convenience alias for `#instantiateClass()`.
	 *
	 * @public
	 * @param {string} fullClassName - A full, namespaced, class name.
	 * @param {Object} cfg - The existing configuration object.
	 * @returns {Object} - The newly instantiated class instance.
	 */
	inst( fullClassName, cfg = null ) {
		return this.instantiateClass( fullClassName, cfg );
	}

	/**
	 * Injects metadata and IoC container values into the provided `cfg` object and then
	 * uses the updated configuration object to instantiate a class instance.
	 *
	 * Important: This method passes the `cfg` object to the class constructor as the first parameter,
	 * and does not pass any other parameters. For that reason, this method is not suitable for
	 * instantiating classes that do not accept a configuration object or require more than one
	 * constructor param.
	 *
	 * @public
	 * @param {string} fullClassName - A full, namespaced, class name.
	 * @param {Object} cfg - The existing configuration object.
	 * @returns {Object} - The newly instantiated class instance.
	 */
	instantiateClass( fullClassName, cfg = null ) {

		// Locals
		let me = this;

		// Ensure our `cfg` is an object.
		if( !_.isPlainObject( cfg ) ) {
			cfg = {};
		}

		// Load the class definition
		let ClassDefinition = Core.cls( fullClassName );

		// Auto-resolve class dependencies using IoC values
		// (except for values that were explicitly provided)
		cfg = me._injectIocValues( ClassDefinition, cfg );

		// Ensure we're passing Core Framework meta
		if( !cfg.$corefw ) {
			cfg.$corefw = {};
		}

		// Attach the full class name to the class
		cfg.$corefw.fullClassName = fullClassName;

		// Ensure that we're passing something for parent
		if( !cfg.$corefw.parent ) {
			cfg.$corefw.parent = null;
		}

		// Instantiate the object..
		let InstantiatedObject = new ClassDefinition( cfg );

		// All done
		return InstantiatedObject;

	}

	/**
	 * Injects missing class dependency values from the attached IoC container into
	 * a provided configuration object.
	 *
	 * @private
	 * @param {function} ClassDefinition - A class definition/constructor of a Core Framework compatible class.
	 * @param {Object} cfg - The existing configuration object to which this method should inject IoC values.
	 * @returns {Object} The configuration object (`cfg`), updated with values injected from the IoC container.
	 */
	_injectIocValues( ClassDefinition, cfg ) {

		// Locals
		let me  = this;
		let ioc = me.iocContainer;

		// We can only inject for classes that define a static `getClassDependencies()` method.
		if( ClassDefinition.getClassDependencies === undefined || typeof ClassDefinition.getClassDependencies !== "function" ) {
			return cfg;
		}

		// Collect the class dependencies
		let deps = ClassDefinition.getClassDependencies();

		// Explicit cfg values take precedence over IoC values,
		// so we will reduce the full list of dependencies (deps)
		// to a list of dependencies not being provided explicitly.
		let needed = [ ...deps ].filter(

			function( item ) {

				if( cfg[ item ] === undefined || cfg[ item ] === null ) {
					return true;
				} else {
					return false;
				}

			}

		);

		// If our config is not missing any missing dependency values for
		// the target class, then we can save ourselves work by exiting early.
		if( needed.length === 0 ) {
			return cfg;
		}

		// Query the IoC container for our missing values and
		// apply any values that it returns to our cfg.
		ioc.resolveMany( needed ).forEach(

			function( resolvedValue, dependencyName ) {

				cfg[ dependencyName ] = resolvedValue;

			}

		);


		// All done
		return cfg;

	}

}

module.exports = ClassLoader;
