/**
 * @file
 * Defines tests for the Core.type.check.simple.IsCoreClassName class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

describe( "Core.type.check.simple.IsCoreClassName", function () {

	let check;

	before( function () {

		// Get the class definition for the check class
		check = Core.cls( "Core.type.check.simple.IsCoreClassName" );

	} );

	describe( "::evaluateTarget()", function () {

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

		it( "should return TRUE when passed a Core Class Name (variant #5)", function () {

			// Define the test value
			let testValue = "Core.abstract.BaseClass";

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

		it( "should return FALSE when passed a Core Class Definition", function () {

			// Define the test value
			let testValue = Core.cls( "Core.abstract.Component" );

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

	describe( "::describeTarget()", function() {

		it( "should properly describe Core Class Names", function() {

			// This is what we want described..
			let valueToDescribe = "Core.abstract.Component";

			// Describe it
			let res = check.describeTarget( valueToDescribe );

			// Assert..
			expect( res ).to.equal( "Core Class Name (String; \"Core.abstract.Component\")" );

		} );

	} );

	describe( "<- Core.type.check.Collection#getFirstDescriptiveMatch()", function() {

		it( "should return this check ('isCoreClassName') as the first, descriptive, match for valid Core Class Name strings", function () {

			// Define the test value
			let testValue = "Core.ns.Something";

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

