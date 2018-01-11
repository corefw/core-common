/**
 * Defines the Logger class.
 *
 * @author Ashraful Sharif <sharif.ashraful@gmail.com>
 * @author Theodor Shaytanov <brainenjii@gmail.com>
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 5.0.0
 * @license None
 * @copyright 2017 C2C Schools, LLC
 */
"use strict";

//<editor-fold desc="( DEPENDENCIES )">


// Important Note:
// This module only loads a single dependency, directly, which is the
// parent class for the class defined within.  This is intended to force
// dependency loading through the parent class, by way of the `$dep()`
// method, in order to centralize dependency definition and loading.
const BaseClass = require( "../BaseClass" );


//</editor-fold>

/**
 * A class for logging. Every logger instance may be forked and all forked
 * instances has shared sequences counter.
 *
 * @memberof Logging
 * @extends Core.BaseClass
 */
class Logger extends BaseClass {

	//<editor-fold desc="--- Construction & Initialization -------------------">

	/**
	 * @constructor
	 * @param {?object} cfg A configuration object that will be consumed by
	 * the newly instantiated class (object).
	 */
	constructor( cfg ) {

		// Call parent
		super( cfg );

		// Process the configuration
		this.configure( cfg );

		// Display config warnings, if applicable
		this._displayConfigWarnings();

	}



	//</editor-fold>

	//<editor-fold desc="--- Main/Public Logger Methods ----------------------">



	/**
	 * This method creates log entry for events
	 *
	 * @access public
	 * @param {String} level level of log entry
	 * @param {*} a
	 * @param {*} b
	 * @param {*} c
	 *
	 * @returns {Object} log entry
	 */
	log( level, a, b, c ) {

		// Locals
		let me = this;
		let namePrefix = me.getSetting("namePrefix");
		let minLevel = me.getSetting("minLogLevel");
		let arrEventName = [];
		let logLevels = me._getLogLevels();
		let eventType = "event"; // todo
		let linear = me.getSetting("linear");
		let logEntry, eventValues, messageMask, eventMessage,
			levelInfo, intLevel, finalEventName;

		// Deps
		const _ 		= me.$dep("lodash");
		const moment 	= me.$dep("moment");
		const errs 		= me.$dep("errors");


		// Parse arguments while allowing multiple signatures
		let logArguments = me._parseLogArguments( a, b, c );

		// Get event params
		eventValues = logArguments.values;
		messageMask = logArguments.mask;

		// Process event name
		if( namePrefix !== "" ) {
			arrEventName.push( namePrefix );
		}
		if( logArguments.name !== "" ) {
			arrEventName.push( logArguments.name );
		}
		if( arrEventName.length === 0 ) {
			finalEventName = "c2cs-lib-logging." + eventType;
		} else {
			finalEventName = arrEventName.join(".");
		}

		// Ensure the log level is valid
		if ( logLevels[ level ] === undefined ) {

			let addComma = false;
			let errMessage = "Invalid log level ('" + level + "'). Supported log levels are: ";
			_.each( logLevels, function( levelSettings, levelName ) {

				if( addComma ) {
					errMessage += ", ";
				} else {
					addComma = true;
				}

				errMessage += "'" + levelName + "'";

			})

			throw new errs.InvalidArgumentError( errMessage );

		} else {

			// Capture Log level info
			levelInfo = logLevels[level];

		}

		// Check the 'minimum log level' setting to see if the severity
		// of this error message is above the threshold; if it is not,
		// then the message will be dropped.
		intLevel = levelInfo.syslogSeverityCode;

		// Note that level severity is descending, where a lower
		// severity code means 'more severe', rather than less.
		if( intLevel > minLevel ) {
			return;
		}

		// Combine current params with Logger instance params
		eventValues = _.extend( _.clone( me.getSetting("values") ), eventValues );

		// Format message
		eventMessage = me._formatLogMessage( messageMask, eventValues );

		// Combine message with params and apply log field defaults
		let dt = moment.utc();
		logEntry = _.extend(
			{
				"@timestamp"        : dt.format(),
				application         : me.getSetting( "application" ),
				message             : eventMessage ? levelInfo.prefix + eventMessage : "",
				severity            : levelInfo.syslogSeverity,
				severityCode        : levelInfo.syslogSeverityCode,
				name                : finalEventName,
				eventType           : eventType,
				sequence            : me._incrementSequence(),
				logFormat           : "2016.2",
				logTransport        : [ "c2cs-lib-logging" ],
				applicationPlatform : "node.js"
			}, me._processEventValues( eventValues )
		);

		// Special logic that injects the Moment object
		// into the log data when linear output is enabled.
		// (this allows us to customize the date/time output)
		if( linear ) {
			logEntry._moment = dt;
		}

		// Output to console
		me._outputToConsole( levelInfo, logEntry );

		// Return result log entry
		return logEntry;

	}


	/**
	 * Injects permanent log data into all logger entries
	 *
	 * @param {Object} varValues arguments for format messageMask
	 *
	 * @returns {Logger} current logger instance
	 */
	add( varValues ) {
		
		// Locals
		let me = this;
		let existing = me.getSetting( "values" );

		// Deps
		const _ = me.$dep("lodash");
		
		if( !_.isObject( varValues ) ) {
			return;
		} else {
			_.each( varValues, function( varVal, varKey ) {
				existing[ varKey ] = varVal;
			});
		}

		return this;

	}

