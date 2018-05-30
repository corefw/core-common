/**
 * @file Defines the Validator class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @author Kevin Sanders <kevin@c2cschools.com>
 * @since 5.0.0
 * @license See LICENSE.md for details about licensing.
 * @copyright 2017 C2C Schools, LLC
 */

"use strict";

const BaseClass	= require( "../common/BaseClass" );
const ERRORS	= require( "../errors" );

/**
 * This utility class facilitates validation, especially of JavaScript and JSON
 * objects against JSON Schemas.
 *
 * @memberOf Util
 * @extends Common.BaseClass
 */
class Validator extends BaseClass {

	/**
	 * @inheritDoc
	 */
	_initialize( cfg ) {

		const me = this;

		// Call parent
		super._initialize( cfg );

		// Add format validators
		me.formats = {
			"int8": {
				type     : "number",
				validate : function ( data ) {

					data = Number( data );

					if ( data <= 127 && data >= -128 ) {

						return true;
					}

					return false;
				},
			},
			"int16": {
				type     : "number",
				validate : function ( data ) {

					data = Number( data );

					if ( data <= 32767 && data >= -32768 ) {

						return true;
					}

					return false;
				},
			},
			"int32": {
				type     : "number",
				validate : function ( data ) {

					data = Number( data );

					if ( data <= 2147483647 && data >= -2147483648 ) {

						return true;
					}

					return false;
				},
			},
		};

		// Execute immediately, if requested
		if ( cfg.immediate === true ) {

			me.validate();
		}
	}

	/**
	 * The data to be validated.
	 *
	 * @public
	 * @type {Object}
	 */
	get data() {

		const me = this;

		return me.getConfigValue( "data", null );
	}

	set data( /** Object */ val ) {

		const me = this;

		me.setConfigValue( "data", val );
	}

	/**
	 * The schema that will be used in the validation of `data`.
	 *
	 * @public
	 * @type {Object}
	 */
	get schema() {

		const me = this;

		return me.getConfigValue( "schema", null );
	}

	set schema( /** Object */ val ) {

		const me = this;

		me.setConfigValue( "schema", val );
	}

	/**
	 * When TRUE, validation will be skipped (passed) if either the `data` or
	 * `schema` is NULL.
	 *
	 * @public
	 * @type {boolean}
	 * @default false
	 */
	get skipIfNull() {

		const me = this;

		return me.getConfigValue( "skipIfNull", false );
	}

	set skipIfNull( /** boolean */ val ) {

		const me = this;

		me.setConfigValue( "skipIfNull", val );
	}

	/**
	 * When TRUE, validation errors will be thrown verbatim (not wrapped by a
	 * custom error).
	 *
	 * @public
	 * @type {boolean}
	 * @default false
	 */
	get throwAJVErrors() {

		const me = this;

		return me.getConfigValue( "throwAJVErrors", false );
	}

	set throwAJVErrors( /** boolean */ val ) {

		const me = this;

		me.setConfigValue( "throwAJVErrors", val );
	}

	/**
	 * Stores schema `definitions` (refs/references) that will be used to
	 * populate the schema with common schema parts before validation.
	 *
	 * @public
	 * @type {?Object}
	 * @default null
	 */
	get definitions() {

		const me = this;

		return me.getConfigValue( "definitions", null );
	}

	set definitions( /** ?Object */ val ) {

		const me = this;

		me.setConfigValue( "definitions", val );
	}

	/**
	 * Starts a validation operation.
	 *
	 * @param {?Object} [cfg=null] - Optional configuration values that will be
	 *     used to configure the validator prior to validation. Any
	 *     configuration setting that can be passed to the Validator's
	 *     constructor can also be passed here.
	 * @returns {void} Errors will be thrown if validation fails.
	 */
	validate( cfg ) {

		const me = this;

		// Apply New Config
		me.setConfigValues( cfg );

		// Skip if necessary
		if ( me.skipIfNull && ( me.data === null || me.schema === null ) ) {

			return;
		}

		// Do it
		me._validateObject( me.data, me.schema );
	}

