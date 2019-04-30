/**
 * @file
 * Defines the Core.error.Manager class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/* eslint no-useless-call: "off" */

// Load dependencies using the Core Framework
const { _, VERROR } = Core.deps( "_", "verror" );

/**
 * Faciliates the throwing of custom errors.
 *
 * @memberOf Core.error
 * @extends Core.abstract.Component
 */
class Manager extends Core.cls( "Core.abstract.Component" ) {

	/**
	 * Classes that are not [typically] loaded through the AssetManager will not have their full class name (which
	 * includes the namespace) injected automatically, so we need to explicitly defined it here.
	 *
	 * @access public
	 * @type {string}
	 */
	get $amClassName() {
		return "Core.error.Manager";
	}

	throw( error, errorConstructor, cause, infoObject, message, ...printfValues ) {

		// Locals
		let me = this;

		// We wont use `createError` if a single argument is passed
		// and that argument is an Error (or instance of Error).
		if( arguments.length !== 1 || !( error instanceof Error ) ) {

			// Pass arguments, verbatim, to `createError`
			error = me.createError.apply( me, arguments );

		}

		// Throw it
		throw( error );

	}

	createError( errorConstructor, cause, infoObject, message, ...printfValues ) {

		// Locals
		let me                   = this;
		let finalConstructorArgs = [];
		let vErrorOptions        = {};
		let hasVErrorOptions     = false;

		// Parse the arguments; this method has a bunch of possible signatures...
		let opts = me._parseErrorParams.call( me, [ ...arguments ] );

		// Handle `cause`
		if( opts.cause !== null && me._supportsCause( opts.constructor ) ) {

			vErrorOptions.cause = opts.cause;
			hasVErrorOptions    = true;

		}

		// Handle `info`
		if( opts.info !== null && me._supportsInfo( opts.constructor ) ) {

			vErrorOptions.info  = opts.info;
			hasVErrorOptions    = true;

		}

		// Append VError options
		if( hasVErrorOptions ) {
			finalConstructorArgs.push( vErrorOptions );
		}

		// Push the message
		finalConstructorArgs.push( opts.message );

		// .. and append everything else ..
		finalConstructorArgs = finalConstructorArgs.concat( opts.params );

		// When we spawn a Core Error Class, we prepend the constructor arguments with a special symbol
		// to "inform" the error that it is being spawned by the errorManager.
		// See `Core.error.BaseError::constructor()` for more info on this...
		if( opts.constructor.$isCoreError === true ) {
			finalConstructorArgs.unshift( Core.constants.error.SPAWED_BY_ERROR_MANAGER );
		}


		// Instantiate & return
		return new opts.constructor( ...finalConstructorArgs );

	}

	/**
	 * This helper class for `#createError` parses its many possible method signatures into a configuration object.
	 *
	 * @private
	 */
	_parseErrorParams( args ) {

		// Locals
		let me 		= this;
		let opts = {
			constructor : null,
			cause       : null,
			message     : null,
			info        : null,
			params      : []
		};

		// Iterate over each param..
		_.each( args, function( oneArg ) {

			let res = me._parseOneErrorParam( oneArg );

			// Apply this argument to the final options
			switch( res.type ) {

				case "constructor":

					// We only accept the first 'constructor'
					if( opts.constructor === null ) {
						opts.constructor = res.value;
					} else {
						opts.params.push( res.value );
					}

					break;

				case "cause":

					// We only accept the first 'cause'
					if( opts.cause === null ) {
						opts.cause = res.value;
					} else {
						opts.params.push( res.value );
					}

					break;

				case "string":

					// We'll interpret the first string
					// that we encounter as the 'message'
					if( opts.message === null ) {
						opts.message = res.value;
					} else {
						opts.params.push( res.value );
					}

					break;

				case "info":

					// We'll interpret the first info object
					// that we encounter as the basis of 'info'.
					if( opts.info === null ) {
						opts.info = res.value;
					} else {

						// ... and merge all other info objects
						// into the original, giving precedence
						// to the last info object.

						opts.info = _.merge( {}, opts.info, res.value );

					}

					break;

				case "generic":
				default:

					// Everything else will be passed
					// to the Error constructor.
					opts.params.push( res.value );
					break;

			}

			//Core.inspect( res, "Parse One Error Param: Result" );

		} );

		// If we don't have a constructor by now, default to `Core.error.GenericError`
		if( opts.constructor === null ) {
			opts.constructor = Core.cls( "Core.error.GenericError" );
		}

		// If we don't have a message, try to resolve a default
		if( opts.message === null ) {

			if( opts.constructor.defaultMessage !== undefined ) {
				opts.message = opts.constructor.defaultMessage;
			} else {

				if( opts.cause === null ) {
					opts.message = "An unknown error occurred and no additional details were provided";
				} else {
					opts.message = "An unknown error occurred";
				}

			}

		}

		// All done
		return opts;

	}