	/**
	 * Fork creates a new Logger instance
	 *
	 * @returns {Logger} logger instance
	 */
	fork( cfg ) {

		// Locals
		let me = this;
		let child = new Logger( cfg );
		let myPrefix = me.getSetting("namePrefix");
		let childPrefix = child.getSetting("namePrefix");
		let arrPrefix = [];

		// Pass all "shared" values to the child
		child.configure( me.getSharedConfig() );

		// Pass all stored values to the child
		child.setSetting( "values", me.getSetting("values") );

		// Build the namePrefix for the new child
		if( myPrefix !== "" ) {
			arrPrefix.push( myPrefix );
		}

		if( childPrefix !== "" ) {
			arrPrefix.push( childPrefix );
		}

		if( arrPrefix.length > 0 ) {
			child.setSetting( "namePrefix", arrPrefix.join(".") );
		} else {
			child.setSetting( "namePrefix", "" );
		}

		// Apply a reference to the parent logger
		child._parentLogger = me;

		// All done
		return child;

	}



	//</editor-fold>

	//<editor-fold desc="--- Generic Configuration Methods -------------------">



	/**
	 * A special method that checks the config and warns for certain
	 * settings or conditions.
	 *
	 * @instance
	 * @access private
	 * @returns {void}
	 */
	_displayConfigWarnings() {

		// Warnings are disabled.
		// They might not need to come back.
		// todo: consider what to do here
		return;

		// Locals
		let me = this;
		let hasDisplayedWarnings = me.getSetting("hasDisplayedWarnings");

		// We only need to show these once
		if( hasDisplayedWarnings === true ) {
			return;
		}

		// Warn if no application name is set ...
		if( me.getSetting("application") === "unknown-application" ) {
			this.warn("c2cs-lib-logging: No application name set ('application').\n  - 'application' MUST be provided in production!");
		}

		// Warn if 'inspect' output mode is enabled ...
		if( me.getSetting("inspect") === true ) {
			this.warn("c2cs-lib-logging: Inspection mode is enabled ('inspect').\n  - 'inspect' MUST be disabled (set to false) in production!");
		}

		// Warn if 'linear' output mode is enabled ...
		if( me.getSetting("linear") === true ) {
			this.warn("c2cs-lib-logging: Linear output mode is enabled ('linear').\n  - 'linear' MUST be disabled (set to false) in production!");
		}

		// Set the flag to prevent these warnings
		// from showing more than once.
		me.setSetting( "hasDisplayedWarnings", true );

	}

	/**
	 * Initializes the logger config; this method will setup all of the
	 * appropriate configuration variables using default values.  This method is,
	 * also, idempotent, and can be called an unlimited number of times without
	 * any adverse effects.
	 *
	 * @instance
	 * @access private
	 * @returns {void}
	 */
	_initConfig() {

		// Locals
		let me = this;
		let applyDefaults = false;

		// me._config stores configuration info
		if( me._config === undefined ) {
			me._config = {};
			applyDefaults = true;
		}

		// me._config.instance stores configuration info
		// that is NOT passed directly to child loggers.
		if( me._config.instance === undefined ) {
			me._config.instance = {};
			applyDefaults = true;
		}

		// me._config.shared stores configuration info
		// that IS passed directly to child loggers.
		if( me._config.shared === undefined ) {
			me._config.shared = {};
			applyDefaults = true;
		}

		// Apply defaults, if necessary
		if( applyDefaults ) {
			me.resetConfig();
		}

	}

	/**
	 * Returns information about a single logger setting.
	 *
	 * @instance
	 * @access private
	 * @throws Error if the provided setting is not known or is otherwise invalid.
	 * @param {string} name The name of the setting to retrieve information for.
	 * @returns {object} Information about the provided setting
	 */
	_getSettingProperties( name ) {

		// Locals
		let me = this;
		let all = me._getAllSettingProperties();

		// Deps
		const errs = me.$dep("errors");

		if( all[ name ] === undefined ) {

			throw new errs.InvalidArgumentError(
				"Invalid logger setting ('" + name + "')"
			);

		} else {
			return all[ name ];
		}

	}

	_getReservedFields() {

		return {
			level      : "pLevel",
			logType    : "pLogType",
			msg        : "pMsg",
			name       : "pName",
			sourceType : "pSourceType",
			sequence   : "pSequence",
			value      : "pValue"
		};

	}

	/**
	 * Returns information about all of the available logging levels.
	 *
	 * @access private
	 * @returns {object} A plain object containing log-level information.
	 */
	_getLogLevels() {

		return {
			trace     : {
				level              : "trace",
				prefix             : "[TRACE] ",
				consoleMethod      : "log",
				shouldPush         : false,
				syslogSeverity     : "debug",
				syslogSeverityCode : 8,
				colors			   : { severity: "cyan", message: "grey" }
			},
			debug     : {
				level              : "debug",
				prefix             : "[DEBUG] ",
				consoleMethod      : "log",
				shouldPush         : false,
				syslogSeverity     : "debug",
				syslogSeverityCode : 7,
				colors			   : { severity: "cyan", message: "cyan" }
			},
			info     : {
				level              : "info",
				prefix             : "",
				consoleMethod      : "log",
				shouldPush         : true,
				syslogSeverity     : "info",
				syslogSeverityCode : 6,
				colors			   : { severity: "white", message: "white" }
			},
			notice   : {
				level              : "notice",
				prefix             : "Important: ",
				consoleMethod      : "info",
				shouldPush         : true,
				syslogSeverity     : "notice",
				syslogSeverityCode : 5,
				colors			   : { severity: "white", message: "blue" }
			},
			warning  : {
				level              : "warning",
				prefix         	   : "Warning: ",
				consoleMethod      : "warn",
				shouldPush         : true,
				syslogSeverity     : "warning",
				syslogSeverityCode : 4,
				colors			   : { severity: "yellow", message: "yellow" }
			},
			error    : {
				level              : "error",
				prefix             : "Error: ",
				consoleMethod      : "error",
				shouldPush         : true,
				syslogSeverity     : "err",
				syslogSeverityCode : 3,
				colors			   : { severity: "red", message: "red" }
			},
			critical : {
				level              : "critical",
				prefix             : "Critical Error: ",
				consoleMethod      : "error",
				shouldPush         : true,
				syslogSeverity     : "crit",
				syslogSeverityCode : 2,
				colors			   : { severity: "red", message: "red" }
			},
			alert    : {
				level              : "alert",
				prefix             : "System Error: ",
				consoleMethod      : "error",
				shouldPush         : true,
				syslogSeverity     : "alert",
				syslogSeverityCode : 1,
				colors			   : { severity: "red", message: "red" }
			},
			emergency : {
				level              : "emergency",
				prefix             : "Critical System Error: ",
				consoleMethod      : "error",
				shouldPush         : true,
				syslogSeverity     : "emerg",
				syslogSeverityCode : 0,
				colors			   : { severity: "red", message: "red" }
			}
		};


	}

