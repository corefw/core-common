/**
 * @file
 * Defines the Core.logging.output.Console class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */



// Load dependencies using the Core Framework
const { _, CHALK } = Core.deps( "_", "chalk" );

/**
 * Provides log output to the console, typically for debugging and development purposes.
 *
 * @memberOf Core.logging.output
 * @extends Core.logging.output.BaseOutput
 */
class Console extends Core.cls( "Core.logging.output.BaseOutput" ) {

	_formatLogEvent( logEvent ) {

	}

	_getSeverityColorFn( severityCode ) {

		switch( severityCode ) {

			case 0:
			case 1:
			case 2:
			case 3:
				return CHALK.red;

			case 4:
				return CHALK.yellow;

			case 5:
				return CHALK.bold.white;

			case 6:
				return CHALK.white;

			default:
				return CHALK.cyan;

		}

	}

	get dateTimeColorFn() {
		return CHALK.grey;
	}

	get sequenceColorFn() {
		return CHALK.white;
	}

	get nameColorFn() {
		return CHALK.grey;
	}

	get componentColorFn() {
		return CHALK.green;
	}

	get bracketColorFn() {
		return CHALK.white;
	}

	_getComponentPadding( defaultValue, lastComponentName ) {

		// Apply the default, if needed
		if( this._lastComponentPadding === undefined || this._lastComponentPadding === null ) {
			this._lastComponentPadding = defaultValue;
		}

		// Increase the padding, if needed
		if( lastComponentName.length > this._lastComponentPadding ) {
			this._lastComponentPadding = lastComponentName.length;
		}

		// Done
		return this._lastComponentPadding;

	}

	writeLogEvent( event ) {

		// Locals
		let me = this;

		// Settings
		const OUTPUT_SETTINGS = {
			dateTimeFormat      : "hh:mm:ss.SSS",
			defaultComponentLen : 30,
			sequenceDigits      : 4
		};

		// Color Functions
		const colorFn = {
			severity  : me._getSeverityColorFn( event.severity.code ),
			dateTime  : me.dateTimeColorFn,
			sequence  : me.sequenceColorFn,
			name      : me.nameColorFn,
			component : me.componentColorFn,
			bracket   : me.bracketColorFn
		};

		// Helpers
		const bracketS = colorFn.bracket( "[ " );
		const bracketE = colorFn.bracket( " ]" );

		// The padding for the 'component' section of the log will increase
		// as components with longer names are encountered. So, we delegate
		// the resolution of the component padding to a helper.
		const finalComponentPadding = me._getComponentPadding(
			OUTPUT_SETTINGS.defaultComponentLen, event.application.component
		);

		// Format the event time as a string
		let strTime = event.moment.format( OUTPUT_SETTINGS.dateTimeFormat );

		// Format the severity as a string
		let strSeverity = event.severity.abbr.toUpperCase();

		// Format the sequence number as a string
		let strSequence = _.padStart( ( "" + event.log.sequence ), OUTPUT_SETTINGS.sequenceDigits, "0" );

		// Format the component
		let strComponent = _.padEnd( event.application.component, finalComponentPadding );

		// Format the event name
		let strEventName = "(" + event.name + ")";

		// Convert the message to an array of lines.
		let arrMessage = event.message.split( "\n" );

		// Iterate over each line in the message.
		_.each( arrMessage, function( messageLine ) {

			// Init the final output line
			let line = "";

			// Attach the time to the line.
			line += colorFn.dateTime( strTime );
			line += " ";

			// Attach the sequence number.
			line += colorFn.sequence( strSequence );
			line += " ";

			// Attach the severity to the line.
			line += bracketS;
			line += colorFn.severity( strSeverity );
			line += bracketE;
			line += " ";

			// Attach the component to the line
			line += bracketS;
			line += colorFn.component( strComponent );
			line += bracketE;
			line += " ";

			// Attach the message line.
			line += colorFn.severity( messageLine );
			line += " ";

			// Attach the event name
			line += colorFn.name( strEventName );

			// Output it..
			me._out( line );

		} );

		//Core.inspect( event, "Console Output Event" );

	}

	_out( str ) {
		console.log( str );
	}

}

module.exports = Console;

/*
let event = {
	name        : "log.test.alert",
	message     : "Testing the 'alert' log level.",
	application : {
		component : "Core.graphql.server.ApolloLambda",
		name      : "unknown",
		platform  : "node.js",
		version   : "unknown"
	},
	log: {
		format       : "2018.01",
		security     : { level: "private" },
		sequence     : 9,
		shortMessage : "Testing the 'alert' log level."
	},
	source: {
		executionId : "unknown",
		file        : "unknown",
		line        : 0
	},
	severity: {
		code  : 1,
		level : "Alert",
		abbr  : "Alr"
	}
};
*/
