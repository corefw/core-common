/**
 * @file
 * Defines tests for the Core.type.check.simple.IsArrayLike class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

describe( "Core.type.check.simple.IsArrayLike", function () {

	let check;

	before( function () {

		// Get the class definition for the check class
		check = Core.cls( "Core.type.check.simple.IsArrayLike" );

	} );

	describe( "::evaluateTarget()", function () {

		it( "should return TRUE when passed an array", function () {

			// Define the test value
			let testValue = [ 1, 2 ];

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed a string", function () {

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

		it( "should return FALSE when passed a NULL value", function () {

			// Define the test value
			let testValue = null;

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

	} );

} );

