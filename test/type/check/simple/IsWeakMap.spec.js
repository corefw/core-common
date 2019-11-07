/**
 * @file
 * Defines tests for the Core.type.check.simple.IsWeakMap class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/* eslint func-style: "off", require-jsdoc: "off" */

describe( "Core.type.check.simple.IsWeakMap", function () {

	let check;

	before( function () {

		// Get the class definition for the check class
		check = Core.cls( "Core.type.check.simple.IsWeakMap" );

	} );

	describe( "::evaluateTarget()", function () {

		it( "should return TRUE when passed a WeakMap Object", function () {

			// Define the test value
			let testValue = new WeakMap();

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

		it( "should return FALSE when passed a Map Object", function () {

			// Define the test value
			let testValue = new Map();

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

		it( "should properly describe WeakMaps", function() {

			// This is what we want described..
			let valueToDescribe = new WeakMap();

			// Describe it
			let res = check.describeTarget( valueToDescribe );

			// Assert..
			expect( res ).to.equal( "WeakMap Object" );

		} );

	} );

	describe( "<- Core.type.check.Collection#getFirstDescriptiveMatch()", function() {

		it( "should return this check ('isWeakMap') as the first, descriptive, match for WeakMap Objects", function () {

			// Define the test value
			let testValue = new WeakMap();

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

