/**
 * @file
 * Defines the Core.abstract.Component class.
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

// Symbols for default $corefw.config values
const NO_CONFIG_VALUE = Symbol.for( "No Value" );

// Symbols for applying defaults in $require()
const USE_INTERNAL_CONFIG_VALUE 	= Symbol( "Use Internal Config Value (this.$corefw.config)" );
const DO_NOT_VALIDATE_TYPE 			= Symbol( "Do not validate type" );
const DO_NOT_VALIDATE_INSTANCE_OF 	= Symbol( "Do not validate using instanceOf" );
const NOT_FROM_A_MIXIN              = Symbol( "Not from a mixin" );


/**
 * This is the _real_ base class for all framework logic.
 *
 * @abstract
 * @extends Core.abstract.BaseClass
 * @mixes Core.asset.mixin.MixUtilsMixin
 * @memberOf Core.abstract
 */
class Component extends Core.mix( "Core.abstract.BaseClass", "Core.asset.mixin.MixUtilsMixin" ) {



	// <editor-fold desc="--- Construction & Initialization ----------------------------------------------------------">



	/**
	 * The class constructor.
	 *
	 * @param {Object} [cfg] - Configuration options for the class; the values provided will be stored
	 * in the internal class configuration object (`this.$corefw.config`) and will be mapped to all
	 * `$construct` methods provided by the class hierarchy or any mixins that those classes implement.
	 */
	constructor( cfg ) {

		// Required before `this` can be used...
		super( cfg );

		// Ensure that we have a configuration object
		if( cfg === undefined || cfg === null ) {
			cfg = {};
		}

		// If a $corefw property was passed in, we'll use it
		// as the initial value for the "Framework Data Container"
		if( cfg.$corefw === undefined ) {

			this._initFrameworkDataContainer( null );

		} else {

			this._initFrameworkDataContainer( cfg.$corefw );

			// The $corefw property is special and it has
			// been stored in the "Framework Data Container",
			// so we'll truncate it from the config.
			delete cfg.$corefw;

		}

		// Store the constructor arguments
		this.$configure( cfg );

		// Execute the special methods
		this._executeSpecialMethods();

	}

	/**
	 * This is just a stub for the `$ready` method, which can be overridden by child classes, it will be called,
	 * automatically, after all `$construct` methods have been called.
	 *
	 * Note: Unlike the special `$construct` method, in which ALL implementations (at all levels of the class
	 * hierarchy) will be executed (ignoring the fact that they may be overridden), the `$ready` method
	 * is executed natively and only highest-level override will be executed.
	 *
	 * @private
	 * @returns {void}
	 */
	$ready() {
		// This is an abstract stub.
	}

	/**
	 * This is the entry point for the execution of all 'special' class (e.g. `$construct`,`$ready`) and
	 * mixin methods (e.g. `$beforeReady`, `$construct`) that apply to class instances (some methods, such as
	 * the special mixin method, `$mixin`, are meant to apply to class definitions, not instances, and
	 * are not executed here).
	 *
	 * Note: This method is called automatically by the constructor and should never be called directly.
	 *
	 * @private
	 * @returns {void}
	 */
	_executeSpecialMethods() {

		// Locals
		let me = this;
		let executeMixinChains;

		// Paranoid check for the $mixins object
		if( typeof me.$mixins === "object" ) {
			executeMixinChains = true;
		} else {
			executeMixinChains = false;
		}

		// Execute the special mixin method chain: $beforeConstruct
		if( executeMixinChains ) {
			me.$mixins.applyMethodChain( "$beforeConstruct", [] );
		}

		// Execute the $construct method(s)
		me._executeConstructMethods();

		// Execute the special mixin method chains: $afterConstruct & $beforeReady
		if( executeMixinChains ) {
			me.$mixins.applyMethodChain( "$afterConstruct", [] );
			me.$mixins.applyMethodChain( "$beforeReady", [] );
		}

		// Execute the $ready method
		me.$ready();

		// Execute the special mixin method chain: $afterReady
		if( executeMixinChains ) {
			me.$mixins.applyMethodChain( "$afterReady", [] );
		}

	}

	/**
	 * Initializes the "Framework Data Container", which is a non-enumerable (hidden)
	 * property that the framework will use to store meta information about this class/object.
	 *
	 * @private
	 * @param {Object?} [initialValue={}] - An optional, initial, value for the FW meta.
	 * @returns {void}
	 */
	_initFrameworkDataContainer( initialValue ) {

		// Create an empty object as the default value if an
		// initial value was not passed in.
		if( initialValue === undefined || initialValue === null ) {
			initialValue = {};
		}

		// We use 'defineProperty' because we want to make the
		// container object permanent and non-enumerable.
		Object.defineProperty( this, "$corefw", {
			value        : initialValue,
			writable     : false,
			configurable : false,
			enumerable   : false,
		} );

	}