	/**
	 * Returns information about ALL logger settings.
	 *
	 * @instance
	 * @access private
	 * @returns {object} Information about all logger settings.
	 */
	_getAllSettingProperties() {

		// Locals
		let me = this;

		return {
			minLogLevel: {
				shared: true,
				defaultValue: 6
			},
			sequence: {
				shared: true,
				defaultValue: 0
			},
			pushTimeout: {
				shared: true,
				defaultValue: 10000
			},
			inspect: {
				shared: true,
				defaultValue: false
			},
			linear: {
				shared: true,
				defaultValue: false
			},
			outputToConsole: {
				shared: true,
				defaultValue: true
			},
			outputToSqs: {
				shared: true,
				defaultValue: false
			},
			outputToViewer: {
				shared: true,
				defaultValue: false
			},
			namePrefix: {
				shared: false,
				defaultValue: "",
				mutator: function( val ) {
					return me._formatName( val );
				}
			},
			timings: {
				shared: false,
				defaultValue: {}
			},
			templates: {
				shared: true,
				defaultValue: {}
			},
			//outputBuffer: {
			//	shared: true,
			//	defaultValue: []
			//},
			values: {
				shared: false,
				defaultValue: {}
			},
			application: {
				shared: true,
				defaultValue: "unknown-application"
			},
			hasDisplayedWarnings: {
				shared: true,
				defaultValue: false
			},
			dieOnWarning: {
				shared: true,
				defaultValue: false
			},
			dieOnError: {
				shared: true,
				defaultValue: false
			},
			dieOnCritical: {
				shared: true,
				defaultValue: true
			},
			dieOnAlert: {
				shared: true,
				defaultValue: true
			},
			dieOnEmergency: {
				shared: true,
				defaultValue: true
			}
		};

	}

	/**
	 * Applies a configuration object to the logger.  This method will
	 * send each key in the configuration object through `#setSetting`.
	 *
	 * @instance
	 * @access public
	 * @param {object} cfg A logger configuration object.
	 * @returns {void}
	 */
	configure( cfg ) {

		// Locals
		let me = this;

		// Deps
		const _ = me.$dep("lodash");
		
		// If 'cfg' is a string, we will treat it
		// as a namePrefix setting.
		if( _.isString( cfg ) ) {
			cfg = {
				namePrefix: cfg
			};
		}

		// Ensure the config has been initialized
		// and all default values have been loaded.
		me._initConfig();

		// Iterate over each config value
		_.each( cfg, function( configVal, configName ) {
			me.setSetting( configName, configVal );
		});

	}

	/**
	 * Sets a single setting for the logger.
	 *
	 * @instance
	 * @access public
	 * @param {string} name The name of the setting to set
	 * @param {*} value The new value
	 * @returns {*} The new setting value
	 */
	setSetting( name, value ) {

		// Locals
		let me = this;
		let settingInfo = me._getSettingProperties( name );
		let settingStore;

		// Find the proper place to store the setting
		if( settingInfo.shared === true ) {
			settingStore = me._config.shared;
		} else {
			settingStore = me._config.instance;
		}

		// Mutate value, if applicable
		if( settingInfo.mutator !== undefined ) {
			value = settingInfo.mutator( value );
		}

		// Apply new value
		settingStore[ name ] = value;

		// Return the value
		return value;

	}

	/**
	 * Gets a single setting from the logger configuration.
	 *
	 * @instance
	 * @access public
	 * @param {string} name The name of the setting to get
	 * @returns {*} The requested setting value
	 */
	getSetting( name ) {

		// Locals
		let me = this;
		let settingInfo = me._getSettingProperties( name );
		let settingStore;

		// Find the proper place from which to fetch the setting
		if( settingInfo.shared === true ) {
			settingStore = me._config.shared;
		} else {
			settingStore = me._config.instance;
		}

		// Return the value
		return settingStore[ name ];

	}

	/**
	 * Resets a single setting to it's default value.
	 *
	 * @instance
	 * @access public
	 * @param {string} name The setting to reset
	 * @returns {*} The new setting value (it's default value)
	 */
	resetSetting( name ) {

		// Locals
		let me = this;
		let settingInfo = me._getSettingProperties( name );

		// Reset the setting
		return me.setSetting( name, settingInfo.defaultValue );

	}

	/**
	 * Resets all configuration values to their defaults.
	 *
	 * @instance
	 * @access public
	 * @returns {void}
	 */
	resetConfig() {

		// Locals
		let me = this;
		let settings = me._getAllSettingProperties();

		// Deps
		const _ = me.$dep("lodash");
		
		// Iterate over each setting and reset it
		_.each( settings, function( settingInfo, settingName ) {
			me.resetSetting( settingName );
		});

	}

