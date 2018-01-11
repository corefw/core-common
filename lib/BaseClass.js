/**
 * Defines the BaseClass.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 5.0.0
 * @requires module:Errors
 * @license None
 * @copyright 2017 C2C Schools, LLC
 */
"use strict";

//<editor-fold desc="( DEPENDENCIES )">



//<editor-fold desc="--- Local Project Dependencies --------------------------">


// Important Note:
// Since most of the classes in the project extend the one defined in this
// file (BaseClass), we cannot load them in the module scope.  Instead, they
// are required on-demand in the $dep() method, below.
const ERRORS			= require( "./Errors");



//</editor-fold>

//<editor-fold desc="--- Dependencies from our other projects ----------------">


// Temporarily disabled: I do not think we're using this, yet,
// in the new v5 structure and it was causing build errors.
//const SLS_CLIENT			= require( "@c2cs/sls-client" );



//</editor-fold>

//<editor-fold desc="--- Node.js Built-Ins -----------------------------------">



// Built-in http module.
// See: https://nodejs.org/docs/latest/api/http.html
const HTTP = require( "http" );

// Built-in utility module
const UTIL = require( "util" );

// For path parsing
const PATH = require( "path" );



//</editor-fold>

//<editor-fold desc="--- Third Party Libraries/Modules -----------------------">


const _ 					= require( "lodash" );
const TIPE 					= require( "tipe" );
const EYES 					= require( "eyes" );
//unused? const SWAGGER_CLIENT 		= require( "swagger-client" );
const MOMENT 				= require( "moment" );
const BB 					= require( "bluebird" );
const MYSQL2 				= require( "mysql2" );
const SEQUELIZE 			= require( "sequelize" );
const SEQUELIZE_INHERITS	= require( "sequelize/lib/utils/inherits" );
const TV4 					= require( "tv4" );
const UUID 					= require( "uuid" );
const JWT 					= require( "jsonwebtoken" );
const VERROR 				= require( "verror" );
const REDIS 				= require( "redis" );
const AWS_SDK				= require( "aws-sdk" );
const CHALK					= require( "chalk" );


// Lodash Plugins
_.mixin( require("lodash-inflection") );

// Lodash Config
// Mustache.js-style template
_.templateSettings = {
	interpolate: /\{\{(.+?)}}/g
};


//</editor-fold>



//</editor-fold>

//<editor-fold desc="--- Local Constants -------------------------------------">


/**
 * @const {string}
 */
const SINGLETON_STORE_CONFIG_PROPERTY = "dependencySingletons";



//</editor-fold>

/**
 * The root class that all other classes inherit.
 *
 * @memberof Core
 * @abstract
 */
class BaseClass {

	//<editor-fold desc="--- Static Methods ----------------------------------">



	/**
	 * This special static method is evaluated, exclusively, by
	 * {@link Core.BaseClass} when this class (or any of its children) are loaded
	 * through it.
	 *
	 * Note: Classes that return TRUE for this static method will be assumed
	 * to also require instantiation.  Thus, `#$forceInstantiation` will be
	 * assumed to also return TRUE.
	 *
	 * @access protected
	 * @returns {boolean} When TRUE, the `$dep()` loader will only instantiate
	 * an object from this class once.  Subsequent requests for this object will
	 * yield the same instance.
	 */
	static $singleton() {
		return false;
	}

	/**
	 * This special static method is evaluated, exclusively, by
	 * `Core.BaseClass#$dep()` when this class (or any of its children) are loaded
	 * through it.
	 *
	 * @access protected
	 * @returns {boolean} When TRUE, the `$dep()` loader will always instantiate
	 * an instance of this class when this class is requested as a dependency.
	 */
	static $forceInstantiation() {
		return true;
	}




	//</editor-fold>

	//<editor-fold desc="--- Construction & Initialization -------------------">




