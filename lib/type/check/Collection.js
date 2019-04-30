/**
 * @file
 * Defines the Core.type.check.Collection class.
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
 * Contains and manages a collection of Core.type.check.BaseCheck objects.
 *
 * @memberOf Core.type.check
 * @extends Core.abstract.Component
 */
class Collection extends Core.cls( "Core.abstract.Component" ) {

	$construct( autoLoadBuiltInChecks ) {

		if( autoLoadBuiltInChecks !== false ) {
			this._loadBuiltInChecks();
		}

	}

	get store() {

		if( this._store === undefined ) {
			this._store = new Map();
		}

		return this._store;

	}

	add( CheckClass ) {
		this.store.set( CheckClass.checkName.toLowerCase(), CheckClass );
	}

	has( checkName ) {

		// check names are case insensitive
		checkName = checkName.toLowerCase();

		// first, see if we have the exact check
		if( this.store.has( checkName ) ) {
			return true;
		}

		// if that fails, try it with a 'is' prefix
		if( this.store.has( "is" + checkName ) ) {
			return true;
		}

		// ok, then we do not have it.
		return false;

	}

	get( checkName ) {

		// check names are case insensitive
		checkName = checkName.toLowerCase();

		// first, see if we have the exact check
		if( this.store.has( checkName ) ) {
			return this.store.get( checkName );
		}

		// if that fails, try it with a 'is' prefix
		if( this.store.has( "is" + checkName ) ) {
			return this.store.get( "is" + checkName );
		}

		// couldn't find it!
		return undefined;

	}

	_loadBuiltInChecks() {

		// Locals
		let me    = this;
		let names = me._builtInCheckNames;

		// Add each
		names.forEach( function( name ) {
			let CheckClass = Core.cls( name );
			me.add( CheckClass );
		} );

	}

	/**
	 * Gets a Map Object containing only the 'descriptive' checks from 'store', sorted ascending by
	 * their 'describePriority'.
	 *
	 * @private
	 * @type {Map}
	 */
	get descriptiveChecks() {

		// Locals
		let me = this;

		// Rebuild the cache, if needed..
		if( _.isNil( me._descriptiveCheckCache ) ) {
			me._resolveDescriptiveChecks();
		}

		// Return the cache value
		return me._descriptiveCheckCache;

	}

	/**
	 * Builds the `_descriptiveCheckCache` variable, which is a cache value for the `descriptiveChecks` getter.
	 * See the `descriptiveChecks` getter for more information.
	 *
	 * @see `descriptiveChecks`
	 * @private
	 * @returns {void}
	 */
	_resolveDescriptiveChecks() {

		// Locals
		let me     		= this;
		let unsorted 	= [];

		// Copy the 'descriptive' values over to a new array.
		me.store.forEach( function( CheckClass, checkNameLC ) {

			if( CheckClass.isDescriptive ) {
				unsorted.push( CheckClass );
			}

		} );

		// Sort the 'descriptive checks' by:
		// - ASC describePriority
		// - ASC name
		let sorted = unsorted.sort( ( a, b ) => {

			if( a.describePriority > b.describePriority ) {
				return 1;
			} else if ( a.describePriority < b.describePriority ) {
				return -1;
			} else {

				if( a.checkName > b.checkName ) {
					return 1;
				} else if ( a.checkName < b.checkName ) {
					return -1;
				} else {
					return 0; // Equal
				}


			}

		} );

		// Build the final, return, Map Object
		let final = new Map();
		_.each( sorted, function( CheckClass ) {
			final.set( CheckClass.checkName.toLowerCase(), CheckClass );
		} );

		// Persist the value to the cache
		me._descriptiveCheckCache = final;

	}

	/**
	 * Iterates over all 'descriptiveChecks' and returns the first check to which the provided `value` conforms to.
	 *
	 * @private
	 * @throws Error If no matches could be found (every variable value should match at least one check)
	 * @param {*} value - The value to check
	 * @returns {function} The first matched "Check Class".
	 */
	getFirstDescriptiveMatch( value ) {

		// Locals
		let me     = this;
		let checks = [ ...me.descriptiveChecks.values() ];
		let ret    = null;

		// Iterate until we find a match
		_.each( checks, function( CheckClass ) {

			if( CheckClass.evaluateTarget( value ) === true ) {

				// Save the matched check
				ret = CheckClass;

				// Stop looking for more
				return false;

			}

		} );

		// Every variable should match at least one 'simple check'..
		if( ret === null ) {
			throw new Error( "Core.type.check.Collection::getFirstDescriptiveMatch() failed to identify the provided value! This should never happen and is a bug." );
		}

		// All done..
		return ret;

	}

	get _builtInCheckNames() {

		return [
			"Core.type.check.simple.IsArguments",
			"Core.type.check.simple.IsArray",
			"Core.type.check.simple.IsArrayBuffer",
			"Core.type.check.simple.IsArrayLike",
			"Core.type.check.simple.IsArrayLikeObject",
			"Core.type.check.simple.IsBoolean",
			"Core.type.check.simple.IsBuffer",
			"Core.type.check.simple.IsDate",
			"Core.type.check.simple.IsEmpty",
			"Core.type.check.simple.IsError",
			"Core.type.check.simple.IsFinite",
			"Core.type.check.simple.IsFunction",
			"Core.type.check.simple.IsInteger",
			"Core.type.check.simple.IsLength",
			"Core.type.check.simple.IsMap",
			"Core.type.check.simple.IsNaN",
			"Core.type.check.simple.IsNative",
			"Core.type.check.simple.IsNil",
			"Core.type.check.simple.IsNull",
			"Core.type.check.simple.IsNumber",
			"Core.type.check.simple.IsObject",
			"Core.type.check.simple.IsObjectLike",
			"Core.type.check.simple.IsPlainObject",
			"Core.type.check.simple.IsRegExp",
			"Core.type.check.simple.IsSafeInteger",
			"Core.type.check.simple.IsSet",
			"Core.type.check.simple.IsString",
			"Core.type.check.simple.IsSymbol",
			"Core.type.check.simple.IsTypedArray",
			"Core.type.check.simple.IsUndefined",
			"Core.type.check.simple.IsWeakMap",
			"Core.type.check.simple.IsWeakSet",
			"Core.type.check.simple.IsArrowFunction",
			"Core.type.check.simple.IsNonArrowFunction",
			"Core.type.check.simple.IsAnonymousFunction",
			"Core.type.check.simple.IsNamedFunction",
			"Core.type.check.simple.IsBoundFunction",
			"Core.type.check.simple.IsUnboundFunction",
			"Core.type.check.simple.IsAsyncFunction",
			"Core.type.check.simple.IsNonAsyncFunction",
			"Core.type.check.simple.IsMoment",
			"Core.type.check.simple.IsCoreClass",
			"Core.type.check.simple.IsCoreClassName",
			"Core.type.check.simple.IsCoreClassLike",
			"Core.type.check.simple.IsCoreClassInstance",
			"Core.type.check.extended.IsInstanceOf",
		];

	}

}

module.exports = Collection;