	/**
	 * This method applies the `$construct()` logic for all Framework classes.
	 *
	 * @private
	 * @returns {void}
	 */
	_executeConstructMethods() {

		// Locals
		let me = this;

		// This variable tracks whether or not additional $construct
		// calls should be made; it allows child classes to return
		// FALSE to prevent $construct methods from being called on
		// parent classes.
		let skipAdditionalCalls = false;

		// Resolve the class $construct methods in the prototype chain and from
		// any mixins that provided it using the static, `Component`, method.
		let allConstructMethods = Component.getAllConstructMethods( this );

		// Iterate over each class $construct method in the chain
		allConstructMethods.forEach( function( oneConstructMethod ) {

			// We only continue making calls if no
			// previous $construct call returned FALSE.
			if( !skipAdditionalCalls ) {

				// Call the $construct method for this level..
				let res = me._executeOneConstructMethod( oneConstructMethod );

				// If $construct returned FALSE, we'll
				// prevent additional, parent, calls.
				if( res === false ) {
					skipAdditionalCalls = true;
				}

			}

		} );

	}

	/**
	 * Executes a single `$construct` method.
	 *
	 * Important: This method is a helper for the `_executeConstructMethods()` method, and should
	 * probably never be called directly.
	 *
	 * @private
	 * @param {function} constructMethod - One of the `$construct` methods associated with this class.
	 * @returns {ConstructMethodReturn} The value returned by the `$construct` method that was executed.
	 */
	_executeOneConstructMethod( constructMethod ) {

		// Locals
		let me = this;
		let ci = Core.classInspector;

		// Resolve the parameter names for the target function
		let fnParamNames = ci.getFunctionParams( constructMethod );

		// Create an array container for the final
		// parameter values that will be passed to the
		// $construct method at this level.
		let finalParamValues = [];

		// Resolve the parameter values by pulling
		// values from the config object that was
		// passed to this object's constructor.
		fnParamNames.forEach( function( paramName ) {

			let finalVal = me.$getConfig( paramName, null );
			finalParamValues.push( finalVal );

		} );

		// Call the $construct method..
		let constructReturnValue = constructMethod.apply( me, finalParamValues );

		// If $construct returned an overrides object, we'll
		// apply the necessary config changes before moving on...
		if( typeof constructReturnValue === "object" ) {
			me.$applyConfig( constructReturnValue );
		}

		// Return the value from $construct
		return constructReturnValue;

	}



	// </editor-fold>

	// <editor-fold desc="--- Static Methods -------------------------------------------------------------------------">



	/**
	 * Returns a Set containing all of the class dependencies for this class, which is resolved by
	 * combining all of the unique, named, parameters of all `$construct` methods that are executed
	 * when an instance of this class is instantiated.
	 *
	 * Note: This method will return the named parameters for the `$construct` method provided, directly,
	 * by this class (if this class does provide a `$construct` method), any `$construct` methods provided
	 * by any of this class' ancestor/super classes, and any `$construct` methods provided by any of
	 * the mixins that were mixed into this class or any of its ancestors/super classes.
	 *
	 * @public
	 * @static
	 * @param {?Object|function} [scope=NULL] - When provided, and not NULL, this object will be used
	 * as the scope of the collection operation. The primary purpose of this parameter is to allow
	 * class instances to execute this method by passing `this` as the `scope`.
	 * @returns {Set<string>} A list of all class dependencies.
	 */
	static getClassDependencies( scope = null ) {

		// Locals
		let ret = new Set();
		let ci  = Core.classInspector;

		// Apply default scope
		if( scope === null ) {
			scope = this.prototype;
		}

		// Gather all of the $construct methods that contribute to
		// this class (including those that were mixed in).
		let constructMethods = Component.getAllConstructMethods( scope );

		// Iterate over each $construct method
		constructMethods.forEach( function( constructMethod ) {

			// Resolve its named parameters
			let paramNames = ci.getFunctionParams( constructMethod );

			// Iterate over each param
			paramNames.forEach( function( paramName ) {

				ret.add( paramName );

			} );


		} );

		// All done..
		return ret;

	}

