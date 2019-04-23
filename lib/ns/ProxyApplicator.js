/**
 * @file
 * Defines the Core.ns.ProxyApplicator Class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

// Deps
const _ = require( "lodash" );

/**
 * Applies a Proxy to classes and objects that enables "namespace ghosting", whereby calls to
 * non-existent properties on the target will be treated like namespace paths.
 *
 * @example
 * let obj     = {
 *     a: "hello",
 *     rootNamespace: "Something.good",
 *     cls: function( name ) {
 *         console.log( "load: " + name );
 *     }
 * };
 * let proxied = ProxyApplicator.apply( obj );
 *
 * console.log( proxied.a );          // -> "hello"
 * console.log( proxied.some.path );  // -> <Core.ns.GenericProvider>
 * console.log( proxied.some.Class ); // -> "load: Something.good.some.Class"
 *
 * @memberOf Core.ns
 */
class ProxyApplicator {

	/**
	 * Applies the Namespace Provider Proxy to a target object or function.
	 *
	 * @public
	 * @static
	 * @param {Object|function} target - The object to apply the ns provider proxy to.
	 * @param {?Object} [opts=null] - Additional options for the application process.
	 * @param {boolean} [opts.skipValidation=false] - When TRUE, the target object will not be validated for
	 * compatibility as a root namespace provider.
	 * @returns {Object|fundtion} The `target`, with the Proxy object applied.
	 */
	static apply( target, opts = null ) {

		// Ensure we have an options object
		if( opts === null ) {
			opts = {};
		}

		// Apply default opts
		opts = _.defaults( {}, opts, {
			skipValidation: false
		} );

		// Validate
		if( opts.skipValidation !== true ) {
			this._validateTarget( target );
		}

		// Apply the proxy
		return new Proxy( target, this.handler );

	}

	/**
	 * Validates that a target object or function for compatibility as a root namespace provider.
	 *
	 * @static
	 * @private
	 * @throw Error if the target is invalid.
	 * @param {Object|function} target - A prospective root namespace provider.
	 * @returns {void}
	 */
	static _validateTarget( target ) {

		if( target.rootNamespace === undefined || target.rootNamespace === null ) {
			throw new Error( "Invalid `target` provided to Core.ns.ProxyApplicator::apply(). Root namespace providers MUST expose a 'rootNamespace' property." );
		}

		if( target.cls === undefined || target.cls === null || ( typeof target.cls !== "function" ) ) {
			throw new Error( "Invalid `target` provided to Core.ns.ProxyApplicator::apply(). Root namespace providers MUST expose a 'cls' method for spawning class endpoints." );
		}

	}

	/**
	 * Returns the class definition (constructor) of the class that will be used as
	 * a generic namespace provider. This class will be used to facilitate sub-paths
	 * in the namespace tree.
	 *
	 * @static
	 * @public
	 * @type {Core.ns.GenericProvider}
	 */
	static get genericProvider() {
		return require( "./GenericProvider" );
	}

	/**
	 * Returns a cache object that is used to store namespace information and the various
	 * generic providers that are spawned as the namespace tree is traversed.
	 *
	 * @static
	 * @public
	 * @type {WeakMap<Object, Object>}
	 */
	static get nsProviderCache() {

		if( this._nsProviderCache === undefined ) {
			this._nsProviderCache = new WeakMap();
		}

		return this._nsProviderCache;

	}

	/**
	 * When given a namespace provider (any object that has had the Proxy object applied to it),
	 * this method will attempt to resolve the top-most provider in its chain.
	 *
	 * @public
	 * @static
	 * @param {Object|function} obj - A ns provider to find the root provider for.
	 * @returns {Object|function} The root provider for the provider specified as `obj`.
	 */
	static getRootNsProviderFor( obj ) {

		// Root objects won't have metadata
		if( obj.$nsProviderMeta === undefined ||
			obj.$nsProviderMeta.parentProvider === undefined ||
			obj.$nsProviderMeta.parentProvider === null ) {

			return obj;

		}

		// If we have a parent, then we'll recurse through
		return this.getRootNsProviderFor( obj.$nsProviderMeta.parentProvider );

	}

