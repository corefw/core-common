/**
 * @file
 * Defines tests for the Core.type.check.simple.IsArray class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

describe( "Core.type.check.simple.IsArray", function () {

	let check;

	before( function () {

		// Get the class definition for the check class
		check = Core.cls( "Core.type.check.simple.IsArray" );

	} );

	describe( ".checkName", function () {

		it( "should return the appropriate checkName value", function () {
			expect( check.checkName ).to.equal( "isArray" );
		} );

	} );

	describe( "::evaluateTarget()", function () {

		it( "should return TRUE when passed an empty Array", function () {

			// Define the test value
			let testValue = [];

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed a non-empty Array", function () {

			// Define the test value
			let testValue = [ 1, 2, 3 ];

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

		it( "should return FALSE when passed a String", function () {

			// Define the test value
			let testValue = "2";

			// Evaluate
			let result = check.evaluateTarget( testValue );

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

		it( "should return FALSE when passed a Map", function () {

			// Define the test value
			let testValue = new Map();

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

	} );

	describe( "::describeTarget()", function() {

		it( "should properly describe empty arrays", function() {

			// This is what we want described..
			let valueToDescribe = [];

			// Describe it
			let res = check.describeTarget( valueToDescribe );

			// Assert..
			// -> array (empty)
			expect( res ).to.equal( "empty Array" );

		} );

		it( "should properly describe non-empty arrays", function() {

			// This is what we want described..
			let valueToDescribe = [ 1, 2, 3, 4 ];

			// Describe it
			let res = check.describeTarget( valueToDescribe );

			// Assert..
			// -> array (length=4)
			expect( res ).to.equal( "Array (length=4)" );

		} );

	} );

	describe( "<- Core.type.check.Collection#getFirstDescriptiveMatch()", function() {

		it( "should return this check ('isArray') as the first, descriptive, match for Arrays", function () {

			// Define the test value
			let testValue = [];

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
