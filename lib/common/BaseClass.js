/**
 * @file Defines the BaseClass class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @author Kevin Sanders <kevin@c2cschools.com>
 * @since 5.0.0
 * @license See LICENSE.md for details about licensing.
 * @copyright 2017 C2C Schools, LLC
 */

"use strict";

// <editor-fold desc="( DEPENDENCIES )">

// <editor-fold desc="--- Local Project Dependencies -------------------------">

// Important Note:
// Since most of the classes in the project extend the one defined in this file
// (BaseClass), we cannot load them in the module scope. Instead, they are
// required on-demand in the $dep() method, below.

const ERRORS = require( "../errors" );

// </editor-fold>

// <editor-fold desc="--- Third Party Libraries/Modules ----------------------">

const _ 					= require( "lodash" );
const TIPE 					= require( "tipe" );
const EYES 					= require( "eyes" );
const MOMENT 				= require( "moment" );
const BB 					= require( "bluebird" );
const MYSQL2 				= require( "mysql2" );
const SEQUELIZE 			= require( "sequelize" );
const SEQUELIZE_INHERITS	= require( "sequelize/lib/utils/inherits" );
const AJV					= require( "ajv" );
const UUID 					= require( "uuid/v4" );
const JWT 					= require( "jsonwebtoken" );
const VERROR 				= require( "verror" );
const REDIS 				= require( "redis" );
const AWS_SDK				= require( "aws-sdk" );
const CHALK					= require( "chalk" );

// Lodash Plugins
_.mixin( require( "lodash-inflection" ) );

// Lodash Config
// Mustache.js-style template
_.templateSettings = {
	interpolate: /{{(.+?)}}/g,
};

// </editor-fold>

// <editor-fold desc="--- Node.js Built-Ins ----------------------------------">

/**
 * Built-in http module.
 * @see https://nodejs.org/docs/latest/api/http.html
 */
const HTTP = require( "http" );

/**
 * Built-in utility module.
 * @see https://nodejs.org/docs/latest/api/util.html
 */
const UTIL = require( "util" );

/**
 * For path parsing.
 * @see https://nodejs.org/docs/latest/api/path.html
 */
const PATH = require( "path" );

/**
 * Built-in file system module.
 * @see https://nodejs.org/docs/latest/api/fs.html
 */
const FS = BB.promisifyAll( require( "fs" ) );

// </editor-fold>

// </editor-fold>

// <editor-fold desc="--- Local Constants ------------------------------------">

/**
 * @const {string}
 */
const SINGLETON_STORE_CONFIG_PROPERTY = "dependencySingletons";

// </editor-fold>

/**
 * The root class that all other classes inherit.
 *
 * @memberOf Common
 * @abstract
 */
class BaseClass {

	// <editor-fold desc="--- Static Methods ---------------------------------">

	/**
	 * This special static method is evaluated exclusively by
	 * {@link Common.BaseClass} when this class (or any of its children) are
	 * loaded through it.
	 *
	 * **Note:** Classes that return TRUE for this static method will be assumed
	 * to also require instantiation. Thus, `#$forceInstantiation` will be
	 * assumed to also return TRUE.
	 *
	 * @protected
	 * @returns {boolean} When TRUE, the `$dep()` loader will only instantiate
	 *     an object from this class once. Subsequent requests for this object
	 *     will yield the same instance.
	 */
	static $singleton() {

		return false;
	}

	// noinspection JSUnusedGlobalSymbols
	/**
	 * This special static method is evaluated exclusively by
	 * {@link Common. BaseClass#$dep()} when this class (or any of its children)
	 * are loaded through it.
	 *
	 * @protected
	 * @returns {boolean} When TRUE, the `$dep()` loader will always instantiate
	 *     an instance of this class when this class is requested as a
	 *     dependency.
	 */
	static $forceInstantiation() {

		return false;
	}

	// </editor-fold>

	// <editor-fold desc="--- Construction & Initialization ------------------">