	/**
	 * Determines if the provided error constructor supports a `cause` (causal error). Since this functionality
	 * is provided by the `VError` module, and is NOT supported by built-in errors, we need to determine if the
	 * provided constructor extends from `VError` (which our Core Error Classes do).
	 *
	 * @private
	 * @param {function} ErrorConstructor - The constructor for an error object.
	 * @returns {boolean} TRUE if the provided error constructor supports a `cause` value; FALSE otherwise.
	 */
	_supportsCause( ErrorConstructor ) {
		return this._extendsVError( ErrorConstructor );
	}

	/**
	 * Determines if the provided error constructor supports an `info` object. Since this functionality
	 * is provided by the `VError` module, and is NOT supported by built-in errors, we need to determine if the
	 * provided constructor extends from `VError` (which our Core Error Classes do).
	 *
	 * @private
	 * @param {function} ErrorConstructor - The constructor for an error object.
	 * @returns {boolean} TRUE if the provided error constructor supports an `info` object; FALSE otherwise.
	 */
	_supportsInfo( ErrorConstructor ) {
		return this._extendsVError( ErrorConstructor );
	}

	/**
	 * Determines if the provided error constructor extends from `VError` (which our Core Error Classes do).
	 *
	 * @private
	 * @param {function} ErrorConstructor - The constructor for an error object.
	 * @returns {boolean} TRUE if the provided error constructor extends from `VError`; FALSE otherwise.
	 */
	_extendsVError( ErrorConstructor ) {

		// Core Error Classes DO extend from VError
		if( ErrorConstructor.$isCoreError === true ) {
			return true;
		}

		// .. we also check for VError base constructors
		if( ErrorConstructor.name === "VError" ||
			ErrorConstructor.name === "WError" ||
			ErrorConstructor.name === "SError" ) {

			return true;

		}

		// For everything else, we return FALSE
		return false;

	}

	/**
	 * This helper class for `#_parseErrorParams` parses one argument and summarizes a few details about its value.
	 *
	 * @private
	 */
	_parseOneErrorParam( value ) {

		let ret = {
			type 	: null,
			value	: null
		};

		if( _.isString( value ) ) {

			// Strings can be any of:
			//		- A full Core Class Name 										(e.g. "Core.error.GenericError"	)
			//		- A Core Class Name with the `Core.error` namespace implied 	(e.g. "GenericError"			)
			//		- An error message												(e.g. "It was bad"				)
			//		- A value for `extsprintf`										(e.g. "anything"				)

			// Note: This method cannot tell error message and printf values apart,
			// so it will just return `type='string'` for anything that is not
			// recognized as a full or short class name.

			// Check for 'full Core Class Name'
			if( Core.validator.isCoreClassName( value ) && Core.classExists( value ) ) {

				// This string refers to a Core Class; we'll go ahead and convert it to a
				// Class Definition (constructor) before returning it..
				return {
					type  : "constructor",
					value : Core.cls( value )
				};

			}

			// Check for 'short Core Class Name'
			if( Core.validator.isCoreClassName( "Core.error." + value ) && Core.classExists( "Core.error." + value ) ) {

				// This string refers to a Core Class; we'll go ahead and convert it to a
				// Class Definition (constructor) before returning it..
				return {
					type  : "constructor",
					value : Core.cls( "Core.error." + value )
				};

			}

			// Anything else gets the generic return
			return {
				type  : "string",
				value : value
			};

		} else if( _.isFunction( value ) ) {

			// Functions are likely to be Error object constructors
			return {
				type  : "constructor",
				value : value
			};

		} else if( _.isError( value ) ) {

			// Error objects are likely to be a cause..
			return {
				type  : "cause",
				value : value
			};

		} else if( _.isPlainObject( value ) ) {

			// Plain objects are likely "info" objects
			return {
				type  : "info",
				value : value
			};

		} else {

			// Everything else will be passed to the error constructor
			return {
				type  : "generic",
				value : value
			};

		}

		return ret;

	}

	info( err ) {
		return VERROR.info( err );
	}

}

module.exports = Manager;
