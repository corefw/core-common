/**
 * @file
 * Defines tests for the Core.type.check.simple.IsArrowFunction class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/* eslint func-style: "off", require-jsdoc: "off" */

describe( "Core.type.check.simple.IsArrowFunction", function () {

	let check;

	before( function () {

		// Get the class definition for the check class
		check = Core.cls( "Core.type.check.simple.IsArrowFunction" );

	} );

	describe( "::evaluateTarget()", function () {

		it( "should return TRUE when passed an Arrow Function (variant #1)", function () {

			// Define the test value
			let testValue = () => {};

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed an Arrow Function (variant #2)", function () {

			// Define the test value
			let testValue = ( $$a, __b ) => {};

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed an Arrow Function (variant #3)", function () {

			// Define the test value
			let testValue = functioN => {};

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed an Arrow Function (variant #4)", function () {

			// Define the test value
			let testValue = $a => $a + 1;

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed an Arrow Function (variant #5)", function () {

			// Define the test value
			let testValue = __a => ( { foo: "bar" } );

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed an Arrow Function (variant #6)", function () {

			// Evaluate
			let result = check.evaluateTarget( () => {} );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed an Arrow Function (variant #7)", function () {

			// Evaluate
			let result = check.evaluateTarget( a => {} );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed an Arrow Function (variant #8)", function () {

			// Define the test value
			let testValue = (

			) => {};

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return FALSE when passed an anonymous, non-arrow, function (variant #1)", function () {

			// Define the test value
			let testValue = function() {};

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed an anonymous, non-arrow, function (variant #2)", function () {

			// Evaluate
			let result = check.evaluateTarget( function() {} );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a named, non-arrow, function", function () {

			// Define the test value
			let testValue = function named2() { return a => {}; };

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a non-arrow function reference (variant #1)", function () {

			// Define the test value
			function testValue( a, b, c ) {}

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a non-arrow function reference (variant #2)", function () {

			// Evaluate
			let result = check.evaluateTarget( function named4() {} );

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

