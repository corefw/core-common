/**
 * @file Defines the Uuid class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @author Kevin Sanders <kevin@c2cschools.com>
 * @since 5.0.0
 * @license See LICENSE.md for details about licensing.
 * @copyright 2017 C2C Schools, LLC
 */

"use strict";

const BaseClass = require( "../common/BaseClass" );

/**
 * This utility class provides useful static methods for dealing with Unique
 * Identifiers (UUIDs).
 *
 * @memberOf Util
 * @extends Common.BaseClass
 */
class Uuid extends BaseClass {

	/**
	 * @inheritDoc
	 */
	static $singleton() {

		return true;

	}

	/**
	 * Generates a UUID with an optional prefix.
	 *
	 * @public
	 * @param {?string} [prefix] - An optional prefix to add to the UUID.
	 * @returns {string} The generated UUID.
	 */
	generate( prefix ) {

		const me = this;

		// Dependencies
		const UUID = me.$dep( "uuid" );

		let uuid = UUID();

		if ( prefix !== undefined && prefix !== null ) {

			return me.convertToUuidString( prefix + uuid );

		}

		return uuid;

	}

	/**
	 * Converts a string UUID to a `Buffer`.
	 *
	 * @public
	 * @param {string} val - The UUID to convert.
	 * @returns {Buffer} The string UUID converted to a `Buffer`.
	 */
	convertToUuidBuffer( val ) {

		const me = this;

		// First, ensure its a proper uuid
		val = me.convertToUuidString( val );

		// Remove all non-hex characters (incl dashes)
		val = val.replace( /[^a-f0-9]/g, "" );

		// Create new Buffer
		return new Buffer( val, "hex" );

	}

	/**
	 * Liberally converts practically any variable into a string UUID.
	 *
	 * @public
	 * @param {*|Buffer|String} val - The variable to convert into a UUID.
	 * @returns {string} The variable converted to a string UUID.
	 */
	convertToUuidString( val ) {

		const me = this;

		// Dependencies
		const _ = me.$dep( "lodash" );

		// Convert the value to a string, if it is a Buffer...
		if ( Buffer.isBuffer( val ) ) {

			val = val.toString( "hex" );

		}

		// Convert it to a string if it is anything else...
		if ( !_.isString( val ) ) {

			val = String( val );

		}

		// Remove invalid (non-hex) characters
		val = val.replace( /[^a-fA-F0-9]/g, "" );

		// Force the value to exactly 32 characters...
		if ( val.length < 32 ) {

			// If it's too short, pad with zeros...
			val = _.padEnd( val, 32, "0" );

		} else if ( val.length > 32 ) {

			// If it's too long, trim it...
			val = val.substr( 0, 32 );

		}

		// Make it lower case...
		val = val.toLowerCase();

		// Insert dashes...
		val =
			val.substr( 0, 8 ) + "-" +
			val.substr( 8, 4 ) + "-" +
			val.substr( 12, 4 ) + "-" +
			val.substr( 16, 4 ) + "-" +
			val.substr( 20 );

		// Done
		return val;

	}

}

module.exports = Uuid;
