/**
 * @file
 * Defines the `Core.type.mixin.Validating` mixin.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

// Load dependencies using the Core Framework
const { _, TIPE, A } = Core.deps( "_", "tipe", "a" );

// Alias a few constants, for brevity
const NO_CONFIG_VALUE             = Core.constants.config.NO_CONFIG_VALUE;
const USE_INTERNAL_CONFIG_VALUE   = Core.constants.validation.USE_INTERNAL_CONFIG_VALUE;
const DO_NOT_VALIDATE_TYPE        = Core.constants.validation.DO_NOT_VALIDATE_TYPE;
const DO_NOT_VALIDATE_INSTANCE_OF = Core.constants.validation.DO_NOT_VALIDATE_INSTANCE_OF;
const NOT_FROM_A_MIXIN            = Core.constants.validation.NOT_FROM_A_MIXIN;

/**
 * Provides classes with methods for validating variables.
 *
 * Note: This mixin is applied to `Core.abstract.Component`, making it generally
 * available to most framework classes.
 *
 * @memberOf Core.type.mixin
 */
class Validating {

	$construct() {

		// Note: Currently this mixin uses the `Core.validator` global singleton, which
		// is an instance of Core.type.Validator, to do most of the validation work.
		// In accordance with the framework's architecture and under normal circumstances,
		// classes and mixins would NOT use global objects.  Instead, they would require
		// them using the $construct() method (like this one).
		//
		// Although I think its likely that we should, eventually, consider implementing
		// the Validator through the normal channels, there are a few reasons why it MIGHT
		// be ok to continue doing it this way...
		//
		//     1. For objects that do not have a state, its generally ok to use them as
		//        global singletons, as they do not violate the "no global state" tenet.
		//
		//     2. It MAY be acceptable to allow some, small, number of fundamental, framework
		//        actors to reside in the global space as exceptions to the rule(s)..
		//        especially when those actors contribute to the lowest levels of
		//        functionality (classes, mixins, interfaces, etc). I will need to think
		//        about this a bit more.
		//
		// In this case, particularly, there are a few reasons why it would not be ideal, currently,
		// to accept the `Validator` as a class dependency.
		//
		//     1. $construct methods on mixins are always executed AFTER all class-provided
		//        $construct methods; this mixin provides the $require() method, which is
		//        used, primarily, to validate class dependencies (from within class $construct
		//        methods), so you get a chicken-and-egg problem.
		//
		//     2. Considering how fundamental type validation is, it seems less-than-ideal
		//        to require that practically every class receives a `Validator`.
		//
		// Either way, this is not set in stone, and I just wanted to leave this note for myself,
		// so that I could consider it more in the future.

	}

	/**
	 * Validates a variable/value.  This method is an alias for `Core.type.Validator::validate()`.
	 *
	 * @private
	 * @throws Error if validation fails, unless `opts.throwErrors` is FALSE.
	 * @param {*} value - The value to validate.
	 * @param {Object} opts - Validation options. See `Core.type.Validator::validate()` for more info.
	 * @returns {ValidationResult} The result of the validation operation. Failure results will only be returned
	 * if `opts.throwErrors` is FALSE. Successful results will always be returned.
	 */
	$validate( value, opts ) {
		return Core.validator.validate( value, opts );
	}


