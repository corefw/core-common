/**
 * @file
 * Defines the Core.debug.mixin.CallTrackerMixin mixin.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/**
 * This is a simple helper method that can be used in unit tests to track arbitrary method calls.
 *
 * @memberOf Core.debug.mixin
 */
class CallTrackerMixin {

	/**
	 * Manually logs a method call.
	 *
	 * @public
	 * @param {string} methodName - The name of the method being called.
	 * @param {string} sourceName - An arbitrary name for the callee.
	 * @param {arguments} args - The arguments passed into the method.
	 * @param {*} thisRef - The `this` reference given to the method.
	 * @returns {void}
	 */
	logManualMethodCall( methodName, sourceName, args, thisRef ) {

		// Locals
		let me 		= this;
		let data 	= me.callTrackerData;

		// Ensure we have a container for the target method
		if( data[ methodName ] === undefined || data[ methodName ] === null ) {
			data[ methodName ] = {
				didParticipate     : {},
				argsPassed		   : {},
				participationOrder : [],
				thisRefs           : {}
			};
		}

		// Convenience reference
		let methodData = data[ methodName ];

		// Tracks which sources executed the method
		methodData.didParticipate[ sourceName ] = sourceName;

		// Tracks the order that the sources executed the method
		methodData.participationOrder.push( sourceName );

		// Stores the arguments passed to the method
		methodData.argsPassed[ sourceName ] = [ ...args ];

		// Stores the `this` reference that was passed to the method
		methodData.thisRefs[ sourceName ] = thisRef;

	}

	/**
	 * A simple object store that houses method call data.
	 *
	 * @access public
	 * @default {}
	 * @type {Object}
	 */
	get callTrackerData() {

		if( this._callTrackerData === undefined ) {
			this._callTrackerData = {};
		}

		return this._callTrackerData;

	}

}

module.exports = CallTrackerMixin;
