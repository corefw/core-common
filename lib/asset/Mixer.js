/**
 * @file
 * Defines the Core.asset.Mixer class.
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
 * Applies mixins to facilitate multiple inheritance.
 *
 * @memberOf Core.asset
 */
class Mixer {

	constructor() {
		// Do nothing
	}

	/**
	 * Applies multiple inheritance to a base class (a.k.a. "Mixins") and returns the resulting class.
	 *
	 * @public
	 * @param {string} baseClassName - The full, namespaced, class name of the base class.
	 * @param {string[]} mixins - The full, namespaced, class name of each mixin to be applied.
	 * @returns {function} The mixed class definition.
	 */
	mix( baseClassName, ...mixins ) {

		// Locals
		let me = this;

		// Resolve the base class, by name.
		let baseClass = Core.cls( baseClassName );

		// Convert the provided mixins to a Map object.
		let mixinMap = me._createMixinMap( mixins );

		// Initialize the result/return class definition.
		class MixedResult extends baseClass {}

		// Initialize a metadata object containing general information about this `mix()` operation.
		let operationMeta = me._createMixOperationMeta( baseClassName, baseClass, mixinMap );

		// Inject operation metadata as a `$mixinMeta` property in the MixedResult class.
		// (other framework systems will use this property for reflection)
		me._injectOperationMeta( MixedResult, operationMeta );

		// Extend the operation metadata with information about MixedResult
		let mixedResultMeta = me._createMixedResultMeta( MixedResult, operationMeta );

		// Call any $beforeMixin() methods provided by the mixin(s)
		me._executeMixinMethodForAll( {
			methodName      : "$beforeMixin",
			mixedResult     : MixedResult,
			mixins          : mixinMap,
			mixedResultMeta : mixedResultMeta
		} );

		// Iterate over the mixin map
		mixinMap.forEach( function( mixinClass, mixinClassName ) {

			// Create a metadata object specific to this mixin..
			let mixinMeta = me._createMixinMeta( mixinClassName, mixinClass, mixedResultMeta );

			// Copy the static/class properties
			me._copyProperties( MixedResult, mixinClass );

			// Copy the instance properties
			me._copyProperties( MixedResult.prototype, mixinClass.prototype );

			// Execute $mixin methods, if this mixin provides it.
			me._executeMixinMethodForOne( {
				methodName  : "$mixin",
				mixedResult : MixedResult,
				mixinClass  : mixinClass,
				mixinMeta   : mixinMeta
			} );

		} );

		// Call any $afterMixin() methods provided by the mixin(s)
		me._executeMixinMethodForAll( {
			methodName      : "$afterMixin",
			mixedResult     : MixedResult,
			mixins          : mixinMap,
			mixedResultMeta : mixedResultMeta
		} );

		// All done ..
		return MixedResult;

	}

	/**
	 * Copies the inheritable, "own", properties from one object to another.
	 *
	 * @private
	 * @param {Object} target - The object to which the properties will be copied.
	 * @param {Object} source - The object from which the properties will be copied.
	 * @returns {void} All operations are performed "by reference"; the object referenced in the `target`
	 * parameter will be updated.
	 */
	_copyProperties( target, source ) {

		// Locals
		let me               = this;
		let protectedMembers = me._protectedMembers;

		// Iterate over each "owned" property and symbol of the source
		for ( let key of Object.getOwnPropertyNames( source ).concat( Object.getOwnPropertySymbols( source ) ) ) {

			// Exclude these...
			//if ( key !== "constructor" && key !== "prototype" && key !== "name" ) {
			if( !protectedMembers.has( key ) ) {

				// Resolve the property descriptor to ensure an exact copy ...
				let desc = Object.getOwnPropertyDescriptor( source, key );

				// Apply the property to the target
				Object.defineProperty( target, key, desc );

			}

		}

	}