	/**
	 * The root of all ev... I mean... constructors.
	 * @constructor
	 * @param {?object} cfg A configuration object that will be consumed by
	 * the newly instantiated class (object).
	 */
	constructor ( cfg ) {

		// Locals
		let me = this;

		// Set config
		me.config = cfg;

		// Initialize the path manager
		me._initPathManager();

	}




	//</editor-fold>

	//<editor-fold desc="--- Dependency Loading & Management -----------------">



	/**
	 * Instantiates a new child object, from a class definition file, and
	 * passes some useful metadata to it automatically.
	 *
	 * #### Important Notes:
	 *
	 *   - This method will only work if this object has a PathManager in its config.
	 *   - This method can only be used to create classes that stem from the BaseClass.
	 *   - This method can only be used to create classes that accept exactly one
	 *     constructor parameter.
	 *   - This method will automatically call {@link Core.BaseClass#$adopt} on objects that
	 *     it creates.
	 *
	 * @throws {Errors.PathManagerRequiredError} If this object does not have a 'PathManager'
	 *         defined in its config.
	 * @throws {Errors.PathNotDefinedError} If the provided classRootPath does not exist.
	 * @throws {Errors.UnsupportedClassError} if the spawned object is not an instance
	 *         of BaseClass (this root class).
	 *
	 * @access protected
	 * @param {string} classRootPath The root directory of the class definition.
	 * @param {string} className The name of the class to spawn (e.g. "MyClass").
	 * This parameter may also include a subpath prefix (e.g. "path/to/MyClass")
	 * which will be applied (joined) to the root path.
	 * @param {object} cfg A configuration object to pass to the new object.
	 * @returns {Core.BaseClass}
	 */
	$spawn( classRootPath, className, cfg ) {

		let me = this;
		let pm = me.pathManager;
		let classPath, classDefinition, childObject;

		// Default the config
		if( TIPE(cfg) !== "object" ) {
			cfg = {};
		}

		// Require a path manager ...
		if( pm === null ) {
			throw new ERRORS.PathManagerRequiredError(
				"Attempted to use BaseClass#$spawn from an object that does " +
				"not have a 'PathManager' defined in its configuration, which " +
				"is REQUIRED for resolving class definition paths."
			);
		}

		// Resolve class definition path
		classPath = pm.join( classRootPath, className );

		// Load the class
		classDefinition = require( classPath );

		// Apply config updates
		cfg = me.$adopt( cfg );

		// Spawn the object
		childObject = new classDefinition( cfg );

		// Ensure the new object is an instance of BaseClass
		if( childObject instanceof BaseClass === false ) {
			throw new ERRORS.UnsupportedClassError(
				"Attempted to use BaseClass#$spawn to create a child object " +
				"that is not an instance of the BaseClass root class."
			);
		}

		return childObject;

	}

	/**
	 * Passes along configuration data to a child a object. This method will
	 * accept either a fully instantiated class object or a plain object, which
	 * is assumed to be a configuration object for instantiating a class object.
	 *
	 * @access protected
 	 * @throws {Errors.InvalidArgumentError} If the provided `obj` parameter is
	 *     not an object.
	 * @param {Core.BaseClass|object} obj A child object which should be an instance of a
	 * Class that inherits from {@link BaseClass} OR a plain object, which is
	 * assumed to be a configuration object that will be used to instantiate
	 * a class object.
	 * @returns {Core.BaseClass} The adopted child or a configuration object (the
	 * `obj` param).
	 */
	$adopt( obj ) {

		let me = this;
		let myConfig = me.config;
		let cfg;

		// Ensure that we have a object ..
		if( TIPE(obj) !== "object" ) {
			throw new ERRORS.InvalidArgumentError(
				"BaseClass#$adopt expects an object as it's first argument, " +
				"but a '" + TIPE(obj) + "' was provided."
			);
		}

		// Capture the '$config' object, if it exists...
		if( TIPE( obj.$config ) === "object" ) {
			cfg = obj.$config;
		} else {
			cfg = obj;
		}

		// So, now, we should have a plain object ...
		if( !_.isPlainObject( cfg ) ) {
			throw new ERRORS.InvalidArgumentError(
				"BaseClass#$adopt expects either an instance of a class that " +
				"stems from BaseClass or a simple configuration object as it's" +
				"first argument, but an unrecognized/unsupported object was " +
				"provided."
			);
		}

		// Apply the configuration updates...
		cfg.pathManager = myConfig.pathManager;
		cfg.spawnedBy 	= me;
		cfg.utils		= me.utils;

		// Pass singleton store
		cfg[ SINGLETON_STORE_CONFIG_PROPERTY ] = me[ SINGLETON_STORE_CONFIG_PROPERTY ];

		// Return whatever was
		// given to us ..
		return obj;

	}

