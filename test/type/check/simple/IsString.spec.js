/**
 * @file
 * Defines tests for the Core.type.check.simple.IsString class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/* eslint func-style: "off", require-jsdoc: "off" */

describe( "Core.type.check.simple.IsString", function () {

	let check;

	before( function () {

		// Get the class definition for the check class
		check = Core.cls( "Core.type.check.simple.IsString" );

	} );

	describe( "::evaluateTarget()", function () {

		it( "should return TRUE when passed a String", function () {

			// Define the test value
			let testValue = "aString";

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

		it( "should return FALSE when passed a Boolean", function () {

			// Define the test value
			let testValue = false;

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

		it( "should return FALSE when passed a plain Object", function () {

			// Define the test value
			let testValue = {};

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

	} );

	describe( "::describeTarget()", function() {

		it( "should properly describe empty strings", function() {

			// This is what we want described..
			let valueToDescribe = "";

			// Describe it
			let res = check.describeTarget( valueToDescribe );

			// Assert..
			// -> string (empty)
			expect( res ).to.equal( "empty String" );

		} );

		it( "should properly describe short strings", function() {

			// This is what we want described..
			let valueToDescribe = "0123456789";

			// Describe it
			let res = check.describeTarget( valueToDescribe );

			// Assert..
			// -> string ("0123456789")
			expect( res ).to.have.string( "String" );
			expect( res ).to.have.string( valueToDescribe );

		} );

		it( "should properly describe long strings", function() {

			// This is what we want described..
			let valueToDescribe = "012345678901234567890123456789012345678901234567890123456789";

			// Describe it
			let res = check.describeTarget( valueToDescribe );

			// Assert..
			// -> string ("0123456789...", length=50)
			expect( res ).to.have.string( "String" );
			expect( res ).to.have.string( "length" );
			expect( res ).to.have.string( valueToDescribe.length + "" );

		} );

	} );

	describe( "<- Core.type.check.Collection#getFirstDescriptiveMatch()", function() {

		it( "should return this check ('isX') as the first, descriptive, match for X", function () {

			// Define the test value
			let testValue = "some-value-here";

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