	/**
	 * Evaluates a namespace provider object and determines if it is a root provider.
	 *
	 * @static
	 * @public
	 * @param {Object} obj - The object to evaluate.
	 * @returns {boolean} TRUE if `obj` is a root provider; FALSE otherwise.
	 */
	static isRootProvider( obj ) {

		// Root objects won't have metadata
		if( obj.$nsProviderMeta === undefined ||
			obj.$nsProviderMeta.parentProvider === undefined ||
			obj.$nsProviderMeta.parentProvider === null ) {

			return true;

		} else {

			return false;

		}

	}

	/**
	 * Resolves and returns the full namespace that a namespace provider represents. For root providers,
	 * this will be the value of the `rootNamespace` property that it exposes. For child providers, it
	 * will be a string representation of the namespace that they represent.
	 *
	 * @static
	 * @public
	 * @param {Object|function} obj - A ns provider to find the path of.
	 * @returns {string} The ns path that `obj` represents.
	 */
	static getFullNsFor( obj ) {

		// Locals
		let me = this;
		let mySection;

		// See if it was just defined for us (a shortcut)..
		if( obj.$nsProviderMeta !== undefined && obj.$nsProviderMeta.fullNsName !== undefined ) {
			return obj.$nsProviderMeta.fullNsName;
		}

		// Check to see if our object is the root object.
		if( me.isRootProvider( obj ) ) {

			// Check to see if the object exposes a `rootNamespace` property..
			if( obj.rootNamespace !== undefined && obj.rootNamespace !== null ) {

				// It does, so we'll use that...
				return obj.rootNamespace;

			} else {

				// This shouldn't happen..
				return "Unknown";

			}

		}

		// Our object is not the root object, so we'll evaluate
		// its metadata to determine the NS section it provides for.
		if( obj.$nsProviderMeta.provideForNs !== undefined ) {

			// Found the section name..
			mySection = obj.$nsProviderMeta.provideForNs;

		} else {

			// This really shouldn't happen...
			mySection  = "unknownSection";

		}

		// Get the name of our parent namespace (recurse upward)..
		let parentNamespaceName = this.getFullNsFor( obj.$nsProviderMeta.parentProvider );

		// Combine and return
		return parentNamespaceName + "." + mySection;

	}

	/**
	 * Attaches internal metadata to a newly created namespace provider object, which will
	 * always be a `GenericProvider`.
	 *
	 * @public
	 * @static
	 * @param {Core.ns.GenericProvider} obj - The ns provider object to apply metadata to.
	 * @param {Object} metadata - The metadata to apply.
	 * @returns {void}
	 */
	static addMetaToProvider( obj, metadata ) {

		if( !obj.hasOwnProperty( "$nsProviderMeta" ) ) {

			Object.defineProperty( obj, "$nsProviderMeta", {
				enumerable   : false,
				configurable : false,
				writable     : false,
				value        : metadata
			} );

		}

	}

	/**
	 * Gets the cache data for a specific namespace provider, which will be attached to the
	 * root provider in the given providers chain.
	 *
	 * If the cache does not currently exist, it will be created.
	 *
	 * @static
	 * @public
	 * @param {Object|function} obj - A ns provider to find the cache of.
	 * @returns {Object} The cache data for the provided `obj`.
	 */
	static getCacheFor( obj ) {

		// Locals
		let me           = this;
		let rootProvider = me.getRootNsProviderFor( obj );
		let cache        = me.nsProviderCache;

		if( !cache.has( rootProvider ) ) {
			me.initCacheFor( rootProvider );
		}

		return cache.get( rootProvider );

	}

	/**
	 * Creates a cache object for a given namespace provider.
	 *
	 * @static
	 * @public
	 * @param {Object|function} obj - A ns provider to create a cache object for. This ns provider should be a root
	 * provider; its children will share the cache object with their chain.
	 * @returns {void}
	 */
	static initCacheFor( obj ) {

		// Locals
		let me     = this;
		let cache  = this.nsProviderCache;
		let nsName = me.getFullNsFor( obj );

		// Create a new cache
		cache.set( obj, {
			rootNs    : nsName,
			providers : new Map()
		} );

	}

