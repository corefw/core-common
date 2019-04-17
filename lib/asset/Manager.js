/**
 * @file
 * Defines the Core.asset.Manager class.
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
const PATH	= require( "path" );

/**
 * Manages the loading of dependencies and classes for applications that implement the Core Framework.
 *
 * @memberOf Core.asset
 */
class Manager {

	constructor() {
		this._initDependencyContainer();
		this._initNamespaceContainer();
		this._initClassCache();
	}



	// <editor-fold desc="--- Dependency Management ------------------------------------------------------------------">



	/**
	 * Initializes the dependency container, which serves as a lazy-loading
	 * and caching mechanism for all dependencies available to the applications
	 * built on the Core Framework.
	 *
	 * This method is called once, and exclusively, by the constructor.
	 *
	 * @private
	 * @returns {void}
	 */
	_initDependencyContainer() {
		this.clearDependencyContainer();
	}

	/**
	 * Clears the dependency cache, allowing dependencies to be redefined.
	 * Importantly, however, this does not necessary "invalidate" the internal
	 * cache created by the `require()` built-in, so dependencies will not,
	 * necessarily, be reloaded without additional measures being taken to
	 * invalidate the built-in cache.
	 *
	 * @public
	 * @returns {void}
	 */
	clearDependencyContainer() {
		this._deps = {};
	}

	/**
	 * Registers one or more dependencies. This method is a proxy for the `registerDependency`
	 * method; it adds convenience by allowing multiple dependencies to be specified and
	 * registered with a single call.
	 *
	 * @public
	 * @param {Object.<string,function>} deps - An object defining one or more dependency loading functions, whereby
	 * each key of the object is the name of a dependency and each value is a function that can be used to lazy-load
	 * that dependency.
	 * @returns {void}
	 */
	registerDependencies( deps ) {

		// Locals
		let me = this;

		// Iterate over each dependency
		_.each( deps, function ( lib, name ) {
			me.registerDependency( name, lib );
		} );

	}

	/**
	 * Registers one dependency for use by Core Framework applications via the `dep()` method.
	 *
	 * @public
	 * @param {string} name - The name of the dependency being registered.
	 * @param {function} fn - A function that returns the fully initialized dependency (promotes lazy loading).
	 * @returns {void}
	 */
	registerDependency( name, fn ) {

		// Locals
		let me = this;
		let deps = me._deps;

		// Register the dep
		deps[ name ] = {
			isLoaded : false,
			loaderFn : fn,
			cache    : null,
			isAlias  : false,
			aliasFor : null,
			mock     : null,
		};

	}

	/**
	 * Registers one or more dependency aliases. This method is a proxy for the `addDependencyAlias`
	 * method; it adds convenience by allowing multiple aliases to be specified and registered with
	 * a single call.
	 *
	 * @public
	 * @param {Object.<string,string|string[]>} aliases - An object defining one or more aliases for
	 * existing dependencies. The keys should reference existing dependency names and the values
	 * can be either a string (to add a single alias) or an array of strings (to add multiple aliases).
	 * @returns {void}
	 */
	addDependencyAliases( aliases ) {

		// Locals
		let me 		= this;

		// Iterate over each alias
		_.each( aliases, function( alias, name ) {
			me.addDependencyAlias( name, alias );
		} );

	}

	/**
	 * Adds an alias for an existing dependency, for convenience and refactorability.
	 *
	 * @public
	 * @param {string} name - The name of the existing dependency.
	 * @param {string|string[]} alias - An alias, or an array of aliases, to be added.
	 * @returns {void}
	 */
	addDependencyAlias( name, alias ) {

		// Locals
		let me 		= this;
		let deps 	= me._deps;

		// If an array of aliases is passed in,
		// we'll iterate and pass each alias into
		// a separate call of this method.
		if( TIPE( alias ) === "array" ) {

			_.each( alias, function( oneAlias ) {
				me.addDependencyAlias( name, oneAlias );
			} );

		} else {

			// Otherwise, we register the alias directly..
			deps[ alias ] = {
				isAlias  : true,
				aliasFor : name,
				isLoaded : false,
				loaderFn : null,
				cache    : null,
				mock     : null,
			};

		}

	}

	/**
	 * Clears the dependency cache data. Assuming that the Node.js require() cache has
	 * also been cleared/invalidated (which is not handled by this method), then calling
	 * this method will cause all dependencies to be reloaded upon their next inclusion.
	 *
	 * @public
	 * @returns {void}
	 */
	clearDependencyCache() {

		// Locals
		let me 		= this;
		let deps 	= me._deps;

		// Clear the cache for each dep
		_.each( deps, function( dep ) {

			dep.cache    = null;
			dep.mock  	 = null;
			dep.isLoaded = false;

		} );

	}