	/**
	 * Primarily, this method validates class dependency (internal configuration) values, but it can also be used
	 * to validate practically any arbitrary value.
	 *
	 * @throws Error if the required value fails validation.
	 * @param {string} name - The name of the dependency or parameter being validated.
	 * @param {Object} opts - A configuration object with optional validation settings.
	 * @param {*} [opts.value] - By default, `$require` will validate against settings stored in the internal class
	 * configuration object (`this.$corefw.config`). However, if a value is provided for this setting, it will be
	 * used instead a value collected from the internal class config.
	 * @param {string} [opts.instanceOf] - If provided, the value will be required to be an 'instanceOf' the specified
	 * Core Framework class.
	 * @param {string} [opts.type] - If provided, the value will be required to be of the specified native type.
	 * @param {boolean} [opts.allowNull=false] - When FALSE (default), NULL values will cause a validation failure.
	 * @returns {*} The final value.
	 */
	$require( name, opts ) {

		// Locals
		let me = this;
		let value;

		// Apply default options
		opts = _.defaults( opts, {
			value      : USE_INTERNAL_CONFIG_VALUE,
			instanceOf : DO_NOT_VALIDATE_INSTANCE_OF,
			type       : DO_NOT_VALIDATE_TYPE,
			allowNull  : false,
			fromMixin  : NOT_FROM_A_MIXIN,
		} );

		// Resolve the value
		if( opts.value === USE_INTERNAL_CONFIG_VALUE ) {
			value = me.$getConfig( name, NO_CONFIG_VALUE, true );
		} else {
			value = opts.value;
		}

		// Check for missing value..
		if( value === undefined || value === NO_CONFIG_VALUE ||
			( value === null && !opts.allowNull ) ) {

			_throwValidationError( "A value is required but was not provided." );

		} else if( value === null ) {

			return null;

		}

		// If `instanceOf` validation is requested, then we can infer
		// that our target value must be an object, and we'll validate
		// that it is of the `object` type.
		if( opts.instanceOf !== DO_NOT_VALIDATE_INSTANCE_OF ) {
			opts.type = "object";
		}

		// Validate type, if requested ..
		if( opts.type !== DO_NOT_VALIDATE_TYPE ) {

			// Find the type of the provided value
			let providedType = _getTypeOf( value );

			// Compare the provided and expected types
			if( providedType.toLowerCase() !== opts.type.toLowerCase() ) {

				// Format the types for the error message.
				let dispExpectedType = A( _.capitalize( opts.type ), { capitalize: true } );
				let dispProvidedType = A( _.capitalize( providedType ) );

				// Throw the validation error
				_throwValidationError( `${dispExpectedType} was expected, but ${dispProvidedType} was provided.` );


			}

		}

		// Validate with instanceOf, if requested..
		if( opts.instanceOf !== DO_NOT_VALIDATE_INSTANCE_OF ) {

			// Resolve the target class definition
			// (a.k.a. constructor function)
			let cls = Core.cls( opts.instanceOf );

			// Test it
			if( !( value instanceof cls ) ) {
				_throwValidationError( "The value is expected to be an instance of the '" + cls.prototype.$amClassName + "' constructor/class." );
			}

		}

		// Return the final value
		return value;


		// <editor-fold desc="----- Internal Helper Functions for $require() -----">


		/**
		 * A helper function for throwing validation failure errors.
		 *
		 * @private
		 * @throws Error
		 * @param {string} message - Specific information about the validation failure.
		 * @returns {void}
		 * @todo this should probably be moved to a more formal, utility class, eventually
		 */
		function _throwValidationError( message ) {

			// Find the name of the calling method.
			let tmp = new Error();
			let stack = tmp.stack.split( "\n" );
			let originLine = stack[ 3 ];
			let caller = originLine.substr( originLine.indexOf( "." ) + 1 );
			caller = caller.substr( 0, caller.indexOf( "(" ) - 1 );
			let errorSource;

			// If opts.fromMixin was provided with the name of a mixin,
			// we'll ensure that the error message properly reflects it.
			if( opts.fromMixin === NOT_FROM_A_MIXIN ) {
				errorSource = `${me.className}::${caller}()`;
			} else {
				errorSource = `${opts.fromMixin}::${caller}() (mixed into '${me.className}')`;
			}

			// Create the start of the full error message
			let str = `Validation failure in ${errorSource}.`;

			// Describe the parameter
			if( opts.value === USE_INTERNAL_CONFIG_VALUE || caller === "$construct" ) {

				// If the internal configuration is being validated, or if the
				// $require() method is called from the `$construct()` method, then
				// we'll refer to the variable as a 'class dependency'.
				str += ` The class dependency ($construct parameter), '${name}', failed validation.`;

			} else {

				// Otherwise, we'll refer to the variable as a method parameter.
				str += ` The method parameter, '${name}', failed validation.`;

			}

			// Add the reason
			str += " Reason: " + message;

			// Throw the error
			throw new Error( str );

		}


		/**
		 * A helper function for resolving the type of a variable.
		 *
		 * @private
		 * @param {*} target - The variable to resolve the type for.
		 * @returns {string} The name of the type for the variable provided as `target`.
		 * @todo this should probably be moved to a more formal, utility class, eventually
		 */
		function _getTypeOf( target ) {

			if( typeof target === "symbol" ) {
				return "symbol";
			} else if ( _.isMap( target ) ) {
				return "map";
			} else if ( _.isSet( target ) ) {
				return "set";
			} else if ( _.isWeakMap( target ) ) {
				return "weakMap";
			} else if ( _.isWeakSet( target ) ) {
				return "weakSet";
			} else {
				return TIPE( target );
			}

		}


		// </editor-fold>


	}

	$shouldImplement( interfaceClassName ) {

	}


}

module.exports = Validating;
