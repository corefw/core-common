/**
 * @file
 * Defines tests for the Core.type.check.simple.IsSafeInteger class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/* eslint func-style: "off", require-jsdoc: "off" */

describe( "Core.type.check.simple.IsSafeInteger", function () {

	let check;

	before( function () {

		// Get the class definition for the check class
		check = Core.cls( "Core.type.check.simple.IsSafeInteger" );

	} );

	describe( "::evaluateTarget()", function () {

		it( "should return TRUE when passed a safe integer (literal)", function () {

			// Define the test value
			let testValue = 3;

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed a safe integer (constant)", function () {

			// Define the test value
			let testValue = Number.MAX_SAFE_INTEGER;

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

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

		it( "should return FALSE when passed a non-integral Number (literal)", function () {

			// Define the test value
			let testValue = 42.1;

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a non-integral Number (constant)", function () {

			// Define the test value
			let testValue = Number.MIN_VALUE;

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a String", function () {

			// Define the test value
			let testValue = "3";

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

	} );

} );

