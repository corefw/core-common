/**
 * @file
 * Defines tests for the Core.type.check.simple.IsUnboundFunction class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/* eslint func-style: "off", require-jsdoc: "off" */

describe( "Core.type.check.simple.IsUnboundFunction", function () {

	let check;

	before( function () {

		// Get the class definition for the check class
		check = Core.cls( "Core.type.check.simple.IsUnboundFunction" );

	} );

	describe( "::evaluateTarget()", function () {

		it( "should return TRUE when passed an unbound arrow function (variant #1)", function () {

			// Define the test value
			let testValue = () => {};

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed an unbound arrow function (variant #2)", function () {

			// Define the test value
			let testValue = ( $$a, __b ) => {};

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed an unbound arrow function (variant #3)", function () {

			// Define the test value
			let testValue = $a => $a + 1;

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed an unbound arrow function (variant #4)", function () {

			// Evaluate
			let result = check.evaluateTarget( functioN => {} );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed an unbound, anonymous, non-arrow, function", function () {

			// Define the test value
			let testValue = function() {};

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed an unbound, named, non-arrow, function", function () {

			// Define the test value
			let testValue = function someName() { return a => {}; };

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed an unbound, anonymous, async function", function () {

			// Define the test value
			let testValue = async function() {};

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return FALSE when passed a bound arrow function (variant #1)", function () {

			// Define the test value
			let anArrowFunction = () => {};
			let testValue = anArrowFunction.bind( this );

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a bound arrow function (variant #2)", function () {

			// Define the test value
			let anArrowFunction = ( $$a, __b ) => {};
			let testValue = anArrowFunction.bind( this );

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a bound arrow function (variant #3)", function () {

			// Define the test value
			let anArrowFunction = $a => $a + 1;
			let testValue = anArrowFunction.bind( this );

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a bound arrow function (variant #4)", function () {

			// Define the test value
			let anArrowFunction = functioN => {};

			// Evaluate
			let result = check.evaluateTarget( anArrowFunction.bind( this ) );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a bound, anonymous, non-arrow, function", function () {

			// Define the test value
			let anAnonymousFunction = function() {};
			let testValue = anAnonymousFunction.bind( this );

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a bound, named, non-arrow, function", function () {

			// Define the test value
			let aNamedFunction = function someName() { return a => {}; };
			let testValue = aNamedFunction.bind( this );

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a bound, anonymous, async function", function () {

			// Define the test value
			let anAsyncFunction = async function() {};
			let testValue = anAsyncFunction.bind( this );

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

		it( "should return FALSE when passed an Array", function () {

			// Define the test value
			let testValue = [];

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a boolean", function () {

			// Define the test value
			let testValue = true;

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

	} );

} );

