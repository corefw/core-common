/**
 * @file
 * This is the main entry point for the Core Framework (i.e. it will be loaded whenever you require("@corefw/common")).
 * The returned object will include a number of VERY fundamental utilty objects that can be used to instantiate various
 * parts of the framework in a number of different ways.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.1.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";


// --


// Foundational Class Deps
const AssetManager 		= require( "./asset/Manager" );
const Mixer				= require( "./asset/Mixer" );
const ClassInspector	= require( "./asset/ClassInspector" );
const Igniter 			= require( "./app/Igniter" );
const DebugInspector    = require( "./debug/Inspector" );

// Instantiate an AssetManager
let assetManager = new AssetManager();

// Instantiate the Mixer (Mixin Provider)
let mixer = new Mixer();

// Instantiate an Igniter
let igniter = new Igniter();

// Instantiate a ClassInspector
let classInspector = new ClassInspector();

// Instantiate a DebugInspector
let debugInspector = new DebugInspector();


// --


// Register Framework-Level Deps
// Note that we register functions, and not the dependencies
// themselves, in order to promote lazy-loading.
assetManager.registerDependencies( {

	"aws-sdk"        : () => { return require( "aws-sdk" ); 			},
	"bluebird-extra" : () => { return require( "bluebird" ); 			},
	"eyes"           : () => { return require( "eyes" ); 				},
	"js-yaml"        : () => { return require( "js-yaml" ); 			},
	"moment"         : () => { return require( "moment" ); 				},
	"uuid"           : () => { return require( "uuid" ); 				},
	"verror"         : () => { return require( "verror" ); 				},
	"indefinite"     : () => { return require( "indefinite" );			},
	"path"           : () => { return require( "path" );			    },
	"fast-glob"      : () => { return require( "fast-glob" );		    },
	"dot-object"     : () => { return require( "dot-object" );		    },
	"perf_hooks"     : () => { return require( "perf_hooks" );		    },

	// todo: remove these..
	"tipe": () => { return require( "tipe" ); 				},

	// These require a bit of special initialization
	"lodash": function initLodashDep() {

		// Load Lodash
		let lodash = require( "lodash" );

		// Lodash Plugins
		lodash.mixin( require( "lodash-inflection" ) );

		// Lodash Config
		// Mustache.js-style template
		/*
		lodash.templateSettings = {
			interpolate: /{{(.+?)}}/g,
		};
		*/

		// Return it
		return lodash;

	},

	"fs": function initFileSystemDep() {

		// We use fs-extra-promise to add several filesystem functions, as well as
		// promise support, to the native `fs` module and, since we use non-native
		// promises (bluebird and bluebird-extra), we need to inform the fs-extra-promise
		// library of the promise library that it should use.

		// Load the promise library, which is _aliased_ as "promise" in the Asset Manager.
		let promiseLibrary = assetManager.dep( "promise" );

		// Apply the promise lib and return...
		return require( "fs-extra-promise" ).usePromise( promiseLibrary );

	},

	"chalk": function initChalkDep() {

		let CHALK = require( "chalk" );
		return new CHALK.constructor();

	},


} );

// Add a few dependency aliases
assetManager.addDependencyAliases( {
	"dot-object"     : "dot",
	"fast-glob"      : "glob",
	"aws-sdk"        : "aws",
	"bluebird-extra" : [ "promise", "bluebird" ],
	"js-yaml"        : "yaml",
	"lodash"         : "_",
	"mysql2"         : "mysql",
	"jsonwebtoken"   : "jwt",
	"indefinite"     : "a",
} );


// --


// Register root framework namespaces
assetManager.registerNamespace(
	"Core",
	[ __dirname ]
);

/*
assetManager.registerNamespace(
	"Core.app",
	[ __dirname, "app" ]
);
assetManager.registerNamespace(
	"Core.asset",
	[ __dirname, "asset" ]
);
*/


// --


// Create the "Core" object
let Core = {

	// Fundamental Classes
	igniter        : igniter,
	assetManager   : assetManager,
	mixer          : mixer,
	classInspector : classInspector,
	inspector      : debugInspector,

	// Convenience aliases for common framework methods
	cls() {
		return assetManager.cls.apply( assetManager, arguments );
	},

	// Instantiates a target class. This is a convenience shortcut for
	// quickly loading classes, but it should not be used often (if at all)
	// in production because it loads classes outside of an application
	// context, which is a party foul.
	inst( className, cfg = null ) {

		if( cfg === null ) {
			cfg = {};
		}

		let Cls = Core.cls( className );
		return new Cls( cfg );

	},

	dep() {
		return assetManager.dep.apply( assetManager, arguments );
	},

	deps() {
		return assetManager.deps.apply( assetManager, arguments );
	},

	mix() {
		return mixer.mix.apply( mixer, arguments );
	},

	summarize() {
		return debugInspector.summarize.apply( debugInspector, arguments );
	},

	inspect() {
		return debugInspector.inspect.apply( debugInspector, arguments );
	},

	summarizeChain() {
		return debugInspector.summarizeChain.apply( debugInspector, arguments );
	},

	clearCaches( includeDependencyCache = false ) {

		// Clear the Node.js require() cache.
		Object.keys( require.cache ).forEach(
			function ( key ) {
				delete require.cache[ key ];
			}
		);

		// Clear the AssetManager's class cache
		assetManager.clearClassCache();

		// Optionally, clear the AssetManager's dependency cache
		if( includeDependencyCache === true ) {
			assetManager.clearDependencyCache();
		}

	},

	instanceOf( obj, className ) {

		let cls = Core.cls( className );
		return ( obj instanceof cls );

	},

	instanceof( obj, className ) {
		return Core.instanceOf( obj, className );
	}

};


// --


// Make Core global
global.Core 		= Core;

// Export the Core object
module.exports 		= Core;
