/**
 * @file
 * Defines tests for the Core.type.check.simple.IsNumber class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/* eslint func-style: "off", require-jsdoc: "off" */

describe( "Core.type.check.simple.IsNumber", function () {

	let check;

	before( function () {

		// Get the class definition for the check class
		check = Core.cls( "Core.type.check.simple.IsNumber" );

	} );

	describe( "::evaluateTarget()", function () {

		it( "should return TRUE when passed a Number (literal)", function () {

			// Define the test value
			let testValue = 3;

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed a Number (constant)", function () {

			// Define the test value
			let testValue = Number.MIN_VALUE;

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed Infinity", function () {

			// Define the test value
			let testValue = Infinity;

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed NaN", function () {

			// Define the test value
			let testValue = NaN;

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return FALSE when passed a numerical String", function () {

			// Define the test value
			let testValue = "3";

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

		it( "should return FALSE when passed an Array", function () {

			// Define the test value
			let testValue = [];

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

	} );

	describe( "::describeTarget()", function() {

		it( "should properly describe non-whole Numbers", function() {

			// This is what we want described..
			let valueToDescribe = 1.2;

			// Describe it
			let res = check.describeTarget( valueToDescribe );

			// Assert..
			expect( res ).to.equal( "Number (value=1.2)" );

		} );

	} );

	describe( "<- Core.type.check.Collection#getFirstDescriptiveMatch()", function() {

		it( "should return this check ('isNumber') as the first, descriptive, match for non-integral Numbers", function () {

			// Define the test value
			let testValue = 1.2;

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

