/**
 * @file
 * Defines the Core.error.BaseError class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

// Load dependencies using the Core Framework
const { _, VERROR } = Core.deps( "_", "verror" );

/**
 * A base class for custom, Core Framework, errors.
 *
 * Note: this class does not extend a Core Framework class. Instead, it extends VError, which, itself, extends
 * the built-in Error object. This is done to ensure that our custom errors have the built-in functionality
 * of Error objects and so that they'll show up as instances of Error (instanceof Error).
 *
 * @abstract
 * @memberOf Core.error
 * @extends VError
 */
class BaseError extends VERROR {

	constructor( ...args ) {

		// In order to maintain consistency, we require that all Core Error Classes
		// be created using the Core.error.Manager singleton, which will inject a
		// special symbol into the constructor to identify itself.
		if( args[ 0 ] === Core.constants.error.SPAWED_BY_ERROR_MANAGER ) {

			// Yes, we're being spawned by the error manager, so we can proceed as usual..
			// ... after we drop that special symbol off ...
			args.shift();
			super( ...args );

		} else {

			// We're being spawned using the 'new' keyword. We're going defer to the
			// `Core.error.Manager` to ensure consistency.

			// .. but we still need to call super(), which is an
			// unfortunate tax, to gain access to `this`
			super( ...args );

			// Append our constructor function to the arguments we received..
			args.unshift( this.constructor );

			// .. and defer to the error manager
			return Core.errorManager.createError( ...args );

		}

	}

	static get $isCoreError() {
		return true;
	}

	static get defaultMessage() {
		return "An unknown error occurred";
	}

	/**
	 * The formal name of the error.  This property allows the class name to show up in the output when errors of this
	 * type are thrown.
	 *
	 * @access public
	 * @type {string}
	 */
	get name() {

		if( this._overrideName !== undefined ) {

			// We allow the name to be overridden
			// by way of the setter for this property.
			return this._overrideName;

		} else {

			// If it was not overridden, then we'll
			// use the className property.
			return this.className;

		}

	}
	set name( val ) {
		this._overrideName = val;
	}


	/**
	 * The full name of this error class, including a namespace. If the class name cannot be resolved
	 * (which will be the case if this error was not loaded through the AssetManager), then this property
	 * employs a few fall-back techniques to get as close as it can.
	 *
	 * @access public
	 * @type {string}
	 */
	get className() {

		if( this.$amClassName === undefined || this.$amClassName === null ) {

			if( this.constructor === undefined || this.constructor.name === undefined ||
				this.constructor.name === null || this.constructor.name === "" ) {

				// This is unfortunate, but we fall back to our parent....
				// (paranoid: this should probably never happen)
				return super.name;

			} else {

				// We can use our constructor name..
				return this.constructor.name;

			}

		} else {

			// Great.. we have the full class name
			return this.$amClassName;

		}

	}

	/**
	 * Overrides the built-in `toString()` behavior in an effort to inject the error's full class name.
	 *
	 * @returns {string} A description of this error, usually with a stack trace included.
	 */
	toString() {

		// Locals
		let me 			= this;
		let original 	= super.toString();
		let shortName 	= me.constructor.name;

		// Replace our short name (e.g. "BaseError") with the longest
		// name that we could resolve (e.g. "Core.error.BaseError")
		if( original.indexOf( shortName ) !== -1 ) {

			let regx = new RegExp( shortName );
			original = original.replace( regx, me.name );

		}

		// All done
		return original;

	}

}

module.exports = BaseError;