	/**
	 * This method executes the `AJV` validator on a provided object.
	 *
	 * @private
	 * @throws {Errors.UnrecognizedParameterError}
	 * @throws {Errors.MissingParameterError}
	 * @throws {Errors.InvalidParameterError}
	 * @param {Object} data - The data to validate.
	 * @param {Object} schema - A "JSON Schema" object
	 * @returns {void} This method will THROW if validation fails, but otherwise
	 *     it does not return anything.
	 */
	_validateObject( data, schema ) {

		const me = this;

		// Dependencies
		const _		= me.$dep( "lodash" );
		const AJV	= me.$dep( "ajv" );

		// Create AJV validator instance

		let ajv = new AJV( {
			coerceTypes  : true,
			jsonPointers : true,
		} );

		// Apply formats

		let formats = me.formats;

		if ( formats !== null ) {

			_.each( formats, function ( v, k ) {

				ajv.addFormat( k, v );
			} );
		}

		// Apply Definitions

		let definitions	= me.definitions;

		if ( definitions !== null ) {

			_.each( definitions, function ( v, k ) {

				ajv.addSchema( v, k );
			} );
		}

		// Prepare Schema

		schema = me._prepareSchema( schema );

		// Validate

		let validate	= ajv.compile( schema );
		let valid		= validate( data );

		if ( !valid ) {

			let err;

			if ( me.throwAJVErrors ) {

				err = validate.errors[ 0 ];

			} else {

				err = me._createValidationError( validate.errors[ 0 ] );
			}

			throw err;
		}

		// Check for missing schemas
		// if ( TV4.missing.length > 0 ) {
		//
		// 	throw new ERRORS.MissingSchemaDefinitionError(
		// 		"Missing definition for $ref:" + TV4.missing[ 0 ]
		// 	);
		// }
	}

	// noinspection JSMethodCanBeStatic
	/**
	 * This method provides an error customization layer on top of `AJV`
	 * validation, which assists in making API errors, that are caused by
	 * request param validation failures, more intuitive to the client.
	 *
	 * @private
	 * @throws {Errors.UnrecognizedParameterError}
	 * @throws {Errors.MissingParameterError}
	 * @throws {Errors.InvalidParameterError}
	 * @param {Error} ajvError - An error generated by `AJV` during a failed
	 *     validation operation.
	 * @returns {Errors.BaseError} Validation error object.
	 */
	_createValidationError( ajvError ) {

		// console.log( JSON.stringify( ajvError, null, 2 ) );

		let keyword				= ajvError.keyword;
		let paramName			= ajvError.dataPath;
		let isRootParamError	= true;

		let ErrorType;
		let message;

		// Determine if this validation error
		// applies to the root parameter object.

		// a. Remove any / prefixes
		paramName = paramName.replace( /^\//, "" );

		// b. Check for other slashes...

		if ( paramName.indexOf( "/" ) !== -1 ) {

			isRootParamError = false;
		}

		// Apply overrides (if applicable)
		switch ( keyword ) {

			case "required":

				// Do not override non-root errors of this type.
				if ( !isRootParamError ) {

					break;
				}

				ErrorType = ERRORS.MissingParameterError;

				message = "Missing required parameter: " +
					"'" + ajvError.params.missingProperty + "'";

				break;

			default:

				ErrorType = ERRORS.InvalidParameterError;

				message = "Invalid request parameter: " +
					"'" + paramName + "' " +
					"(" + ajvError.message + ")";

				break;
		}

		// Wrap the tv4 error and return...
		return new ErrorType( ajvError, message );

		// Do not override non-root errors of this type.
		// if ( isRootParamError ) {
		//
		// 	tv4error.message = "This parameter is not recognized";
		// 	ErrorType = ERRORS.UnrecognizedParameterError;
		// }
	}

	/**
	 * This method prepares the request schema for use by `ajv`
	 * by making a few, minor, alterations.
	 *
	 * @private
	 * @param {Object} original - The original requests schema.
	 * @returns {Object} A validation schema ready for use by `ajv`.
	 */
	_prepareSchema( original ) {

		const me = this;

		// Dependencies
		const _ = me.$dep( "lodash" );

		// Clone the original
		let schema = _.clone( original );

		// Make a few mods...
		// FIXME: why is it necessary to remove schema id?
		if ( schema.$id !== undefined ) {

			delete schema.$id;
		}

		// The 'definitions' property should be plural
		if ( schema.definition !== undefined ) {

			if ( schema.definitions === undefined ) {

				schema.definitions = schema.definition;
			}

			delete schema.definition;
		}

		// Prohibit unrecognized parameters
		// (disabled, for now, will come back to it...)
		// -> schema.additionalProperties = false;

		// Done
		return schema;
	}
}

module.exports = Validator;
