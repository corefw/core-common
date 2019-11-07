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
	 * @returns {*} If validation is successful, then `value` will be returned. If validation fails AND
	 * `opts.throwErrors=false` AND no `opts.defaultValue` is provided (default), then NULL will be returned. If
	 * validation fails and `opts.defaultValue` is specified, then `opts.defaultValue` will be returned
	 * (if `opts.defaultValue` is a function, then it will be executed, and its return value will be
	 * returned). Finally, if `opts.throwErrors=true` (default) AND no `opts.defaultValue` is provided (default),
	 * then an error will be thrown and nothing will be returned.
	 */
	$validate( value, opts ) {

		// Locals
		let ret;

		// We need to 'decorate' errors thrown by `Core.type.Validator`:
		try {

			ret = Core.validator.validate( value, opts );

		} catch( err ) {

			// Resolve the method that called $validate
			let caller = Core.debugInspector.getCaller( {
				sourceObject: this
			} );

			// We'll prepend the error message with this...
			let errorWrapMessage = "Validation failed in " + caller.description;

			// Throw a outer validation error, with the error thrown
			// by `Core.type.Validator#validate()` ('err') as the `cause`.
			Core.throw( "ValidationError", err, errorWrapMessage );

		}

		// If `Core.type.Validator#validate()` didn't throw,
		// then we can return it's return value verbatim.
		return ret;

	}

	/**
	 * Validates a function or method parameter (aka argument).
	 *
	 * @private
	 * @throws Core.error.ParamValidationError if validation fails, unless `opts.throwErrors` is FALSE or a
	 * `opts.defaultValue` is provided.
	 * @param {string} paramName - The name of the parameter (aka argument) being validated.
	 * @param {*} value - The value to validate.
	 * @param {Object} opts - Validation options. See `Core.type.Validator::validate()` for more info.
	 * @returns {*} If validation is successful, then `value` will be returned. If validation fails AND
	 * `opts.throwErrors=false` AND no `opts.defaultValue` is provided (default), then NULL will be returned. If
	 * validation fails and `opts.defaultValue` is specified, then `opts.defaultValue` will be returned
	 * (if `opts.defaultValue` is a function, then it will be executed, and its return value will be
	 * returned). Finally, if `opts.throwErrors=true` (default) AND no `opts.defaultValue` is provided (default),
	 * then an error will be thrown and nothing will be returned.
	 */
	$validateParam( paramName, value, opts ) {

		// Locals
		let ret;

		// We need to 'decorate' errors thrown by `Core.type.Validator`:
		try {

			ret = Core.validator.validate( value, opts );

		} catch( err ) {

			// Resolve the method that called $validateParam
			let caller = Core.debugInspector.getCaller( {
				sourceObject: this
			} );

			// We'll prepend the error message with this...
			let errorWrapMessage = "Validation failed for the `" + paramName + "` parameter in " + caller.description;

			// Throw a outer validation error, with the error thrown
			// by `Core.type.Validator#validate()` ('err') as the `cause`.
			Core.throw( "ParamValidationError", err, errorWrapMessage );


		}

		// If `Core.type.Validator#validate()` didn't throw,
		// then we can return it's return value verbatim.
		return ret;

	}

	/**
	 * Validates a configuration object.
	 *
	 * @private
	 * @throws Core.error.PropertyValidationError if validation fails on a property and the validation options for
	 * that property allows errors to be thrown.
	 * @param {string} objectName - A name for the object being validated. This is used to generate error messages.
	 * @param {Object} obj - The object to validate.
	 * @param {Object<string,Object>} propertyOptions - Validation options for each property to be validated.
	 * @param {Object} [globalOptions] - Validation options that will be merged with each `propertyOption`. See
	 * `Core.type.Validator::validate()` for more info.
	 * @returns {*} The return value is dependent on the validation options specified for each property.
	 */
	$validateObject( objectName, obj, propertyOptions, globalOptions = {} ) {

		// Locals
		let me = this;

		// We use these to temporarily store any errors that were thrown.
		let validationErrorWasThrown 	= false;
		let validationErrorPropertyName = null;
		let validationError 			= null;

		// Ensure `propertyOptions` is a plain object
		if( !_.isPlainObject( propertyOptions ) ) {
			propertyOptions = {};
		}

		// Combine the property names from our object (`obj`)
		// and the property specific options to determine
		// all of the possible properties for the result.
		let possibleProperties = Object.getOwnPropertyNames( obj );
		possibleProperties = possibleProperties.concat( Object.getOwnPropertyNames( propertyOptions ) );

		// Iterate over each property in `propertyOptions`
		_.each( possibleProperties, function( propertyName ) {

			let finalOptions;

			// Check for property-specific options..
			if( !_.isNil( propertyOptions[ propertyName ] ) ) {

				// Merge `globalOptions`
				finalOptions = Core.validator.mergeInstructions( propertyOptions[ propertyName ], globalOptions );

			} else {

				// Only use the global options
				finalOptions = globalOptions;

			}

			// Validate the property..
			try {

				obj[ propertyName ] = Core.validator.validate( obj[ propertyName ], finalOptions );

			} catch( err ) {

				// If any property throws, we're bust..
				// We'll save the error and re-throw it down below...
				validationErrorWasThrown 	= true;
				validationErrorPropertyName = propertyName;
				validationError 			= err;

				// Stop iterating..
				return false;

			}

		} );

		// We do not "re-throw" inside of the `_.each`, above, because Lodash would
		// add several call sites to the stack (~6). We could mitigate with
		// the `lookBackIndex` option for `getCaller()`, but it would break if the
		// LoDash stack pattern changes. So, to be on the safe side, we're calling
		// `getCaller` from outside of the `_.each`.
		if( validationErrorWasThrown === true ) {

			// Resolve the method that called $validateObject
			let caller = Core.debugInspector.getCaller( {
				sourceObject: me
			} );

			// We'll prepend the error message with this...
			let errorWrapMessage = "Validation failed for `" + objectName + "." + validationErrorPropertyName + "` in " + caller.description;

			// Throw a outer validation error, with the error thrown
			// by `Core.type.Validator#validate()` ('validationError') as the `cause`.
			Core.throw( "PropertyValidationError", validationError, errorWrapMessage );

		}


		// If we survived, then we need to return `obj`.
		return obj;

	}

	/**
	 * Validates a class dependency ($construct param).
	 *
	 * @private
	 * @throws Core.error.DependencyValidationError if validation fails, unless `opts.throwErrors` is FALSE or a
	 * `opts.defaultValue` is provided.
	 * @param {string} dependencyName - The name of the class dependency being validated.
	 * @param {Object} [opts=null] - Validation options. See `Core.type.Validator::validate()` for more info.
	 * @returns {*} If validation is successful, then the config/dependency will be returned. If validation fails AND
	 * `opts.throwErrors=false` AND no `opts.defaultValue` is provided (default), then NULL will be returned. If
	 * validation fails and `opts.defaultValue` is specified, then `opts.defaultValue` will be returned
	 * (if `opts.defaultValue` is a function, then it will be executed, and its return value will be
	 * returned). Finally, if `opts.throwErrors=true` (default) AND no `opts.defaultValue` is provided (default),
	 * then an error will be thrown and nothing will be returned.
	 */
	$require( dependencyName, opts = null ) {

		// Locals
		let me = this;
		let ret;

		// Resolve the config/dependency value
		let value = me.$getConfig( dependencyName, NO_CONFIG_VALUE, true );

		// Convert the special "NO_CONFIG_VALUE" symbol to NULL..
		// (we only use to prevent $getConfig from applying a default)
		if( value === NO_CONFIG_VALUE ) {
			value = null;
		}

		// We need to 'decorate' errors thrown by `Core.type.Validator`:
		try {

			ret = Core.validator.validate( value, opts );

		} catch( err ) {

			// Resolve the method that called $require
			let caller = Core.debugInspector.getCaller( {
				sourceObject: this
			} );

			// We'll prepend the error message with this...
			let errorWrapMessage = "Validation failed for the `" + dependencyName + "` class dependency in " + caller.description;

			// Throw a outer validation error, with the error thrown
			// by `Core.type.Validator#validate()` ('err') as the `cause`.
			Core.throw( "DependencyValidationError", err, errorWrapMessage );


		}

		// If `Core.type.Validator#validate()` didn't throw, then..
		// a) persist the value returned..
		if( _.isObject( ret ) && ret.$isValidationResults === true ) {
			me.$setConfig( dependencyName, ret.finalValue );
		} else {
			me.$setConfig( dependencyName, ret );
		}

		// b) return that value verbatim
		return ret;

	}

	$implementsTODO( interfaceClassName ) {

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



}

module.exports = Validating;