	/**
	 * Instantiates a generic ns provider object as the child of another ns provider object.
	 *
	 * @static
	 * @public
	 * @param {Object|function} parentProvider - The parent ns provider of the new provider.
	 * @param {string} provideForNs - The sub-part of a namespace tree that the new provider should represent.
	 * @returns {Core.ns.GenericProvider} A new ns provider object.
	 */
	static createGenericProvider( parentProvider, provideForNs ) {

		// Locals
		let me = this;

		// Get our namespace name
		let fullNsName = me.getFullNsFor( parentProvider ) + "." + provideForNs;

		// Check the cache for an existing provider
		let cache = me.getCacheFor( parentProvider );
		if( cache.providers.has( fullNsName ) ) {
			return cache.providers.get( fullNsName );
		}

		// Get the generic provider class
		let GenericProviderClass = me.genericProvider;

		// Instantiate
		let genericProvider = new GenericProviderClass();

		// Create metadata for it..
		let gpMetadata = {
			parentProvider, provideForNs, fullNsName
		};

		// Apply the meta
		me.addMetaToProvider( genericProvider, gpMetadata );

		// Apply the proxy
		let proxiedProvider = me.apply( genericProvider, { skipValidation: true } );

		// Add to cache
		cache.providers.set( fullNsName, proxiedProvider );

		// All done...
		return proxiedProvider;

	}

	/**
	 * Calls the `cls()` method on the root ns provider of `obj` and returns the result.
	 * (usually, this will result in a class definition/constructor being returned)
	 *
	 * @static
	 * @public
	 * @param {Object|function} obj - The namespace provider from which a class was requested.
	 * @param {string} className - The name of the class being requested.
	 * @returns {Core.abstract.BaseClass|*} A class definition.
	 */
	static spawnClassEndpoint( obj, className ) {

		// Locals
		let me = this;

		// Get the root namespace provider
		let rootNsProvider = me.getRootNsProviderFor( obj );

		// Resolve the namespace of the target class
		let namespace = me.getFullNsFor( obj );

		// Resolve the full class name, with namespace
		let fullClassName = namespace + "." + className;

		// Call the 'cls()' method on the root provider
		return rootNsProvider.cls( fullClassName );

	}

	/**
	 * The handler that will be used by the Proxies that this class creates.
	 *
	 * @static
	 * @public
	 * @type {Object}
	 */
	static get handler() {

		let applicator = this;

		return {

			get: function( obj, prop ) {

				// Check to see if we should forward the value..
				if( applicator._shouldForwardProp( obj, prop ) ) {
					return obj[ prop ];
				}

				// If we're here, we need to return a virtual value.
				if( ( /^[A-Z]/ ).test( prop ) ) {

					// If the requested property starts with an upper-case
					// letter, then we need to spawn & return a class.
					return applicator.spawnClassEndpoint( obj, prop );

				} else {

					// Otherwise, we need to return a new namespace provider.
					return applicator.createGenericProvider( obj, prop );

				}

			}

		};

	}

	/**
	 * This helper function for the `handler` decides if a `get` property request should be forwarded to the
	 * Proxy target, or if it should be handled as part of a namespace path.
	 *
	 * @static
	 * @private
	 * @param {function|Object} obj - A proxy target object (one that was processed by `apply()`).
	 * @param {string|Symbol} prop - The name of the property being requested.
	 * @returns {boolean} TRUE if the get operation should be forwarded to the target; FALSE otherwise.
	 */
	static _shouldForwardProp( obj, prop ) {

		// For properties that actually exist on our
		// target object, we'll forward them.
		if( prop in obj ) {
			return true;
		}

		// We also don't handle Symbols, so we
		// forward those too...
		if( typeof prop === "symbol" ) {
			return true;
		}

		// Finally, we'll forward some special values...
		if( prop === "inspect" || prop === "prototype" ) {
			return true;
		}

		// Everything else, we'll virtualize...
		return false;

	}

}

module.exports = ProxyApplicator;