	/**
	 * Returns a Set containing all of the $construct methods that will be executed instances of this class
	 * are instantiated.
	 *
	 * Note: This method will return the `$construct` method provided, directly, by this class (if this class
	 * does provide a `$construct` method), any `$construct` methods provided by any of this class' ancestor/super
	 * classes, and any `$construct` methods provided by any of the mixins that were mixed into this class or any of
	 * its ancestors/super classes.
	 *
	 * @public
	 * @static
	 * @param {?Object|function} [scope=NULL] - When provided, and not NULL, this object will be used
	 * as the scope of the collection operation. The primary purpose of this parameter is to allow
	 * class instances to execute this method by passing `this` as the `scope`.
	 * @returns {Set<string>} A list of all class dependencies.
	 */
	static getAllConstructMethods( scope = null ) {

		// Locals
		let ci = Core.classInspector;

		// Apply default scope
		if( scope === null ) {
			scope = this.prototype;
		}

		// Resolve the class $construct methods in the prototype chain
		let classConstructMethods = ci.getMethodChain( scope, "$construct" );

		// Resolve any $construct methods provided by mixins
		let mixinConstructMethods = [ ...scope.$mixins.getMethodChain( "$construct" ) ];

		// Merge them together..
		let allConstructMethods = _.flatten( [ classConstructMethods, mixinConstructMethods ] );

		// Cast as a Set and return
		return new Set( allConstructMethods );

	}




	// </editor-fold>

	// <editor-fold desc="--- Universal Class Properties -------------------------------------------------------------">


	/**
	 * The name of this class. If the class definition file was loaded using `Core.asset.Manager` (e.g. `Core.cls`)
	 * or if this class was instantiated by a `Core.asset.ClassLoader` (both of whom inject meta information into
	 * the classes and class instances that they handle), then the full, namespaced, name of the class will be returned.
	 *
	 * If this class definition was loaded traditionally (i.e. via `require()`) and was instantiated traditionally
	 * (i.e. via the `new` keyword`), then namespace information will not be available and this property will return
	 * the simplified name provided by `this.constructor`.
	 *
	 * @access public
	 * @type {string}
	 */
	get className() {

		// Locals
		let me = this;

		if( me.$corefw !== undefined && me.$corefw.fullClassName !== undefined && me.$corefw.fullClassName !== null ) {
			return me.$corefw.fullClassName;
		} else if( me.$amClassName !== undefined && me.$amClassName !== null ) {
			return me.$amClassName;
		} else {
			return me.constructor.name;
		}

	}



	// </editor-fold>

	// <editor-fold desc="--- Internal Configuration ($corefw.config) ------------------------------------------------">



	/**
	 * Applies the name/value pairs provided in `cfg` to the internal configuration object. This method is
	 * the same as (and defers to) `$applyConfig` except this method will clear the current configuration
	 * data (using `$clearConfig`) before applying the configuration object.
	 *
	 * Note: This method is called, automatically, by the `BaseClass` constructor.
	 *
	 * @private
	 * @param {Object} cfg - A plain object of configuration values, where each key in the object is
	 * the name of a configuration setting.
	 * @returns {void}
	 */
	$configure( cfg ) {

		// Locals
		let me = this;

		// First, clear the config ...
		me.$clearConfig();

		// Defer to `$applyConfig`
		me.$applyConfig( cfg );

	}

	/**
	 * Applies the name/value pairs provided in `cfg` to the internal configuration object. This method is
	 * the same as (and is used by) `$configure` except this method will NOT clear the current configuration
	 * data before applying the configuration object (i.e. this method is additive).
	 *
	 * @private
	 * @param {Object} cfg - A plain object of configuration values, where each key in the object is
	 * the name of a configuration setting.
	 * @returns {void}
	 */
	$applyConfig( cfg ) {

		// Locals
		let me = this;

		// Iterate over the keys of the provided `cfg` object
		for ( const prop in cfg ) {

			// The config object should be plain and the values it provides
			// should all be its 'own' (not inherited).
			if ( cfg.hasOwnProperty( prop ) ) {

				// Defer to $setConfig to process each value
				me.$setConfig( prop, cfg[ prop ] );

			}

		}

	}

	/**
	 * Clears the internal, Framework, configuration object.
	 *
	 * @private
	 * @returns {void}
	 */
	$clearConfig() {
		this.$corefw.config = {};
	}

	/**
	 * This internal Core Framework method sets the value of a configuration property.
	 *
	 * @private
	 * @param {string} name - The name of the configuration property to set.
	 * @param {*} value - The new value of the configuration property.
	 * @returns {*} The final, new, value that was set.
	 */
	$setConfig( name, value ) {

		// Locals
		let me = this;

		// Store it
		me.$corefw.config[ name ] = value;

		// Return it
		return value;

	}

