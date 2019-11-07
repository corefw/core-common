/**
 * @file
 * Defines the Core.logging.Logger class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */



// Load dependencies using the Core Framework
const { _, MOMENT } = Core.deps( "_", "moment" );

/**
 * A class that facilitates log output.
 *
 * @memberOf Core.logging
 * @extends Core.abstract.Component
 */
class Logger extends Core.mix(
	"Core.abstract.Component",
	"Core.asset.mixin.Parenting"
) {

	$construct( context, logOutputs, minLogLevel ) {

		// Require the `context` class dep
		this._context = this.$require( "context", {
			instanceOf: "Core.context.Context",
		} );

		// Require the `output` class dep
		this._rawOutputs = this.$require( "logOutputs", {
			$any: [
				{ instanceOf: "Core.logging.output.BaseOutput" },
				{ instanceOf: "Core.logging.output.Collection" }
			],
		} );

		// Initialize the sequence id
		this._sequence = 0;

		// Set the initial minLogLevel
		this.minLogLevel = this.$require( "minLogLevel", {
			isString     : true,
			defaultValue : "warning"
		} );

	}

	// <editor-fold desc="--- Outputs --------------------------------------------------------------------------------">



	get outputs() {

		// Locals
		let me = this;

		// We should store our outputs, natively, as a Core.logging.output.Collection.
		// If we have anything other than a collection, then we will convert it to one here.
		if( me._rawOutputs.$amClassName !== "Core.logging.output.Collection" ) {
			me._convertRawOutputsToCollection();
		}

		// Return the raw outputs
		return me._rawOutputs;

	}

	_convertRawOutputsToCollection() {

		this._rawOutputs = this.$spawn( "Core.logging.output.Collection", {
			initialValues: this._rawOutputs
		} );

	}

	set _rawOutput( newVal ) {

		// Locals
		let me = this;

		// Wrap the provided output in a collection
		// (if it's already a collection, the new collection will ingest it)
		this.outputs = me.$spawn( "Core.logging.output.Collection", {
			initialValues: newVal
		} );

	}



	// </editor-fold>

	get minLogLevel() {
		return this._minLogLevel;
	}

	set minLogLevel( val ) {
		this._minLogLevel = this._getSeverityCode( val );
	}

	initLogEvent( severity, ...args ) {

		// Locals
		let me 		= this;
		let event, message, name;

		// Iterate over each arg to try to identify each.
		_.each( args, function( arg ) {

			if( name === undefined && Core.constants.logging.LOG_NAME_REGEX.test( arg ) ) {

				// The first string to match the name syntax
				// will be considered to be the event name.
				name = arg;

			} else if( message === undefined && _.isString( arg ) ) {

				// The first string after the ID, or the first non-name
				// string, will be considered to be the message.
				message = arg;

			} else if( event === undefined && _.isPlainObject( arg ) ) {

				// The first object will be adopted as the event.
				event = arg;

			}

		} );

		// Ensure we have an event.
		if( !_.isPlainObject( event ) ) {
			event = {};
		}

		// We store the event name, if one was provided..
		if( name !== undefined ) {
			event.name = name;
		}

		// We store the event message, if one was provided.
		if( message !== undefined ) {
			event.message = message;
		}

		// Apply event defaults
		event = me._applyLogEventDefaults( event );

		// Overwrite the default severity.
		event.severity = severity;

		// All done
		return event;

	}

	/**
	 * Populates a log event object with default values for any required fields that it is missing.
	 *
	 * @private
	 * @param {Object} event - The event object to apply defaults to.
	 * @returns {Object} A copy of `event`, with defaults applied.
	 */
	_applyLogEventDefaults( event ) {

		let defaultValues = {
			application: {
				component : "unknown",
				name      : "unknown",
				platform  : "node.js",
				version   : "unknown"
			},
			log: {
				format   : "2018.01",
				security : {
					level: "private"
				},
				sequence: 0
			},
			source: {
				executionId : "unknown",
				file        : "unknown",
				line        : 0
			},
			severity : "info",
			name     : "generic.log.event",
			message  : "-"
		};
		let final = _.defaultsDeep( {}, event, defaultValues );

		// Special field: log.shortMessage
		// If not explicitly specified, we'll copy the `message` to this field.
		if( final.log.shortMessage === null || final.log.shortMessage === undefined ) {
			final.log.shortMessage = final.message;
		}

		// All done
		return final;

	}

	log( event ) {

		// Locals
		let me = this;

		// If event.severity is provided in a simplified
		// format (not an object) then we'll need to translate it.
		if( !_.isPlainObject( event.severity ) ) {

			// Capture the string value
			let severity = event.severity;
			delete event.severity;

			// Add formal severity info back to the event
			event.severity 			= {};
			event.severity.code 	= me._getSeverityCode( severity );
			event.severity.level 	= me._getSeverityName( event.severity.code );
			event.severity.abbr 	= me._getSeverityAbbreviation( event.severity.code );

		}

		// Ensure that the log level of our event is within range.
		if( event.severity.code > me.minLogLevel ) {
			return;
		}

		// Increment the sequence number
		this._sequence++;
		event.log.sequence = this._sequence;

		// Todo: get everything else, such as package.json data, from the Context

		// Attach a Moment.js object
		event.moment = MOMENT();

		// Send to the outputs
		me._writeLogEvent( event );

	}


	/**
	 * Sends a log event to the output handlers.
	 *
	 * @private
	 * @param {Object} event - The log event to send to the output handlers.
	 * @returns {void}
	 */
	_writeLogEvent( event ) {

		// Send the log event to each log output handler
		this.outputs.each( function( output ) {
			output.writeLogEvent( event );
		} );

	}


	// <editor-fold desc="--- Severity Resolution --------------------------------------------------------------------">



	/**
	 * Resolves the security code (a Number) when provided a string or integer representation.
	 *
	 * @private
	 * @throws Core.error.ParamValidationError If the `severity` param value is not a Number, String, NULL, or UNDEFINED.
	 * @param {?String|Number} [severity=6] - A string or numerical representation of a severity code.
	 * @returns {Number} The resolved severity code. The default code (6 - Info) will be returned if the `severity`
	 * parameter is valid but could not be resolved.
	 */
	_getSeverityCode( severity ) {

		// Locals
		let me = this;

		// Handle NULL and UNDEFINED
		// These will return the default level: Info (6)
		if( _.isNil( severity ) ) {
			return 6;
		}

		// Handle integers
		if( _.isNumber( severity ) ) {
			return _.clamp( severity, 0, 8 );
		}

		// Anything other than a string beyond this point is an error.
		if( !_.isString( severity ) ) {
			me.$throw( "ParamValidationError",
				"Logger::_getSeverityCode() expects either a Number (between 0 and 8) or a string, but " +
				Core.validator.describeA( severity ) + " was received."
			);
		}

		// Convert to lower case.
		severity = severity.toLowerCase();

		// Most severity levels can be resolved using only the first letter.
		switch( severity.substr( 0, 1 ) ) {

			// Alert (0)
			case "a":
				return 1;

			// Critical (2)
			case "c":
				return 2;

			// Warning (4)
			case "w":
				return 4;

			// Notice (5)
			case "n":
				return 5;

			// Info (6)
			case "i":
				return 6;

			// Debug (7)
			case "d":
				return 7;

			// Trace (8)
			case "t":
				return 8;

		}

		// The rest can be determined using the first two letters.
		switch( severity.substr( 0, 2 ) ) {

			// Emergency (0)
			case "em":
				return 0;

			// Error (3)
			case "er":
				return 3;

		}

		// For everything else, return the default.
		return 6; // Info

	}

	/**
	 * Returns a string representation of the severity of an event when provided a valid severity code.
	 *
	 * @private
	 * @param {?Number} [code=6] - The severity code, which should be a integer between 0 and 8.
	 * @returns {String} A string representation of the provided code.
	 */
	_getSeverityName( code ) {

		// Ensure the number is within the valid range.
		code = _.clamp( code, 0, 8 );

		switch( code ) {

			case 0:
				return "Emergency";

			case 1:
				return "Alert";

			case 2:
				return "Critical";

			case 3:
				return "Error";

			case 4:
				return "Warning";

			case 5:
				return "Notice";

			case 6:
				return "Informational";

			case 7:
				return "Debug";

			case 8:
				return "Trace";

		}

	}

	/**
	 * Returns an abbreviated string representation of the severity of an event when provided a valid severity code.
	 *
	 * @private
	 * @param {?Number} [code=6] - The severity code, which should be a integer between 0 and 8.
	 * @returns {String} An abbreviated string representation of the provided code.
	 */
	_getSeverityAbbreviation( code ) {

		// Ensure the number is within the valid range.
		code = _.clamp( code, 0, 8 );

		switch( code ) {

			case 0:
				return "Emr";

			case 1:
				return "Alr";

			case 2:
				return "Crt";

			case 3:
				return "Err";

			case 4:
				return "Wrn";

			case 5:
				return "Ntc";

			case 6:
				return "Inf";

			case 7:
				return "Dbg";

			case 8:
				return "Trc";

		}

	}



	// </editor-fold>



}

module.exports = Logger;