	/**
	 * Gets the full logger configuration as a one-dimensional
	 * key/value object.
	 *
	 * @instance
	 * @access public
	 * @returns {object}
	 */
	getConfig() {

		// Locals
		let me = this;
		let settings = me._getAllSettingProperties();
		let ret = {};

		// Deps
		const _ = me.$dep("lodash");
		
		// Iterate over each setting
		_.each( settings, function( settingInfo, settingName ) {
			ret[ settingName ] = me.getSetting( settingName );
		});

		// Finished
		return ret;

	}

	/**
	 * Gets the SHARED portions of the logger configuration as a
	 * one-dimensional key/value object.
	 *
	 * @instance
	 * @access public
	 * @returns {object}
	 */
	getSharedConfig() {

		// Locals
		let me = this;
		let settings = me._getAllSettingProperties();
		let ret = {};

		// Deps
		const _ = me.$dep("lodash");
		

		// Iterate over each setting
		_.each( settings, function( settingInfo, settingName ) {
			if( settingInfo.shared === true ) {
				ret[ settingName ] = me.getSetting( settingName );
			}
		});

		// Finished
		return ret;

	}

	/**
	 * Checks a string to see if it is a properly formatted 'name'
	 * value for a log entry.
	 *
	 * @instance
	 * @access private
	 * @param {string} name
	 * @returns {boolean} TRUE if the provided value is a valid name string, or
	 *     FALSE otherwise.
	 */
	_isValidName( name ) {

		// Locals
		let me = this;
		let regx = /^([a-z][a-z0-9]*)(\.[a-z0-9]+)*$/;

		// Deps
		const _ = me.$dep("lodash");

		if( _.isString( name ) ) {
			if( name.match( regx ) ) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}

	}

	/**
	 * Applies formatting and mutations to a string in order to
	 * ensure that it is properly formatted as a log entry 'name'.
	 *
	 * @access private
	 * @param {string} name The string to format
	 * @returns {string} The formatted string
	 */
	_formatName( name ) {

		// names should always be lower case
		name = name.toLowerCase();

		// convert all invalid characters to dots
		name = name.replace(/[^a-z0-9]+/g, ".");

		// remove preceeding dots
		name = name.replace(/^\.+/g, "");

		// remove dots at the end
		name = name.replace(/\.+$/g, "");

		// all done
		return name;

	}



	//</editor-fold>

	//<editor-fold desc="--- Extended Configuration Methods ------------------">



	/**
	 * This method resets the 'sequence' counter to a zero (literal) value.
	 *
	 * @instance
	 * @access public
	 * @returns {number} Always, literally, zero (0).
	 */
	resetSequence() {

		// Locals
		let me = this;

		if( me._parentLogger === undefined ) {
			return this.resetSetting("sequence");
		} else {
			return me._parentLogger.resetSequence();
		}


	}

	/**
	 * Returns the next sequence number/id.
	 *
	 * @instance
	 * @access private
	 * @returns {number}
	 */
	_incrementSequence() {

		// Locals
		let me = this;
		let seq;

		if( me._parentLogger === undefined ) {

			seq = me.getSetting("sequence");
			seq++;
			me.setSetting("sequence", seq);

		} else {
			seq = me._parentLogger._incrementSequence();
		}

		return seq;

	}

	/**
	 * Set context for logger
	 *
	 * @param {String} newContext context of logger
	 *
	 * @returns {void}
	 */
	setContext( newContext ) {

		this.context = newContext;

	}

	/**
	 * Config for SQS pushing
	 *
	 * @param {Object} [config]
	 * @param {String} [config.customerId] AWS account ID
	 * @param {String} [config.sqsQueue] sqs queue for push
	 * @param {String} [config.accessKeyId] AWS auth data
	 * @param {String} [config.secretAccessKey] AWS auth data
	 * @param {String} [config.region] AWS auth data
	 *
	 * @return {void}
	 *
	 */
	setSQSConfig( config ) {

		// Locals
		let me = this;
		let awsConfig = me._getAwsConfig();

		// Deps
		const _ = me.$dep("lodash");

		_.extend( awsConfig, {
			customerId: config.customerId,
			sqsQueue: config.sqsQueue,
			accessKeyId: config.accessKeyId,
			secretAccessKey: config.secretAccessKey,
			region: config.region
		});

	}

	/**
	 * Gets the AWS config information for the logger
	 * @fixme bad, bad: this should be loaded from the environment...
	 *
	 * @access private
	 * @returns {object}
	 */
	_getAwsConfig() {

		return {
			accessKeyId: null,
			secretAccessKey: null,
			region: null,
			customerId: null,
			sqsQueue: "Logging-Broker"
		};

	}


	/**
	 * This method change reserved field names
	 *
	 * @param {Object} params arguments for format messageMask
	 *
	 * @returns {Object} params with renamed reserved fields
	 */
	_processEventValues( params ) {

		// Locals
		let me = this;
		let reservedFields = me._getReservedFields();

		// Deps
		const _ = me.$dep("lodash");
		
		if ( !params ) {
			return {};
		}

		_.each( reservedFields, function processReserved ( newField, field ) {

			if ( params[field] ) {

				params[newField] = params[field];
				delete params[field];

			}

		} );

		return params;

	}



	//</editor-fold>

	//<editor-fold desc="--- Metric and Timing Methods -----------------------">



	metric( name, value ) {

		// todo:

	}

	logMetric( type, value, name, metricName, messageMask, params ) {

		// Locals
		let me = this;
		let msg;

		// Deps
		const errs = me.$dep("errors");

		// Code for object naming
		if ( typeof name === "object" ) {

			params = messageMask || metricName;
			metricName = name.metricName;
			messageMask = name.mask || name.metricName;
			name = name.name;

		}

		// Variant for missed params
		if ( !( metricName && typeof metricName === "string" ) ) {

			throw new errs.InvalidArgumentError(
				"Missed required values for `messageMask` or " + "`metricName`"
			);

		}

		if ( !params && ( !messageMask || typeof messageMask === "object" ) ) {

			params = messageMask;
			messageMask = metricName;

		}

		// Format message
		// msg = me._formatLogMessage( messageMask, params );

		// Format metricName
		metricName = me._formatLogMessage( metricName, params );

		messageMask = "{{value}} " + messageMask;
		params["metricName"] = metricName;
		params["value"] = value;
		params["metricType"] = type ? "timing" : "number";
		return this.info(
			name, messageMask, params
		);

	}

