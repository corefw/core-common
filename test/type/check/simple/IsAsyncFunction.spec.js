/**
 * @file
 * Defines tests for the Core.type.check.simple.IsAsyncFunction class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/* eslint func-style: "off", require-jsdoc: "off", no-extra-bind: "off" */

describe( "Core.type.check.simple.IsAsyncFunction", function () {

	let check;

	before( function () {

		// Get the class definition for the check class
		check = Core.cls( "Core.type.check.simple.IsAsyncFunction" );

	} );

	describe( "::evaluateTarget()", function () {

		it( "should return TRUE when passed a named Async Function (variant #1)", function () {

			// Define the test value
			let testValue = async function namedAsync() {};

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed a named Async Function (variant #2)", function () {

			// Evaluate
			let result = check.evaluateTarget( async function fourth() {} );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed an anonymous Async Function (variant #1)", function () {

			// Evaluate
			let result = check.evaluateTarget( async function() {} );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed an anonymous Async Function (variant #2)", function () {

			// Define the test value
			let testValue = async function() {};

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed an Arrow Function", function () {

			// Define the test value
			let testValue = async () => {};

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return FALSE when passed a non-Async Arrow Function (variant #1)", function () {

			// Define the test value
			let testValue = () => {};

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a non-Async Arrow Function (variant #2)", function () {

			// Define the test value
			let testValue = ( $$a, __b ) => {};

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a non-Async Arrow Function (variant #3)", function () {

			// Define the test value
			let testValue = functioN => {};

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a non-Async, non-Arrow, function variable (variant #1)", function () {

			// Define the test value
			let testValue = function() {};

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a non-Async, non-Arrow, function variable (variant #2)", function () {

			// Define the test value
			let testValue = function named2() { return a => {}; };

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a non-Async, non-Arrow, function reference (variant #1)", function () {

			// Define the test value
			function testValue( a, b, c ) {}

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a non-Async, non-Arrow, function reference (variant #2)", function () {

			// Evaluate
			let result = check.evaluateTarget( function() {} );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a non-Async, non-Arrow, function reference (variant #3)", function () {

			// Evaluate
			let result = check.evaluateTarget( function someName() {} );

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

		it( "should properly describe anonymous, async, functions", function() {

			// This is what we want described..
			let anAnonymousFunction = async function() {};

			// Describe it
			let res = check.describeTarget( anAnonymousFunction );

			// Assert..
			expect( res ).to.equal( "Async Function (anonymous; as=anAnonymousFunction)" );

		} );

		it( "should properly describe named, async, functions", function() {

			// This is what we want described..
			let valueToDescribe = async function aNamedFunction() {};

			// Describe it
			let res = check.describeTarget( valueToDescribe );

			// Assert..
			expect( res ).to.equal( "Async Function (name=aNamedFunction)" );

		} );

		it( "should properly describe async, arrow, functions that have ANY name", function() {

			// This is what we want described..
			let anArrowFunction = async ( a ) => {};

			// Describe it
			let res = check.describeTarget( anArrowFunction );

			// Assert..
			expect( res ).to.equal( "Async Function (arrow; as=anArrowFunction)" );

		} );

		it( "should properly describe async, arrow, functions that have NO name", function() {

			// Execute describe()
			let res = check.describeTarget( async ( a ) => {} );

			// Assert..
			expect( res ).to.equal( "Async Function (arrow)" );

		} );

		it( "should properly describe bound, anonymous, async, functions that have NO name as though they are 'anonymous'", function() {

			// This is what we want described..
			let aBoundFn = ( async function() {} ).bind( this );

			// Describe it
			let res = check.describeTarget( aBoundFn );

			// Assert..
			expect( res ).to.equal( "Async Function (bound; anonymous)" );

		} );

		it( "should properly describe bound, named, async, functions", function() {

			// This is what we want described..
			async function aNamedFunction() {}
			let aBoundFn = aNamedFunction.bind( this );

			// Describe it
			let res = check.describeTarget( aBoundFn );

			// Assert..
			expect( res ).to.equal( "Async Function (bound; name=aNamedFunction)" );


		} );

		it( "should semi-properly describe bound, anonymous, async, functions that have ANY name as though they are 'named'", function() {



			// Note: This is a case where the describe() method cannot resolve the full truth;
			// the bind() operation obscures its ability to resolve the fact that the original
			// function was anonymous, so it does not mention 'anonymous' in the description.
			// See the note in `Core.type.Inspector::isAnonymousFunction()` for more info.



			// This is what we want described..
			let anAnonymousFunction = async function() {};
			let aBoundFn = anAnonymousFunction.bind( this );

			// Describe it
			let res = check.describeTarget( aBoundFn );

			// Assert..
			expect( res ).to.equal( "Async Function (bound; name=anAnonymousFunction)" );

		} );

		it( "should semi-properly describe bound, async, arrow, functions with ANY name", function() {



			// Note: This is a case where the describe() method cannot resolve the full truth; the bind()
			// operation obscures its ability to resolve the fact that the original function was an arrow
			// function AND anonymous, so it does not mention 'arrow' or 'anonymous' in the description. See
			// the notes in `Core.type.Inspector::isAnonymousFunction()` and
			// `Core.type.Inspector::isArrowFunction()` for more info.




			// This is what we want described..
			let anArrowFunction = async ( a ) => {};
			let aBoundFn = anArrowFunction.bind( this );

			// Describe it
			let res = check.describeTarget( aBoundFn );

			// Assert..
			expect( res ).to.equal( "Async Function (bound; name=anArrowFunction)" );


		} );

		it( "should semi-properly describe bound, async, arrow, functions with NO name", function() {



			// Note: This is a case where the describe() method cannot resolve the full truth;
			// the bind() operation obscures its ability to resolve the fact that the original
			// function was an arrow function, so it does not mention 'arrow' in the description.
			// See the note in `Core.type.Inspector::isArrowFunction()` for more info.




			// This is what we want described..
			let aBoundFn = ( async ( a ) => {} ).bind( this );

			// Describe it
			let res = check.describeTarget( aBoundFn );

			// Assert..
			expect( res ).to.equal( "Async Function (bound; anonymous)" );


		} );

	} );

	describe( "<- Core.type.check.Collection#getFirstDescriptiveMatch()", function() {

		it( "should return this check ('isAsyncFunction') as the first, descriptive, match for functions defined with 'async'", function () {

			// Define the test value
			let testValue = async function() {};

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