	/**
	 * The root of all ev... I mean... constructors.
	 *
	 * @param {?Object} [cfg] - A configuration object that will be consumed by
	 *     the newly instantiated class (object).
	 */
	constructor( cfg ) {

		const me = this;

		me.initialize( cfg );
	}

	/**
	 * Called during construction to initialize the newly instantiated class
	 * (object).
	 *
	 * @param {?Object} [cfg] - A configuration object that will be consumed by
	 *     the newly instantiated class (object).
	 * @returns {void}
	 */
	initialize( cfg ) {

		const me = this;

		// Set config
		me.config = cfg;

		me._dependencyMap = [];

		// Initialize the path manager
		me.initPathManager();
	}

	// </editor-fold>

	// <editor-fold desc="--- Dependency Loading & Management ----------------">

	/**
	 * Instantiates a new child object, from a class definition file, and passes
	 * some useful metadata to it automatically.
	 *
	 * #### Important Notes:
	 *
	 *   - This method will only work if this object has a PathManager in its
	 *     config.
	 *   - This method can only be used to create classes that stem from the
	 *     BaseClass.
	 *   - This method can only be used to create classes that accept exactly
	 *     one constructor parameter.
	 *   - This method will automatically call {@link Common.BaseClass#$adopt}
	 *     on objects that it creates.
	 *
	 * @throws {Errors.PathManagerRequiredError} If this object does not have a
	 *     'PathManager' defined in its config.
	 * @throws {Errors.PathNotDefinedError} If the provided classRootPath does
	 *     not exist.
	 * @throws {Errors.UnsupportedClassError} If the spawned object is not an
	 *     instance of BaseClass (this root class).
	 *
	 * @protected
	 * @param {string} classRootPath - The root directory of the class
	 *     definition.
	 * @param {string} className - The name of the class to spawn (e.g.
	 *     "MyClass"). This parameter may also include a sub-path prefix (e.g.
	 *     "path/to/MyClass") which will be applied (joined) to the root path.
	 * @param {Object} [cfg] - A configuration object to pass to the new object.
	 * @returns {Common.BaseClass|*} The instantiated class.
	 */
	$spawn( classRootPath, className, cfg ) {

		const me = this;

		// Default the config
		if ( TIPE( cfg ) !== "object" ) {

			cfg = {};
		}

		// Require a path manager
		let pm = me.pathManager;

		if ( pm === null ) {

			throw new ERRORS.PathManagerRequiredError(
				"Attempted to use BaseClass#$spawn from an object that does " +
				"not have a 'PathManager' defined in its configuration, " +
				"which is REQUIRED for resolving class definition paths."
			);
		}

		// Resolve class definition path
		let classPath = pm.join( classRootPath, className );

		// Load the class
		const ClassDefinition = require( classPath );

		// Apply config updates
		cfg = me.$adopt( cfg );

		// Spawn the object
		let childObject = new ClassDefinition( cfg );

		// Ensure the new object is an instance of BaseClass
		if ( childObject instanceof BaseClass === false ) {

			throw new ERRORS.UnsupportedClassError(
				"Attempted to use BaseClass#$spawn to create a child object " +
				"that is not an instance of the BaseClass root class."
			);
		}

		return childObject;
	}