	/**
	 * Loads a single [external] dependency.
	 *
	 * @param {string} name - The name of the dependency to load.
	 * @returns {*} The dependency, as provided by the dependency's `loaderFn()`.
	 */
	dep( name ) {

		// Locals
		let me = this;
		let deps = me._deps;
		let dep;

		// Check for existence
		if( !deps[ name ] ) {
			throw new Error( `Unknown dependency ('${name}') requested in Core.asset.Manager::dep().` );
		} else {
			dep = deps[ name ];
		}

		// Check for an alias
		if( dep.isAlias === true ) {
			return me.dep( dep.aliasFor );
		}

		// Check for cache
		if( dep.isLoaded === true ) {
			return dep.cache;
		}

		// todo: check for mock

		// Load the dep
		let ret = dep.loaderFn.apply( me, [ me ] );

		// Cache the dep
		dep.cache    = ret;
		dep.isLoaded = true;

		// Return it...
		return ret;

	}

	/**
	 * Loads multiple dependencies; useful for using a dereferencing syntax.
	 * This method defers the dependency loading logic to `dep()`.
	 *
	 * @example
	 * const { _, TIPE } = Core.deps( "_", "tipe" );
	 *
	 * @example
	 * let deps   = Core.deps( [ "lodash", "tipe" ] );
	 * const _    = deps.lodash;
	 * const TIPE = deps.tipe;
	 *
	 * @public
	 * @param {string[]} names - One or more dependencies to load. Each parameter can be a string or an
	 * array of strings (or an array of array of strings).
	 * @returns {Object} A key/value object with each dependency name as keys.
	 */
	deps( ...names ) {

		// Locals
		let me = this;
		let ret = {};

		// Flatten (this will allow arrays, of
		// any depth, to be passed in)
		names = _.flattenDeep( names );

		// Iterate & build the return..
		_.each( names, function( name ) {

			// Resolve dep
			let dep = me.dep( name );

			// Persist the dep verbatim
			ret[ name ] = dep;

			// We also return the dependency name in upper-case, with dashes replaced with underscores,
			// to promote using this method with destructuring while maintaining our convention
			// of making module dependencies UPPER_CASE.
			let nameForDestructuring = name.toUpperCase().replace( /[^a-zA-Z0-9]+/, "_" );
			ret[ nameForDestructuring ] = dep;

		} );

		return ret;

	}



	// </editor-fold>

	// <editor-fold desc="--- Namespace Registration -----------------------------------------------------------------">



	/**
	 * Initializes the namespace container, which provides namespace to directory
	 * mapping information that is used for resolving the path of framework classes
	 * by full, namespaced, class name.
	 *
	 * This method is called once, and exclusively, by the constructor.
	 *
	 * @private
	 * @returns {void}
	 */
	_initNamespaceContainer() {
		this.clearNamespaceContainer();
	}

	/**
	 * Clears/resets the namespace container.
	 *
	 * @private
	 * @returns {void}
	 */
	clearNamespaceContainer() {
		this._namespaces = [];
	}

	/**
	 * This utility method is used to ensure that namespace prefixes (e.g. "Core.abstract") are
	 * stored in a consistent format.
	 *
	 * @example
	 * this._normalizeNamespacePrefix( "Core.abstract." );  // Core.abstract
	 *
	 * @private
	 * @param {string} nsPrefix - A namespace prefix to normalize.
	 * @returns {string} The provided namespace prefix, after normalization.
	 */
	_normalizeNamespacePrefix( nsPrefix ) {

		// Remove periods/dots from the start
		// and end of the prefix string.
		nsPrefix = nsPrefix.replace( /(^\.|\.$)+/ig, "" );

		// Done
		return nsPrefix;

	}

	/**
	 * Sorts the namespace container, usually after a namespace prefix has been added, to ensure
	 * that more specific namespace prefixes resolve before less specific namespace prefixes.
	 *
	 * @private
	 * @returns {void}
	 */
	_sortNamespaceContainer() {

		// Locals
		let me = this;

		/**
		 * This helper function sorts the namespace container by the length of the namespace
		 * prefix, with longer prefixes coming first, under the assumption that longer
		 * prefixes are more specific than shorter ones.
		 *
		 * @private
		 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
		 * @param {Object} a - An element from the namespace container
		 * @param {Object} b - Another element from the namespace container, which will be compared to element provided
		 * in the `a` parameter.
		 * @returns {number} The comparison result
		 */
		function nsSortFn( a, b ) {

			if( a.prefix.length > b.prefix.length ) {
				return -1;
			} else {
				return 1;
			}

		}

		// Apply the helper function
		me._namespaces = me._namespaces.sort( nsSortFn );

	}

