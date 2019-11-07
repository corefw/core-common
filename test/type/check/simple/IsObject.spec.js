/**
 * @file
 * Defines tests for the Core.type.check.simple.IsObject class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/* eslint func-style: "off", require-jsdoc: "off", no-new-object: "off" */

describe( "Core.type.check.simple.IsObject", function () {

	let check;

	before( function () {

		// Get the class definition for the check class
		check = Core.cls( "Core.type.check.simple.IsObject" );

	} );

	describe( "::evaluateTarget()", function () {

		it( "should return TRUE when passed an Object", function () {

			// Define the test value
			let testValue = {};

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed an Array", function () {

			// Define the test value
			let testValue = [ 1, 2, 3 ];

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return FALSE when passed a String", function () {

			// Define the test value
			let testValue = "2";

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a NULL value", function () {

			// Define the test value
			let testValue = null;

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed an UNDEFINED value", function () {

			// Define the test value
			let testValue = undefined;

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

	} );

	describe( "::describeTarget()", function() {

		it( "should properly describe objects with extended constructors", function() {

			// This is what we want described..
			class x {}
			let y = new x();
			let valueToDescribe = y;

			// Describe it
			let res = check.describeTarget( valueToDescribe );

			// Assert..
			expect( res ).to.equal( "Object (constructor.name=\"x\")" );

		} );

		it( "should properly describe objects with 'Object' constructors (variant #1)", function() {

			// This is what we want described..
			let valueToDescribe = {};

			// Describe it
			let res = check.describeTarget( valueToDescribe );

			// Assert..
			expect( res ).to.equal( "Object (plain)" );

		} );

		it( "should properly describe objects with 'Object' constructors (variant #2)", function() {

			// This is what we want described..
			let valueToDescribe = new Object();

			// Describe it
			let res = check.describeTarget( valueToDescribe );

			// Assert..
			expect( res ).to.equal( "Object (plain)" );

		} );

	} );

	describe( "<- Core.type.check.Collection#getFirstDescriptiveMatch()", function() {

		it( "should return this check ('isObject') as the first, descriptive, match for prototypical Objects", function () {

			// Define the test value
			let TestValue = function() {};

			// Instantiate a check collection
			let collection = Core.inst( "Core.type.check.Collection" );

			// Execute the `getFirstDescriptiveMatch` method.
			let result = collection.getFirstDescriptiveMatch( new TestValue() );

			// Assert that the check tested by this file
			// is the one returned by getFirstDescriptiveMatch.
			expect( result.checkName ).to.equal( check.checkName );

		} );

	} );

} );