	/**
	 * Stores a list of property keys that will not be copied when applying mixins to classes.
	 *
	 * @access public
	 * @type {Set}
	 */
	get _protectedMembers() {

		if( this.__protectedMembers === undefined ) {
			this.__protectedMembers = new Set(
				[
					"constructor",
					"prototype",
					"name",
					"$amClassName",
					"$mixinMeta",
					"$beforeMixin",
					"$mixin",
					"$afterMixin",
					"$beforeConstruct",
					"$construct",
					"$afterConstruct",
					"$beforeReady",
					"$afterReady"
				]
			);
		}
		return this.__protectedMembers;

	}

	/**
	 * Converts an array of mixin class names into a Map of mixin class objects.
	 *
	 * @private
	 * @param {Array<string>} mixinClassNames - An array of full, namespaced, mixin class names.
	 * @returns {MixinMap} All of the mixins specified in `mixinClassNames`, resolved to constructor
	 * functions, and returned as a Map.
	 */
	_createMixinMap( mixinClassNames ) {

		// Locals
		let mixinMap = new Map();

		// Iterate over each mixin and apply it to MixedResult
		for ( let mixinClassName of mixinClassNames ) {

			// Resolve the mixin class/constructor
			let MixinClass = Core.cls( mixinClassName );

			// Add the mixin to our Map
			mixinMap.set( mixinClassName, MixinClass );

		}

		// All done ..
		return mixinMap;

	}


	// <editor-fold desc="--- Mixin Metadata Creation & Injection ----------------------------------------------------">



	/**
	 * Creates an object and populates it with mixin metadata that is applicable class/object wide.
	 * i.e. The metadata object will be constructed within a context that is NOT specific to an individual mixin.
	 *
	 * The main reason that this method exists is to facilitate consistency in mixin metadata objects.
	 *
	 * @private
	 * @param {string} baseClassName - The full, namespaced, name of the class that mixins are being applied to.
	 * @param {function} baseClass - The constructor of the class that mixins are being applied to.
	 * @param {MixinMap} mixins - A Map() containing all of the mixins being applied by the mixer (at the current level).
	 * @returns {MixOperationMetadata} The metadata object that was created.
	 */
	_createMixOperationMeta( baseClassName, baseClass, mixins ) {

		let baseProto = baseClass.prototype;

		return {
			baseClassName, baseClass, baseProto, mixins
		};

	}

	/**
	 * Extends a `MixOperationMetadata` object with information about the `MixedResult` class that was produced.
	 *
	 * @private
	 * @param {MixedResult} mixedResult - The constructor for a 'MixedResult' class being built by the mixer.
	 * @param {MixOperationMetadata} operationMeta - A special metadata object that was produced by {@link `_createMixOperationMeta`}.
	 * @returns {MixedResultMetadata} The metadata object that was created.
	 */
	_createMixedResultMeta( mixedResult, operationMeta ) {

		let mixedProto = mixedResult.prototype;

		return _.merge( {}, operationMeta, {
			mixedResult, mixedProto
		} );

	}

	/**
	 * Extends a `MixedResultMetadata` object with information about a specific mixin.
	 *
	 * @private
	 * @param {string} mixinClassName - The full, namespaced, name of a mixin that is being applied.
	 * @param {function} mixinClass - The class/constructor function for a mixin that is being applied.
	 * @param {MixedResultMetadata} mixedResultMeta - A special metadata object that was produced by {@link `_createMixedResultMeta`}.
	 * @returns {MixinMetadata} The metadata object that was created.
	 */
	_createMixinMeta( mixinClassName, mixinClass, mixedResultMeta ) {

		let mixinProto = mixinClass.prototype;

		return _.merge( {}, mixedResultMeta, {
			mixinClassName,	mixinClass,	mixinProto
		} );

	}

	/**
	 * Extends a `MixinMetadata` object with information about a specific method and a single invocation.
	 *
	 * @private
	 * @param {string} methodName - The name of the method being invoked.
	 * @param {function} methodRef - The method being invoked.
	 * @param {MixinMetadata} mixinMeta - A special metadata object that was produced by {@link `_createMixinMeta`}.
	 * @returns {MixinMethodMeta} The metadata object that was created.
	 */
	_createMethodInvocationMeta( methodName, methodRef, mixinMeta ) {

		return _.merge( {}, mixinMeta, {
			methodName, methodRef
		} );

	}

