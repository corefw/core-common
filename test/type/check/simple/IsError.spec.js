/**
 * @file
 * Defines tests for the Core.type.check.simple.IsError class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/* eslint func-style: "off", require-jsdoc: "off" */

const VError = Core.dep( "verror" );

describe( "Core.type.check.simple.IsError", function () {

	let check;

	before( function () {

		// Get the class definition for the check class
		check = Core.cls( "Core.type.check.simple.IsError" );

	} );

	describe( "::evaluateTarget()", function () {

		it( "should return TRUE when passed an Error Object", function () {

			// Define the test value
			let testValue = new Error();

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed an extended Error Object", function () {

			// Define the test value
			class ExtendedError extends Error {}
			let testValue = new ExtendedError();

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed a VError Object", function () {

			// Define the test value
			let cause 		= new Error( "this error was the cause" );
			let testValue 	= new VError( cause, "bad stuff" );

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed a WError Object", function () {

			// Define the test value
			let cause 		= new Error( "this error was the cause" );
			let testValue 	= new VError.WError( cause, "bad stuff" );

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed a SError Object", function () {

			// Define the test value
			let cause 		= new Error( "this error was the cause" );
			let testValue 	= new VError.SError( cause, "bad stuff" );

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		// --

		it( "should return FALSE when passed an Error constructor", function () {

			// Define the test value
			let testValue = Error;

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed an extended Error constructor", function () {

			// Define the test value
			class ExtendedError extends Error {}
			let testValue = ExtendedError;

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a VError constructor", function () {

			// Evaluate
			let result = check.evaluateTarget( VError );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a WError constructor", function () {

			// Evaluate
			let result = check.evaluateTarget( VError.WError );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a SError constructor", function () {

			// Evaluate
			let result = check.evaluateTarget( VError.SError );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a String", function () {

			// Define the test value
			let testValue = "a";

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a Number", function () {

			// Define the test value
			let testValue = 1;

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed an Array", function () {

			// Define the test value
			let testValue = [];

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a non-Error Object", function () {

			// Define the test value
			let testValue = {};

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

	} );

	describe( "::describeTarget()", function() {

		it( "should properly describe Error objects with no message", function() {

			// This is what we want described..
			let valueToDescribe = new Error();

			// Describe it
			let res = check.describeTarget( valueToDescribe );

			// Assert..
			expect( res ).to.equal( "Error Object (with an empty message)" );


		} );

		it( "should properly describe Error objects with an empty message", function() {

			// This is what we want described..
			let valueToDescribe = new Error( "" );

			// Describe it
			let res = check.describeTarget( valueToDescribe );

			// Assert..
			expect( res ).to.equal( "Error Object (with an empty message)" );

		} );

		it( "should properly describe Error objects with a short message", function() {

			// This is what we want described..
			let valueToDescribe = new Error( "Something is rotten in Denmark" );

			// Describe it
			let res = check.describeTarget( valueToDescribe );

			// Assert..
			expect( res ).to.equal( "Error Object (\"Something is rotten in Denmark\")" );

		} );

		it( "should properly describe Error objects with a long message", function() {

			// This is what we want described..
			let valueToDescribe = new Error( "Something is rotten in the state of Denmark. We really should do something about it" );

			// Describe it
			let res = check.describeTarget( valueToDescribe );

			// Assert..
			expect( res ).to.equal( "Error Object (\"Something is rotten in the state of...\")" );

		} );

	} );

	describe( "<- Core.type.check.Collection#getFirstDescriptiveMatch()", function() {

		it( "should return this check ('isError') as the first, descriptive, match for Error Objects", function () {

			// Define the test value
			let testValue = new Error();

			// Instantiate a check collection
			let collection = Core.inst( "Core.type.check.Collection" );

			// Execute the `getFirstDescriptiveMatch` method.
			let result = collection.getFirstDescriptiveMatch( testValue );

			// Assert that the check tested by this file
			// is the one returned by getFirstDescriptiveMatch.
			expect( result.checkName ).to.equal( check.checkName );

		} );

		it( "should return this check ('isError') as the first, descriptive, match for extended Error Objects", function () {

			// Define the test value
			class ExtendedError extends Error {}
			let testValue = new ExtendedError();

			// Instantiate a check collection
			let collection = Core.inst( "Core.type.check.Collection" );

			// Execute the `getFirstDescriptiveMatch` method.
			let result = collection.getFirstDescriptiveMatch( testValue );

			// Assert that the check tested by this file
			// is the one returned by getFirstDescriptiveMatch.
			expect( result.checkName ).to.equal( check.checkName );

		} );

		it( "should return this check ('isError') as the first, descriptive, match for VError Objects", function () {

			// Define the test value
			let cause 		= new Error( "this error was the cause" );
			let testValue 	= new VError( cause, "bad stuff" );

			// Instantiate a check collection
			let collection = Core.inst( "Core.type.check.Collection" );

			// Execute the `getFirstDescriptiveMatch` method.
			let result = collection.getFirstDescriptiveMatch( testValue );

			// Assert that the check tested by this file
			// is the one returned by getFirstDescriptiveMatch.
			expect( result.checkName ).to.equal( check.checkName );

		} );

	} );

} );