	/**
	 * This method can be used to load any dependencies that are available to
	 * the {@link Core.BaseClass}. This allows most dependencies to be shared among
	 * all classes without needing to `require` each on in the class definition
	 * file.
	 *
	 * This dependency loading mechanism was added so that dependency management
	 * could be centralized, which allows more granular control over dependency
	 * loading.  The end-result being fewer dependency files and small endpoint
	 * deployments.
	 *
	 * @example
	 * let _ = this.$dep("lodash");
	 *
	 * @example
	 * let BB = this.$dep("bluebird");
	 *
	 * @access protected
	 * @param {string} name The name of the dependency to load, e.g. "lodash"
	 * @param {?object} cfg An optional configuration object, for dependencies
	 * 			that support it.
	 * @returns {*} The loaded dependency.
	 */
	$dep( name, cfg ) {

		// Locals
		let me = this;
		let isSingleton = false;
		let forceInstantiation = false;
		let singletons, DEP, inst;

		// lc name
		name = name.toLowerCase();

		// Resolve class / static dependency
		switch( name ) {

			case "_":
			case "lodash":
				name = "lodash";
				DEP = _;
				break;

			case "eyes":
				DEP = EYES;
				break;

			case "tipe":
				DEP = TIPE;
				break;

			case "swagger-client":
				DEP = SWAGGER_CLIENT;
				break;

			case "redis":
				DEP = REDIS;
				break;

			case "verror":
				DEP = VERROR;
				break;

			case "jwt":
				DEP = JWT;
				break;

			case "mysql2":
				DEP = MYSQL2;
				break;

			case "moment":
				DEP = MOMENT;
				break;

			case "aws":
			case "aws-sdk":
				name = "aws-sdk";
				DEP = AWS_SDK;
				break;

			case "chalk":
				DEP = CHALK;
				break;

			case "bb":
			case "bluebird":
			case "promise":
				name = "bluebird";
				DEP = BB;
				break;

			case "uuid":
				DEP = UUID;
				break;

			case "tv4":
				DEP = TV4;
				break;

			case "sequelize":
				DEP = SEQUELIZE;
				break;

			case "sequelize-inherits":
				DEP = SEQUELIZE_INHERITS;
				break;

			// Temporarily disabled: I do not think we're using this, yet,
			// in the new v5 structure and it was causing build errors.

			//case "sls-client":
			//	DEP = SLS_CLIENT;
			//	break;

			case "errors":
				DEP = ERRORS;
				break;

			case "http":
				DEP = HTTP;
				break;

			case "util":
				DEP = UTIL;
				break;

			case "path":
				DEP = PATH;
				break;

			case "logger":
				DEP = require( "./logging/Logger" );
				break;

			case "mysqladapterfactory":
				DEP = require( "./db/mysql/MysqlAdapterFactory" );
				break;

			case "sequelizetypeinjector":
				DEP = require( "./db/mysql/SequelizeTypeInjector" );
				break;

			default:
				throw new ERRORS.UnknownDependencyError(
					"A call to $dep() specified an unknown dependency ('" + name + "')."
				);
				break;

		}

		// Identify self-proclaimed singletons
		if( TIPE( DEP.$singleton ) === "function" ) {
			isSingleton = DEP.$singleton();
			if( isSingleton ) {
				DEP.$forceInstantiation = function() {
					return true;
				}
			}
		}

		// Force instantiation logic
		if( TIPE( DEP.$forceInstantiation ) === "function" ) {
			forceInstantiation = DEP.$forceInstantiation();
		}

		// Create a config, if missing, for forceInstantiation deps
		if( forceInstantiation && TIPE( cfg ) !== "object" ) {
			cfg = {};
		}

		// If no config is passed, we will
		// return the static/uninstantiated
		// dependency object.
		if( TIPE( cfg ) !== "object" ) {
			return DEP;
		}

		// Singleton evaluation
		if( cfg.singleton === true ) {
			delete cfg.singleton;
			isSingleton = true;
		}

		if( isSingleton ) {
			singletons = me._getConfigValue( SINGLETON_STORE_CONFIG_PROPERTY, {} );
			if( singletons[ name ] !== undefined ) {
				me.$log("trace", "Returning existing singleton ('" + name + "')");
				return singletons[ name ];
			}
			me.$log("trace", "Creating new singleton ('" + name + "')");
		}

		// Instantiate
		me.$log("trace", "Instantiating class ('" + name + "')");
		inst = new DEP( cfg );

		// Adopt, as neccessary
		if( inst instanceof BaseClass ) {
			me.$adopt( inst );
		}

		// Persist singletons
		if( isSingleton ) {
			singletons[ name ] = inst;
		}

		// Done
		return inst;

	}