	/**
	 * This method initiates timing calculation by name
	 *
	 * @param {String | Object} name name of log entry
	 * @param {String} [name.name] name of log entry
	 *
	 * @returns {void}
	 */
	timingStart( name ) {

		this.timings[name.name || name] = new Date().getTime();

	}

	/**
	 * This method finishes timing calculation by name and logs result
	 *
	 * @param {String | Object} name name of log entry
	 * @param {String} [name.name] name of log entry
	 * @param {String} [name.mask] message mask content of log entry
	 * @param {String} [name.metricName | Object] metric name of log entry
	 * @param {String} [metricName] metric name of log entry
	 * @param {String} [messageMask] message mask content of log entry
	 * @param {Object} [params] arguments for format messageMask
	 *
	 * @returns {Object} log entry
	 */
	timingStop( name, metricName, messageMask, params ) {

		// Variable for timing value
		let value;

		value = new Date().getTime() - this.timings[name.name || name];

		delete this.timings[name];

		return this.timing( value, name, metricName, messageMask, params );

	}

	/**
	 * This method logs timing by value
	 *
	 * @param {String} value timing value in ms
	 * @param {String | Object} name name of log entry
	 * @param {String} [name.name] name of log entry
	 * @param {String} [name.mask] message mask content of log entry
	 * @param {String} [name.metricName | Object] metric name of log entry
	 * @param {String} [metricName] metric name of log entry
	 * @param {String} [messageMask] message mask content of log entry
	 * @param {Object} [params] arguments for format messageMask
	 *
	 * @returns {Object} log entry
	 */
	timing( value, name, metricName, messageMask, params ) {

		return this.logMetric( "timing", value, name, metricName, messageMask,
			params );

	}

	/**
	 * This method logs numeric metric value
	 *
	 * @param {Number} value numeric value of log entry
	 * @param {String | Object} name name of log entry
	 * @param {String} [name.name] name of log entry
	 * @param {String} [name.mask] message mask content of log entry
	 * @param {String} [name.metricName | Object] metric name of log entry
	 * @param {String} [metricName] metric name of log entry
	 * @param {String} [messageMask] message mask content of log entry
	 * @param {Object} [params] arguments for format messageMask
	 *
	 * @returns {Object} log entry
	 */
	Xmetric( value, name, metricName, messageMask, params ) {

		return this.logMetric( "numeric", value, name, metricName, messageMask,
			params );

	}



	//</editor-fold>

	//<editor-fold desc="--- Log output methods ------------------------------">



	/**
	 * Push data to external handlers
	 *
	 * @access private
	 * @param {Object | Function} [data] Data sent
	 * @param {Function} [callback] callback function
	 *
	 * @returns {Boolean}
	 */
	_outputLogData( data, callback ) {

		// Locals
		let me = this;

		// Deps
		const Promise = me.$dep("bluebird");
		const _ = me.$dep("lodash");

		if ( !data ) {

			data = _.clone( me._shared.logResults );
			me._shared.logResults.length = 0;
			callback = _.noop;

		}

		if ( typeof data === "function" ) {

			callback = data;
			data = _.clone( me._shared.logResults );
			me._shared.logResults.length = 0;

		}

		if ( me.pushTimeout ) {

			clearTimeout( me.pushTimeout );

		}

		return Promise.resolve().then(
			function sendDataToSQS () {

				if ( me._shared.outputToSqs ) {

					return me._outputToSqs( data );

				}

				return Promise.resolve();

			}
		).then(
			function sendDataToViewer () {

				if ( me._shared.allowViewerPushing ) {

					return me._outputToViewer( data );

				}

				return Promise.resolve();

			}
		).then(
			function resultHandler () {

				return callback ? callback() : false;

			}
		).catch(
			function errorHandler () {

				return callback ? callback() : false;

			}
		);

	}


	/**
	 * Outputs a log entry to the console.
	 *
	 * @access private
	 * @param {object} levelInfo
	 * @param {object} logEntry
	 * @returns {void}
	 */
	_outputToConsole( levelInfo, logEntry ) {

		// Locals
		let me = this;
		let otc = me.getSetting("outputToConsole");
		let streamName;

		// Deps
		const eyes = me.$dep("eyes");

		// Determine if console output should be skipped
		if ( otc !== true ) {
			return;
		}

		// error, warn, info, log, trace
		switch( levelInfo.consoleMethod ) {

			case "error":
			case "trace":
			case "warn":
				streamName = "stderr";
				break;

			case "info":
			case "log":
				streamName = "stdout";
				break;

			default:
				streamName = "unknown";
				break;

		}

		logEntry.stream = streamName;

		if( me.getSetting("inspect") === true ) {
			eyes.inspect( logEntry );
		} else if( me.getSetting("linear") === true ) {
			me._outputLinear( logEntry.message, levelInfo, logEntry );
		} else {
			console[levelInfo.consoleMethod]( JSON.stringify( logEntry ) );
		}

	};