	/**
	 * Registers a single namespace prefix in the namespace container.
	 *
	 * @public
	 * @param {string} nsPrefix - The namespace prefix to register.
	 * @param {string|string[]} path - An absolute path, or an array of path elements that will be passed to
	 * the Node.js `path` module's `join` function.
	 * @returns {void}
	 */
	registerNamespace( nsPrefix, path ) {

		// Locals
		let me = this;

		// If an array is passed for 'path', then
		// we'll need to join the path, first.
		if( TIPE( path ) === "array" ) {
			path = PATH.join.apply( null, path );
		}

		// Normalize using 'resolve', for consistency
		path = PATH.resolve( path );

		// Normalize the namespace name
		nsPrefix = me._normalizeNamespacePrefix( nsPrefix );

		// If this exact prefix has already been defined, we'll
		// remove it so that the new settings will overwrite
		// the existing settings (and not create a duplicate).
		me.removeExactNsPrefix( nsPrefix );

		// Store the namespace
		me._namespaces.push( {
			prefix : nsPrefix,
			path   : path,
		} );

		// Sort the namespaces
		me._sortNamespaceContainer();

	}

	/**
	 * Removes a single entry from the namespace store, if an exact prefix match can be made.
	 *
	 * @public
	 * @param {string} nsPrefix - The namespace prefix to search for and remove.
	 * @returns {boolean} TRUE if a prefix was removed; FALSE if a match could not be found.
	 */
	removeExactNsPrefix( nsPrefix ) {

		// Locals
		let me = this;
		let hasMatch = false;

		// Normalize the namespace name
		nsPrefix = me._normalizeNamespacePrefix( nsPrefix );

		// Filter
		me._namespaces = _.filter( me._namespaces, function( item ) {

			if( hasMatch ) {

				// This method can only remove exactly ONE namespace entry.
				// So, we'll always return TRUE after the first match.
				return true;

			} else if( nsPrefix === item.prefix ) {

				// We found a match..
				hasMatch = true;

				// Return FALSE to filter this one out.
				return false;

			} else {

				// Doesn't match; keep it.
				return true;

			}

		} );

		// All done
		return hasMatch;

	}

	/**
	 * Removes matching namespace prefixes from the namespace store.
	 *
	 * @public
	 * @param {RegExp|string} match - A variable to compare namespace prefixes to. If a string is provided, namespaces
	 * that START WITH the provided string will be removed. If a regular expression is provided, then it will be
	 * evaluated against each namespace prefix in the store and all matching prefixes will be removed.
	 * @returns {boolean} TRUE if any prefixes were removed; FALSE if no matches could be made.
	 */
	removeMatchingNsPrefixes( match ) {

		// Locals
		let me = this;
		let hasMatches = false;

		// Branch the logic based on the type of 'match'
		switch( TIPE( match ) ) {

			case "string":

				// We'll convert strings to a regular expression..
				match = RegExp( "^" + match );
				break;

			case "regexp":

				// Regular expression objects can pass straight through ..
				break;

			default:

				// Everything else throws an error
				throw new Error( "Invalid 'match' parameter passed to Core.asset.Manager::removeMatchingNsPrefixes(). A string or a RegExp was expected but a variable with type '" + TIPE( match ) + "' was provided." );

		}

		// Filter
		me._namespaces = _.filter( me._namespaces, function( item ) {

			// Test the regex
			if( match.test( item.prefix ) ) {

				// We need to keep track of the fact that
				// we found a match, so that we can return
				// at the end of the remove op.
				hasMatches = true;

				// We want to remove any items that match,
				// so we need to return false.
				return false;

			} else {

				// It did not match, and we want to keep it,
				// so return TRUE for this item.
				return true;

			}

		} );

		// All done
		return hasMatches;

	}


	// </editor-fold>

	// <editor-fold desc="--- Class Resolution & Loading -------------------------------------------------------------">



	/**
	 * Initializes the class cache, which is used to reduce the burden of class path resolution
	 * by storing the results of previous `getClass()` requests.
	 *
	 * This method is called once, and exclusively, by the constructor.
	 *
	 * @private
	 * @returns {void}
	 */
	_initClassCache() {
		this.clearClassCache();
	}

