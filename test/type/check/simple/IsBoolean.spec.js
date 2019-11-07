/**
 * @file
 * Defines tests for the Core.type.check.simple.IsBoolean class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

describe( "Core.type.check.simple.IsBoolean", function () {

	let check;

	before( function () {

		// Get the class definition for the check class
		check = Core.cls( "Core.type.check.simple.IsBoolean" );

	} );

	describe( "::evaluateTarget()", function () {

		it( "should return TRUE when passed a Boolean (TRUE)", function () {

			// Define the test value
			let testValue = true;

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed a Boolean (FALSE)", function () {

			// Define the test value
			let testValue = false;

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return FALSE when passed a Number", function () {

			// Define the test value
			let testValue = 1;

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

		it( "should return FALSE when passed an Array", function () {

			// Define the test value
			let testValue = [];

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed an Object", function () {

			// Define the test value
			let testValue = {};

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

	} );

	describe( "::describeTarget()", function() {

		it( "should properly describe TRUE values", function() {

			// This is what we want described..
			let valueToDescribe = true;

			// Describe it
			let res = check.describeTarget( valueToDescribe );

			// Assert..
			// -> boolean (TRUE)
			expect( res ).to.equal( "Boolean (TRUE)" );

		} );

		it( "should properly describe FALSE values", function() {

			// This is what we want described..
			let valueToDescribe = false;

			// Describe it
			let res = check.describeTarget( valueToDescribe );

			// Assert..
			// -> boolean (FALSE)
			expect( res ).to.equal( "Boolean (FALSE)" );

		} );

	} );

	describe( "<- Core.type.check.Collection#getFirstDescriptiveMatch()", function() {

		it( "should return this check ('isBoolean') as the first, descriptive, match for Booleans", function () {

			// Define the test value
			let testValue = true;

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
