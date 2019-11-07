/**
 * @file
 * Defines tests for the Core.type.check.simple.IsSet class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/* eslint func-style: "off", require-jsdoc: "off" */

describe( "Core.type.check.simple.IsSet", function () {

	let check;

	before( function () {

		// Get the class definition for the check class
		check = Core.cls( "Core.type.check.simple.IsSet" );

	} );

	describe( "::evaluateTarget()", function () {

		it( "should return TRUE when passed a Set Object", function () {

			// Define the test value
			let testValue = new Set();

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return FALSE when passed a WeakSet Object", function () {

			// Define the test value
			let testValue = new WeakSet();

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

		it( "should return FALSE when passed a String", function () {

			// Define the test value
			let testValue = "1";

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

		it( "should properly describe empty Sets", function() {

			// This is what we want described..
			let valueToDescribe = new Set();

			// Describe it
			let res = check.describeTarget( valueToDescribe );

			// Assert..
			expect( res ).to.equal( "empty Set Object" );

		} );

		it( "should properly describe non-empty Sets", function() {

			// This is what we want described..
			let valueToDescribe = new Set();
			valueToDescribe.add( 1 );
			valueToDescribe.add( 2 );
			valueToDescribe.add( 3 );
			valueToDescribe.add( 4 );

			// Describe it
			let res = check.describeTarget( valueToDescribe );

			// Assert..
			expect( res ).to.equal( "Set Object (size=4)" );

		} );

	} );

	describe( "<- Core.type.check.Collection#getFirstDescriptiveMatch()", function() {

		it( "should return this check ('isSet') as the first, descriptive, match for Set Objects", function () {

			// Define the test value
			let testValue = new Set();

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