	/**
	 * Passes along configuration data to a child object. This method will
	 * accept either a fully instantiated class object or a plain object, which
	 * is assumed to be a configuration object for instantiating a class object.
	 *
	 * @protected
 	 * @throws {Errors.InvalidArgumentError} If the provided `obj` parameter is
	 *     not an object.
	 * @param {Common.BaseClass|Object} obj - A child object which should be an
	 *     instance of a Class that inherits from {@link Common.BaseClass} OR a
	 *     plain object, which is assumed to be a configuration object that will
	 *     be used to instantiate a class object.
	 * @returns {Common.BaseClass} The adopted child or a configuration object
	 *     (the `obj` param).
	 */
	$adopt( obj ) {

		const me = this;

		let myConfig = me.config;
		let cfg;

		// Ensure that we have a object...
		if ( TIPE( obj ) !== "object" ) {

			throw new ERRORS.InvalidArgumentError(
				"BaseClass#$adopt expects an object as its first argument, " +
				"but a '" + TIPE( obj ) + "' was provided."
			);
		}

		// Capture the '$config' object, if it exists...
		if ( TIPE( obj.$config ) === "object" ) {

			cfg = obj.$config;

		} else {

			cfg = obj;
		}

		// So, now, we should have a plain object...
		if ( !_.isPlainObject( cfg ) ) {

			throw new ERRORS.InvalidArgumentError(
				"BaseClass#$adopt expects either an instance of a class that " +
				"stems from BaseClass or a simple configuration object as " +
				"its first argument, but an unrecognized/unsupported object " +
				"was provided."
			);
		}

		// Apply the configuration updates...
		cfg.pathManager = myConfig.pathManager;
		cfg.spawnedBy 	= me;

		// Pass singleton store
		cfg[ SINGLETON_STORE_CONFIG_PROPERTY ] =
			me[ SINGLETON_STORE_CONFIG_PROPERTY ];

		// Return whatever was given to us...
		return obj;
	}

	/**
	 * This method can be used to load any dependencies that are available to
	 * the {@link Common.BaseClass}. This allows most dependencies to be shared
	 * among all classes without needing to `require` each one in the class
	 * definition file.
	 *
	 * This dependency loading mechanism was added so that dependency management
	 * could be centralized, which allows more granular control over dependency
	 * loading. The end-result being fewer dependency files and small endpoint
	 * deployments.
	 *
	 * @example
	 *     const _ = me.$dep("lodash");
	 *
	 * @example
	 *     const BB = me.$dep("bluebird");
	 *
	 * @protected
	 * @param {string} name - The name of the dependency to load, e.g. "lodash".
	 * @param {?Object} [cfg] - An optional configuration object, for
	 *     dependencies that support it.
	 * @param {boolean} [cfg.singleton] - When TRUE, the loader will only
	 *     instantiate an object from this class once. Subsequent requests for
	 *     this object will yield the same instance.
	 * @returns	{*} The loaded dependency.
	 */
	$dep( name, cfg ) { // eslint-disable-line complexity

		const me = this;

		let isSingleton			= false;
		let forceInstantiation	= false;

		let singletons;
		let DEP;
		let inst;

		if ( TIPE( name ) === "string" ) {

			name = name.toLowerCase();

			// Resolve class / static dependency
			// noinspection SpellCheckingInspection
			switch ( name ) {

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

				// case "swagger-client":
				// 	DEP = SWAGGER_CLIENT;
				// 	break;

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

				case "ajv":
					DEP = AJV;
					break;

				case "sequelize":
					DEP = SEQUELIZE;
					break;

				case "sequelize-inherits":
					DEP = SEQUELIZE_INHERITS;
					break;

				// case "errors":
				// 	DEP = ERRORS;
				// 	break;

				case "http":
					DEP = HTTP;
					break;

				case "util":
					DEP = UTIL;
					break;

				case "path":
					DEP = PATH;
					break;

				case "fs":
					DEP = FS;
					break;

				case "logger":
					DEP = require( "../logging/Logger" );
					break;

				// case "mysqladapterfactory":
				// case "mysql-adapter-factory":
				// 	name = "mysql-adapter-factory";
				// 	DEP = require( "@corefw/model" ).db.mysql.MysqlAdapterFactory;
				// 	break;
				//
				// case "sequelizetypeinjector":
				// case "sequelize-type-injector":
				// 	name = "sequelize-type-injector";
				// 	DEP = require( "@corefw/model" ).db.mysql.SequelizeTypeInjector;
				// 	break;

				case "util/uuid":
					DEP = require( "../util/Uuid" );
					break;

				case "util/validator":
					DEP = require( "../util/Validator" );
					break;

				case "util/kmscrypt":
				case "util/kms-crypt":
					name = "util/kms-crypt";
					DEP = require( "../util/KmsCrypt" );
					break;

				case "crypto":

					DEP = require( "crypto" );
					break;

				default:

					// look in dependency map...

					DEP = me._dependencyMap[ name ];

					// not found...

					if ( !DEP ) {

						throw new ERRORS.UnknownDependencyError(
							"A call to $dep() specified an unknown dependency ('" +
							name + "')."
						);
					}
			}

		} else {

			/** @type Common.BaseClass */
			DEP		= name;
			name	= DEP.name.toLowerCase();
		}

		// Identify self-proclaimed singletons
		if ( TIPE( DEP.$singleton ) === "function" ) {

			isSingleton = DEP.$singleton();

			if ( isSingleton ) {

				DEP.$forceInstantiation = function () {

					return true;
				};
			}
		}

		// Force instantiation logic
		if ( TIPE( DEP.$forceInstantiation ) === "function" ) {

			forceInstantiation = DEP.$forceInstantiation();
		}

		// Create a config, if missing, for forceInstantiation dependencies
		if ( forceInstantiation && TIPE( cfg ) !== "object" ) {

			cfg = {};
		}

		// If no config is passed, we will return the static/uninstantiated
		// dependency object.
		if ( TIPE( cfg ) !== "object" ) {

			return DEP;
		}

		// Singleton evaluation
		if ( cfg.singleton === true ) {

			delete cfg.singleton;
			isSingleton = true;
		}

		if ( isSingleton ) {

			singletons = me.getConfigValue(
				SINGLETON_STORE_CONFIG_PROPERTY,
				{}
			);

			if ( singletons[ name ] !== undefined ) {

				me.$log(
					"trace",
					"Returning existing singleton ('" + name + "')"
				);

				return singletons[ name ];
			}

			me.$log(
				"trace",
				"Creating new singleton ('" + name + "')"
			);
		}

		// Instantiate
		me.$log(
			"trace",
			"Instantiating class ('" + name + "')"
		);

		inst = new DEP( cfg );

		// Adopt, as necessary
		if ( inst instanceof BaseClass ) {

			me.$adopt( inst );
		}

		// Persist singletons
		if ( isSingleton ) {

			singletons[ name ] = inst;
		}

		// Done
		return inst;
	}

