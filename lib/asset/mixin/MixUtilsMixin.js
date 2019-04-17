/**
 * @file
 * Defines the `Core.asset.mixin.MixUtilsMixin` mixin.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

// Load dependencies using the Core Framework
const { _, TIPE } = Core.deps( "_", "tipe" );

/**
 * Provides the `$mixin` property which contains a number of useful methods for interacting with mixins,
 * mixed parent classes, and their members. This mixin is applied at the `Core.abstract.Component` level to ensure that
 * virtually all Framework classes will have access to the functionality that it provides.
 *
 * @memberOf Core.asset.mixin
 */
class MixUtilsMixin {

	get $mixins() {

		// Locals
		let target = this;

		// Define and return the helper object.
		const utils = {

			// <editor-fold desc="--- Mixin Metadata ($mixinMeta) ----------------------------------------------------">



			/**
			 * An array of all mixin metadata objects (`$mixinMeta`) from all ancestors in the prototype chain, ordered
			 * from the child class to the eldest ancestor.
			 *
			 * @access public
			 * @type {Object[]}
			 */
			get metaChain() {
				return Core.classInspector.getPropertyChain( target, "$mixinMeta", false );
			},

			/**
			 * An array of all mixin metadata objects (`$mixinMeta`) from all ancestors in the prototype chain, ordered
			 * from the eldest ancestor to the child class.
			 *
			 * @access public
			 * @type {Object[]}
			 */
			get metaChainInverted() {
				return Core.classInspector.getPropertyChain( target, "$mixinMeta", true );
			},




			// </editor-fold>

			// <editor-fold desc="--- Mixin Reflection ---------------------------------------------------------------">



			/**
			 * Returns a list (Map) of the prototypes of all mixins affecting the target class, regardless of where the
			 * mixins were applied in the hierarchy.
			 *
			 * The list will be ordered based on the application/mix order of the mixins, with the eldest ancestor's
			 * first mixin being first and the direct parent's last mixin being last.
			 *
			 * @access public
			 * @type {Map<string,Object>}
			 */
			get all() {

				// Initialize the return
				let ret = new Map();

				// We use `metaChainInverted` (as opposed to `metaChain`) because we want the
				// mixins to be ordered from eldest to newest.
				_.each( utils.metaChainInverted, function( mixinMeta ) {

					if( mixinMeta.mixins !== undefined && mixinMeta.mixins !== null ) {

						mixinMeta.mixins.forEach( function( mixinConstructor, mixinClassName ) {

							if( !ret.has( mixinClassName ) ) {
								ret.set( mixinClassName, mixinConstructor.prototype );
							}

						} );

					}

				} );

				// Done
				return ret;

			},

			/**
			 * Returns a list (Set) of names of all mixins affecting the target class, regardless of where
			 * the mixins were applied in the hierarchy.
			 *
			 * The list will be ordered based on the application/mix order of the mixins, with the eldest parent's
			 * first mixin being first and the target classes last mixin being last.
			 *
			 * @access public
			 * @type {Set<string>}
			 */
			get names() {
				return new Set( utils.all.keys() );
			},

			/**
			 * Gets the prototype for one of the mixins that have been applied to the target.
			 *
			 * Note: This method simply forks the logic based on the type of the `mixinName`; strings will be
			 * deferred to `_getMixinWithName` and RegExp objects will be deferred to `_getMixinMatching`.
			 *
			 * @public
			 * @param {string|RegExp} mixinName - Either a fully pathed mixin name, as a string, which will be checked
			 * against the list of mixins for an exact match, or a regular expression to check against all of the
			 * mixin names for THE FIRST match.
			 * @returns {Object} If a string is provided for `mixinName` and it matches, exactly, one of the names
			 * of the mixins that have been applied to the target, or if a regular expression is provided, and it
			 * matches ANY of the names of the mixins that have been applied to the target, then the FIRST matching
			 * mixin's prototype will be returned. Otherwise, NULL will be returned to indicate that no match was found.
			 */
			get( mixinName ) {

				switch( TIPE( mixinName ) ) {

					case "string":
						return utils._getMixinWithName( mixinName );

					case "regexp":
						return utils._getMixinMatching( mixinName );

					default:
						throw new Error( "Invalid `mixinName` passed to $mixins.get(); a string or a RegExp was expected but a variable with type '" + TIPE( mixinName ) + "' was provided." );

				}

			},

			/**
			 * Gets the prototype for one of the mixins that have been applied to the target.
			 *
			 * @public
			 * @param {string|RegExp} mixinName - A fully pathed mixin name, as a string, which will be checked
			 * against the list of mixins for an exact match.
			 * @returns {boolean} If a string is provided for `mixinName` and it matches, exactly, one of the names
			 * of the mixins that have been applied to the target then the prototype for the matching mixin will be
			 * returned. Otherwise, NULL will be returned to indicate that no match was found.
			 */
			_getMixinWithName( mixinName ) {

				// Get our mixins..
				let mixins = utils.all;

				// Exit early?
				if( !mixins.has( mixinName ) ) {
					return null;
				} else {
					return mixins.get( mixinName );
				}

			},

			/**
			 * Gets the prototype for one of the mixins that have been applied to the target.
			 *
			 * @public
			 * @param {string|RegExp} regx - A regular expression to check against all of the mixin names for
			 * THE FIRST match.
			 * @returns {boolean} If the provided regular expression  matches ANY of the names of the mixins that have
			 * been applied to the target, then the prototype for FIRST matching mixin will be returned. Otherwise,
			 * NULL will be returned to indicate that no match was found.
			 */
			_getMixinMatching( regx ) {

				// Init the return
				let hasMatches   = false;
				let matchedMixin = null;

				// Iterate over the mixin names
				utils.all.forEach( function( mixin, name ) {

					if( !hasMatches && regx.test( name ) === true ) {
						hasMatches = true;
						matchedMixin = mixin;
					}

				} );

				// Done
				return matchedMixin;

			},

			/**
			 * Checks to see if a mixin has been applied to the target object.
			 *
			 * Note: Regex comparisons will be deferred to `_hasMatch`.
			 *
			 * @public
			 * @param {string|RegExp} mixinName - Either a fully pathed mixin name, as a string, which will be checked
			 * against the list of mixins for an exact match,  or a regular expression to check against all of the
			 * mixin names for ANY matches.
			 * @returns {boolean} If a string is provided for `mixinName` and it matches, exactly, one of the names
			 * of the mixins that have been applied to the target, or if a regular expression is provided, and it
			 * matches ANY of the names of the mixins that have been applied to the target, then TRUE will be returned.
			 * Otherwise, FALSE will be returned to indicate that no match was found.
			 */
			has( mixinName ) {

				switch( TIPE( mixinName ) ) {

					case "string":
						return utils.names.has( mixinName );

					case "regexp":
						return utils._hasMatch( mixinName );

					default:
						throw new Error( "Invalid `mixinName` passed to $mixins.has(); a string or a RegExp was expected but a variable with type '" + TIPE( mixinName ) + "' was provided." );

				}

			},

			/**
			 * Checks to see if a mixin has been applied to the target object.
			 *
			 * Note: Do not call this method directly; use `has()` instead.
			 *
			 * @public
			 * @param {string|RegExp} regx - A regular expression to check against all of the mixin names for ANY matches.
			 * @returns {boolean} If the provided regular expression matches ANY of the names of the mixins that have
			 * been applied to the target, then TRUE will be returned. Otherwise, FALSE will be returned to indicate
			 * that no match was found.
			 */
			_hasMatch( regx ) {

				// Init the return
				let hasMatches = false;

				// Iterate over the mixin names
				utils.names.forEach( function( name ) {

					if( regx.test( name ) === true ) {
						hasMatches = true;
					}

				} );

				// Done
				return hasMatches;

			},





			// </editor-fold>

			// <editor-fold desc="--- Method Chains ------------------------------------------------------------------">



			/**
			 * Returns a list (Set) of all methods, for all mixins affecting the target, with a given name.
			 * Although there may be other use cases for this method, its primary purpose is to facilitate the
			 * execution of some of the special mixin instance methods, such as `$construct`, `$beforeReady`, etc..
			 *
			 * The list will be ordered based on the application/mix order of the mixins, with the eldest ancestor's
			 * first mixin being first and the target classes' last mixin being last.
			 *
			 * @public
			 * @param {string} methodName - The name of the method to find in each mixin.
			 * @returns {Set<function>} All matching methods
			 */
			getMethodChain( methodName ) {

				// Get all mixins
				let mixins = utils.all;
				let ret    = new Set();

				// Iterate over each mixin
				mixins.forEach( function( mixin, mixinName ) {

					if( TIPE( mixin[ methodName ] ) === "function" ) {
						ret.add( mixin[ methodName ] );
					}

				} );

				// Done
				return ret;

			},

			/**
			 * For each mixin of the target that provides a method matching `methodName`, the method will be executed,
			 * and the return value collected into a Map and returned.
			 *
			 * The methods will be executed based on the application/mix order of the mixins, with the eldest ancestor's
			 * first mixin being executed first and the target classes' last mixin being executed last.
			 *
			 * @public
			 * @param {string} methodName - The name of the method to search for in each mixin.
			 * @param {Array} [args] - The arguments to forward to the mixin methods.
			 * @returns {Map<string,*>} The return values of each mixin, as a Map, with the key for each element
			 * being the full, namespaced, class name of the mixin that provided the method.
			 */
			applyMethodChain( methodName, args ) {

				// Get all mixins
				let mixins = utils.all;
				let ret    = new Map();

				// Iterate over each mixin
				mixins.forEach( function( mixin, mixinName ) {

					if( TIPE( mixin[ methodName ] ) === "function" ) {
						let returnValue = mixin[ methodName ].apply( target, args );
						ret.set( mixinName, returnValue );
					}

				} );

				// Done
				return ret;

			}


			// </editor-fold>

		};

		return utils;

	}

}

module.exports = MixUtilsMixin;