	/**
	 * @deprecated in favor of {@link Core.BaseClass#$dep}
	 */
	get utils() {
		return this._getConfigValue( "utils", {} );
	}

	/**
	 * @deprecated in favor of {@link Core.BaseClass#$dep}
	 */
	get uuidUtils() {
		if( this.utils.uuid === undefined ) {
			// This won't work, the class is static ...
			// this.utils.uuid = this.$spawn( "commonLib", "util/Uuid");
			this.utils.uuid = require( "./util/Uuid" );
		}
		return this.utils.uuid;
	}

	/**
	 * @deprecated in favor of {@link Core.BaseClass#$dep}
	 */
	get slsTools() {
		if( this.utils.slsTools === undefined ) {
			// This won't work, the class is static ...
			// this.utils.uuid = this.$spawn( "commonLib", "util/Uuid");
			this.utils.slsTools = require( "./util/Uuid" );
		}
		return this.utils.uuid;
	}



	//</editor-fold>

	//<editor-fold desc="--- Misc Class,  Loader, and Lineage Helpers --------">


	/**
	 * The name of the class used to instantiate this object. (e.g. `BaseClass`)
	 *
	 * @access protected
	 * @readonly
	 * @var {string}
	 */
	get $className() {
		return this.constructor.name;
	}

	/**
	 * A reference to the object that either created this object (using
	 * {@link Core.BaseClass#$spawn}) or that was later set as this object's parent
	 * (using {@link Core.BaseClass#$adopt}).  If no parent exists then this property
	 * will return NULL.
	 *
	 * @access protected
	 * @readonly
	 * @var {?Core.BaseClass}
	 */
	get $creator() {
		if( this.$config === undefined ) {
			return null;
		} else if( this.$config.spawnedBy === undefined || this.$config.spawnedBy === null ) {
			return null;
		} else {
			return this.$config.spawnedBy;
		}
	}

	/**
	 * A convenience alias for {@link Core.BaseClass#$creator}.
	 *
	 * @see Core.BaseClass#$creator
	 * @access protected
	 * @readonly
	 * @var {?Core.BaseClass}
	 */
	get $parent() {
		return this.$creator;
	}

