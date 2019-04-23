/**
 * @file
 * Defines tests for the Core.type.check.simple.IsAnonymousFunction class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/* eslint func-style: "off", require-jsdoc: "off" */

describe( "Core.type.check.simple.IsAnonymousFunction", function () {

	let check;

	before( function () {

		// Get the class definition for the check class
		check = Core.cls( "Core.type.check.simple.IsAnonymousFunction" );

	} );

	describe( "::evaluateTarget()", function () {

		it( "should return TRUE when passed an anonymous object method", function () {

			// Define the test value
			let testObj = {
				anonFn: function() {}
			};

			// Evaluate
			let result = check.evaluateTarget( testObj.anonFn );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed an anonymous instance method for a prototypical method (Class Variant)", function () {

			// Define the test value
			class testClass {}
			testClass.prototype.clsAnonFn = function() {};
			let testInstance = new testClass();

			// Evaluate
			let result = check.evaluateTarget( testInstance.clsAnonFn );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed an anonymous instance method for a prototypical method (Object Variant #1)", function () {

			// Define the test value
			let testConstructor = function() {};
			testConstructor.prototype.anonymousFunction = function() {};
			let testInstance = new testConstructor();

			// Evaluate
			let result = check.evaluateTarget( testInstance.anonymousFunction );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed an anonymous instance method for a prototypical method (Object Variant #2)", function () {

			// Define the test value
			let testConstructor = function() {
				this.anonymousFunction = function() {};
			};
			let testInstance = new testConstructor();

			// Evaluate
			let result = check.evaluateTarget( testInstance.anonymousFunction );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed an anonymous, non-arrow, function (Variant #1)", function () {

			// Define the test value
			let testValue = function() {};

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed an anonymous, non-arrow, function (Variant #2)", function () {

			// Evaluate
			let result = check.evaluateTarget( function() {} );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed an anonymous, arrow, function (Variant #1)", function () {

			// Evaluate
			let result = check.evaluateTarget( () => {} );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed an anonymous, arrow, function (Variant #2)", function () {

			// Define the test value
			let testValue = () => {};

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE when passed an anonymous, arrow, function (Variant #3)", function () {

			// Define the test value
			let testValue = functioN => {};

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return FALSE when passed a named object method", function () {

			// Define the test value
			let testObj = {
				namedFn: function someName() {}
			};

			// Evaluate
			let result = check.evaluateTarget( testObj.namedFn );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a static class method", function () {

			// Define the test value
			class TestClass {
				static namedStaticMethod() {}
			}

			// Evaluate
			let result = check.evaluateTarget( TestClass.namedStaticMethod );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a class instance method", function () {

			// Define the test value
			class TestClass {
				namedInstanceMethod() {}
			}
			let testInstance = new TestClass();

			// Evaluate
			let result = check.evaluateTarget( testInstance.namedInstanceMethod );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a named instance method for a prototypical method (Object Variant #1)", function () {

			// Define the test value
			let testConstructor = function() {};
			testConstructor.prototype.namedFunction = function someName() {};
			let testInstance = new testConstructor();

			// Evaluate
			let result = check.evaluateTarget( testInstance.namedFunction );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a named instance method for a prototypical method (Object Variant #2)", function () {

			// Define the test value
			let testConstructor = function() {
				this.namedFunction = function someName() {};
			};
			let testInstance = new testConstructor();

			// Evaluate
			let result = check.evaluateTarget( testInstance.namedFunction );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a named function variable", function () {

			// Define the test value
			let testValue = function someName() { return a => {}; };

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a named function reference (Variant #1)", function () {

			// Define the test value
			function testValue( a, b, c ) {}

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a named function reference (Variant #2)", function () {

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

		it( "should return FALSE when passed an Array", function () {

			// Define the test value
			let testValue = [];

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE when passed a boolean", function () {

			// Define the test value
			let testValue = true;

			// Evaluate
			let result = check.evaluateTarget( testValue );

			// Assert
			expect( result ).to.equal( false );

		} );

	} );

} );

