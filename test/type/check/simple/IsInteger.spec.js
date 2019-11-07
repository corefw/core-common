/**
 * @file
 * Defines tests for the Core.type.check.simple.IsInteger class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/* eslint func-style: "off", require-jsdoc: "off" */

describe( "Core.type.check.simple.IsInteger", function () {

	let check;

	before( function () {

		// Get the class definition for the check class
		check = Core.cls( "Core.type.check.simple.IsInteger" );

	} );

	describe( "::evaluateTarget()", function () {

		it( "should return TRUE when passed an integer (literal variant #1)", function () {

			// Define the test value
			let testValue = 1;

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed an integer (literal variant #2)", function () {

			// Define the test value
			let testValue = 100;

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed an integer (constant)", function () {

			// Define the test value
			let testValue = Number.MAX_SAFE_INTEGER;

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return FALSE when passed a non-integral Number (constant)", function () {

			// Define the test value
			let testValue = Number.MIN_VALUE;

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a non-integral Number (literal)", function () {

			// Define the test value
			let testValue = 1.2;

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed Infinity", function () {

			// Define the test value
			let testValue = Infinity;

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed NaN", function () {

			// Define the test value
			let testValue = NaN;

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a String", function () {

			// Define the test value
			let testValue = "1";

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

	} );

	describe( "::describeTarget()", function() {

		it( "should properly describe integers", function() {

			// This is what we want described..
			let valueToDescribe = 42;

			// Describe it
			let res = check.describeTarget( valueToDescribe );

			// Assert..
			expect( res ).to.equal( "integer (Number; value=42)" );

		} );

	} );

	describe( "<- Core.type.check.Collection#getFirstDescriptiveMatch()", function() {

		it( "should return this check ('isInteger') as the first, descriptive, match for Integers", function () {

			// Define the test value
			let testValue = 1;

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