	/**
	 * Injects mix operation metadata as a `$mixinMeta` property in mixed classes.
	 *
	 * @private
	 * @param {MixedResult} MixedResult - The constructor for a 'MixedResult' class being built by the mixer.
	 * @param {MixOperationMetadata} operationMeta - A special metadata object that was produced by {@link `_createMixOperationMeta`}.
	 * @returns {void}
	 */
	_injectOperationMeta( MixedResult, operationMeta ) {

		// Create the mixin metadata
		Object.defineProperty( MixedResult.prototype, "$mixinMeta", {
			value        : operationMeta,
			writable     : false,
			configurable : false,
			enumerable   : false,
		} );

	}




	// </editor-fold>


	/**
	 * Executes one of the special mixin methods on a single mixin, if it provides it.
	 *
	 * @private
	 * @param {Object} opts - Execution options.
	 * @param {string} opts.methodName - The function to check for and, if found, invoke.
	 * @param {function} opts.mixinClass - The constructor for the mixin being applied.
	 * @param {MixedResult} opts.mixedResult - The MixedResult class being constructed; its prototype will be used
	 * as the scope (`this`) in the method being called.
	 * @param {MixinMetadata} opts.mixinMeta - Metadata for the mixin being applied.
	 * @returns {*} The value returned by the function that was executed or NULL if no function was executed.
	 */
	_executeMixinMethodForOne( opts ) {

		// Locals
		let me = this;
		let ret = null;

		// Extract the options
		const { methodName, mixedResult, mixinClass, mixinMeta } = opts;

		// Does our target mixin have the method?
		if( TIPE( mixinClass.prototype[ methodName ] ) === "function" ) {

			// Capture a reference to the function
			let methodRef = mixinClass.prototype[ methodName ];

			// Create a metadata object specific to this method/invocation
			let methodMeta = me._createMethodInvocationMeta( methodName, methodRef, mixinMeta );

			// Invoke
			ret = methodRef.apply( mixedResult.prototype, [ methodMeta ] );

		}

		// Done
		return ret;

	}

	/**
	 * Executes one of the special mixin methods on a single mixin, if it provides it.
	 *
	 * @private
	 * @param {Object} opts - Execution options.
	 * @param {string} opts.methodName - The function to check for and, if found, invoke.
	 * @param {MixinMap} opts.mixins - A Map containing all of the mixins to check for the method.
	 * @param {MixedResult} opts.mixedResult - The MixedResult class being constructed; its prototype will be used
	 * as the scope (`this`) in the method being called.
	 * @param {MixedResultMetadata} opts.mixedResultMeta - Metadata for the MixedResult class being created.
	 * @returns {Map<string,*>} All of the values returned by the invoked methods, in a Map, keyed with the full, namespaced,
	 * class name of the mixin called.
	 */
	_executeMixinMethodForAll( opts ) {

		// Locals
		let me = this;
		let ret = new Map();

		// Extract the options
		const { methodName, mixedResult, mixins, mixedResultMeta } = opts;

		// Iterate over the mixin map
		mixins.forEach( function( mixinClass, mixinClassName ) {

			// Create a metadata object specific to this mixin..
			let mixinMeta = me._createMixinMeta( mixinClassName, mixinClass, mixedResultMeta );

			// Execute $mixin methods, if this mixin provides it.
			let result = me._executeMixinMethodForOne( {
				methodName  : methodName,
				mixedResult : mixedResult,
				mixinClass  : mixinClass,
				mixinMeta   : mixinMeta
			} );

			// Add the return value to our Map
			ret.set( mixinClassName, result );

		} );

		// Done
		return ret;

	}

}

module.exports = Mixer;


/**
 * A Map containing mixin classes/constructors, keyed with the full, namespaced, class names for each mixin.
 *
 * @typedef {Map<string,function>} MixinMap
 */

/**
 * The constructor for a class that was created by applying one or more mixins to a base class in a
 * single `mix()` operation.
 *
 * @typedef {function} MixedResult
 */