	/**
	 * Resolves the lineage for this object, which shows this object,
	 * it's parent (the object that created it, via `$spawn`), the object that
	 * created it's parent, and so on, until the `$root` object is reached.
	 *
	 * The return will be an array of objects, with the first index being the
	 * root object in the lineage.
	 *
	 * If this method is called on the `$root` object (one that was not created
	 * by another object by way of `$spawn`), then an array will be returned
	 * containing a single item, which will be this object.
	 *
	 * @access protected
	 * @readonly
	 * @var {Core.BaseClass[]}
	 */
	get $lineage() {
		return this._resolveLineage();
	}

	/**
	 * Returns whether or not this object has a parent (in its lineage). If
	 * this object has a parent, FALSE will be returned. If this object does not
	 * have a parent, then TRUE will be returned.
	 *
	 * @see Core.BaseClass#$lineage
	 * @access protected
	 * @readonly
	 * @var {boolean}
	 */
	get $isRoot() {
		if( this.$creator === null ) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Returns the top-most (oldest) object in this object's lineage. If this
	 * object does not have a lineage, then `this` is returned.
	 *
	 * @see Core.BaseClass#$lineage
	 * @access protected
	 * @readonly
	 * @var {Core.BaseClass}
	 */
	get $root() {
		return this.$lineage[0];
	}

	/**
	 * This method is called, exclusively, by the `$lineage` property's getter.
	 *
	 * @see Core.BaseClass#$lineage
	 * @access private
	 */
	_resolveLineage() {

		// Locals
		let me = this;
		let ret = [ me ];
		let parentLineage;

		// The root object can return early..
		if( me.$isRoot ) {
			return ret;
		}

		// Deps
		const _ = me.$dep("lodash");

		// Get parent's lineage
		parentLineage = me.$parent.$lineage;

		// Flatten with lodash and return
		return _.concat( parentLineage, ret );

	}



	//</editor-fold>

	//<editor-fold desc="--- Logging -----------------------------------------">


	/**
	 * Creates a new log event by proxying method calls to the attached
	 * `Logger` for this object.
	 *
	 * If this object does not have an attached `Logger` object, then the log
	 * event will be added to a log event queue that will be flushed if/when
	 * a `Logger` is attached.
	 *
	 * @access protected
	 * @param {string} level The log level for the new event (i.e. `severity`)
	 * @param {string} a
	 * @param {string} b
	 * @param {string} c
	 * @returns {void}
	 */
	$log( level, a, b, c ) {
		if( this.logger !== null ) {
			this.logger.log( level, a, b, c );
		} else {
			this._addLogToQueue( arguments );
		}
	}

	get logger() {
		if( this.$root._logger === undefined ) {
			this.$root._logger = null;
		}
		return this.$root._logger;
	}

	set logger( val ) {
		this.$root._logger = val;
		this._flushLogQueue();
	}

	get _logQueue() {
		if( this.$root.__logQueue === undefined ) {
			this.$root.__logQueue = {
				items: []
			};
		}
		return this.$root.__logQueue;
	}

	/**
	 * Adds a log item to the logging queue. This method will be called
	 * by the `#$log` method if a logger object is not available.
	 *
	 * @access private
	 * @param {Arguments} args The arguments that we're passed to `#$log`.
	 * @returns {void}
	 */
	_addLogToQueue( args ) {
		let q = this._logQueue;
		q.items.push(
			{
				src: this,
				args: args
			}
		);
	}

	/**
	 * Flushes the log queue if a logger is available and there are
	 * items in the queue.
	 *
	 * @access private
	 * @returns {void}
	 */
	_flushLogQueue() {

		// Locals
		let me 		= this;
		let logger 	= me.logger;

		// We can only flush the queue if we
		// have a logger object...
		if( logger !== null ) {

			const _ 	= me.$dep("lodash");
			let q 		= me._logQueue;

			// If the queue is empty, we can skip this..
			if( q.items.length === 0 ) {

				return;

			} else {

				// Call the $log method, again, for each of the
				// items in the queue...
				_.each( q.items, function( queueItem ) {

					let fn = queueItem.src["$log"];
					fn.apply( queueItem.src, queueItem.args );

				});

				// Clear the queue
				q.items = [];

			}

		}

	}



	//</editor-fold>

	//<editor-fold desc="--- Paths & Path Management -------------------------">



	get pathManager() {
		return this._getConfigValue( "pathManager", this._initPathManager );
	}

	set pathManager( val ) {
		this._setConfigValue( "pathManager", val );
		this.$adopt( val );
	}

	/**
	 * Initializes a generic PathManager object.
	 *
	 * @access private
	 * @returns {void} The path manager is instantiated and then stored
	 * in the 'pathManager' property.
	 */
	_initPathManager( ) {

		// Locals
		let me = this;
		
		// We'll only ever need one..
		if( me._hasConfigValue("pathManager") ) {

			return me.pathManager;

		} else {

			if( me.constructor.name === "PathManager" ) {
				me.pathManager = me;
			} else {
				const PathManager = require( "./PathManager" );
				me.pathManager = new PathManager();
			}

			return me.pathManager;

		}

	}


	//</editor-fold>

	//<editor-fold desc="--- Configuration -----------------------------------">



	set config( val ) {

		// Locals
		let me = this;

		// Ensure we have a config...
		me._initInternalConfigStore();

		// Ignore anything that isn't an object
		if( TIPE( val ) !== "object" ) {
			return;
		}

		// 'Overlay' the new settings...
		_.each( val, function( newValue, configProperty ) {
			me._setConfigValue( configProperty, newValue );
		});

	}

	get config() {

		// Locals
		let me = this;

		// Ensure we have a config...
		me._initInternalConfigStore();

		// Return the config
		return me.$config;

	}

	_initInternalConfigStore() {
		let me = this;
		if( me.$config === undefined ) {
			me.$config = {};
		}
	}

	_getConfigValue( configProperty, defaultValue ) {

		// Locals
		let me = this;

		// Ensure we have a config...
		me._initInternalConfigStore();

		// Default the defaultValue
		if( defaultValue === undefined ) {
			defaultValue = null;
		}

		// Apply the default value if it is missing...
		if( me.$config[ configProperty ] === undefined ) {

			if( TIPE( defaultValue ) === "function" ) {
				let fn = defaultValue.bind( me );
				defaultValue = fn();
			}

			me.$config[ configProperty ] = defaultValue;

		}

		// Return the value
		return me.$config[ configProperty ];


	}

	_hasConfigValue( configProperty ) {
		let me = this;
		if( me.$config[ configProperty ] === undefined ) {
			return false;
		} else {
			return true;
		}
	}

	_setConfigValueIfMissing( configProperty, newValue ) {
		let me = this;
		if( !me._hasConfigValue( configProperty ) ) {
			me._setConfigValue( configProperty, newValue );
		}
	}

	_setConfigValue( configProperty, newValue ) {

		// Locals
		let me = this;

		// Ensure we have a config...
		me._initInternalConfigStore();

		// Apply the new value
		me.$config[ configProperty ] = newValue;

	}

	_setConfigValues( kvObject ) {

		// Locals
		let me = this;

		// We only accept objects..
		if( TIPE( kvObject ) !== "object" ) {
			return;
		}

		_.each( kvObject, function( val, key ) {
			if( TIPE(val) !== "undefined" ) {
				me._setConfigValue( key, val );
			}
		});

	}

	_eraseConfigValue( configProperty ) {
		delete me.$config[ configProperty ];
	}



	//</editor-fold>

	//<editor-fold desc="--- Serialization -----------------------------------">



	serialize( format ) {

		let me = this;
		switch( format.toLowerCase() ) {

			case "jsonapiobject":
				return me._serializeToJsonApiObject();
				break;

			case "jsonapistring":
				return me._serializeToJsonApiString();
				break;

			case "jsonapipretty":
				return me._serializeToJsonApiPretty();
				break;

		}

	}

	_serializeToJsonApiString() {

		let me = this;
		let obj = me._serializeToJsonApiObject();
		return JSON.stringify( obj );

	}

	_serializeToJsonApiPretty() {

		let me = this;
		let obj = me._serializeToJsonApiObject();
		let inspector = me._getInspector();
		let inspection = inspector( obj );
		return inspection;

	}

	_serializeToJsonApiObject() {
		return {};
	}



	//</editor-fold>

	//<editor-fold desc="--- Debugging ---------------------------------------">

	/**
	 * A `Util.DebugHelper` instance.
	 *
	 * @access protected
	 * @readonly
	 * @var {Util.DebugHelper}
	 */
	get $debugger() {
		return this.$spawn( "commonLib", "util/DebugHelper");
	}

	/**
	 * Uses an instance of the `Util.DebugHelper` class to inspect (dump)
	 * the contents of this object.
	 *
	 * Note that this method differs from the `#$inspect()` method in that it
	 * dumps the contents of this object, whereas `#$inspect()` can be used to
	 * dump the contents of any, arbitrary, variable.
	 *
	 * @uses #$inspect
	 * @access protected
	 * @param {boolean} [output=true] Whether or not the contents of the variable
	 * should be dumped to the console (stdout); if FALSE, the output string
	 * will be returned, rather than output.
	 * @param {?number} [indent=0] An optional amount to indent the output,
	 * using tabs.
	 * @returns A string showing the contents ot `varToInspect`
	 */
	inspect( output, indent ) {

		// Locals
		let me = this;
		let title = me.$className;

		// Defer to $inspect
		return me.$inspect( me, output, indent, title );

	}

	/**
	 * Uses an instance of the `Util.DebugHelper` class to inspect (dump)
	 * the contents of this object's internal configuration store (`$cfg`).
	 *
	 * @uses #$inspect
	 * @access protected
	 * @param {boolean} [output=true] Whether or not the contents of the variable
	 * should be dumped to the console (stdout); if FALSE, the output string
	 * will be returned, rather than output.
	 * @param {?number} [indent=0] An optional amount to indent the output,
	 * using tabs.
	 * @returns A string showing the contents ot `varToInspect`
	 */
	inspectConfig( output, indent ) {

		// Locals
		let me = this;
		let title = me.$className + ".$cfg";

		// Defer to $inspect
		return me.$inspect( me.$config, output, indent, title );

	}

	/**
	 * Uses an instance of the `Util.DebugHelper` class to inspect (dump)
	 * the contents of an arbitrary variable.
	 *
	 * Note that this method differs from the `#inspect()` method in that it
	 * allows an arbitrary variable to be inspected, whereas `#inspect()`
	 * can only be used to dump the contents of this object.
	 *
	 * @uses Util.DebugHelper#inspect
	 * @access protected
	 * @param {*} varToInspect The variable to dump.
	 * @param {boolean} [output=true] Whether or not the contents of the variable
	 * should be dumped to the console (stdout); if FALSE, the output string
	 * will be returned, rather than output.
	 * @param {?number} [indent=0] An optional amount to indent the output,
	 * using tabs.
	 * @param {?string} [title=null] An optional title to add to the output.
	 * @returns A string showing the contents ot `varToInspect`
	 */
	$inspect( varToInspect, output, indent, title ) {
		return this.$debugger.inspect( varToInspect, output, indent, title );
	}

	/**
	 * Returns an inspector object (from the eyes module), which can be used to
	 * display the contents of variables in a pretty way.
	 *
	 * @deprecated Use $inspect instead
	 * @access protected
	 * @returns {object}
	 */
	_getInspector() {
		return this.$debugger.inspector;
	}



	//</editor-fold>

};

module.exports = BaseClass;