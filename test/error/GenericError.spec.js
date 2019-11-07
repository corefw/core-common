/**
 * @file
 * Defines tests for the Core.error.GenericError class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/* eslint func-style: "off", require-jsdoc: "off" */

describe( "Core.error.GenericError", function () {

	let errorManager;

	before( function () {
		errorManager = Core.inst( "Core.error.Manager" );
	} );

	describe( "(Accessibility)", function() {

		describe( "(the 'new' keyword w/ Core.cls)", function() {

			let TestConstructor;
			let testInstance;
			let testCause;

			before( function() {

				// Create a "cause"
				testCause = new Error( "A.CAUSE" );

				// Grab the constructor
				TestConstructor = Core.cls( "Core.error.GenericError" );

				// Instantiate
				testInstance = new TestConstructor( "%s and %05d is bad", "a", { hello: "world" }, 1, testCause );

			} );


			it( "should create an instance of the appropriate class", function () {

				expect( testInstance ).to.be.an.instanceof( Core.cls( "Core.error.GenericError" ) );

			} );

			it( "should create an error with a properly formatted message", function () {

				// Assert that the message came out ok ..
				expect( testInstance.message ).to.have.string( "a and 00001 is bad" );

			} );

			it( "should return an error imbued with additional 'info'", function () {

				// Extract the 'info'
				let info = errorManager.info( testInstance );

				// .. and assert that the test 'info' made it
				expect( info.hello ).to.equal( "world" );

			} );

			it( "should return an error that contains 'causal' information in its 'message'", function () {

				// Assert
				expect( testInstance.message ).to.have.string( testCause.message );

			} );

			it( "should return an error that has a 'cause' reference", function () {

				// Assert
				expect( testInstance.jse_cause ).to.equal( testCause );

			} );

		} );

		describe( "(the 'new' keyword w/ the Core NS proxy)", function() {

			let TestConstructor;
			let testInstance;
			let testCause;

			before( function() {

				// Create a "cause"
				testCause = new Error( "A.CAUSE" );

				// Grab the constructor
				TestConstructor = Core.error.GenericError;

				// Instantiate
				testInstance = new TestConstructor( "%s and %05d is bad", "a", { hello: "world" }, 1, testCause );

			} );


			it( "should create an instance of the appropriate class", function () {

				expect( testInstance ).to.be.an.instanceof( Core.cls( "Core.error.GenericError" ) );

			} );

			it( "should create an error with a properly formatted message", function () {

				// Assert that the message came out ok ..
				expect( testInstance.message ).to.have.string( "a and 00001 is bad" );

			} );

			it( "should return an error imbued with additional 'info'", function () {

				// Extract the 'info'
				let info = errorManager.info( testInstance );

				// .. and assert that the test 'info' made it
				expect( info.hello ).to.equal( "world" );

			} );

			it( "should return an error that contains 'causal' information in its 'message'", function () {

				// Assert
				expect( testInstance.message ).to.have.string( testCause.message );

			} );

			it( "should return an error that has a 'cause' reference", function () {

				// Assert
				expect( testInstance.jse_cause ).to.equal( testCause );

			} );

		} );

	} );


} );
