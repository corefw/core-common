/**
 * @file
 * Defines the Core class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

// Unlike most framework classes, this fundamental class must load
// its dependencies directly and is limited to dependencies that are
// defined, explicitly, for "core-common" in its package.json file.
const _		= require( "lodash" );
const PATH	= require( "path" );

// This ProxyApplicator will convert the Core object to a "namespace provider";
// which allows get requests to undefined properties to be routed to its
// attached `assetManager` singleton.
const ProxyApplicator = require( "./ns/ProxyApplicator" );

/**
 * A static class that provides the lowest levels of framework functionality.
 */
class Core {

	// <editor-fold desc="--- Fundamental Properties -----------------------------------------------------------------">

	static get commonLibPath() {

		return __dirname;

	}

	static get commonRootPath() {

		return PATH.join( this.commonLibPath, ".." );

	}

	static get commonInitPath() {

		return PATH.join( this.commonLibPath, "index.js" );

	}

	static get coreRootClassPath() {

		return PATH.join( this.commonLibPath, "Core.js" );

	}

	// </editor-fold>

	// <editor-fold desc="--- Namespace Provider Properties ----------------------------------------------------------">

	/**
	 * This property defines the root namespace; it is required by the `Core.ns.ProxyApplicator`'s `apply()` method.
	 *
	 * @static
	 * @public
	 * @type {string}
	 */
	static get rootNamespace() {

		return "Core";

	}

	// </editor-fold>

	// <editor-fold desc="--- Root Singletons ------------------------------------------------------------------------">

	/**
	 * The assetManager, a root singleton.
	 *
	 * @access public
	 * @static
	 * @type {Core.asset.Manager}
	 */
	static get assetManager() {

		return (

			/** @type Core.asset.Manager */
			this._getRootSingleton( "assetManager", "./asset/Manager" )
		);

	}

	/**
	 * The mixer, a root singleton.
	 *
	 * @access public
	 * @static
	 * @type {Core.asset.Mixer}
	 */
	static get mixer() {

		return (

			/** @type Core.asset.Mixer */
			this._getRootSingleton( "mixer", "./asset/Mixer" )
		);

	}

	/**
	 * The igniter, a root singleton.
	 *
	 * @access public
	 * @static
	 * @type {Core.app.Igniter}
	 */
	static get igniter() {

		return (

			/** @type Core.app.Igniter */
			this._getRootSingleton( "igniter", "./app/Igniter" )
		);

	}

	/**
	 * The classInspector, a root singleton.
	 *
	 * todo: Can this be merged with Core.type.Inspector ?
	 *
	 * @access public
	 * @static
	 * @type {Core.asset.ClassInspector}
	 */
	static get classInspector() {

		return (

			/** @type Core.asset.ClassInspector */
			this._getRootSingleton( "classInspector", "./asset/ClassInspector" )
		);

	}

	/**
	 * The debugInspector, a root singleton.
	 *
	 * @access public
	 * @static
	 * @type {Core.debug.Inspector}
	 */
	static get debugInspector() {

		return (

			/** @type Core.debug.Inspector */
			this._getRootSingleton( "debugInspector", "./debug/Inspector" )
		);

	}

	/**
	 * The validator, a root singleton.
	 *
	 * @access public
	 * @static
	 * @type {Core.type.Validator}
	 */
	static get validator() {

		return (

			/** @type Core.type.Validator */
			this._getRootSingleton( "validator", "./type/Validator", {
				assetManager: this.assetManager,
			} )
		);

	}

	/**
	 * The error manager, a root singleton.
	 *
	 * @access public
	 * @static
	 * @type {Core.error.Manager}
	 */
	static get errorManager() {

		return (

			/** @type Core.error.Manager */
			this._getRootSingleton( "errorManager", "./error/Manager" )
		);

	}

	/**
	 * The module loader, a root singleton.
	 *
	 * @access public
	 * @static
	 * @type {Core.module.Loader}
	 */
	static get moduleLoader() {

		return (

			/** @type Core.module.Loader */
			this._getRootSingleton( "moduleLoader", "./asset/module/Loader" )
		);

	}

