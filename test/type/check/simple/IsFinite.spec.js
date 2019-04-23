/**
 * @file
 * Defines tests for the Core.type.check.simple.IsFinite class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/* eslint func-style: "off", require-jsdoc: "off" */

describe( "Core.type.check.simple.IsFinite", function () {

	let check;

	before( function () {

		// Get the class definition for the check class
		check = Core.cls( "Core.type.check.simple.IsFinite" );

	} );

	describe( "::evaluateTarget()", function () {

		it( "should return TRUE when passed a finite Number (literal)", function () {

			// Evaluate
			let result = check.evaluateTarget( 3 );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed a finite Number (constant)", function () {

			// Evaluate
			let result = check.evaluateTarget( Number.MIN_VALUE );

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

