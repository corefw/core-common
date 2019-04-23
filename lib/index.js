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

// Load the Core class. It provides its functionality by way
// of static methods, so there's no need to instantiate it.
const Core = require( "./Core" );

// Make Core global & this file's export.
module.exports = global.Core = Core;



// --


// Register Framework-Level Deps
// Note that we register functions, and not the dependencies
// themselves, in order to promote lazy-loading.
Core.assetManager.registerDependencies( {

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

		// Return it
		return lodash;

	},

	"fs": function initFileSystemDep() {

		// We use fs-extra-promise to add several filesystem functions, as well as
		// promise support, to the native `fs` module and, since we use non-native
		// promises (bluebird and bluebird-extra), we need to inform the fs-extra-promise
		// library of the promise library that it should use.

		// Load the promise library, which is _aliased_ as "promise" in the Asset Manager.
		let promiseLibrary = Core.assetManager.dep( "promise" );

		// Apply the promise lib and return...
		return require( "fs-extra-promise" ).usePromise( promiseLibrary );

	},

	"chalk": function initChalkDep() {

		let CHALK = require( "chalk" );
		return new CHALK.constructor();

	},


} );


// Add a few dependency aliases
Core.assetManager.addDependencyAliases( {
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
Core.assetManager.registerNamespace(
	"Core",
	[ __dirname ]
);

