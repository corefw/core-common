/**
 * @file
 * Defines tests for the Core.type.check.simple.IsArrayBuffer class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

describe( "Core.type.check.simple.IsArrayBuffer", function () {

	let check;

	before( function () {

		// Get the class definition for the check class
		check = Core.cls( "Core.type.check.simple.IsArrayBuffer" );

	} );

	describe( "::evaluateTarget()", function () {

		it( "should return TRUE when passed an ArrayBuffer", function () {

			// Define the test value
			let testValue = new ArrayBuffer( 2 );

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return FALSE when passed an Array (variant #1)", function () {

			// Define the test value
			let testValue = new Array( 2 );

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed an Array (variant #2)", function () {

			// Define the test value
			let testValue = [ 1, 2 ];

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

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


	} );

	describe( "::describeTarget()", function() {

		it( "should properly describe ArrayBuffers", function() {

			// This is what we want described..
			let valueToDescribe = new ArrayBuffer( 2 );

			// Describe it
			let res = check.describeTarget( valueToDescribe );

			// Assert..
			// -> ArrayBuffer (byteLength=2)
			expect( res ).to.equal( "ArrayBuffer (byteLength=2)" );

		} );

	} );

	describe( "<- Core.type.check.Collection#getFirstDescriptiveMatch()", function() {

		it( "should return this check ('isArrayBuffer') as the first, descriptive, match for ArrayBuffer Objects", function () {

			// Define the test value
			let testValue = new ArrayBuffer( 2 );

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