/**
 * A plain object containing mixin metadata for a single `mix()` operation. The metadata in this object will
 * contain general mixin information for a MixedResult class; it will not be contextualized to a specific mixin
 * or mixin member.
 *
 * Metadata Tree: `MixOperationMetadata (Root Meta)`
 *
 * @typedef {Object} MixOperationMetadata
 * @property {string} baseClassName - The full, namespaced, name of the class that mixins are being applied to.
 * @property {function} baseClass - The constructor of the class that mixins are being applied to.
 * @property {Object} baseProto - The prototype of the base class; identical to `baseClass.prototype`.
 * @property {Map<string,function>} mixins - A Map() containing all of the mixins being applied by the mixer.
 */

/**
 * A plain object containing mixin metadata for a single MixedResult class. This metadata object extends
 * the `MixOperationMetadata` by including information about the MixedResult.
 *
 * Metadata Tree: `MixOperationMetadata -> MixedResultMetadata`
 *
 * @typedef {Object} MixedResultMetadata
 * @property {string} baseClassName - The full, namespaced, name of the class that mixins are being applied to.
 * @property {function} baseClass - The constructor of the class that mixins are being applied to.
 * @property {Object} baseProto - The prototype of the base class; identical to `baseClass.prototype`.
 * @property {MixinMap} mixins - A Map() containing all of the mixins being applied by the mixer.
 * @property {MixedResult} mixedResult - The constructor of the MixedResult class that was produced in `mix()` operation.
 * @property {Object} mixedProto - The prototype of the `mixedResult`; identical to `mixedResult.prototype`.
 */

/**
 * A plain object containing mixin metadata contextualized for a single mixin being applied in a `mix()` operation.
 * This metadata object extends the `MixedResultMetadata` by including information about the specific mixin.
 *
 * Metadata Tree: `MixOperationMetadata -> MixedResultMetadata -> MixinMetadata`
 *
 * @typedef {Object} MixinMetadata
 * @property {string} baseClassName - The full, namespaced, name of the class that mixins are being applied to.
 * @property {function} baseClass - The constructor of the class that mixins are being applied to.
 * @property {Object} baseProto - The prototype of the base class; identical to `baseClass.prototype`.
 * @property {MixinMap} mixins - A Map() containing all of the mixins being applied by the mixer.
 * @property {MixedResult} mixedResult - The constructor of the MixedResult class that was produced in `mix()` operation.
 * @property {Object} mixedProto - The prototype of the `mixedResult`; identical to `mixedResult.prototype`.
 * @property {string} mixinClassName - The full, namespaced, name of a mixin that is being applied.
 * @property {function} mixinClass - The constructor of a mixin that is being applied.
 * @property {Object} mixinProto - The prototype of the mixin; identical to `mixinClass.prototype`.
 */


/**
 * A plain object containing mixin metadata contextualized for a single mixin method invocation.
 * This metadata object extends the `MixinMetadata` by including information about a specific method.
 *
 * Metadata Tree: `MixOperationMetadata -> MixedResultMetadata -> MixinMetadata -> MixinMethodMeta`
 *
 * @typedef {Object} MixinMethodMeta
 * @property {string} baseClassName - The full, namespaced, name of the class that mixins are being applied to.
 * @property {function} baseClass - The constructor of the class that mixins are being applied to.
 * @property {Object} baseProto - The prototype of the base class; identical to `baseClass.prototype`.
 * @property {MixinMap} mixins - A Map() containing all of the mixins being applied by the mixer.
 * @property {MixedResult} mixedResult - The constructor of the MixedResult class that was produced in `mix()` operation.
 * @property {Object} mixedProto - The prototype of the `mixedResult`; identical to `mixedResult.prototype`.
 * @property {string} mixinClassName - The full, namespaced, name of a mixin that is being applied.
 * @property {function} mixinClass - The constructor of a mixin that is being applied.
 * @property {Object} mixinProto - The prototype of the mixin; identical to `mixinClass.prototype`.
 * @property {string} methodName - The name of the method being invoked.
 * @property {function} methodRef - A reference of the method being invoked.
 */