	/**
	 * Outputs log data in a linear format when `_shared.linear` is `true`.
	 *
	 * @access private
	 * @param {object} levelInfo
	 * @param {object} logEntry
	 * @returns {void}
	 */
	_outputLinear( message, levelInfo, logEntry ) {

		// Locals
		let me = this;
		let str, severity, levelSettings,
			severityColor, messageColor;

		// Settings
		const allLogLevels = me._getLogLevels();
		
		// Deps
		const _ = me.$dep("lodash");
		const chalk = me.$dep("chalk");

		// Handle multi-line
		if( message.indexOf("\n") !== -1 ) {
			let spl = message.split("\n");
			_.each( spl, function( line ) {
				me._outputLinear( line, levelInfo, logEntry );
			})
			return;
		}

		// Start with the timestamp
		if( logEntry._moment !== undefined ) {
			str = chalk.gray( logEntry._moment.format("HH:mm:ss.SSS") );
			delete logEntry._moment;
		} else {
			str = chalk.white( logEntry["@timestamp"] );
		}


		// Resolve the color coding
		severity 		= logEntry.severity;
		levelSettings 	= allLogLevels[ severity ];
		severityColor 	= levelSettings.colors.severity;
		messageColor 	= levelSettings.colors.message;

		// Build the string
		str += chalk[severityColor]( " [ " + _.padEnd( logEntry.severity, 7 ) + " ] " );
		str += chalk[messageColor]( message );

		console.log(str);

	}

	/**
	 * Send data to SQS
	 *
	 * @access private
	 * @param {Object | Function} data Data sent into SQS
	 *
	 * @returns {Promise} promise
	 */
	_outputToSqs( data ) {

		// Locals
		let me = this;
		let awsConfig = me._getAwsConfig();

		// Deps
		const Promise = me.$dep("bluebird");
		const _ = me.$dep("lodash");
		const uuid = me.$dep("uuid");

		if ( !( awsConfig.accessKeyId && awsConfig.customerId && awsConfig.region &&
				awsConfig.secretAccessKey && awsConfig.sqsQueue ) ) {

			return Promise.resolve();

		}

		return new Promise( function promiseBody ( resolve, reject ) {

			return me.getSQSQueue( function queueHandler ( err, queueURL ) {

				let batchMessages = [];
				let i;

				// Error handling
				if ( err ) {

					reject( err );

				}

				if ( !_.isArray( data ) ) {

					data = [data];

				}

				for ( i = 0; i < data.length / 10; i += 1 ) {

					batchMessages.push( data.slice( i * 10, i * 10 + 10 ) );

				}

				return Promise.reduce( batchMessages,
					function messageHandle ( index, pack ) {

						return me.sqs.sendMessageBatchAsync( {
							Entries: pack.map( function messageHandler ( message ) {

								return {
									Id: uuid(),
									MessageBody: JSON.stringify( message )
								};

							} ),
							QueueUrl: queueURL
						} );

					}, 0 ).then( resolve ).catch( reject );

			} );

		} );

	}

