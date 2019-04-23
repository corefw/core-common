/**
 * @file
 * Defines tests for the Core.type.check.simple.IsArguments class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

describe( "Core.type.check.simple.IsArguments", function () {

	let check;
	let argsObject;

	before( function () {

		// Get the class definition for the check class
		check = Core.cls( "Core.type.check.simple.IsArguments" );

		// We use this helper function to build an arguments object that we can test with.
		/* eslint require-jsdoc: "off" */
		function buildTestArgsObject( a, b, c ) {
			argsObject = arguments;
		}
		buildTestArgsObject( "firstParam", "secondParam", "thirdParam" );

	} );

	describe( "::evaluateTarget()", function () {

		it( "should return TRUE when passed an Arguments Object", function () {

			// Define the test value
			let testValue = argsObject;

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return FALSE when passed an Array", function () {

			// Define the test value
			let testValue = [ "this", "is", "an", "array" ];

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

	} );

	describe( "::describeTarget()", function() {

		it( "should properly describe empty argument objects", function () {

			// Define the test value
			let testValue = arguments;

			// Describe it
			let result = check.describeTarget( testValue );

			// Define our expectations
			let expectedResult = "empty Arguments Object";

			// Assert
			expect( result ).to.equal( expectedResult );

		} );

		it( "should properly describe non-empty argument objects", function () {

			// Define the test value
			let testValue = argsObject;

			// Describe it
			let result = check.describeTarget( testValue );

			// Define our expectations
			let expectedResult = "Arguments Object (length=3)";

			// Assert
			expect( result ).to.equal( expectedResult );

		} );

	} );

	describe( "<- Core.type.check.Collection#getFirstDescriptiveMatch()", function() {

		it( "should return this check ('isArguments') as the first, descriptive, match for Argument Objects", function () {

			// Define the test value
			let testValue = arguments;

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
