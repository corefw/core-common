/**
 * Defines the Uuid class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 5.0.0
 * @license None
 * @copyright 2017 C2C Schools, LLC
 */
"use strict";

//<editor-fold desc="( DEPENDENCIES )">



//<editor-fold desc="--- Local Project Dependencies --------------------------">


const BaseClass 	= require( "../BaseClass" );
const ERRORS 		= require( "../Errors" );  		// todo: convert to this.$dep pattern



//</editor-fold>

//<editor-fold desc="--- Third Party Libraries/Modules -----------------------">



const _ 		= require( "lodash" );  			// todo: convert to this.$dep pattern
const TIPE 		= require( "tipe" );  				// todo: convert to this.$dep pattern
const BB		= require( "bluebird" );  			// todo: convert to this.$dep pattern
const UUID		= require( "uuid/v4" );  			// todo: convert to this.$dep pattern



//</editor-fold>



//</editor-fold>

/**
 * This utility class provides useful static methods for dealing with
 * Unique Identifiers (UUIDs).
 *
 * @memberOf Util
 * @extends Core.BaseClass
 */
class Uuid extends BaseClass {

	/**
	 * Generates a UUID with an optional prefix.
	 *
	 * @static
	 * @access public
	 * @param {?string} prefix An optional prefix to add to the UUID.
	 * @returns {string}
	 */
	static generate( prefix ) {
		let u = UUID();

		if( prefix !== undefined && prefix !== null ) {
			return this.convertToUuidString( prefix + u );
		} else {
			return u;
		}

	}

	/**
	 * Converts a string UUID to a `Buffer`.
	 *
	 * @static
	 * @access public
	 * @param {string} val The UUID to convert.
	 * @returns {Buffer}
	 */
	static convertToUuidBuffer( val ) {

		// First, ensure its a proper uuid
		val = this.convertToUuidString( val );

		// Remove all non-hex characters (incl dashes)
		val = val.replace(/[^a-f0-9]/g, "");

		// Create new Buffer
		val = new Buffer( val, "hex" );

		// Done..
		return val;

	}

	/**
	 * Liberally converts practically any variable into a string UUID.
	 *
	 * @static
	 * @access public
	 * @param {*} val The variable to convert into a UUID.
	 * @returns {string}
	 */
	static convertToUuidString( val ) {

		// Convert the value to a string, if it is a Buffer..
		if( Buffer.isBuffer( val ) ) {
			val = val.toString("hex");
		}

		// Convert it to a string if it is anything else..
		if( !_.isString( val ) ) {
			val += "";
		}

		// Remove invalid (non-hex) characters
		val = val.replace(/[^a-fA-F0-9]/g, "");

		// Force the value to exactly 32 characters..
		if( val.length < 32 ) {

			// If it's too short, pad with zeros..
			val = _.padEnd( val, 32, "0" );

		} else if( val.length > 32 ) {

			// If it's too long, trim it..
			val = val.substr( 0, 32 );

		}

		// Make it lower case...
		val = val.toLowerCase();

		// Insert dashes...
		val = 	val.substr( 0, 8  ) + "-" +
				val.substr( 8, 4  ) + "-" +
				val.substr( 12, 4 ) + "-" +
				val.substr( 16, 4 ) + "-" +
				val.substr( 20    );

		// Done
		return val;

	}


}

module.exports = Uuid;