	/**
	 * Outputs log data to the log viewer.
	 *
	 * @access private
	 * @param {*} data
	 * @returns {Promise}
	 */
	_outputToViewer( data ) {

		// Locals
		let me = this;

		// Deps
		const Promise = me.$dep("bluebird");
		const _ = me.$dep("lodash");
		

		if ( !( me._shared.allowViewerPushing && data ) ) {

			return Promise.resolve();

		}

		if ( !_.isArray( data ) ) {

			data = [data];

		}

		return new Promise( function promiseBody ( resolve ) {

			// Locals
			let me = this;
			let url = "/logs";
			let options, req;

			// Deps
			const http = me.$dep("http");

			options = {
				hostname: me._shared.viewerHost,
				port: me._shared.viewerPort,
				path: url,
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				}
			};

			req = http.request( options, function responseHandler ( res ) {

				res.setEncoding( "utf8" );

				// Without data event, end event does not fire
				res.on( "data", function responseData () {

				} );
				res.on( "end", function responseEndHandler () {

					// For Lambda Context
					resolve();

				} );

			} );

			req.on( "error", function errorHandler ( ) {

				// Since we don't handle error of logs pushing then just
				// resolve promise
				resolve();

			} );

			// Write data to request body
			req.write( JSON.stringify( {
				logs: data
			} ) );

			return req.end();

		} );

	}



	//</editor-fold>

	//<editor-fold desc="--- Severity-Level-Specific Output Methods ----------">


	/**
	 * Create a new log 'event' with 'trace' severity.  This method is a convenience
	 * alias for `#log()` and is the preferred way for logging 'trace' messages.
	 *
	 * @param {String | Object} name name of log entry
	 * @param {String} [name.name] name of log entry
	 * @param {String} [name.mask] message mask content of log entry
	 * @param {String} [messageMask] message mask content of log entry
	 * @param {Object} [params] arguments for format messageMask
	 * @returns {Object} log entry
	 */
	trace( name, messageMask, params ) {

		return this.log( "trace", name, messageMask, params );

	}


	/**
	 * Create a new log 'event' with 'debug' severity.  This method is a convenience
	 * alias for `#log()` and is the preferred way for logging 'debug' messages.
	 *
	 * @param {String | Object} name name of log entry
	 * @param {String} [name.name] name of log entry
	 * @param {String} [name.mask] message mask content of log entry
	 * @param {String} [messageMask] message mask content of log entry
	 * @param {Object} [params] arguments for format messageMask
	 * @returns {Object} log entry
	 */
	debug( name, messageMask, params ) {
		return this.log( "debug", name, messageMask, params );
	}

	/**
	 * Create a new log 'event' with 'info' severity.  This method is a convenience
	 * alias for `#log()` and is the preferred way for logging 'info' messages.
	 *
	 * @param {String | Object} name name of log entry
	 * @param {String} [name.name] name of log entry
	 * @param {String} [name.mask] message mask content of log entry
	 * @param {String} [messageMask] message mask content of log entry
	 * @param {Object} [params] arguments for format messageMask
	 *
	 * @returns {Object} log entry
	 */
	info( name, messageMask, params ) {

		return this.log( "info", name, messageMask, params );

	}

	/**
	 * Create a new log 'event' with 'notice' severity.  This method is a
	 * convenience alias for `#log()` and is the preferred way for logging 'notice'
	 * messages.
	 *
	 * @param {String | Object} name name of log entry
	 * @param {String} [name.name] name of log entry
	 * @param {String} [name.mask] message mask content of log entry
	 * @param {String} [messageMask] message mask content of log entry
	 * @param {Object} [params] arguments for format messageMask
	 *
	 * @returns {Object} log entry
	 */
	notice( name, messageMask, params ) {

		return this.log( "notice", name, messageMask, params );

	}

	/**
	 * Create a new log 'event' with 'warning' severity.  This method is a
	 * convenience alias for `#log()` and is the preferred way for logging
	 * 'warning' messages.
	 *
	 * @param {String | Object} name name of log entry
	 * @param {String} [name.name] name of log entry
	 * @param {String} [name.mask] message mask content of log entry
	 * @param {String} [messageMask] message mask content of log entry
	 * @param {Object} [params] arguments for format messageMask
	 *
	 * @returns {Object} log entry
	 */
	warning( name, messageMask, params ) {

		return this.log( "warning", name, messageMask, params );

	}

	/**
	 * Convenience alias for `#warning()`
	 */
	warn( name, messageMask, params ) {
		return this.warning( name, messageMask, params );
	}

	/**
	 * Create a new log 'event' with 'error' severity.  This method is a convenience
	 * alias for `#log()` and is the preferred way for logging 'error' messages.
	 *
	 * @param {String | Object} name name of log entry
	 * @param {String} [name.name] name of log entry
	 * @param {String} [name.mask] message mask content of log entry
	 * @param {String} [messageMask] message mask content of log entry
	 * @param {Object} [params] arguments for format messageMask
	 *
	 * @returns {Object} log entry
	 */
	error( name, messageMask, params ) {

		return this.log( "error", name, messageMask, params );

	}

	/**
	 * Create a new log 'event' with 'crit' severity.  This method is a convenience
	 * alias for `#log()` and is the preferred way for logging 'crit' messages.
	 *
	 * @param {String | Object} name name of log entry
	 * @param {String} [name.name] name of log entry
	 * @param {String} [name.mask] message mask content of log entry
	 * @param {String} [messageMask] message mask content of log entry
	 * @param {Object} [params] arguments for format messageMask
	 *
	 * @returns {Object} log entry
	 */
	critical( name, messageMask, params ) {

		return this.log( "critical", name, messageMask, params );

	}

	/**
	 * Create a new log 'event' with 'alert' severity.  This method is a convenience
	 * alias for `#log()` and is the preferred way for logging 'alert' messages.
	 *
	 * @param {String | Object} name name of log entry
	 * @param {String} [name.name] name of log entry
	 * @param {String} [name.mask] message mask content of log entry
	 * @param {String} [messageMask] message mask content of log entry
	 * @param {Object} [params] arguments for format messageMask
	 *
	 * @returns {Object} log entry
	 */
	alert( name, messageMask, params ) {

		return this.log( "alert", name, messageMask, params );

	}

	/**
	 * Create a new log 'event' with 'emerg' severity.  This method is a convenience
	 * alias for `#log()` and is the preferred way for logging 'emerg' messages.
	 *
	 * @param {String | Object} name name of log entry
	 * @param {String} [name.name] name of log entry
	 * @param {String} [name.mask] message mask content of log entry
	 * @param {String} [messageMask] message mask content of log entry
	 * @param {Object} [params] arguments for format messageMask
	 *
	 * @returns {Object} log entry
	 */
	emergency( name, messageMask, params ) {

		return this.log( "emergency", name, messageMask, params );

	}



	//</editor-fold>

	//<editor-fold desc="--- Misc Utility and Specialist Methods -------------">



	/**
	 * This function formats mask by params in Mustache.js-style template
	 *
	 * @access private
	 * @param {String} messageMask message mask content of log entry
	 * @param {Object} logValues arguments for format messageMask
	 * @returns {string} string
	 */
	_formatLogMessage( messageMask, logValues ) {

		// Locals
		let me = this;

		// Deps
		const _ = me.$dep("lodash");
		
		// Templates
		let templates = me.getSetting("templates");
		let template, result;

		if ( !messageMask || _.isEmpty( logValues ) ) {

			return messageMask;

		}

		// Cache-like mechanism for storing templates
		if ( templates[ messageMask ] === undefined ) {

			// Workaround for missed template variables
			messageMask = messageMask.replace( /{{/g, "{{data." );

			template = _.template( messageMask );
			templates[messageMask] = template;

		} else {
			template = templates[messageMask];
		}

		result = template( {
			data: _.mapValues( logValues, function mapIterator ( value ) {

				if ( _.isNumber( value ) ) {

					return "[" + value + ( ( logValues && logValues.metricType === "timing" ) ? "ms" : "" ) + "]";

				}
				return value;

			} )
		} );

		// Workaround for missed template variables back
		return result.replace( /\{\{data\./g, "{{" );

	}

	/**
	 * That method pushed
	 * @returns {*}
	 */
	checkLogResults() {

		// Locals
		let me = this;

		if ( me.context !== "lambda" ) {

			return false;

		}

		if ( me._shared.logResults.length === 10 ) {

			return me._outputLogData();

		}

		if ( !me._pushRequest ) {

			me._pushRequest = setTimeout( me._outputLogData.bind( me ),
				me._shared.pushTimeout || 10000 );

		}

		return true;

	}


	/**
	 * Returns the SQS configuration, which is an extension of the AWS config.
	 *
	 * @todo promisify?
	 * @param {Function} callback
	 * @returns {Boolean}
	 */
	getSQSQueue( callback ) {

		// Locals
		let me = this;
		let awsConfig = me._getAwsConfig();
		let url;

		// Deps
		const Bluebird 	= me.$dep("bluebird");
		const util 		= me.$dep("util");
		const aws 		= me.$dep("aws-sdk");

		aws.config.update( awsConfig );

		me.sqs = Bluebird.promisifyAll( me.sqs || new aws.SQS() );

		url = util._formatLogMessage( "https://sqs.%s.amazonaws.com/%s/%s",
			awsConfig.region, awsConfig.customerId, awsConfig.sqsQueue );

		callback( null, url );

	}



	//</editor-fold>

	//<editor-fold desc="--- Argument Parsing for Logs and Metrics -----------">



	/**
	 * This utility function is used to process arguments passed to the `#log`
	 * method.
	 *
	 * @instance
	 * @access private
	 * @returns {{name: null, mask: null, values: {}}}
	 */
	_parseLogArguments( ) {

		// Locals
		let me = this;

		// Deps
		const _ = me.$dep("lodash");
		
		// Init Return
		let ret = {
			name: null,
			mask: null,
			values: {}
		};

		_.each( arguments, function( arg ) {
			me._parseOneLogArgument( arg, ret );
		});

		// If a 'name' was matched, but a 'mask' was not, then we
		// should assume that we improperly matched on the 'name'
		// field and that the implementor intended for that to be
		// the message/mask.
		if( ret.mask === null && ret.name !== null ) {
			ret.mask = ret.name;
			ret.name = null;
		}

		// Apply defaults
		if( ret.name === null ) {
			ret.name = "";
		}
		if( ret.mask === null ) {
			ret.mask = "";
		}

		return ret;

	}

	/**
	 * This utility function services the `#log` method by processing
	 * a single function argument from its params.
	 *
	 * @instance
	 * @access private
	 * @param {*} val The argument to process
	 * @param {object} ret A reference for the current processed values
	 */
	_parseOneLogArgument( val, ret ) {

		// Locals
		let me = this;

		// Deps
		const errs 	= me.$dep("errors");
		const _ 	= me.$dep("lodash");

		// Ignore undefined and NULL values
		if( val === undefined || val === null ) {
			return;
		}

		// Processing for string params ..
		if( _.isString( val ) ) {

			// If the name is already set, then this SHOULD
			// be the message mask..
			if( ret.name !== null ) {

				// But, if the mask is already set, then
				// we have a problem...
				if( ret.mask !== null ) {

					throw new errs.InvalidArgumentError(
						"Invalid argument passed to log() method.  An extra string parameter ('" + val + "') was passed with an event that already has a 'name' and message 'mask'."
					);

				} else {
					ret.mask = val;
					return;
				}

			} else {

				// If we're here, then .name is not set..
				// So, next we need to see if the value is a proper `name` value
				if( me._isValidName( val ) ) {

					// It is.. so, we can move on..
					ret.name = val;
					return;

				} else {

					// The string is not a valid name, so it SHOULD
					// be the message mask.. but, if the mask is already set, then
					// we have a problem...
					if( ret.mask !== null ) {

						throw new errs.InvalidArgumentError(
							"Invalid argument passed to log() method.  An extra string parameter ('" + val + "'), which is NOT a valid 'name' string, was passed with an event that already has a message 'mask'."
						);

					} else {
						ret.mask = val;
						return;
					}

				}
			}

		}

		// Processing for Error objects
		if( _.isError( val ) ) {

			ret.values.errorMessage = val.message;
			ret.values.errorType = val.name;
			ret.values.sourceStack = val.stack;

			let rgx = /\s+at\s+([^\(]+)\(([^:]+)\:(\d+)\:(\d+)\)/;
			let mt = rgx.exec( ret.values.sourceStack );

			if( mt === null ) {
				ret.values.sourceFunction = "unknown";
				ret.values.sourceFile = "unknown";
				ret.values.sourceLine = 0;
				ret.values.sourceColumn = 0;
			} else {
				ret.values.sourceFunction = _.trim( mt[1] );
				ret.values.sourceFile = _.trim( mt[2] );
				ret.values.sourceLine = parseInt( mt[3], 10 );
				ret.values.sourceColumn = parseInt( mt[4], 10 );
			}

			if( ret.mask === null ) {
				ret.mask = val.message;
			}
			return;

		}

		// Processing all other objects
		if( _.isObject( val ) ) {

			// Objects can be pretty diverse.  In general,
			// we will consider all keys to be 'values' unless
			// they match special, hard-coded, key names.

			_.each( val, function( objVal, objKey ) {

				switch( objKey ) {

					case "mask":
					case "message":

						if( ret.mask === null ) {
							// If no mask currently exists, we can
							// simply set it..
							ret.mask = objVal;
						} else {
							// If a mask already exists, we will append it..
							ret.mask += ": " + objVal;
						}

						break;

					case "name":

						objVal = me._formatName( objVal );

						if( ret.name === null ) {
							// If no name currently exists, we can
							// simply set it..
							ret.name = objVal;
						} else {
							// If a name already exists, we will append it..
							ret.name += "." + objVal;
						}

						break;

					case "values":

						// Apply each value..
						_.each( objVal, function( valV, valK ) {
							ret.values[ valK ] = valV;
						});

						break;

					default:

						// Everything else will be considered as a 'value'
						ret.values[ objKey ] = objVal;
						break;

				}

			});

		}

	}


	/**
	 * @todo : complete this?
	 */
	_parseMetricArgs() {

		let ret = {
			metricType: "count",
			metricUnit: "unit",
			value: null,
			name: "",
			values: {}
		};

	};

	/**
	 * @todo : complete this?
	 */
	_parseOneMetricArg() {


	}



	//</editor-fold>

};

module.exports = Logger;
