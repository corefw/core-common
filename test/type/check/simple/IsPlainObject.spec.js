/**
 * @file
 * Defines tests for the Core.type.check.simple.IsPlainObject class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/* eslint func-style: "off", require-jsdoc: "off" */

describe( "Core.type.check.simple.IsPlainObject", function () {

	let check;

	before( function () {

		// Get the class definition for the check class
		check = Core.cls( "Core.type.check.simple.IsPlainObject" );

	} );

	describe( "::evaluateTarget()", function () {

		it( "should return TRUE when passed a Plain Object (variant #1)", function () {

			// Define the test value
			let testValue = Object.create( null );

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed a Plain Object (variant #2)", function () {

			// Define the test value
			let testValue = { x: 0, y: 0 };

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed a plain Object (variant #3)", function () {

			// Define the test value
			let testValue = {};

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return FALSE when passed a prototypical Object", function () {

			// Define the test value
			let TestValue = function someName() {};

			// Evaluate
			let result = check.evaluateTarget( new TestValue() );

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
			let testValue = [ 1, 2, 3 ];

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

	} );

	describe( "::describeTarget()", function() {

		it( "should properly describe Plain Object's with no keys", function() {

			// This is what we want described..
			let valueToDescribe = {};

			// Describe it
			let res = check.describeTarget( valueToDescribe );

			// Assert..
			expect( res ).to.equal( "empty Plain Object" );

		} );

		it( "should properly describe Plain Object's with a few keys", function() {

			// This is what we want described..
			let valueToDescribe = { something: "old", andSomething: "new", thenSomething: "borrowed", finallySomething: "blue" };

			// Describe it
			let res = check.describeTarget( valueToDescribe );

			// Assert..
			expect( res ).to.equal( "Plain Object (keys=\"something\",\"andSomething\",\"thenSomething\",\"finallySomething\")" );

		} );

		it( "should properly describe Plain Object's with many keys", function() {

			// This is what we want described..
			let valueToDescribe = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 10, k: 11 };

			// Describe it
			let res = check.describeTarget( valueToDescribe );

			// Assert..
			expect( res ).to.equal( "Plain Object (keys=\"a\",\"b\",\"c\"...; total=11)" );

		} );

	} );

	describe( "<- Core.type.check.Collection#getFirstDescriptiveMatch()", function() {

		it( "should return this check ('isPlainObject') as the first, descriptive, match for plain Objects", function () {

			// Define the test value
			let testValue = { hello: "world" };

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

