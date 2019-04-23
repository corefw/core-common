/**
 * @file
 * Defines tests for the Core.type.check.simple.IsFunction class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/* eslint func-style: "off", require-jsdoc: "off" */

describe( "Core.type.check.simple.IsFunction", function () {

	let check;

	before( function () {

		// Get the class definition for the check class
		check = Core.cls( "Core.type.check.simple.IsFunction" );

	} );

	describe( "::evaluateTarget()", function () {

		it( "should return TRUE when passed a Function", function () {

			// Define the test value
			let testValue = function() {};

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return FALSE when passed a RegExp Object", function () {

			// Define the test value
			let testValue = /abc/;

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

		it( "should return FALSE when passed an Array", function () {

			// Define the test value
			let testValue = [];

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed an Object", function () {

			// Define the test value
			let testValue = {};

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

	} );

	describe( "::describeTarget()", function() {

		it( "should properly describe anonymous, non-async, functions", function() {

			// This is what we want described..
			let anAnonymousFunction = function() {};

			// Describe it
			let res = check.describeTarget( anAnonymousFunction );

			// Assert..
			expect( res ).to.equal( "Function (anonymous; as=anAnonymousFunction)" );

		} );

		it( "should properly describe named, non-async, functions", function() {

			// This is what we want described..
			let valueToDescribe = function aNamedFunction() {};

			// Describe it
			let res = check.describeTarget( valueToDescribe );

			// Assert..
			expect( res ).to.equal( "Function (name=aNamedFunction)" );

		} );

		it( "should properly describe non-async, arrow, functions that have ANY name", function() {

			// This is what we want described..
			let anArrowFunction = ( a ) => {};

			// Describe it
			let res = check.describeTarget( anArrowFunction );

			// Assert..
			expect( res ).to.equal( "Function (arrow; as=anArrowFunction)" );

		} );

		it( "should properly describe non-async, arrow, functions that have NO name", function() {

			// Describe it
			let res = check.describeTarget( ( a ) => {} );

			// Assert..
			expect( res ).to.equal( "Function (arrow)" );

		} );

		it( "should properly describe bound, anonymous, non-async, functions that have NO name, as though they are 'anonymous'", function() {

			// This is what we want described..
			let aBoundFn = ( function() {} ).bind( this );

			// Describe it
			let res = check.describeTarget( aBoundFn );

			// Assert..
			expect( res ).to.equal( "Function (bound; anonymous)" );

		} );

		it( "should properly describe bound, named, non-async, functions", function() {

			// This is what we want described..
			function aNamedFunction() {}
			let aBoundFn = aNamedFunction.bind( this );

			// Describe it
			let res = check.describeTarget( aBoundFn );

			// Assert..
			expect( res ).to.equal( "Function (bound; name=aNamedFunction)" );


		} );

		it( "should semi-properly describe bound, anonymous, non-async, functions that have ANY name, as though they are 'named'", function() {



			// Note: This is a case where the describe() method cannot resolve the full truth;
			// the bind() operation obscures its ability to resolve the fact that the original
			// function was anonymous, so it does not mention 'anonymous' in the description.
			// See the note in `Core.type.Inspector::isAnonymousFunction()` for more info.



			// This is what we want described..
			let anAnonymousFunction = function() {};
			let aBoundFn = anAnonymousFunction.bind( this );

			// Describe it
			let res = check.describeTarget( aBoundFn );

			// Assert..
			expect( res ).to.equal( "Function (bound; name=anAnonymousFunction)" );

		} );

		it( "should semi-properly describe bound, non-async, arrow, functions with ANY name", function() {



			// Note: This is a case where the describe() method cannot resolve the full truth; the bind()
			// operation obscures its ability to resolve the fact that the original function was an arrow
			// function AND anonymous, so it does not mention 'arrow' or 'anonymous' in the description. See
			// the notes in `Core.type.Inspector::isAnonymousFunction()` and
			// `Core.type.Inspector::isArrowFunction()` for more info.




			// This is what we want described..
			let anArrowFunction = ( a ) => {};
			let aBoundFn = anArrowFunction.bind( this );

			// Describe it
			let res = check.describeTarget( aBoundFn );

			// Assert..
			expect( res ).to.equal( "Function (bound; name=anArrowFunction)" );


		} );

		it( "should semi-properly describe bound, non-async, arrow, functions with NO name", function() {



			// Note: This is a case where the describe() method cannot resolve the full truth;
			// the bind() operation obscures its ability to resolve the fact that the original
			// function was an arrow function, so it does not mention 'arrow' in the description.
			// See the note in `Core.type.Inspector::isArrowFunction()` for more info.




			// This is what we want described..
			let aBoundFn = ( ( a ) => {} ).bind( this );

			// Describe it
			let res = check.describeTarget( aBoundFn );

			// Assert..
			expect( res ).to.equal( "Function (bound; anonymous)" );


		} );

	} );

	describe( "<- Core.type.check.Collection#getFirstDescriptiveMatch()", function() {

		it( "should return this check ('isFunction') as the first, descriptive, match for functions", function () {

			// Define the test value
			let testValue = function () {};

			// Instantiate a check collection
			let collection = Core.inst( "Core.type.check.Collection" );

			// Execute the `getFirstDescriptiveMatch` method.
			let result = collection.getFirstDescriptiveMatch( testValue );

			// Assert that the check tested by this file
			// is the one returned by getFirstDescriptiveMatch.
			expect( result.checkName ).to.equal( check.checkName );

		} );

		it( "should return this check ('isFunction') as the first, descriptive, non-Core class constructors", function () {

			// Define the test value
			class TestValue {}

			// Instantiate a check collection
			let collection = Core.inst( "Core.type.check.Collection" );

			// Execute the `getFirstDescriptiveMatch` method.
			let result = collection.getFirstDescriptiveMatch( TestValue );

			// Assert that the check tested by this file
			// is the one returned by getFirstDescriptiveMatch.
			expect( result.checkName ).to.equal( check.checkName );

		} );

	} );

} );
