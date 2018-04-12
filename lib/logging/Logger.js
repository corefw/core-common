/**
 * @file Defines the Logger class.
 *
 * @author Ashraful Sharif <sharif.ashraful@gmail.com>
 * @author Theodor Shaytanov <brainenjii@gmail.com>
 * @author Luke Chavers <luke@c2cschools.com>
 * @author Kevin Sanders <kevin@c2cschools.com>
 * @since 5.0.0
 * @license See LICENSE.md for details about licensing.
 * @copyright 2017 C2C Schools, LLC
 */

"use strict";

// Important Note:
// This module only loads a single dependency, directly, which is the parent
// class for the class defined within. This is intended to force dependency
// loading through the parent class, by way of the `$dep()` method, in order to
// centralize dependency definition and loading.

const BaseClass	= require( "../common/BaseClass" );
const ERRORS	= require( "../errors" );

/**
 * A class for logging. Every logger instance may be forked and all forked
 * instances has a shared sequences counter.
 *
 * @memberOf Logging
 * @extends Common.BaseClass
 */
class Logger extends BaseClass {

	// <editor-fold desc="--- Construction & Initialization ------------------">

	/**
	 * @inheritDoc
	 */
	initialize( cfg ) {

		const me = this;

		// Call parent
		super.initialize( cfg );

		// Process the configuration
		me.configure( cfg );

		// Display config warnings, if applicable
		me._displayConfigWarnings();
	}

	// </editor-fold>

	// <editor-fold desc="--- Main/Public Logger Methods ---------------------">