	/**
	 * Add a dependency that can later be used via $dep().
	 *
	 * @param {string} name - Dependency name.
	 * @param {string|Object} [dep] - Dependency string or object. If not
	 *     provided the same value as the 'name' parameter will be used.
	 * @returns {void}
	 */
	addDependency( name, dep ) {

		const me = this;

		// Dependencies
		const TIPE	= me.$dep( "tipe" );

		// dependency not provided, assume same as name...

		if ( !dep ) {

			dep = name;
		}

		// dependency is a string, require it...

		// FIXME: Breaks due to path/module location ?

		if ( TIPE( dep ) === "string" ) {

			dep = require( dep );
		}

		// add to dependency map

		me._dependencyMap[ name ] = dep;
	}

	// </editor-fold>

	// <editor-fold desc="--- Misc Class, Loader, and Lineage Helpers --------">

	/**
	 * The name of the class used to instantiate this object (e.g. `BaseClass`).
	 *
	 * @protected
	 * @readonly
	 * @type {string}
	 */
	get $className() {

		const me = this;

		return me.constructor.name;
	}

	/**
	 * A reference to the object that either created this object (using
	 * {@link Common.BaseClass#$spawn}) or that was later set as this object's
	 * parent (using {@link Common.BaseClass#$adopt}). If no parent exists then
	 * this property will return NULL.
	 *
	 * @protected
	 * @readonly
	 * @type {?Common.BaseClass}
	 */
	get $creator() {

		const me = this;

		if ( me.$config === undefined ) {

			return null;

		} else if (

			me.$config.spawnedBy === undefined ||
			me.$config.spawnedBy === null
		) {

			return null;
		}

		return me.$config.spawnedBy;
	}

