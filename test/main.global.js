/**
 * @file
 * This file (along with any others that match *.global.js) will be included automatically by the`core-cli-plugin-mocha`
 * CLI plugin prior to running Mocha. Since test files (*.spec.js) will not have access to this file's scope, anything
 * that should be made available to tests must be globalized (e.g. added to the `global` object).
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";


// Register a "namespace" for test fixture classes.
Core.assetManager.registerNamespace(
	"Test.fixture.",
	[ __dirname, "_fixtures" ]
);


// Global Test Helpers
const globalTestHelpers = {

	initTestDependency( fullClassName ) {

		// A convenience alias..
		let initDep = globalTestHelpers.initTestDependency;

		switch( fullClassName ) {

			case "Core.asset.ClassLoader":
				return Core.inst( "Core.asset.ClassLoader", {
					iocContainer: initDep( "Core.asset.ioc.Container" )
				} );

			case "Core.context.Context":
				return Core.inst( "Core.context.Context", {
					templateParser: initDep( "Core.template.Parser" )
				} );

			case "Core.fs.path.Manager":
				return Core.inst( "Core.fs.path.Manager", {
					context        : initDep( "Core.context.Context" ),
					rootPathPrefix : "/"
				} );

			case "Core.fs.FileSystem":
				return Core.inst( "Core.fs.FileSystem", {
					pathManager       : initDep( "Core.fs.path.Manager" ),
					classLoader       : initDep( "Core.asset.ClassLoader" ),
					fileSystemAdapter : initDep( "Core.fs.adapter.Local" )
				} );

			case "Core.type.Validator":
				return Core.inst( "Core.type.Validator", {
					assetManager : Core.assetManager,
					classLoader  : initDep( "Core.asset.ClassLoader" ),
				} );

			default:
				return Core.inst( fullClassName, {} );

		}

	}

};

global.testHelpers = globalTestHelpers;
