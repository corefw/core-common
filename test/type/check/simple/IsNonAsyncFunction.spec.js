/**
 * @file
 * Defines tests for the Core.type.check.simple.IsNonAsyncFunction class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/* eslint func-style: "off", require-jsdoc: "off", no-extra-bind: "off" */

describe( "Core.type.check.simple.IsNonAsyncFunction", function () {

	let check;

	before( function () {

		// Get the class definition for the check class
		check = Core.cls( "Core.type.check.simple.IsNonAsyncFunction" );

	} );

	describe( "::evaluateTarget()", function () {

		it( "should return TRUE when passed a non-Async Arrow Function (variant #1)", function () {

			// Define the test value
			let testValue = () => {};

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed a non-Async Arrow Function (variant #2)", function () {

			// Define the test value
			let testValue = ( $$a, __b ) => {};

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed a non-Async Arrow Function (variant #3)", function () {

			// Define the test value
			let testValue = functioN => {};

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed a non-Async, non-Arrow, function variable (variant #1)", function () {

			// Define the test value
			let testValue = function() {};

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed a non-Async, non-Arrow, function variable (variant #2)", function () {

			// Define the test value
			let testValue = function named2() { return a => {}; };

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed a non-Async, non-Arrow, function reference (variant #1)", function () {

			// Define the test value
			function testValue( a, b, c ) {}

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed a non-Async, non-Arrow, function reference (variant #2)", function () {

			// Evaluate
			let result = check.evaluateTarget( function() {} );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed a non-Async, non-Arrow, function reference (variant #3)", function () {

			// Evaluate
			let result = check.evaluateTarget( function someName() {} );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return FALSE when passed a named Async Function (variant #1)", function () {

			// Define the test value
			let testValue = async function namedAsync() {};

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a named Async Function (variant #2)", function () {

			// Evaluate
			let result = check.evaluateTarget( async function fourth() {} );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed an anonymous Async Function (variant #1)", function () {

			// Evaluate
			let result = check.evaluateTarget( async function() {} );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed an anonymous Async Function (variant #2)", function () {

			// Define the test value
			let testValue = async function() {};

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed an Arrow Function", function () {

			// Define the test value
			let testValue = async () => {};

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

		it( "should return FALSE when passed a String", function () {

			// Define the test value
			let testValue = "2";

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a Boolean", function () {

			// Define the test value
			let testValue = true;

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

	} );


} );