	/**
	 * Returns a root singleton object, by name. If the singleton has not yet been
	 * loaded and instantiated, this method will do so before returning.
	 *
	 * @private
	 * @static
	 * @param {string} name - The name of the singleton to get.
	 * @param {string} requirePath - The `require()` path to the singleton's class definition; this will be
	 * used to load the class definition if the singleton does not yet exist.
	 * @param {?Object} [cfg=null] - If provided and not NULL, this configuration object will be passed to the
	 * singletons constructor if the singleton has not yet been instantiated.
	 * @returns {Object} The requested singleton.
	 */
	static _getRootSingleton( name, requirePath, cfg = null ) {

		// Locals
		let me = this;

		// Check the singleton cache
		if ( !me._rootSingletonCache.has( name ) ) {

			// We need to load it..
			// First, retrieve the class definition/constructor..
			let SingletonClass = require( requirePath );

			// Instantiate
			let singletonInstance;

			if ( cfg === null ) {

				singletonInstance = new SingletonClass();

			} else {

				singletonInstance = new SingletonClass( cfg );

			}

			// Store it in the singleton cache
			me._rootSingletonCache.set( name, singletonInstance );

		}

		// Return the asset
		return me._rootSingletonCache.get( name );

	}

	/**
	 * A Map Object that is used to cache the root singletons, to promote lazy loading
	 * and the ability to reload one or more singletons, as needed.
	 *
	 * @access private
	 * @static
	 * @type {Map<string, Object>}
	 */
	static get _rootSingletonCache() {

		// Create the cache object, if it does not already exist.
		if ( this.__rootSingletonCache === undefined ) {

			this.__rootSingletonCache = new Map();

		}

		// Return the cache object.
		return this.__rootSingletonCache;

	}

	// </editor-fold>

	// <editor-fold desc="--- Singleton Alias Methods ----------------------------------------------------------------">

	/**
	 * This helper method simply forwards method arguments to one of the singletons attached to this class.
	 *
	 * @private
	 * @param {string} singletonPropName - The property (on `this`) in which the target singleton is stored.
	 * @param {string} methodName - The name of the method to execute on the singleton.
	 * @param {IArguments} args - The Arguments Object that was generated in the forwarding/callee function.
	 * @returns {*} The return value from the singleton, verbatim.
	 */
	static _singletonAlias( singletonPropName, methodName, args ) {

		// Locals
		let me = this;

		// Get the singleton
		let singleton = me[ singletonPropName ];

		// Execute
		return singleton[ methodName ].apply( singleton, args );

	}

	/**
	 * This is a convenience alias for the `assetManager` singleton's `classExists()` method.
	 *
	 * @see {@link `Core.asset.Manager#classExists()`}
	 * @returns {boolean} TRUE if the provided class name can be resolved and is found on the file system; FALSE otherwise.
	 */
	static classExists() {

		return this._singletonAlias( "assetManager", "classExists", arguments );

	}

	/**
	 * This is a convenience alias for the `assetManager` singleton's `getClass()` method.
	 *
	 * @see {@link `Core.asset.Manager#getClass()`}
	 * @returns {function} A Core Class Definition (constructor)
	 */
	static cls() {

		return this._singletonAlias( "assetManager", "getClass", arguments );

	}

	/**
	 * This is a convenience alias for the `assetManager` singleton's `inst()` method.
	 *
	 * @see {@link `Core.asset.Manager#inst()`}
	 * @returns {Object} A newly instantiated class instance.
	 */
	static inst() {

		return this._singletonAlias( "assetManager", "inst", arguments );

	}

	/**
	 * This is a convenience alias for the `assetManager` singleton's `dep()` method.
	 *
	 * @see {@link `Core.asset.Manager#dep()`}
	 * @returns {*} A dependency
	 */
	static dep() {

		return this._singletonAlias( "assetManager", "dep", arguments );

	}

	/**
	 * This is a convenience alias for the `assetManager` singleton's `deps()` method.
	 *
	 * @see {@link `Core.asset.Manager#deps()`}
	 * @returns {*} One or more dependencies
	 */
	static deps() {

		return this._singletonAlias( "assetManager", "deps", arguments );

	}

	/**
	 * This is a convenience alias for the `mixer` singleton's `mix()` method.
	 *
	 * @see {@link `Core.asset.Mixer#mix()`}
	 * @returns {function} A Core Class Definition (constructor)
	 */
	static mix() {

		return this._singletonAlias( "mixer", "mix", arguments );

	}

	/**
	 * This is a convenience alias for the `debugInspector` singleton's `summarize()` method.
	 *
	 * @see {@link `Core.debug.Inspector#summarize()`}
	 * @returns {void}
	 */
	static summarize() {

		this._singletonAlias( "debugInspector", "summarize", arguments );

	}

