/**
 * @file Defines the BaseClientWrapper class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.2
 * @license See LICENSE.md for details about licensing.
 * @copyright 2019 C2C Schools, LLC
 */

"use strict";

// Important Note
// --------------
// This module only loads a single dependency, directly, which is the
// parent class for the class defined within. This is intended to force
// dependency loading through the parent class, by way of the `$dep()`
// method, in order to centralize dependency definition and loading.

const ParentClass	= require( "../common/BaseClass" );

/**
 * Something...
 *
 * @abstract
 * @memberOf Aws
 * @extends Common.BaseClass
 */
class BaseClientWrapper extends ParentClass {

	// <editor-fold desc="--- Construction and Initialization ----------------">

	/**
	 * @inheritDoc
	 */
	_initialize( cfg ) {

		// Call parent
		super._initialize( cfg );

	}


	// </editor-fold>

	// <editor-fold desc="--- Logging ----------------------------------------">

	/**
	 * @inheritDoc
	 */
	get logger() {

		const me = this;

		if ( me._logger === undefined ) {

			let parentLogger	= super.logger;

			me._logger = parentLogger.fork( {
				component  : me.constructor.name,
				namePrefix : me.constructor.name,
			} );

		}

		return me._logger;
	}

	/**
	 * @inheritDoc
	 */
	set logger( val ) {

		super.logger = val;
	}

	// </editor-fold>


}

module.exports = BaseClientWrapper;