	/**
	 * This method creates a log entry for events.
	 *
	 * @public
	 * @param {string} level - level of log entry
	 * @param {*} a - First log parameter.
	 * @param {*} [b] - Second log parameter.
	 * @param {*} [c] - Third log parameter.
	 * @returns {?Object} The log entry or null if the entry was dropped.
	 */
	log( level, a, b, c ) {

		const me = this;

		// Dependencies
		const _ 		= me.$dep( "lodash" );
		const moment 	= me.$dep( "moment" );
		// const ERRORS 	= me.$dep( "errors" );

		let namePrefix		= me.getSetting( "namePrefix" );
		let minLevel		= me.getSetting( "minLogLevel" );
		let arrEventName	= [];
		let logLevels		= me._getLogLevels();
		let eventType		= "event";
		let linear			= me.getSetting( "linear" );

		// Parse arguments while allowing multiple signatures
		let logArguments = me._parseLogArguments( a, b, c );

		// Get event params
		let eventValues = logArguments.values;
		let messageMask = logArguments.mask;

		// Override eventType
		if( logArguments.values.source !== undefined && logArguments.values.source.type !== undefined ) {
			eventType = logArguments.values.source.type;
		}

		// Process event name
		if ( namePrefix !== "" ) {

			arrEventName.push( namePrefix );
		}

		if ( logArguments.name !== "" ) {

			arrEventName.push( logArguments.name );
		}

		let finalEventName;

		if ( arrEventName.length === 0 ) {

			finalEventName = "core-common-logger." + eventType;

		} else {

			finalEventName = arrEventName.join( "." );
		}

		// Ensure the log level is valid

		if ( logLevels[ level ] === undefined ) {

			let addComma	= false;
			let errMessage	= "Invalid log level ('" + level + "'). " +
				"Supported log levels are: ";

			_.each( logLevels, function ( levelSettings, levelName ) {

				if ( addComma ) {

					errMessage += ", ";

				} else {

					addComma = true;
				}

				errMessage += "'" + levelName + "'";
			} );

			throw new ERRORS.InvalidArgumentError( errMessage );
		}

		// Capture Log level info
		let levelInfo = logLevels[ level ];

		// Check the 'minimum log level' setting to see if the severity of this
		// error message is above the threshold; if it is not, then the message
		// will be dropped.
		let intLevel = levelInfo.syslogSeverityCode;

		// Note that level severity is descending, where a lower severity code
		// means 'more severe', rather than less.
		if ( intLevel > minLevel ) {

			return null;
		}

		// Combine current params with Logger instance params
		eventValues = _.extend(
			_.clone( me.getSetting( "values" ) ),
			eventValues
		);

		// Format message mask
		messageMask = messageMask ? levelInfo.prefix + messageMask : "";

		// Combine message with params and apply log field defaults
		let dt = moment.utc();
		let dtFormat = "YYYY-MM-DDTHH:mm:ss.SSSZ";

		let logEntry = _.merge(
			{
				"@timestamp"        : dt.format( dtFormat ),
				application: {
					name: me.getSetting( "application" ),
					platform: "node.js",
					component: me.getSetting( "component" ),
					version: null
				},
				log: {
					format: "2018-01",
					data: null,
					transport: [ "@corefw/core-common" ],
					sequence: me._incrementSequence(),
				},
				severity: {
					code: levelInfo.syslogSeverityCode,
					level: levelInfo.syslogSeverity
				},
				source: {
					type: eventType,
					stream: "stdout"
				},
				//metric: null,
				name: finalEventName,
				message: null

			}, me._processEventValues( eventValues )
		);

		// Parse the message mask
		logEntry.message = me._formatLogMessage( messageMask, logEntry );

		// Special logic that injects the Moment object into the log data when
		// linear output is enabled. (this allows us to customize the date/time
		// output)
		if ( linear ) {
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
	 * @param {Object} varValues - arguments for format messageMask
	 * @returns {Logging.Logger} current logger instance
	 */
	add( varValues ) {

		const me = this;

		// Dependencies
		const _ = me.$dep( "lodash" );

		let existing = me.getSetting( "values" );

		if ( !_.isObject( varValues ) ) {

			return me;
		}

		_.each( varValues, function ( varVal, varKey ) {

			existing[ varKey ] = varVal;
		} );

		return me;
	}

	/**
	 * Creates a new Logger instance.
	 *
	 * @param {Object} cfg - Configuration object.
	 * @returns {Logging.Logger} Logger instance.
	 */
	fork( cfg ) {

		const me = this;

		let child		= new Logger( cfg );
		let myPrefix	= me.getSetting( "namePrefix" );
		let childPrefix	= child.getSetting( "namePrefix" );
		let arrPrefix	= [];

		// Dependencies
		const _ = me.$dep( "lodash" );

		// Pass all "shared" values to the child
		child.configure( me.getSharedConfig() );

		// Pass all stored values to the child
		let parentValues = me.getSetting( "values" );
		let childValues;

		if( typeof cfg.values === "object" ) {
			childValues = cfg.values;
		} else {
			childValues = {};
		}

		let combinedValues = _.merge( parentValues, childValues );

		child.setSetting( "values", combinedValues );

		// Allow overriding for the 'component' setting
		if( cfg.component !== undefined && cfg.component !== null ) {
			child.setSetting( "component", cfg.component );
		} else {
			child.setSetting( "component", me.getSetting("component") );
		}

		// Build the namePrefix for the new child
		if ( myPrefix !== "" ) {

			arrPrefix.push( myPrefix );
		}

		if ( childPrefix !== "" ) {

			arrPrefix.push( childPrefix );
		}

		if ( arrPrefix.length > 0 ) {

			child.setSetting( "namePrefix", arrPrefix.join( "." ) );

		} else {

			child.setSetting( "namePrefix", "" );
		}

		// Apply a reference to the parent logger
		child._parentLogger = me;

		// All done
		return child;
	}

	// </editor-fold>

	// <editor-fold desc="--- Generic Configuration Methods ------------------">

	/**
	 * A special method that checks the config and warns for certain settings or
	 * conditions.
	 *
	 * @instance
	 * @private
	 * @returns {void}
	 */
	_displayConfigWarnings() {

		// Warnings are disabled.
		// They might not need to come back.
		// todo: consider what to do here
		return;

		const me = this;

		let hasDisplayedWarnings = me.getSetting( "hasDisplayedWarnings" );

		// We only need to show these once
		if ( hasDisplayedWarnings === true ) {

			return;
		}

		// Warn if no application name is set...
		if ( me.getSetting( "application" ) === "unknown-application" ) {

			me.warn(
				"core-common/logger: No application name set ('application').\n" +
				" - 'application' MUST be provided in production!"
			);
		}

		// Warn if 'inspect' output mode is enabled...
		if ( me.getSetting( "inspect" ) === true ) {

			me.warn(
				"core-common/logger: Inspection mode is enabled ('inspect').\n " +
				" - 'inspect' MUST be disabled (set to false) in production!"
			);
		}

		// Warn if 'linear' output mode is enabled...
		if ( me.getSetting( "linear" ) === true ) {

			me.warn(
				"core-common/logger: Linear output mode is enabled ('linear').\n" +
				" - 'linear' MUST be disabled (set to false) in production!"
			);
		}

		// Set the flag to prevent these warnings
		// from showing more than once.
		me.setSetting( "hasDisplayedWarnings", true );
	}

	/**
	 * Initializes the logger config; this method will setup all of the
	 * appropriate configuration variables using default values. This method is
	 * also idempotent and can be called an unlimited number of times without
	 * any adverse effects.
	 *
	 * @instance
	 * @private
	 * @returns {void}
	 */
	_initConfig() {

		const me = this;

		let applyDefaults = false;

		// me._config stores configuration info
		if ( me._config === undefined ) {

			me._config = {};
			applyDefaults = true;
		}

		// me._config.instance stores configuration info
		// that is NOT passed directly to child loggers.
		if ( me._config.instance === undefined ) {

			me._config.instance = {};
			applyDefaults = true;
		}

		// me._config.shared stores configuration info
		// that IS passed directly to child loggers.
		if ( me._config.shared === undefined ) {

			me._config.shared = {};
			applyDefaults = true;
		}

		// Apply defaults, if necessary
		if ( applyDefaults ) {

			me.resetConfig();
		}
	}

	/**
	 * Returns information about a single logger setting.
	 *
	 * @instance
	 * @private
	 * @throws Error if the provided setting is not known or is otherwise
	 *     invalid.
	 * @param {string} name - The name of the setting to retrieve information
	 *     for.
	 * @returns {Object} Information about the provided setting.
	 */
	_getSettingProperties( name ) {

		const me = this;

		// Dependencies
		// const ERRORS = me.$dep( "errors" );

		let all = me._getAllSettingProperties();

		if ( all[ name ] === undefined ) {

			throw new ERRORS.InvalidArgumentError(
				"Invalid logger setting ('" + name + "')"
			);
		}

		return all[ name ];
	}

	// noinspection JSMethodCanBeStatic
	_getReservedFields() {

		return {
			level      : "pLevel",
			logType    : "pLogType",
			msg        : "pMsg",
			name       : "pName",
			sourceType : "pSourceType",
			sequence   : "pSequence",
			value      : "pValue",
		};
	}

	// noinspection JSMethodCanBeStatic
	/**
	 * Returns information about all of the available logging levels.
	 *
	 * @private
	 * @returns {Object} A plain object containing log-level information.
	 */
	_getLogLevels() {

		let me = this;
		if( me.__logLevelCache === undefined ) {

			// Dependencies
			const _ = me.$dep( "lodash" );

			// Define the log levels using plain-english
			// log level names..
			me.__logLevelCache = {
				trace     : {
					level              : "trace",
					prefix             : "[TRACE] ",
					consoleMethod      : "log",
					shouldPush         : false,
					syslogSeverity     : "debug",
					syslogSeverityCode : 8,
					colors             : {
						severity : "cyan",
						message  : "grey"
					},
				},
				debug     : {
					level              : "debug",
					prefix             : "[DEBUG] ",
					consoleMethod      : "log",
					shouldPush         : false,
					syslogSeverity     : "debug",
					syslogSeverityCode : 7,
					colors             : {
						severity : "cyan",
						message  : "cyan"
					},
				},
				info      : {
					level              : "info",
					prefix             : "",
					consoleMethod      : "log",
					shouldPush         : true,
					syslogSeverity     : "info",
					syslogSeverityCode : 6,
					colors             : {
						severity : "white",
						message  : "white"
					},
				},
				notice    : {
					level              : "notice",
					prefix             : "",
					consoleMethod      : "info",
					shouldPush         : true,
					syslogSeverity     : "notice",
					syslogSeverityCode : 5,
					colors             : {
						severity : "bold",
						message  : "bold"
					},
				},
				warning   : {
					level              : "warning",
					prefix             : "Warning: ",
					consoleMethod      : "warn",
					shouldPush         : true,
					syslogSeverity     : "warning",
					syslogSeverityCode : 4,
					colors             : {
						severity : "yellow",
						message  : "yellow"
					},
				},
				error     : {
					level              : "error",
					prefix             : "Error: ",
					consoleMethod      : "error",
					shouldPush         : true,
					syslogSeverity     : "err",
					syslogSeverityCode : 3,
					colors             : { severity : "red", message : "red" },
				},
				critical  : {
					level              : "critical",
					prefix             : "Critical Error: ",
					consoleMethod      : "error",
					shouldPush         : true,
					syslogSeverity     : "crit",
					syslogSeverityCode : 2,
					colors             : { severity : "red", message : "red" },
				},
				alert     : {
					level              : "alert",
					prefix             : "System Error: ",
					consoleMethod      : "error",
					shouldPush         : true,
					syslogSeverity     : "alert",
					syslogSeverityCode : 1,
					colors             : { severity : "red", message : "red" },
				},
				emergency : {
					level              : "emergency",
					prefix             : "Critical System Error: ",
					consoleMethod      : "error",
					shouldPush         : true,
					syslogSeverity     : "emerg",
					syslogSeverityCode : 0,
					colors             : { severity : "red", message : "red" },
				},
			};

			// Create syslog-specific level information
			_.each( me.__logLevelCache, function( levelInfo, levelName ) {

				levelInfo.isSyslogVariant = false;

				let syslogName = levelInfo.syslogSeverity;
				if( me.__logLevelCache[ syslogName ] === undefined ) {
					me.__logLevelCache[ syslogName ] = _.clone( levelInfo );
					me.__logLevelCache[ syslogName ].isSyslogVariant = true;
				}

			});

		}

		return me.__logLevelCache;

	}

	/**
	 * Returns information about ALL logger settings.
	 *
	 * @instance
	 * @private
	 * @returns {Object} Information about all logger settings.
	 */
	_getAllSettingProperties() {

		const me = this;

		return {
			minLogLevel: {
				shared       : true,
				defaultValue : 6,
			},
			sequence: {
				shared       : true,
				defaultValue : 0,
			},
			pushTimeout: {
				shared       : true,
				defaultValue : 10000,
			},
			inspect: {
				shared       : true,
				defaultValue : false,
			},
			linear: {
				shared       : true,
				defaultValue : false,
			},
			outputToConsole: {
				shared       : true,
				defaultValue : true,
			},
			outputToSqs: {
				shared       : true,
				defaultValue : false,
			},
			outputToViewer: {
				shared       : true,
				defaultValue : false,
			},
			namePrefix: {
				shared       : false,
				defaultValue : "",
				mutator      : function ( val ) {

					return me._formatName( val );
				},
			},
			timings: {
				shared       : false,
				defaultValue : {},
			},
			templates: {
				shared       : true,
				defaultValue : {},
			},
			// outputBuffer: {
			//	shared: true,
			//	defaultValue: []
			// },
			values: {
				shared       : false,
				defaultValue : {},
			},
			application: {
				shared       : true,
				defaultValue : "unknown-application",
			},
			hasDisplayedWarnings: {
				shared       : true,
				defaultValue : false,
			},
			dieOnWarning: {
				shared       : true,
				defaultValue : false,
			},
			dieOnError: {
				shared       : true,
				defaultValue : false,
			},
			dieOnCritical: {
				shared       : true,
				defaultValue : true,
			},
			dieOnAlert: {
				shared       : true,
				defaultValue : true,
			},
			dieOnEmergency: {
				shared       : true,
				defaultValue : true,
			},
			component: {
				shared       : false,
				defaultValue : "mainX"
			}
		};
	}

	/**
	 * Applies a configuration object to the logger. This method will send each
	 * key in the configuration object through
	 * {@link Logging.Logger#setSetting}.
	 *
	 * @instance
	 * @public
	 * @param {Object} cfg - A logger configuration object.
	 * @returns {void}
	 */
	configure( cfg ) {

		const me = this;

		// Dependencies
		const _ = me.$dep( "lodash" );

		// If 'cfg' is a string, we will treat it
		// as a namePrefix setting.
		if ( _.isString( cfg ) ) {

			cfg = {
				namePrefix: cfg,
			};
		}

		// Ensure the config has been initialized
		// and all default values have been loaded.
		me._initConfig();

		// Iterate over each config value
		_.each( cfg, function ( configVal, configName ) {

			me.setSetting( configName, configVal );
		} );
	}

	/**
	 * Sets a single setting for the logger.
	 *
	 * @instance
	 * @public
	 * @param {string} name - The name of the setting to set.
	 * @param {*} value - The new value.
	 * @returns {*} The new setting value.
	 */
	setSetting( name, value ) {

		const me = this;

		let settingInfo = me._getSettingProperties( name );
		let settingStore;

		// Find the proper place to store the setting
		if ( settingInfo.shared === true ) {

			settingStore = me._config.shared;

		} else {

			settingStore = me._config.instance;
		}

		// Mutate value, if applicable
		if ( settingInfo.mutator !== undefined ) {

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
	 * @public
	 * @param {string} name - The name of the setting to get.
	 * @returns {*} The requested setting value.
	 */
	getSetting( name ) {

		const me = this;

		let settingInfo = me._getSettingProperties( name );
		let settingStore;

		// Find the proper place from which to fetch the setting
		if ( settingInfo.shared === true ) {

			settingStore = me._config.shared;

		} else {

			settingStore = me._config.instance;
		}

		// Return the value
		return settingStore[ name ];
	}

	/**
	 * Resets a single setting to its default value.
	 *
	 * @instance
	 * @public
	 * @param {string} name - The setting to reset.
	 * @returns {*} The new setting value (its default value).
	 */
	resetSetting( name ) {

		const me = this;

		let settingInfo = me._getSettingProperties( name );

		// Reset the setting
		return me.setSetting( name, settingInfo.defaultValue );
	}

	/**
	 * Resets all configuration values to their defaults.
	 *
	 * @instance
	 * @public
	 * @returns {void}
	 */
	resetConfig() {

		const me = this;

		// Dependencies
		const _ = me.$dep( "lodash" );

		let settings = me._getAllSettingProperties();

		// Iterate over each setting and reset it
		_.each( settings, function ( settingInfo, settingName ) {

			me.resetSetting( settingName );
		} );
	}

	/**
	 * Gets the full logger configuration as a one-dimensional key/value object.
	 *
	 * @instance
	 * @public
	 * @returns {Object} Full logger configuration.
	 */
	getConfig() {

		const me = this;

		// Dependencies
		const _ = me.$dep( "lodash" );

		let settings	= me._getAllSettingProperties();
		let ret			= {};

		// Iterate over each setting
		_.each( settings, function ( settingInfo, settingName ) {

			ret[ settingName ] = me.getSetting( settingName );
		} );

		// Finished
		return ret;
	}

	/**
	 * Gets the SHARED portions of the logger configuration as a one-dimensional
	 * key/value object.
	 *
	 * @instance
	 * @public
	 * @returns {Object} Shared logger configuration.
	 */
	getSharedConfig() {

		const me = this;

		// Dependencies
		const _ = me.$dep( "lodash" );

		let settings	= me._getAllSettingProperties();
		let ret			= {};

		// Iterate over each setting
		_.each( settings, function ( settingInfo, settingName ) {

			if ( settingInfo.shared === true ) {

				ret[ settingName ] = me.getSetting( settingName );
			}
		} );

		// Finished
		return ret;
	}

	/**
	 * Checks a string to see if it is a properly formatted `name` value for a
	 * log entry.
	 *
	 * @instance
	 * @private
	 * @param {string} name - Log entry name.
	 * @returns {boolean} TRUE if the provided value is a valid name string, or
	 *     FALSE otherwise.
	 */
	_isValidName( name ) {

		const me = this;

		// Dependencies
		const _ = me.$dep( "lodash" );

		let pattern = /^([a-z][a-zA-Z0-9\-]*)(\.[a-z][a-zA-Z0-9\-]*)*$/;

		if ( _.isString( name ) && name.match( pattern ) ) {

			return true;
		}

		return false;
	}

	// noinspection JSMethodCanBeStatic
	/**
	 * Applies formatting and mutations to a string in order to ensure that it
	 * is properly formatted as a log entry `name`.
	 *
	 * @private
	 * @param {string} name - The string to format.
	 * @returns {string} The formatted string.
	 */
	_formatName( name ) {

		// names should always be lower case
		name = name.toLowerCase();

		// convert all invalid characters to dots
		name = name.replace( /[^a-z0-9]+/g, "." );

		// remove preceding dots
		name = name.replace( /^\.+/g, "" );

		// remove dots at the end
		name = name.replace( /\.+$/g, "" );

		// all done
		return name;
	}

	// </editor-fold>

	// <editor-fold desc="--- Extended Configuration Methods -----------------">

	/**
	 * This method resets the `sequence` counter to a zero (literal) value.
	 *
	 * @instance
	 * @public
	 * @returns {number} Always, literally, zero (0).
	 */
	resetSequence() {

		const me = this;

		if ( me._parentLogger === undefined ) {

			return me.resetSetting( "sequence" );
		}

		return me._parentLogger.resetSequence();
	}

	/**
	 * Returns the next sequence number/id.
	 *
	 * @instance
	 * @private
	 * @returns {number} Next sequence number/id.
	 */
	_incrementSequence() {

		const me = this;

		let seq;

		if ( me._parentLogger === undefined ) {

			seq = me.getSetting( "sequence" );
			seq++;
			me.setSetting( "sequence", seq );

		} else {

			seq = me._parentLogger._incrementSequence();
		}

		return seq;
	}

	/**
	 * Set context for logger.
	 *
	 * @param {string} newContext - Context of logger.
	 * @returns {void}
	 */
	setContext( newContext ) {

		const me = this;

		me.context = newContext;
	}

	/**
	 * Config for SQS pushing.
	 *
	 * @param {Object} [config] - SQS config.
	 * @param {string} [config.customerId] - AWS account ID.
	 * @param {string} [config.sqsQueue] - SQS queue for push.
	 * @param {string} [config.accessKeyId] - AWS access key id.
	 * @param {string} [config.secretAccessKey] - AWS secret access key.
	 * @param {string} [config.region] - AWS region.
	 * @returns {void}
	 */
	setSQSConfig( config ) {

		const me = this;

		// Dependencies
		const _ = me.$dep( "lodash" );

		let awsConfig = me._getAwsConfig();

		_.extend( awsConfig, {
			customerId      : config.customerId,
			sqsQueue        : config.sqsQueue,
			accessKeyId     : config.accessKeyId,
			secretAccessKey : config.secretAccessKey,
			region          : config.region,
		} );
	}

	// noinspection JSMethodCanBeStatic
	/**
	 * Gets the AWS config information for the logger.
	 *
	 * @private
	 * @returns {Object} AWS config object.
	 */
	_getAwsConfig() {

		return {
			accessKeyId     : process.env.LOGGER_AWS_ACCESS_KEY_ID,
			secretAccessKey : process.env.LOGGER_AWS_SECRET_ACCESS_KEY,
			region          : process.env.LOGGER_AWS_REGION,
			customerId      : process.env.LOGGER_AWS_CUSTOMER_ID,
			sqsQueue        : process.env.LOGGER_AWS_SQS_QUEUE,
		};
	}

	/**
	 * This method renames reserved field names.
	 *
	 * @param {Object} params - Arguments for format messageMask.
	 * @returns {Object} Params with renamed reserved fields.
	 */
	_processEventValues( params ) {

		const me = this;

		// Dependencies
		const _ = me.$dep( "lodash" );

		let reservedFields = me._getReservedFields();

		if ( !params ) {

			return {};
		}

		_.each( reservedFields, function ( newField, field ) {

			if ( params[ field ] ) {

				params[ newField ] = params[ field ];
				delete params[ field ];
			}
		} );

		return params;
	}

	// </editor-fold>

	// <editor-fold desc="--- Metric and Timing Methods ----------------------">

	/**
	 * This method creates a log entry for metrics.
	 *
	 * @public
	 * @param {string} type - Metric type.
	 * @param {*} value - Metric value.
	 * @param {string} name - The name of the log event and metric.
	 * @param {string} [messageMask] - Message mask content of log entry.
	 * @param {Object} [params] - Arguments for format messageMask.
	 * @returns {?Object} The log entry.
	 */
	logMetric( type, value, name, messageMask, params ) {

		const me = this;
		let metricName;

		// Dependencies
		// const ERRORS	= me.$dep( "errors" );
		const TIPE = me.$dep( "tipe" );

		// Validate/coerce the metric type
		if( type !== "timing" && type !== "gauge" ) {
			type = "count";
		}

		// Code for object naming
		if ( TIPE( name ) === "object" ) {
			params = messageMask || name;
			messageMask = name.mask || name.name;
			name = name.name;
		}

		// Variant for missed params
		if ( !( name && TIPE( name ) === "string" ) ) {

			throw new ERRORS.InvalidArgumentError(
				"Missed required values for `messageMask` or `name`"
			);
		}

		// Method signature variations..
		if( TIPE( name ) === "object" ) {

			// If the 3rd argument, 'name', is an object...

			if( messageMask === undefined || messageMask === null ) {

				// ... and the 4th argument is also null or missing, then
				// we'll interpret the signature as ...
				//
				//      logMetric( type, value, params )
				//
				// ... and we'll expect params.name to exist.

				if( params.name === undefined || params.name === null ) {
					throw new ERRORS.InvalidArgumentError(
						"Missing params.name argument in Logger#logMetric()"
					);
				} else {
					name = params.name;
				}

				if( params.messageMask === undefined || params.messageMask === null ) {
					messageMask = name;
				} else {
					messageMask = params.messageMask;
				}

			} else {

				// ... but the 4th argument is provided, then we'll interpret
				// the signature as:
				//
				//      logMetric( type, value, params, name )
				//

				name = messageMask;

				if( params.messageMask === undefined || params.messageMask === null ) {
					messageMask = name;
				} else {
					messageMask = params.messageMask;
				}

			}

			// interpret the signature as:
			//
			//      logMetric( type, value, params )
			//


		} else if( params === undefined || params === null ) {

			// If any params are omitted, the final param, "params",
			// will be undefined or null.

			if( messageMask === undefined || messageMask === null ) {

				// If the 2nd to last parameter is also missing, interpret
				// the signature as:
				//
				//      logMetric( type, value, name )
				//

				// If we do not have a message mask, we will
				// default the message to the name of the metric
				messageMask = name;

				// Create a default params object
				params = {};

			} else if( TIPE( messageMask ) === "object" ) {

				// If the 2nd to last parameter is an object, then it
				// must be the 'params', thus the signature would be:
				//
				//      logMetric( type, value, name, params )
				//

				// Shift the params argument
				params = messageMask;

				// If we do not have a message mask, we will
				// default the message to the name of the metric
				messageMask = name;

			} else {

				// If params was not provided, but none of the other
				// signature checks, above, matched, then we'll interpret
				// the signature as:
				//
				//      logMetric( type, value, name, messageMask )
				//

				// Create a default params object
				params = {};

			}

		}

		if ( !params && ( !messageMask || TIPE( messageMask === "object" ) ) ) {
			params = messageMask;
			messageMask = name;
			//console.log("<<HIT>>");
		}

		// Format the name
		name = me._formatLogMessage( name, params );
		metricName = name;
		name += "." + type;

		// Mutate the mask..
		// Convert {{value}} to {{metric.value}}
		if( messageMask.indexOf("{{value}}") !== -1 ) {
			messageMask = messageMask.replace(/\{\{value\}\}/ig, "{{metric.value}}" );
		}

		// Ensure the metric value exists somewhere in the message mask
		if( messageMask.indexOf("{{metric.value}}") === -1 ) {
			messageMask = "{{metric.value}} " + messageMask;
		}

		// Surround {{metric.value}} in braces..
		messageMask = messageMask.replace(/\{\{metric.value\}\}/ig, "[{{metric.value}}]" );

		// Apply "ms" suffix for timing metrics
		if( type === "timing" ) {
			messageMask = messageMask.replace(/\{\{metric.value\}\}/ig, "{{metric.value}}ms" );
		}

		// Create the metric-info object in the event
		params.metric = {
			type  : type,
			id    : metricName,
			value : value
		};
		params.source = {
			type: "metric"
		};

		return me.info(
			name, messageMask, params
		);

	}

	/**
	 * This method initiates a timing calculation by name.
	 *
	 * @param {String | Object} name - The name of the timing metric.
	 * @param {string} [name.name] - The name of the timing metric.
	 * @returns {void}
	 */
	timingStart( name ) {

		const me = this;

		me.timings[ name.name || name ] = new Date().getTime();
	}

	/**
	 * This method finishes a timing calculation by name and logs the result.
	 *
	 * @param {String | Object} name - The name of the timing metric
	 * @param {string} [name.name] - The name of the timing metric
	 * @param {string} [name.mask] - Message mask content of log entry.
	 * @param {string} [messageMask] - Message mask content of log entry.
	 * @param {Object} [params] - Arguments for format messageMask.
	 * @returns {Object} Log entry.
	 */
	timingStop( name, messageMask, params ) {

		const me = this;

		// Variable for timing value
		let value;

		value = new Date().getTime() - me.timings[ name.name || name ];

		delete me.timings[ name ];

		return me.timing( value, name, messageMask, params );
	}

	/**
	 * This method logs a timing calculation by value.
	 *
	 * @param {string} value - Timing value in ms.
	 * @param {String | Object} name - The name of the timing metric
	 * @param {string} [name.name] - The name of the timing metric
	 * @param {string} [name.mask] - Message mask content of log entry.
	 * @param {string} [messageMask] - Message mask content of log entry.
	 * @param {Object} [params] - Arguments for format messageMask.
	 * @returns {Object} Log entry.
	 */
	timing( value, name, messageMask, params ) {

		const me = this;

		return me.logMetric(
			"timing",
			value, name, messageMask, params
		);
	}

	/**
	 * This method logs a count metric.
	 *
	 * @param {number} value - The value of the metric
	 * @param {string | object} name - The name of the metric
	 * @param {string} [name.name] - The name of the metric
	 * @param {string} [name.mask] - Message mask content of log entry.
	 * @param {string} [messageMask] - Message mask content of log entry.
	 * @param {Object} [params] - Arguments for format messageMask.
	 * @returns {Object} Log entry.
	 */
	count( value, name, messageMask, params ) {

		const me = this;

		return me.logMetric(
			"count",
			value, name, messageMask, params
		);

	}

	/**
	 * This method logs a gauge metric.
	 *
	 * @param {number} value - The value of the metric
	 * @param {string | object} name - The name of the metric
	 * @param {string} [name.name] - The name of the metric
	 * @param {string} [name.mask] - Message mask content of log entry.
	 * @param {string} [messageMask] - Message mask content of log entry.
	 * @param {Object} [params] - Arguments for format messageMask.
	 * @returns {Object} Log entry.
	 */
	gauge( value, name, messageMask, params ) {

		const me = this;

		return me.logMetric(
			"gauge",
			value, name, messageMask, params
		);

	}

	// </editor-fold>

	// <editor-fold desc="--- Log output methods -----------------------------">

	/**
	 * Push data to external handlers.
	 *
	 * @private
	 * @param {Object | Function} [data] - Data sent.
	 * @param {Function} [callback] - Callback function.
	 * @returns {Promise.<*>} Callback return value or FALSE if not callback is
	 *     provided.
	 */
	_outputLogData( data, callback ) {

		const me = this;

		// Dependencies
		const BB	= me.$dep( "bluebird" );
		const _		= me.$dep( "lodash" );
		const TIPE	= me.$dep( "tipe" );

		if ( !data ) {

			data = _.clone( me._shared.logResults );
			me._shared.logResults.length = 0;
			callback = _.noop;
		}

		if ( TIPE( data ) === "function" ) {

			callback = data;
			data = _.clone( me._shared.logResults );
			me._shared.logResults.length = 0;
		}

		if ( me.pushTimeout ) {

			clearTimeout( me.pushTimeout );
		}

		return BB.resolve().then( function () {

			if ( me._shared.outputToSqs ) {

				return me._outputToSqs( data );
			}

			return BB.resolve();

		} ).then( function () {

			if ( me._shared.allowViewerPushing ) {

				return me._outputToViewer( data );
			}

			return BB.resolve();

		} ).then( function () {

			return callback ? callback() : false;

		} ).catch( function () {

			return callback ? callback() : false;
		} );
	}

	/**
	 * Outputs a log entry to the console.
	 *
	 * @private
	 * @param {Object} levelInfo - Level information.
	 * @param {Object} logEntry - Log entry.
	 * @returns {void}
	 */
	_outputToConsole( levelInfo, logEntry ) {

		const me = this;

		// Dependencies
		const eyes = me.$dep( "eyes" );

		let otc = me.getSetting( "outputToConsole" );
		let streamName;

		// Determine if console output should be skipped
		if ( otc !== true ) {

			return;
		}

		// error, warn, info, log, trace
		switch ( levelInfo.consoleMethod ) {

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

		logEntry.source.stream = streamName;

		if ( me.getSetting( "inspect" ) === true ) {

			eyes.inspect( logEntry );

		} else if ( me.getSetting( "linear" ) === true ) {

			me._outputLinear( logEntry.message, levelInfo, logEntry );

		} else {

			console[ levelInfo.consoleMethod ]( JSON.stringify( logEntry ) );
		}
	}

	/**
	 * Outputs log data in a linear format when `_shared.linear` is `true`.
	 *
	 * @private
	 * @param {string} message - Log message.
	 * @param {Object} levelInfo - Level information.
	 * @param {Object} logEntry - Log entry.
	 * @returns {void}
	 */
	_outputLinear( message, levelInfo, logEntry ) {

		const me = this;

		// Dependencies
		const _		= me.$dep( "lodash" );
		const chalk	= me.$dep( "chalk" );

		let str;
		let severity;
		let levelSettings;
		let severityColor;
		let messageColor;

		// Settings
		const allLogLevels = me._getLogLevels();

		// Handle multi-line
		if ( message.indexOf( "\n" ) !== -1 ) {

			let spl = message.split( "\n" );

			_.each( spl, function ( line ) {

				me._outputLinear( line, levelInfo, logEntry );
			} );

			return;
		}

		// Start with the timestamp
		if ( logEntry._moment !== undefined ) {

			str = chalk.gray( logEntry._moment.format( "HH:mm:ss.SSS" ) );
			delete logEntry._moment;

		} else {

			str = chalk.white( logEntry[ "@timestamp" ] );
		}

		// Resolve the color coding
		severity 		= logEntry.severity.level;
		levelSettings 	= allLogLevels[ severity ];
		severityColor 	= levelSettings.colors.severity;
		messageColor 	= levelSettings.colors.message;

		// Override the color for metrics
		if( logEntry.metric !== undefined && logEntry.metric !== null ) {
			severityColor = messageColor = "cyan";
		}

		// Build the string
		str += chalk[ severityColor ](
			" [ " + _.padEnd( logEntry.severity.level, 7 ) + " ] " +
			" [ " + _.padEnd( chalk.green( logEntry.application.component ), 30 ) + " ] "
		);

		str += chalk[ messageColor ]( message );
		str += " " + chalk.grey( "(" + logEntry.name + ")" );

		console.log( str );
	}

	/**
	 * Send data to SQS.
	 *
	 * @private
	 * @param {Object | Function} data - Data sent into SQS.
	 * @returns {Promise} Promise. // TODO: promise payload type
	 */
	_outputToSqs( data ) {

		const me = this;

		// Dependencies
		const BB	= me.$dep( "bluebird" );
		const _		= me.$dep( "lodash" );
		const uuid	= me.$dep( "uuid" );

		let awsConfig = me._getAwsConfig();

		if ( !(
			awsConfig.accessKeyId &&
			awsConfig.customerId &&
			awsConfig.region &&
			awsConfig.secretAccessKey &&
			awsConfig.sqsQueue
		) ) {

			return BB.resolve();
		}

		return new BB( function ( resolve, reject ) {

			return me.getSQSQueue( function ( err, queueURL ) {

				let batchMessages = [];
				let i;

				// Error handling
				if ( err ) {

					reject( err );
				}

				if ( !_.isArray( data ) ) {

					data = [ data ];
				}

				for ( i = 0; i < data.length / 10; i += 1 ) {

					batchMessages.push( data.slice( i * 10, i * 10 + 10 ) );
				}

				return BB.reduce( batchMessages,
					function ( index, pack ) {

						return me.sqs.sendMessageBatchAsync( {
							Entries: pack.map( function ( message ) {

								return {
									Id          : uuid(),
									MessageBody : JSON.stringify( message ),
								};
							} ),
							QueueUrl: queueURL,
						} );

					}, 0 ).then( resolve ).catch( reject );
			} );
		} );
	}

	/**
	 * Outputs log data to the log viewer.
	 *
	 * @private
	 * @param {*} data - Log data.
	 * @returns {Promise} Promise. // TODO: promise payload type
	 */
	_outputToViewer( data ) {

		const me = this;

		// Dependencies
		const BB	= me.$dep( "bluebird" );
		const _		= me.$dep( "lodash" );

		if ( !( me._shared.allowViewerPushing && data ) ) {

			return BB.resolve();
		}

		if ( !_.isArray( data ) ) {

			data = [ data ];
		}

		return new BB( function promiseBody( resolve ) {

			// Dependencies
			const http = me.$dep( "http" );

			let url = "/logs";
			let options;
			let req;

			options = {
				hostname : me._shared.viewerHost,
				port     : me._shared.viewerPort,
				path     : url,
				method   : "POST",
				headers  : {
					"Content-Type": "application/json",
				},
			};

			req = http.request( options, function ( res ) {

				res.setEncoding( "utf8" );

				// Without data event, end event does not fire
				res.on( "data", function () {

				} );

				res.on( "end", function () {

					// For Lambda Context
					resolve();
				} );
			} );

			req.on( "error", function () {

				// Since we don't handle error of logs pushing then just
				// resolve promise
				resolve();
			} );

			// Write data to request body
			req.write( JSON.stringify( {
				logs: data,
			} ) );

			return req.end();
		} );
	}

	// </editor-fold>

	// <editor-fold desc="--- Severity-Level-Specific Output Methods ---------">

	/**
	 * Create a new log event with `trace` severity. This method is a
	 * convenience alias for {@link Logging.Logger#log} and is the preferred way
	 * for logging `trace` messages.
	 *
	 * @param {String | Object} name - Name of log entry.
	 * @param {string} [name.name] - Name of log entry.
	 * @param {string} [name.mask] - Message mask content of log entry.
	 * @param {string} [messageMask] - Message mask content of log entry.
	 * @param {Object} [params] - Arguments for format messageMask.
	 * @returns {Object} Log entry.
	 */
	trace( name, messageMask, params ) {

		const me = this;

		return me.log( "trace", name, messageMask, params );
	}

	/**
	 * Create a new log event with `debug` severity. This method is a
	 * convenience alias for {@link Logging.Logger#log} and is the preferred way
	 * for logging `debug` messages.
	 *
	 * @param {String | Object} name - Name of log entry.
	 * @param {string} [name.name] - Name of log entry.
	 * @param {string} [name.mask] - Message mask content of log entry.
	 * @param {string} [messageMask] - Message mask content of log entry.
	 * @param {Object} [params] - Arguments for format messageMask.
	 * @returns {Object} Log entry.
	 */
	debug( name, messageMask, params ) {

		const me = this;

		return me.log( "debug", name, messageMask, params );
	}

	/**
	 * Create a new log event with `info` severity. This method is a
	 * convenience alias for {@link Logging.Logger#log} and is the preferred way
	 * for logging `info` messages.
	 *
	 * @param {String | Object} name - Name of log entry.
	 * @param {string} [name.name] - Name of log entry.
	 * @param {string} [name.mask] - Message mask content of log entry.
	 * @param {string} [messageMask] - Message mask content of log entry.
	 * @param {Object} [params] - Arguments for format messageMask.
	 * @returns {Object} Log entry.
	 */
	info( name, messageMask, params ) {

		const me = this;

		return me.log( "info", name, messageMask, params );
	}

	/**
	 * Create a new log event with `notice` severity. This method is a
	 * convenience alias for {@link Logging.Logger#log} and is the preferred way
	 * for logging `notice` messages.
	 *
	 * @param {String | Object} name - Name of log entry.
	 * @param {string} [name.name] - Name of log entry.
	 * @param {string} [name.mask] - Message mask content of log entry.
	 * @param {string} [messageMask] - Message mask content of log entry.
	 * @param {Object} [params] - Arguments for format messageMask.
	 * @returns {Object} Log entry.
	 */
	notice( name, messageMask, params ) {

		const me = this;

		return me.log( "notice", name, messageMask, params );
	}

	/**
	 * Create a new log event with `warning` severity. This method is a
	 * convenience alias for {@link Logging.Logger#log} and is the preferred way
	 * for logging `warning` messages.
	 *
	 * @param {String | Object} name - Name of log entry.
	 * @param {string} [name.name] - Name of log entry.
	 * @param {string} [name.mask] - Message mask content of log entry.
	 * @param {string} [messageMask] - Message mask content of log entry.
	 * @param {Object} [params] - Arguments for format messageMask.
	 * @returns {Object} Log entry.
	 */
	warning( name, messageMask, params ) {

		const me = this;

		return me.log( "warning", name, messageMask, params );
	}

	/**
	 * Convenience alias for {@link Logging.Logger.#warning}.
	 *
	 * @param {String | Object} name - Name of log entry.
	 * @param {string} [name.name] - Name of log entry.
	 * @param {string} [name.mask] - Message mask content of log entry.
	 * @param {string} [messageMask] - Message mask content of log entry.
	 * @param {Object} [params] - Arguments for format messageMask.
	 * @returns {Object} Log entry.
	 */
	warn( name, messageMask, params ) {

		const me = this;

		return me.warning( name, messageMask, params );
	}

	/**
	 * Create a new log event with `error` severity. This method is a
	 * convenience alias for {@link Logging.Logger#log} and is the preferred way
	 * for logging `error` messages.
	 *
	 * @param {String | Object} name - Name of log entry.
	 * @param {string} [name.name] - Name of log entry.
	 * @param {string} [name.mask] - Message mask content of log entry.
	 * @param {string} [messageMask] - Message mask content of log entry.
	 * @param {Object} [params] - Arguments for format messageMask.
	 * @returns {Object} Log entry.
	 */
	error( name, messageMask, params ) {

		const me = this;

		return me.log( "error", name, messageMask, params );
	}

	/**
	 * Create a new log event with `critical` severity. This method is a
	 * convenience alias for {@link Logging.Logger#log} and is the preferred way
	 * for logging `critical` messages.
	 *
	 * @param {String | Object} name - Name of log entry.
	 * @param {string} [name.name] - Name of log entry.
	 * @param {string} [name.mask] - Message mask content of log entry.
	 * @param {string} [messageMask] - Message mask content of log entry.
	 * @param {Object} [params] - Arguments for format messageMask.
	 * @returns {Object} Log entry.
	 */
	critical( name, messageMask, params ) {

		const me = this;

		return me.log( "critical", name, messageMask, params );
	}

	/**
	 * Create a new log event with `alert` severity. This method is a
	 * convenience alias for {@link Logging.Logger#log} and is the preferred way
	 * for logging `alert` messages.
	 *
	 * @param {String | Object} name - Name of log entry.
	 * @param {string} [name.name] - Name of log entry.
	 * @param {string} [name.mask] - Message mask content of log entry.
	 * @param {string} [messageMask] - Message mask content of log entry.
	 * @param {Object} [params] - Arguments for format messageMask.
	 * @returns {Object} Log entry.
	 */
	alert( name, messageMask, params ) {

		const me = this;

		return me.log( "alert", name, messageMask, params );
	}

	/**
	 * Create a new log event with `emergency` severity. This method is a
	 * convenience alias for {@link Logging.Logger#log} and is the preferred way
	 * for logging `emergency` messages.
	 *
	 * @param {String | Object} name - Name of log entry.
	 * @param {string} [name.name] - Name of log entry.
	 * @param {string} [name.mask] - Message mask content of log entry.
	 * @param {string} [messageMask] - Message mask content of log entry.
	 * @param {Object} [params] - Arguments for format messageMask.
	 * @returns {Object} Log entry.
	 */
	emergency( name, messageMask, params ) {

		const me = this;

		return me.log( "emergency", name, messageMask, params );
	}

	// </editor-fold>

	// <editor-fold desc="--- Misc Utility and Specialist Methods ------------">

	/**
	 * This function formats mask by params in Mustache.js-style template.
	 *
	 * @private
	 * @param {string} messageMask - Message mask content of log entry.
	 * @param {Object} logValues - Arguments for format messageMask.
	 * @returns {string} The formatted log message.
	 */
	_formatLogMessage( messageMask, logValues ) {

		const me = this;

		// Dependencies
		const _ = me.$dep( "lodash" );

		// Templates
		let templates = me.getSetting( "templates" );
		let template;
		let result;

		if ( !messageMask || _.isEmpty( logValues ) ) {

			return messageMask;
		}

		// Cache-like mechanism for storing templates
		if ( templates[ messageMask ] === undefined ) {

			// Workaround for missed template variables
			messageMask = messageMask.replace( /{{/g, "{{data." );

			template = _.template( messageMask );
			templates[ messageMask ] = template;

		} else {

			template = templates[ messageMask ];
		}

		result = template({
			data: logValues
		});

		/*
		result = template( {
			data: _.mapValues( logValues, function ( value, key ) {

				console.log("== " + key);

				if ( _.isNumber( value ) ) {

					return "[" +
						value +
						(
							logValues &&
							logValues.metricType === "timing" ? "ms" : ""
						) +
						"]";
				}

				return value;
			} ),
		} );
		*/

		// Workaround for missed template variables back
		return result.replace( /{{data\./g, "{{" );
	}

	/**
	 * That method pushed. // TODO: ???
	 * @returns {*}
	 */
	checkLogResults() {

		const me = this;

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
	 * @param {Function} callback - Callback.
	 * @returns {void}
	 */
	getSQSQueue( callback ) {

		const me = this;

		// Dependencies
		const BB 	= me.$dep( "bluebird" );
		const util 	= me.$dep( "util" );
		const aws 	= me.$dep( "aws-sdk" );

		let awsConfig = me._getAwsConfig();
		let url;

		aws.config.update( awsConfig );

		me.sqs = BB.promisifyAll( me.sqs || new aws.SQS() );

		url = util.format(
			"https://sqs.%s.amazonaws.com/%s/%s",
			awsConfig.region,
			awsConfig.customerId,
			awsConfig.sqsQueue
		);

		callback( null, url );
	}

	// </editor-fold>

	// <editor-fold desc="--- Argument Parsing for Logs and Metrics ----------">

	/**
	 * This utility function is used to process arguments passed to the
	 * {@link Logging.Logger#log} method.
	 *
	 * @instance
	 * @private
	 * @returns {{name: null, mask: null, values: {}}} The parsed log arguments.
	 */
	_parseLogArguments() {

		const me = this;

		// Dependencies
		const _ = me.$dep( "lodash" );

		// Init Return
		let ret = {
			name   : null,
			mask   : null,
			values : {},
		};

		_.each( arguments, function ( arg ) {

			me._parseOneLogArgument( arg, ret );
		} );

		// If a 'name' was matched, but a 'mask' was not, then we
		// should assume that we improperly matched on the 'name'
		// field and that the implementor intended for that to be
		// the message/mask.
		if ( ret.mask === null && ret.name !== null ) {

			ret.mask = ret.name;
			ret.name = null;
		}

		// Apply defaults
		if ( ret.name === null ) {

			ret.name = "";
		}

		if ( ret.mask === null ) {

			ret.mask = "";
		}

		return ret;
	}

	/**
	 * This utility function services the {@link Logging.Logger#log} method by
	 * processing a single function argument from its params.
	 *
	 * @instance
	 * @private
	 * @param {*} val - The argument to process.
	 * @param {Object} ret - A reference for the current processed values.
	 * @returns {void}
	 */
	_parseOneLogArgument( val, ret ) {

		const me = this;

		// Dependencies
		// const ERRORS 	= me.$dep( "errors" );
		const _ = me.$dep( "lodash" );

		// Ignore undefined and NULL values
		if ( val === undefined || val === null ) {

			return;
		}

		// Processing for string params...
		if ( _.isString( val ) ) {

			// If the name is already set, then this SHOULD
			// be the message mask...
			if ( ret.name !== null ) {

				// But, if the mask is already set, then
				// we have a problem...
				if ( ret.mask !== null ) {

					throw new ERRORS.InvalidArgumentError(
						"Invalid argument passed to log() method. " +
						"An extra string parameter ('" + val + "') was " +
						"passed with an event that already has a 'name' and " +
						"message 'mask'."
					);
				}

				ret.mask = val;

				return;
			}

			// If we're here, then .name is not set...
			// So, next we need to see if the value is a proper `name` value
			if ( me._isValidName( val ) ) {

				// It is... so, we can move on...
				ret.name = val;

				return;
			}

			// The string is not a valid name, so it SHOULD
			// be the message mask... but, if the mask is already set, then
			// we have a problem...
			if ( ret.mask !== null ) {

				throw new ERRORS.InvalidArgumentError(
					"Invalid argument passed to log() method. " +
					"An extra string parameter ('" + val + "'), which is NOT " +
					"a valid 'name' string, was passed with an event that " +
					"already has a message 'mask'."
				);
			}

			ret.mask = val;

			return;
		}

		// Processing for Error objects
		if ( _.isError( val ) ) {

			ret.values.error = {};

			ret.values.error.message = val.message;
			ret.values.error.type    = val.name;
			ret.values.error.source  = {
				stack : val.stack
			};

			let rgx	= /\s+at\s+([^(]+)\(([^:]+):(\d+):(\d+)\)/;
			let mt	= rgx.exec( ret.values.error.source.stack );

			if ( mt === null ) {

				ret.values.error.source.function	= "unknown";
				ret.values.error.source.file		= "unknown";
				ret.values.error.source.line		= 0;
				ret.values.error.source.column		= 0;

			} else {

				ret.values.error.source.function	= _.trim( mt[ 1 ] );
				ret.values.error.source.file		= _.trim( mt[ 2 ] );
				ret.values.error.source.line		= parseInt( mt[ 3 ], 10 );
				ret.values.error.source.column		= parseInt( mt[ 4 ], 10 );

			}

			if ( ret.mask === null ) {

				ret.mask = val.message;
			}

			return;
		}

		// Processing all other objects
		if ( _.isObject( val ) ) {

			// Objects can be pretty diverse. In general,
			// we will consider all keys to be 'values' unless
			// they match special, hard-coded, key names.

			_.each( val, function ( objVal, objKey ) {

				switch ( objKey ) {

					case "mask":
					case "message":

						if ( ret.mask === null ) {

							// If no mask currently exists,
							// we can simply set it...
							ret.mask = objVal;

						} else {

							// If a mask already exists,
							// we will append it...
							ret.mask += ": " + objVal;
						}

						break;

					case "name":

						objVal = me._formatName( objVal );

						if ( ret.name === null ) {

							// If no name currently exists,
							// we can simply set it...
							ret.name = objVal;

						} else {

							// If a name already exists,
							// we will append it...
							ret.name += "." + objVal;
						}

						break;

					case "values":

						// Apply each value...
						_.each( objVal, function ( valV, valK ) {

							ret.values[ valK ] = valV;
						} );

						break;

					default:

						// Everything else will be considered as a 'value'
						ret.values[ objKey ] = objVal;
						break;
				}
			} );
		}
	}


	// </editor-fold>
}

module.exports = Logger;
