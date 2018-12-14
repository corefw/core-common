/**
 * @file Defines the DebugHelper class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @author Kevin Sanders <kevin@c2cschools.com>
 * @since 5.1.12
 * @license See LICENSE.md for details about licensing.
 * @copyright 2017 C2C Schools, LLC
 */

"use strict";

const BaseClass = require( "../common/BaseClass" );

/**
 * This utility class provides useful debugging methods.
 *
 * @memberOf Util
 * @extends Common.BaseClass
 */
class DebugHelper extends BaseClass {

	/**
	 * Declares this class as a singleton.
	 *
	 * @returns {boolean} TRUE if this class has been declared as a singleton.
	 *     FALSE if not.
	 */
	static $singleton() {

		return true;
	}

	/**
	 * A convenience alias for the {@link Common.BaseClass#inspect} method.
	 *
	 * @public
	 * @param {*} varToInspect - The variable to dump.
	 * @param {boolean} [output=true] - Whether or not the contents of the
	 *     variable should be dumped to the console (stdout); if FALSE, the
	 *     output string will be returned, rather than output.
	 * @param {?number} [indent=0] - An optional amount to indent the output,
	 *     using tabs.
	 * @param {?string} [title=null] - An optional title to add to the output.
	 * @returns {string} A string showing the contents ot `varToInspect`.
	 */
	dbg( varToInspect, output, indent, title ) {

		const me = this;

		return me.inspect( varToInspect, output, indent, title );
	}

	/**
	 * A debugging method that dumps the contents of a variable.
	 *
	 * @public
	 * @param {*} varToInspect - The variable to dump.
	 * @param {boolean} [output=true] - Whether or not the contents of the
	 *     variable should be dumped to the console (stdout); if FALSE, the
	 *     output string will be returned, rather than output.
	 * @param {?number} [indent=0] - An optional amount to indent the output,
	 *     using tabs.
	 * @param {?string} [title=null] - An optional title to add to the output.
	 * @returns {string} A string showing the contents ot `varToInspect`.
	 */
	inspect( varToInspect, output, indent, title ) {

		const me = this;

		// Dependencies
		const _ = me.$dep( "lodash" );

		let inspector = me.inspector;

		// Constants
		const oneIndent = "    ";

		// Param validation: output
		if ( output !== false ) {

			output = true;
		}

		// Param validation: indent
		if ( indent === null || indent === undefined ) {

			indent = 0;

		} else {

			indent = parseInt( indent, 10 );
		}

		// Create the inspection string
		let inspection = inspector( varToInspect );

		// Apply the title, if requested
		if ( _.isString( title ) ) {

			inspection = title + "\n\n" + inspection;
		}

		// Apply indentation, if requested
		if ( indent > 0 ) {

			let indentStr = _.repeat( oneIndent, indent );

			inspection = indentStr + inspection.replace( /\n/g, "\n" + indentStr );
		}

		// Output, if requested...
		if ( output ) {

			console.log( " " );
			console.log( inspection );
			console.log( " " );
		}

		// Return
		return inspection;
	}

	/**
	 * The project-wide default configuration for the 'eyes' module.
	 *
	 * @public
	 * @readonly
	 * @type {Object}
	 */
	get inspectorConfig() {

		return {
			styles: {
				all     : "cyan",		// Overall style applied to everything
				label   : "underline",	// Inspection labels, like "array" in `array: [1, 2, 3]`
				other   : "inverted",	// Objects which don"t have a literal representation, such as functions
				key     : "bold",		// The keys in object literals, like "a" in `{a: 1}`
				special : "grey",		// null, undefined...
				string  : "green",
				number  : "magenta",
				bool    : "green",		// true false
				regexp  : "green",		// /\d+/
			},
			stream    : null,
			maxLength : 10,
		};
	}

	/**
	 * A fully configured object inspector from the `eyes` module.
	 *
	 * @public
	 * @readonly
	 * @type {Object}
	 */
	get inspector() {

		const me = this;

		// Dependencies
		const EYES = me.$dep( "eyes" );

		return EYES.inspector( me.inspectorConfig );
	}
}

module.exports = DebugHelper;
