/**
 * @file
 * Defines tests for the Core.type.check.simple.IsCoreClass class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/* eslint func-style: "off", require-jsdoc: "off" */

describe( "Core.type.check.simple.IsCoreClass", function () {

	let check;

	before( function () {

		// Get the class definition for the check class
		check = Core.cls( "Core.type.check.simple.IsCoreClass" );

	} );

	describe( "::evaluateTarget()", function () {

		it( "should return TRUE when passed a Core Class Definition (variant #1)", function () {

			// Define the test value
			let testValue = Core.cls( "Core.abstract.Component" );

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed a Core Class Definition (variant #2)", function () {

			// Define the test value
			class testValue extends Core.cls( "Core.abstract.BaseClass" ) {}

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return FALSE when passed a Core Class Instance", function () {

			// Define the test value
			let testValue = Core.inst( "Core.abstract.Component" );

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a prototypical object", function () {

			// Define the test value
			function TestValue() {}

			// Evaluate
			let result = check.evaluateTarget( new TestValue() );

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

		it( "should return FALSE when passed an Array", function () {

			// Define the test value
			let testValue = [];

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

	} );

	describe( "::describeTarget()", function() {

		it( "should properly describe Core Framework Classes (a.k.a constructors)", function() {

			// This is what we want described..
			let valueToDescribe = Core.cls( "Core.abstract.Component" );

			// Describe it
			let res = check.describeTarget( valueToDescribe );

			// Assert..
			expect( res ).to.equal( "Core Class Definition (\"Core.abstract.Component\")" );

		} );

	} );

	describe( "<- Core.type.check.Collection#getFirstDescriptiveMatch()", function() {

		it( "should return this check ('isCoreClass') as the first, descriptive, match for Core Class Definitions (constructors)", function () {

			// Define the test value
			let testValue = Core.cls( "Core.abstract.Component" );

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