	/**
	 * This internal Core Framework method gets the value of a configuration property, or, if it is not found,
	 * a provided `defaultValue` will be stored in the configuration and returned.
	 *
	 * Important Note: Calling this method can modify the internal, Framework-Level, configuration of the object.
	 * The `defaultValue` will be SET to the configuration if no value already exists.
	 *
	 * @example
	 * this.$getConfig( "doesntExist", "hi" 	);   // <- "hi"
	 * this.$getConfig( "doesntExist", "hello" 	);   // <- "hi" (was SET in the previous call)
	 *
	 * @private
	 * @param {string} name - The name of the configuration property to retrieve.
	 * @param {*} defaultValue - A default value for the configuration property; if a value does not currently exist,
	 * this default value will be applied and returned.  If a function is provided, it will be executed and its
	 * return value will be used as the default value.
	 * @param {boolean} [allowNull=true] - By default, this method will consider any configuration value that has a
	 * value of NULL to be "set", which will prevent the application of `defaultValue`.  However, if FALSE is passed
	 * to this parameter, then NULL values will be considered as "unset" and will be replaced with `defaultValue`.
	 * @returns {*} The requested value (or the provided `defaultValue`, if the setting was not found).
	 */
	$getConfig( name, defaultValue, allowNull ) {

		// Locals
		let me = this;
		let config = this.$corefw.config;

		// We'll default the default to NULL ;)
		if( defaultValue === undefined ) {
			defaultValue = null;
		}

		// Default 'allowNull' to TRUE
		if( allowNull !== false ) {
			allowNull = true;
		}

		// Check to see if the value exists...
		if( me.$hasConfigValue( name, allowNull ) ) {

			// We store a copy or reference of the value
			// before resolution so that we can determine
			// if the resolver changed the value.
			let currentValue = config[ name ];

			// We found our value; so, first, we'll resolve
			// it, and then return it.
			let newValue = me.$resolveConfigValue( config[ name ] );

			// If the resolver changed the value, we'll store the new value.
			if( currentValue !== newValue ) {
				this.$setConfig( name, newValue );
			}

			// .. and return
			return newValue;

		} else {

			// We did not find our value, so let's see if we need to apply a default..
			if( defaultValue === NO_CONFIG_VALUE ) {

				// This special Symbol will circumvent the application of a default
				// value, so we'll just return the symbol as an indication that no
				// value was found and no default value was applied.
				return NO_CONFIG_VALUE;

			} else {

				// If we're here, we need to apply a default value. Although we usually
				// do resolution at read-time, we'll go ahead and do resolution now
				// because we'll be returning the value (and we don't want implementors
				// to need to understand resolution).
				defaultValue = me.$resolveConfigValue( defaultValue );

				// .. and, then, we'll set the internal value to the default ..
				me.$setConfig( name, defaultValue );

				// .. finally, we'll return the default value
				return defaultValue;

			}

		}

	}

	/**
	 * Checks to see if a configuration value is set.
	 *
	 * @private
	 * @param {string} name - The name of the configuration option to check for.
	 * @param {boolean} [allowNull=true] - By default, this method will consider any configuration value that has a
	 * value of NULL to be "set", which will cause this method to return TRUE.  However, if FALSE is passed
	 * to this parameter, then NULL values will be considered as "unset" and will cause a FALSE return.
	 * @returns {boolean} TRUE if the configuration option has a value; FALSE otherwise.
	 */
	$hasConfigValue( name, allowNull ) {

		// Locals
		let me = this;

		// Param Coercion
		if( allowNull !== false ) {
			allowNull = true;
		}

		// Check for the config
		if( me.$corefw.config[ name ] !== undefined ) {

			// Decide if we should allow NULL values..
			if( allowNull ) {
				return true;
			} else if( me.$corefw.config[ name ] === null ) {
				return false;
			} else {
				return true;
			}

		} else {

			return false;

		}

	}

	/**
	 * This internal Core Framework method evaluates a provided value and resolves the final value that will
	 * be stored in the internal configuration object. The primary purpose of this method is to translate
	 * values that are provided as functions into their final value, which is the result of executing the
	 * provided function.
	 *
	 * @private
	 * @param {*} value - A configuration value; If a function is provided, it will be executed and its return value
	 * will be returned, in turn. Anything else will be returned verbatim.
	 * @returns {*} The final value, after resolution.
	 */
	$resolveConfigValue( value ) {

		// Locals
		let me = this;

		// Check to see if the value is a function
		if( typeof value === "function" ) {

			let newValue = value.apply( this, [ this.$corefw.config ] );

			// Since we executed a function to get the value,
			// we'll send the new value (that was returned from the function),
			// itself, into the resolver for further resolution.
			return me.$resolveConfigValue( newValue );

		} else {
			return value;
		}

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
		if( value === undefined || value === NO_CONFIG_VALUE || ( value === null && !opts.allowNull ) ) {
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



	// </editor-fold>




}

module.exports = Component;
