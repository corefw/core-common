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



	/**
	 * Validates an arbitrary variable/value.
	 *
	 * @private
	 * @throws Core.error.ValidationError if validation fails, unless `opts.throwErrors` is FALSE.
	 * @param {*} value - The value to validate.
	 * @param {Object} opts - Validation options. See `Core.type.Validator::validate()` for more info.
	 * @returns {ValidationResult} The result of the validation operation. Failure results will only be returned
	 * if `opts.throwErrors` is FALSE. Successful results will always be returned.
	 */
	$validate( value, opts ) {






		// todo: I don't like the fact that $validate doesnt return the value on success and
		//         does not support `opts.defaultValue` ... in fact, I kinda want Core.type.Validator
		//         to support it, too.  So, I want to refactor this...
		//         Basically, only the error messages (and error classes) vary from validation method to validation
		//         method, so I want to have a universal validator with error wrapping (only).
		//
		//         this.$validate    	  	-> Core.type.Validator#validate()
		//         this.$validateParam    	-> Core.type.Validator#validateParam()  -> Core.type.Validator#validate()
		//         this.$validateParams   	-> Core.type.Validator#validateParam()  -> Core.type.Validator#validateObj()
		//             ( <obj:map> || <array:map> )
		//		   this.$validateObj   		-> Core.type.Validator#validateObj()  -> Core.type.Validator#validate()
		//		   this.$require	   		-> Core.type.Validator#validateClassDep()  -> Core.type.Validator#validate()
		//		   this.$validateObj   		-> Core.type.Validator#validateObj()  -> Core.type.Validator#validate()



		// Locals
		let ret;

		// We need to 'decorate' errors thrown by `Core.type.Validator`:
		// e.g. "Validation failed in `Core.abstract.Component#someMethod()`: expected a String but a ___ was provided."
		try {
			ret = Core.validator.validate( value, opts );
		} catch( err ) {

			// Resolve the method that called $validate
			let caller = Core.debugInspector.getCaller( {
				sourceObject: this
			} );

			// We'll prepend the error message with this...
			let errorWrapMessage = "Validation failed in " + caller.description;

			// Throw a validation error
			Core.throw( "ValidationError", err, errorWrapMessage );

		}

		// Pass successes (or failures when throwErrors=false) verbatim
		return ret;

	}

	/**
	 * Validates a function or method parameter (aka argument).
	 *
	 * @private
	 * @throws Core.error.ParamValidationError if validation fails, unless `opts.throwErrors` is FALSE.
	 * @param {string} paramName - The name of the parameter (aka argument) being validated.
	 * @param {*} value - The value to validate.
	 * @param {Object} opts - Validation options. See `Core.type.Validator::validate()` for more info.
	 * @param {*} [opts.defaultValue] - If provided, this default value will be returned if validation fails. Note that
	 * passing this option will override `opts.throwErrors` (forcing it to be, effectively, FALSE).
	 * @returns {ValidationResult} The result of the validation operation. Failure results will only be returned
	 * if `opts.throwErrors` is FALSE. Successful results will always be returned.
	 */
	$validateParam( paramName, value, opts ) {





		// todo: I don't like the fact that $validate doesnt return the value on success and
		//         does not support `opts.defaultValue` ... in fact, I kinda want Core.type.Validator
		//         to support it, too.  So, I want to refactor this...
		//         Basically, only the error messages (and error classes) vary from validation method to validation
		//         method, so I want to have a universal validator with error wrapping (only).
		//
		//         this.$validate    	  	-> Core.type.Validator#validate()
		//         this.$validateParam    	-> Core.type.Validator#validateParam()  -> Core.type.Validator#validate()
		//         this.$validateParams   	-> Core.type.Validator#validateParam()  -> Core.type.Validator#validateObj()
		//             ( <obj:map> || <array:map> )
		//		   this.$validateObj   		-> Core.type.Validator#validateObj()  -> Core.type.Validator#validate()
		//		   this.$require	   		-> Core.type.Validator#validateClassDep()  -> Core.type.Validator#validate()
		//		   this.$validateObj   		-> Core.type.Validator#validateObj()  -> Core.type.Validator#validate()






		// Locals
		let validationResult;

		// Check for a default
		let defaultValue 	= null;
		let hasDefaultValue = false;

		if( _.isPlainObject( opts ) && opts.defaultValue !== undefined ) {
			hasDefaultValue = true;
			defaultValue 	= opts.defaultValue;

			// I know that method description says that a default forces `throwErrors` to be FALSE,
			// but we still want `Core.type.Validator#validate()` to throw... we just won't
			// re-throw its Error if/when it does.
			opts.throwErrors = true;

		}

		// We need to 'decorate' errors thrown by `Core.type.Validator`:
		// e.g. "Validation failed in `Core.abstract.Component#someMethod()`: expected a String but a ___ was provided."
		try {
			validationResult = Core.validator.validate( value, opts );
		} catch( err ) {

			// Resolve the method that called $validate
			let caller = Core.debugInspector.getCaller( {
				sourceObject: this
			} );

			// We'll prepend the error message with this...
			let errorWrapMessage = "Validation failed for the `" + paramName + "` parameter in " + caller.description;

			// Throw a validation error
			Core.throw( "ParamValidationError", err, errorWrapMessage );

		}

		// Pass successes verbatim
		return validationResult;

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

	$implements( interfaceClassName ) {

		/*

		Perhaps called in $construct ?

		The nice thing about $construct, in this context, is that parent $construct methods
		are called AFTER child $construct methods.  This will ensure that children have a chance
		to fully construct (perhaps dynamically adding interface-bound members) before the
		interface is applied.


		Alternatively:
		this.$selfValidate( {
			implements: "Core.x.ISomething"
		} );

		 */

	}

	__notes() {

		/*

		$require should probably lose the `value` option (unless it could actually be useful in class dependency
		validation inside of $construct)

		Mixin validation methods should probably support a `defaultValue` option and some way to specify whether
		or not the default is applied ONLY when the value is NULL (which should be the default behavior) or if it should
		be applied on any validation failure.

		--

		$validate may need more options than Validator.validate, such as the aforementioned `defaultValue`.

		Most or all context-specific validators should route through $validate.

		 */

	}

	$validateProp( obj, propName, instructions ) {
		// validates a config object...
		// having access to `obj` (instead of just the value) will allow byRef application of defaultValues
		// ... perhaps, even, dual to allow `obj` to be created if its not a plain object
		//        e.g. obj = this.$validateProp( obj, "someProp", { defaultValue: 1, isNumber: true } );
	}

	$validateParam( paramName, curValue, instructions ) {
		// someParam = this.$validateParam( "someParam", someParam, instructions );

		// For error messages:
		// Core.debug.Inspector.getCallee();
		// e.g. Param validation failed for 'paramName' in `Core.x.Y#someThing()`: An Object was expected but a Number (value=6) was provided.
		//                                                        ^
		//
		// For throwing:
		// Core.throw( "Core.error.ParamValidationError", errCause, "Some message" );
		// Core.throw( "ParamValidationError", errCause, "Some message" );  // Core.error could be implicit?
		// Core.throw( errCause, "Some message" ); // Use "Error"?
		// Core.throw( "Some message" ); // Use "Error" w/o cause?
		//
		// .. or ..
		//
		// this.$throw();
		// (could be beneficial to have the `this` reference)

		// .... BUT WE DO NEED TO GET GOING; WE NEED TO GET TO MICROSERVICES A.S.A.P!!!

	}


}

module.exports = Validating;