	/**
	 * This is a convenience alias for the `debugInspector` singleton's `inspect()` method.
	 *
	 * @see {@link `Core.debug.Inspector#inspect()`}
	 * @returns {void}
	 */
	static inspect() {

		this._singletonAlias( "debugInspector", "inspect", arguments );

	}

	/**
	 * This is a convenience alias for the `debugInspector` singleton's `summarizeChain()` method.
	 *
	 * @see {@link `Core.debug.Inspector#summarizeChain()`}
	 * @returns {void}
	 */
	static summarizeChain() {

		this._singletonAlias( "debugInspector", "summarizeChain", arguments );

	}

	/**
	 * This is a convenience alias for the `validator` singleton's `instanceOf()` method.
	 *
	 * @see {@link `Core.type.Validator#instanceOf()`}
	 * @returns {void}
	 */
	static instanceOf() {

		this._singletonAlias( "validator", "instanceOf", arguments );

	}

	/**
	 * This is a convenience alias for the `validator` singleton's `instanceOf()` method.
	 *
	 * @see {@link `Core.type.Validator#instanceOf()`}
	 * @returns {void}
	 */
	static instanceof() {

		this._singletonAlias( "validator", "instanceOf", arguments );

	}

	/**
	 * This is a convenience alias for the `errorManager` singleton's `throw()` method.
	 *
	 * @see {@link `Core.error.Manager#throw()`}
	 * @returns {void}
	 */
	static throw() {

		this._singletonAlias( "errorManager", "throw", arguments );

	}

	// </editor-fold>

	// <editor-fold desc="--- Cache Management -----------------------------------------------------------------------">

	/**
	 * Clears one or more of the Core root caches. This method will, first, call the `clearCaches()` method on
	 * the attached `assetManager` and, then, will clear any relevant caches at the `Core` (this class) level.
	 *
	 * @public
	 * @param {Object|boolean|null} [opts=null] - An options object indicating which caches should be cleared. This parameter
	 * also allows the passing of the boolean TRUE value, which will clear all caches, excluding the singleton cache.
	 * If NULL (or FALSE) is passed, then the default options will be used (see below).
	 * @param {boolean} [opts.singletons=false] - When TRUE the root level singleton cache will be cleared. Since the
	 * `assetManager` is part of that cache, clearing the singleton cache will destroy the asset manager (and all
	 * of its caches). Thus, if this value is TRUE, `opts.classes` and `opts.dependencies` will be inferred to be TRUE
	 * as well (but `opts.node` will NOT be inferred). Otherwise, when FALSE, the singleton cache will not be cleared.
	 * @param {boolean} [opts.node=true] - When TRUE (default) the Node.js `require()` cache will be cleared
	 * (via `Core.asset.Manager#clearNodeRequireCache()`); otherwise, when FALSE, the Node.js require() cache will not
	 * be cleared.
	 * @param {boolean} [opts.classes=true] - When TRUE (default) the class cache will be cleared
	 * (via `Core.asset.Manager#clearClassCache()`); otherwise, when FALSE, the class cache will not be cleared.
	 * @param {boolean} [opts.dependencies=true] - When TRUE the dependency cache will be cleared
	 * (via `Core.asset.Manager#clearDependencyCache()`); otherwise, when FALSE (default), the dependency cache will
	 * not be cleared.
	 * @returns {void}
	 */
	static clearCaches( opts = null ) {

		// Locals
		let me = this;

		// First, tell the asset manager to clear its caches
		me.assetManager.clearCaches( opts );

		// Next, we'll deal with caches at our level (`Core`)
		// Ensure we have a options object
		if ( !_.isPlainObject( opts ) ) {

			opts = {};

		}

		// Apply default options
		opts = _.defaults( {}, opts, {
			singletons: false,
		} );

		// Clear the singleton cache, if desired
		if ( opts.singletons === true ) {

			this.__rootSingletonCache = new Map();

		}

	}

	// </editor-fold>

	// <editor-fold desc="--- Constants ------------------------------------------------------------------------------">

	/**
	 * Contains constants that are used throughout the framework by various entities.
	 *
	 * @returns {Core.constants} Constants that are used throughout the framework by various entities.
	 */
	static get constants() {

		return (

			/** @type Core.constants */
			require( "./constants" )
		);

	}

	// </editor-fold>

}

// Apply the Namespace Provider Proxy
module.exports = ProxyApplicator.apply( Core );