	/**
	 * A convenience alias for {@link Common.BaseClass#$creator}.
	 *
	 * @see Common.BaseClass#$creator
	 * @protected
	 * @readonly
	 * @type {?Common.BaseClass}
	 */
	get $parent() {

		const me = this;

		return me.$creator;
	}

	/**
	 * Resolves the lineage for this object, which shows this object, its parent
	 * (the object that created it, via `$spawn`), the object that created its
	 * parent, and so on, until the `$root` object is reached.
	 *
	 * The return will be an array of objects, with the first index being the
	 * root object in the lineage.
	 *
	 * If this method is called on the `$root` object (one that was not
	 * created by another object by way of `$spawn`), then an array will be
	 * returned containing a single item, which will be this object.
	 *
	 * @protected
	 * @readonly
	 * @type {Common.BaseClass[]}
	 */
	get $lineage() {

		const me = this;

		return me._resolveLineage();
	}

	/**
	 * Returns whether or not this object has a parent (in its lineage). If this
	 * object has a parent, FALSE will be returned. If this object does not have
	 * a parent, then TRUE will be returned.
	 *
	 * @see Common.BaseClass#$lineage
	 * @protected
	 * @readonly
	 * @type {boolean}
	 */
	get $isRoot() {

		const me = this;

		return me.$creator === null;
	}

	/**
	 * Returns the top-most (oldest) object in this object's lineage. If this
	 * object does not have a lineage, then `this` is returned.
	 *
	 * @see Common.BaseClass#$lineage
	 * @protected
	 * @readonly
	 * @type {Common.BaseClass}
	 */
	get $root() {

		const me = this;

		return me.$lineage[ 0 ];
	}

	/**
	 * This method is called, exclusively, by the `$lineage` property's getter.
	 *
	 * @see Common.BaseClass#$lineage
	 * @private
	 * @returns {Array} The class lineage.
	 */
	_resolveLineage() {

		const me = this;

		let ret = [ me ];
		let parentLineage;

		// The root object can return early...
		if ( me.$isRoot ) {

			return ret;
		}

		// Dependencies
		const _ = me.$dep( "lodash" );

		// Get parent's lineage
		parentLineage = me.$parent.$lineage;

		// Flatten with lodash and return
		return _.concat( parentLineage, ret );
	}

	// </editor-fold>

	// <editor-fold desc="--- Logging ----------------------------------------">

	/**
	 * Creates a new log event by proxying method calls to the attached `Logger`
	 * for this object.
	 *
	 * If this object does not have an attached `Logger` object, then the log
	 * event will be added to a log event queue that will be flushed if/when a
	 * `Logger` is attached.
	 *
	 * @protected
	 * @param {string} level - The log level for the new event (i.e.
	 *     `severity`).
	 * @param {string} a - First log parameter.
	 * @param {string} [b] - Second log parameter.
	 * @param {string} [c] - Third log parameter.
	 * @returns {void}
	 */
	$log( level, a, b, c ) {

		const me = this;

		if ( me.logger !== null ) {

			me.logger.log( level, a, b, c );

		} else {

			me._addLogToQueue( level, a, b, c );
		}
	}

	/**
	 * Get or set the root logger object.
	 *
	 * @returns {Logging.Logger|null} The root logger object.
	 */
	get logger() {

		const me = this;

		if ( me.$root._logger === undefined ) {

			me.$root._logger = null;
		}

		return me.$root._logger;
	}

	set logger( /** Logging.Logger|null */ val ) {

		const me = this;

		me.$root._logger = val;
		me._flushLogQueue();
	}

	/**
	 * Returns the root logging queue.
	 *
	 * @returns {{items: Array}} The root logging queue.
	 * @private
	 * @readonly
	 */
	get _logQueue() {

		const me = this;

		if ( me.$root.__logQueue === undefined ) {

			me.$root.__logQueue = {
				items: [],
			};
		}

		return me.$root.__logQueue;
	}

