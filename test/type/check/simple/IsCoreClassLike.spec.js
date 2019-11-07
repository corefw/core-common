/**
 * @file
 * Defines tests for the Core.type.check.simple.IsCoreClassLike class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/* eslint func-style: "off", require-jsdoc: "off" */

describe( "Core.type.check.simple.IsCoreClassLike", function () {

	let check;

	before( function () {

		// Get the class definition for the check class
		check = Core.cls( "Core.type.check.simple.IsCoreClassLike" );

	} );

	describe( "::evaluateTarget()", function () {

		it( "should return TRUE when passed a Core Class Definition (variant #1)", function () {

			// Define the test value
			let testValue = Core.cls( "Core.abstract.Component" );

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed a Core Class Definition (variant #2)", function () {

			// Define the test value
			class testValue extends Core.cls( "Core.abstract.BaseClass" ) {}

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed a Core Class Name (variant #1)", function () {

			// Define the test value
			let testValue = "Core.Something";

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed a Core Class Name (variant #2)", function () {

			// Define the test value
			let testValue = "Core.ns.Something";

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed a Core Class Name (variant #3)", function () {

			// Define the test value
			let testValue = "Core.ns.someThing.Something";

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed a Core Class Name (variant #4)", function () {

			// Define the test value
			let testValue = "Test.ns.ns.Something";

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return FALSE when passed a string containing an invalid/malformed Core Class Name (variant #1)", function () {

			// Define the test value
			let testValue = "Core.something";

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a string containing an invalid/malformed Core Class Name (variant #2)", function () {

			// Define the test value
			let testValue = "Core";

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a string containing an invalid/malformed Core Class Name (variant #3)", function () {

			// Define the test value
			let testValue = "Core.Something.Something";

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a string containing an invalid/malformed Core Class Name (variant #4)", function () {

			// Define the test value
			let testValue = "Test";

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a Core Class Instance", function () {

			// Define the test value
			let testValue = Core.inst( "Core.abstract.Component" );

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a prototypical object", function () {

			// Define the test value
			function TestValue() {}

			// Evaluate
			let result = check.evaluateTarget( new TestValue() );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a Set", function () {

			// Define the test value
			let testValue = new Set();

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

		it( "should return FALSE when passed a Number", function () {

			// Define the test value
			let testValue = 1;

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

	} );

} );

