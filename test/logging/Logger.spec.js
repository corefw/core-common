/**
 * @file
 * Defines tests for the Core.logging.Logger class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/* eslint no-console: "off", require-jsdoc: "off", func-style: "off", no-extra-bind: "off", no-unused-vars: "off", no-undef: "off", space-in-parens: "off" */

// Convenient Error References
const DependencyValidationError = Core.error.DependencyValidationError;

describe.skip( "Core.logging.Logger", function () {

	describe( "$construct()", function () {

		it( "should require a Core.context.Context class instance", function() {

			function initLogger() {

				let output = testHelpers.initTestDependency( "Core.logging.output.Json" );

				let logger = Core.inst( "Core.logging.Logger", {
					output: output
				} );

			}

			expect( initLogger ).to.throw( DependencyValidationError );

		} );

		it( "should require a Core.logging.output.BaseOutput class instance", function() {

			function initLogger() {

				let context = testHelpers.initTestDependency( "Core.context.Context" );

				let logger = Core.inst( "Core.logging.Logger", {
					context: context
				} );

			}

			expect( initLogger ).to.throw( DependencyValidationError );

		} );

		it( "should accept a single Core.logging.output.BaseOutput class instance", function() {

			let logger;

			function initLogger() {

				let context = testHelpers.initTestDependency( "Core.context.Context" );
				let output 	= testHelpers.initTestDependency( "Core.logging.output.Json" );

				logger = Core.inst( "Core.logging.Logger", {
					context : context,
					output  : output
				} );

			}

			expect( initLogger ).to.not.throw( DependencyValidationError );

		} );

		it( "should accept a Core.logging.output.Collection class instance", function() {

			let logger;

			function initLogger() {

				let context    = testHelpers.initTestDependency( "Core.context.Context" );
				let output 	   = testHelpers.initTestDependency( "Core.logging.output.Json" );
				let collection = testHelpers.initTestDependency( "Core.logging.output.Collection", {
					initialValues: output
				} );

				logger = Core.inst( "Core.logging.Logger", {
					context : context,
					output  : collection
				} );

			}

			expect( initLogger ).to.not.throw( DependencyValidationError );

		} );

		/*
		it( "should accept an array of one Core.logging.output.BaseOutput class instance", function() {

			function initLogger() {

				let context = testHelpers.initTestDependency( "Core.context.Context" );
				let output 	= testHelpers.initTestDependency( "Core.logging.output.Json" );

				let logger = Core.inst( "Core.logging.Logger", {
					context : context,
					output  : [ output ]
				} );

			}

			expect( initLogger ).to.not.throw( DependencyValidationError );

		} );

		it( "should accept an array of more than one Core.logging.output.BaseOutput class instances", function() {

			function initLogger() {

				let context = testHelpers.initTestDependency( "Core.context.Context" );
				let outputA = testHelpers.initTestDependency( "Core.logging.output.Json" );
				let outputB = testHelpers.initTestDependency( "Core.logging.output.Json" );

				let logger = Core.inst( "Core.logging.Logger", {
					context : context,
					output  : [ outputA, outputB ]
				} );

			}

			expect( initLogger ).to.not.throw( DependencyValidationError );

		} );

		it( "should fail when passed an empty array for the output dependency", function() {

			function initLogger() {

				let context = testHelpers.initTestDependency( "Core.context.Context" );
				//let outputA = testHelpers.initTestDependency( "Core.logging.output.Json" );
				//let outputB = testHelpers.initTestDependency( "Core.logging.output.Json" );

				let logger = Core.inst( "Core.logging.Logger", {
					context : context,
					output  : []
				} );

			}

			initLogger();

			//expect( initLogger ).to.not.throw( DependencyValidationError );

		} );
		*/

		it( "should accept a minLogLevel setting" );

		it( "should default minLogLevel to the INFO level" );

	} );

	describe( "log()", function() {

		let logger;

		before( function() {

			//logger =

		} );

	} );

} );