	/**
	 * Adds a log item to the logging queue. This method will be called by the
	 * {@link Common.BaseClass#$log} method if a logger object is not available.
	 *
	 * @private
	 * @param {...*} args - The arguments that we're passing to `#$log`.
	 * @returns {void}
	 */
	_addLogToQueue( ...args ) {

		const me = this;

		let q = me._logQueue;

		q.items.push(
			{
				src  : me,
				args : args,
			}
		);
	}

	/**
	 * Flushes the log queue if a logger is available and there are items in the
	 * queue.
	 *
	 * @private
	 * @returns {void}
	 */
	_flushLogQueue() {

		const me = this;

		let logger = me.logger;

		// We can only flush the queue if we have a logger object...
		if ( logger === null ) {

			return;
		}

		const _	= me.$dep( "lodash" );
		const q	= me._logQueue;

		// If the queue is empty, we can skip this...
		if ( q.items.length === 0 ) {

			return;
		}

		// Call the $log method, again, for each of the items in the queue...
		_.each( q.items, function ( queueItem ) {

			let fn = queueItem.src.$log;

			fn.apply( queueItem.src, queueItem.args );
		} );

		// Clear the queue
		q.items = [];
	}

	// </editor-fold>

	// <editor-fold desc="--- Paths & Path Management ------------------------">

	/**
	 * Get or set the {@link Common.PathManager} object.
	 *
	 * @returns {Common.PathManager} The PathManager object.
	 */
	get pathManager() {

		// FIXME: can we look to the root for this object, like the logger?

		const me = this;

		return me.getConfigValue( "pathManager", me.initPathManager );
	}

	set pathManager( /** Common.PathManager */ val ) {

		const me = this;

		me.setConfigValue( "pathManager", val );
		me.$adopt( val );
	}

	/**
	 * Initializes a generic {@link Common.PathManager} object.
	 *
	 * @protected
	 * @returns {Common.PathManager} The path manager is instantiated and then
	 *     stored in the 'pathManager' property.
	 */
	initPathManager() {

		const me = this;

		// Dependencies...
		const PATH = me.$dep( "path" );

		let pm = me.getConfigValue( "pathManager" );

		if ( !pm ) {

			if ( me.constructor.name === "PathManager" ) {

				// noinspection JSValidateTypes
				pm = me;

			} else {

				/**
				 * @type {Common.PathManager}
				 */
				const PathManager = require( "./PathManager" );

				pm = new PathManager();
			}

			me.pathManager = pm;
		}

		if ( !pm.hasPath( "commonLib" ) ) {

			pm.setPath( "commonLib", PATH.join( __dirname, ".." ) );
		}

		return pm;

		// // Dependencies...
		// const PATH = me.$dep( "path" );
		//
		// // We'll only ever need one...
		// if ( me.hasConfigValue( "pathManager" ) ) {
		//
		// 	return me.pathManager;
		// }
		//
		// if ( me.constructor.name === "PathManager" ) {
		//
		// 	// noinspection JSValidateTypes
		// 	me.pathManager = me;
		//
		// } else {
		//
		// 	/**
		// 	 * @type {Common.PathManager}
		// 	 */
		// 	const PathManager = require( "./PathManager" );
		//
		// 	me.pathManager = new PathManager();
		// }
		//
		// me.pathManager.setPath( "commonLib", PATH.join( __dirname, ".." ) );

		// return me.pathManager;
	}

	// </editor-fold>

	// <editor-fold desc="--- Configuration ----------------------------------">

	/**
	 * Get or set this object's internal configuration store.
	 *
	 * @returns {Object} The configuration store object.
	 */
	get config() {

		const me = this;

		// Ensure we have a config...
		me._initInternalConfigStore();

		// Return the config
		return me.$config;
	}