	/**
	 * Clears the class cache.
	 *
	 * @private
	 * @returns {void}
	 */
	clearClassCache() {
		this._classCache = {};
	}

	/**
	 * Loads and returns a Core Framework class definition.
	 *
	 * @public
	 * @param {string|function|Object} className - The full, namespaced, name of the class that should be loaded.
	 * If a function is passed in, it will be assumed to be a "Class", and will be returned verbatim. Similarly, if
	 * an object is passed it, in will be assumed to be an instance of a class, and its constructor will be returned.
	 * @returns {function} The requested class definition (constructor function).
	 */
	getClass( className ) {

		// Locals
		let me = this;

		// Depending on the type of our `className` variable,
		// we'll need to take different steps.
		let cnType = TIPE( className );
		switch( cnType ) {

			case "string":
				return me._getClassByName( className );

			case "object":
				if( TIPE( className.constructor ) !== "function" ) {
					throw new Error( "Invalid parameter passed to Core.asset.Manager::getClass(). The object passed to the 'className' parameter does not have a constructor (aka class definition), probably because it is not a valid class instance." );
				} else {
					return className.constructor;
				}

			case "function":
				return className;

			default:
				throw new Error( "Invalid parameter passed to Core.asset.Manager::getClass(). The 'className' parameter expects a String, a Function, or an Object, but a variable with type '" + cnType + "' was provided." );

		}

	}

	/**
	 * Loads and returns a Core Framework class definition.
	 *
	 * @public
	 * @param {string} className - The full, namespaced, name of the class that should be loaded.
	 * @returns {Core.abstract.BaseClass} The requested class definition.
	 */
	_getClassByName( className ) {

		// Locals
		let me = this;

		// Check the cache
		if( me._classCache[ className ] !== undefined ) {
			return me._classCache[ className ];
		}

		// Resolve the class path
		let classPath = me._resolveClassPath( className );

		// Load the definition
		let def = require( classPath );

		// Inform the class of its full name via a non-enumerable property.
		if( def.$amClassName === undefined ) {
			Object.defineProperty( def.prototype, "$amClassName", {
				value        : className,
				writable     : true,
				configurable : false,
				enumerable   : false,
			} );
		} else {
			def.$amClassName = className;
		}


		// Cache the definition
		me._classCache[ className ] = def;

		// Return it
		return def;

	}

	/**
	 * Resolves the local, absolute, file path for a class definition file.
	 *
	 * @private
	 * @param {string} className - The full, namespaced, name of the class that the path should be resolved for.
	 * @returns {string} The absolute path to the class definition.
	 */
	_resolveClassPath( className ) {

		// Locals
		let me = this;

		// Resolve the namespace
		let ns = me._resolveNamespacePrefix( className );

		// Remove the matched prefix from the full class name
		let classSuffix = className.substr( ns.prefix.length );

		// Remove any extra dots from the start and end of the suffix
		classSuffix = classSuffix.replace( /(^\.|\.$)+/ig, "" );

		// Convert the suffix into a path by replacing the dots
		// with slashes and appending the .js file extension
		let relClassPath = classSuffix.replace( /\.+/g, PATH.sep ) + ".js";

		// Finally, resolve the absolute path using path.join
		return PATH.join( ns.path, relClassPath );

	}

	/**
	 * Resolves the namespace prefix information for a given class.
	 *
	 * @private
	 * @throws Error if no registered namespaces could be matched by prefix.
	 * @param {string} fullClassName - The full, namespaced, name of a Core Framework class.
	 * @returns {Object} Class namespace information.
	 */
	_resolveNamespacePrefix( fullClassName ) {

		// Locals
		let me = this;
		let ret = null;

		// Find the first, matching, namespace prefix
		_.each( me._namespaces, function( ns ) {

			if( _.startsWith( fullClassName, ns.prefix ) ) {
				ret = ns;
				return false;
			} else {
				return true;
			}

		} );

		// Error if we could not find a prefix...
		if( ret === null ) {
			throw new Error( `Core Framework Error: No registered namespaces were matched for the requested class definition ('${fullClassName}').` );
		}

		// Otherwise, return it..
		return ret;

	}

	/**
	 * A convenience alias for the `getClass` method.
	 *
	 * @public
	 * @param {string} className - The full, namespaced, name of the class that should be loaded.
	 * @returns {Core.abstract.BaseClass} The requested class definition.
	 */
	cls( className ) {
		return this.getClass( className );
	}

	// </editor-fold>

}

module.exports = Manager;
