/**
 * @file
 * Defines the Core.asset.ClassInspector class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";


/**
 * Uses various forms of reflection to inspect class definitions (functions), class instances (objects), and
 * their member properties and methods.
 *
 * @memberOf Core.asset
 */
class ClassInspector {

	constructor() {
		// Do nothing
	}


	/**
	 * Resolves the parameter names for a given function and returns them, in order, as an array.
	 *
	 * Important: This method depends on the fact that running `.toString()` on a function will return its
	 * full contents, including its method signature on the first line. However, mutating functions
	 * in certain ways (by, for example, calling `.bind()` on it) will destroy the original method
	 * string and will cause this method to resolve either empty, or incorrect, function parameters.
	 *
	 * In other words, parameter resolution must be called prior to calling `.bind()` (or similar)
	 * on functions, or this method will not work.
	 *
	 * @public
	 * @param {function} fn - The function to resolve the parameter names for.
	 * @returns {string[]} The parameter names, as an array of strings, or an empty array if no parameters were found.
	 */
	getFunctionParams( fn ) {

		// We'll use this regular expression to parse the method for params
		let regx = /^(\s*function)?\s*[^\(]*\(\s*([^\)]*)\)/m;

		// Apply the regex
		let matchRes = fn.toString().match( regx );

		// If we cannot resolve the method arguments, then graceful
		// recovery is not possible and we need to throw an error.
		if( matchRes === null ) {
			throw new Error( "Failed to resolve method parameters in Core.asset.ClassInspector::getFunctionParams(); this should not happen and is likely an indication that the regular expression being used to resolve parameters is not sufficiently dynamic." );
		}

		// Extract the parameters from the Regex match
		let params = matchRes[ 2 ];

		// Remove any comments
		// see: https://stackoverflow.com/questions/5989315/regex-for-match-replacing-javascript-comments-both-multiline-and-inline
		params = params.replace( /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, "$1" );

		// Remove whitespace from the params string
		params = params.replace( /\s/g, "" );

		// If params is an empty string, then the target
		// function does not have any parameters
		if( params === "" ) {
			return [];
		}

		// Convert to an array
		return params.split( "," );

	}


	/**
	 * Traverses an object's prototype chain looking for members/properties, by name, and returns all
	 * of the members that it finds as an array.
	 *
	 * @public
	 * @param {Object} target - The object to build the property/member chain for.
	 * @param {string} propertyName - The name of the property/member to search for.
	 * @param {boolean} [invertOrder=false] - When TRUE, the order in which the members will be returned will be
	 * inverted, with the eldest parent member being FIRST and the target object's members LAST.
	 * @returns {function[]} An array of matching properties/members, ordered by hierarchy with members from the eldest
	 * parent LAST and members from the `target` object first.
	 */
	getPropertyChain( target, propertyName, invertOrder = false ) {

		// Locals
		let me = this;
		let ret = [];

		// Resolve our parent classes/objects
		let pChain = me.getPrototypeChainOf( target, invertOrder );

		// Iterate over our prototype chain
		pChain.forEach(

			function( ele ) {

				// Check for the target property
				if( ele.hasOwnProperty( propertyName ) ) {

					// Add the method to the return
					ret.push( ele[ propertyName ] );

				}

			}

		);

		// All done..
		return ret;

	}

	/**
	 * Traverses an object's prototype chain looking for methods, by name, and returns all
	 * of the methods it finds as an array.
	 *
	 * @public
	 * @param {Object} target - The object to build the method chain for.
	 * @param {string} methodName - The name of the method to search for.
	 * @param {boolean} [invertOrder=false] - When TRUE, the order in which the methods will be returned will be
	 * inverted, with the eldest parent method being FIRST and the target object's methods LAST.
	 * @returns {function[]} An array of matching methods/functions, ordered by hierarchy with methods from the eldest
	 * parent LAST and methods from the `target` object first.
	 */
	getMethodChain( target, methodName, invertOrder = false ) {

		// todo: ensure that only methods are returned....
		return this.getPropertyChain( target, methodName, invertOrder );

	}

	/**
	 * Traverses the prototype chain of a target object and returns every object
	 * in the chain, stopping at (and excluding) the built-in `Object`.
	 *
	 * This method calls itself recursively to do its work.
	 *
	 * @public
	 * @param {Object} obj - The object to resolve the prototype chain for.
	 * @param {boolean} [invertOrder=false] - When TRUE, the order in which the prototypes will be returned will be
	 * inverted, with the eldest parent being FIRST and the target object LAST.
	 * @returns {Object[]} All of the objects in the prototype chain of the given `obj`. The returned array will be
	 * ordered by hierarchy with the eldest parent LAST and the `obj` object first.
	 */
	getPrototypeChainOf( obj, invertOrder = false ) {

		// Locals
		let me = this;
		let ret = [];

		// We're not going all the way down to Object,
		// so we'll end the recursion if we get that low.
		if( obj.constructor.name === "Object" ) {
			return ret;
		}

		// Depending on the type of object we're dealing with,
		// we may need to traverse downward using either obj.prototype
		// or Object.getPrototypeOf()
		if( obj.prototype ) {

			ret = me.getPrototypeChainOf( obj.prototype, invertOrder );

		} else {

			let proto = Object.getPrototypeOf( obj );

			if ( proto ) {
				ret = me.getPrototypeChainOf( proto, invertOrder );
			}

		}

		// Add the target object to the return array
		// so that it'll be part of the chain.
		if( invertOrder === true ) {

			// Inverted order..
			ret.push( obj );

		} else {

			// Default order..
			ret.unshift( obj );

		}

		// All done
		return ret;

	}

}

module.exports = ClassInspector;