	set config( /** Object */ val ) {

		const me = this;

		// Ensure we have a config...
		me._initInternalConfigStore();

		// Ignore anything that isn't an object
		if ( TIPE( val ) !== "object" ) {

			return;
		}

		// 'Overlay' the new settings...
		_.each( val, function ( newValue, configProperty ) {

			me.setConfigValue( configProperty, newValue );
		} );
	}

	/**
	 * Initialize the internal configuration store.
	 *
	 * @private
	 * @returns {void}
	 */
	_initInternalConfigStore() {

		const me = this;

		if ( me.$config === undefined ) {

			me.$config = {};
		}
	}

	/**
	 * Get the value of a configuration property. If the property has not been
	 * defined then the `defaultValue` or NULL is applied to the property before
	 * being returned.
	 *
	 * @protected
	 * @param {string} configProperty - The name of the property to retrieve the
	 *     value for.
	 * @param {*} [defaultValue=null] - The default value to apply and return if
	 *     the property has not been defined.
	 * @returns {*} The value of the configuration property or `defaultValue` if
	 *     the property has not been defined.
	 */
	getConfigValue( configProperty, defaultValue ) {

		const me = this;

		// Ensure we have a config...
		me._initInternalConfigStore();

		// Default the defaultValue
		if ( defaultValue === undefined ) {

			defaultValue = null;
		}

		// Apply the default value if it is missing...
		if ( me.$config[ configProperty ] === undefined ) {

			if ( TIPE( defaultValue ) === "function" ) {

				let fn = defaultValue.bind( me );

				defaultValue = fn();
			}

			me.$config[ configProperty ] = defaultValue;
		}

		// Return the value
		return me.$config[ configProperty ];
	}

	/**
	 * Checks to see if a configuration property has a defined value.
	 *
	 * @protected
	 * @param {string} configProperty - The name of the property to check.
	 * @returns {boolean} Returns TRUE if a value has been defined for the
	 *     specified property or FALSE if no value has been defined.
	 */
	hasConfigValue( configProperty ) {

		const me = this;

		return me.$config[ configProperty ] !== undefined;
	}

	/**
	 * Sets a configuration property value if it has not already been defined.
	 *
	 * @protected
	 * @param {string} configProperty - The name of the property to set.
	 * @param {*} newValue - The value to set if no value has already been
	 *     defined.
	 * @returns {void}
	 */
	setConfigValueIfMissing( configProperty, newValue ) {

		const me = this;

		if ( !me.hasConfigValue( configProperty ) ) {

			me.setConfigValue( configProperty, newValue );
		}
	}

	/**
	 * Sets a configuration property value.
	 *
	 * @protected
	 * @param {string} configProperty - The name of the property to set.
	 * @param {*} newValue - The value to set.
	 * @returns {void}
	 */
	setConfigValue( configProperty, newValue ) {

		const me = this;

		// Ensure we have a config...
		me._initInternalConfigStore();

		// Apply the new value
		me.$config[ configProperty ] = newValue;
	}

	/**
	 * Set multiple configuration property values at once.
	 *
	 * @protected
	 * @param {Object} kvObject - Configuration properties and values to set.
	 * @returns {void}
	 */
	setConfigValues( kvObject ) {

		const me = this;

		// We only accept objects...
		if ( TIPE( kvObject ) !== "object" ) {

			return;
		}

		_.each( kvObject, function ( val, key ) {

			if ( TIPE( val ) !== "undefined" ) {

				me.setConfigValue( key, val );
			}
		} );
	}

	/**
	 * Erase a configuration property value.
	 *
	 * @protected
	 * @param {string} configProperty - The name of the property to erase.
	 * @returns {void}
	 */
	eraseConfigValue( configProperty ) {

		const me = this;

		delete me.$config[ configProperty ];
	}

	// </editor-fold>

	// <editor-fold desc="--- Serialization ----------------------------------">

	serialize( format ) {

		const me = this;

		// noinspection SpellCheckingInspection
		switch ( format.toLowerCase() ) {

			case "jsonapiobject":
				return me._serializeToJsonApiObject();

			case "jsonapistring":
				return me._serializeToJsonApiString();

			case "jsonapipretty":
				return me._serializeToJsonApiPretty();

			default:
				throw new Error( "Unsupported format: " + format );
		}
	}

	_serializeToJsonApiString() {

		const me = this;

		let obj = me._serializeToJsonApiObject();

		return JSON.stringify( obj );
	}

	_serializeToJsonApiPretty() {

		const me = this;

		let obj = me._serializeToJsonApiObject();

		return me.$inspect( obj );
	}

	// noinspection JSMethodCanBeStatic
	_serializeToJsonApiObject() {

		return {};
	}

	// </editor-fold>

	// <editor-fold desc="--- Debugging --------------------------------------">

	/**
	 * A {@link Util.DebugHelper} instance.
	 *
	 * @protected
	 * @readonly
	 * @type {Util.DebugHelper}
	 */
	get $debugger() {

		const me = this;

		return me.$spawn( "commonLib", "util/DebugHelper" );
	}

	/**
	 * Uses an instance of the {@link Util.DebugHelper } class to inspect (dump)
	 * the contents of this object.
	 *
	 * **Note:** This method differs from the {@link Common.BaseClass#$inspect}
	 * method in that it dumps the contents of this object, whereas
	 * `#$inspect()` can be used to dump the contents of any arbitrary variable.
	 *
	 * @uses Common.BaseClass#$inspect
	 * @protected
	 * @param {boolean} [output=true] - Whether or not the contents of the
	 *     variable should be dumped to the console (stdout); if FALSE, the
	 *     output string will be returned, rather than output.
	 * @param {?number} [indent=0] - An optional amount to indent the output,
	 *     using tabs.
	 * @returns {string} A string showing the contents ot `varToInspect`.
	 */
	inspect( output, indent ) {

		const me = this;

		let title = me.$className;

		// Defer to $inspect
		return me.$inspect( me, output, indent, title );
	}

	/**
	 * Uses an instance of the {@link Util.DebugHelper} class to inspect (dump)
	 * the contents of this object's internal configuration store (`$cfg`).
	 *
	 * @uses #$inspect
	 * @protected
	 * @param {boolean} [output=true] - Whether or not the contents of the
	 *     variable should be dumped to the console (stdout); if FALSE, the
	 *     output string will be returned, rather than output.
	 * @param {?number} [indent=0] - An optional amount to indent the output,
	 *     using tabs.
	 * @returns {string} A string showing the contents ot `varToInspect`.
	 */
	inspectConfig( output, indent ) {

		const me = this;

		let title = me.$className + ".$cfg";

		// Defer to $inspect
		return me.$inspect( me.$config, output, indent, title );
	}

	/**
	 * Uses an instance of the {@link Util.DebugHelper} class to inspect (dump)
	 * the contents of an arbitrary variable.
	 *
	 * **Note:** This method differs from the {@link Common.BaseClass#inspect}
	 * method in that it allows an arbitrary variable to be inspected, whereas
	 * `#inspect()` can only be used to dump the contents of this object.
	 *
	 * @uses Util.DebugHelper#inspect
	 * @protected
	 * @param {*} varToInspect - The variable to dump.
	 * @param {boolean} [output=true] - Whether or not the contents of the
	 *     variable should be dumped to the console (stdout); if FALSE, the
	 *     output string will be returned, rather than output.
	 * @param {?number} [indent=0] - An optional amount to indent the output,
	 *     using tabs.
	 * @param {?string} [title=null] - An optional title to add to the output.
	 * @returns {string} A string showing the contents ot `varToInspect`.
	 */
	$inspect( varToInspect, output, indent, title ) {

		const me = this;

		return me.$debugger.inspect( varToInspect, output, indent, title );
	}

	// </editor-fold>
}

module.exports = BaseClass;
