/**
 * @file
 * Defines tests for the Core.type.check.extended.IsInstanceOf class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/* eslint func-style: "off", require-jsdoc: "off" */

const _ 	= Core.dep( "_" );
const UTIL 	= require( "util" );

describe( "Core.type.check.extended.IsInstanceOf", function () {

	let check;

	before( function () {

		// Get the class definition for the check class
		check = Core.cls( "Core.type.check.extended.IsInstanceOf" );

	} );

	describe( "::evaluateTarget()", function () {

		it( "should properly identify prototypical objects (created using the 'new' keyword)", function () {

			// Define the constructor
			const AConstructor = function() {};

			// Define the test value
			let testValue = new AConstructor();

			// Evaluate
			let result = check.evaluateTarget( testValue, AConstructor );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should properly identify prototypical objects (created using 'Object.setPrototypeOf()')", function () {

			// Define the constructor
			let AConstructor = function() {};

			// Create an object
			let testValue = {};

			// Apply the prototype
			Object.setPrototypeOf( testValue, AConstructor.prototype );

			// Evaluate
			let result = check.evaluateTarget( testValue, AConstructor );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should properly identify prototypical objects (created using 'Object.create()')", function () {

			// Define the constructor
			let AConstructor = function() {};

			// Create an object
			let testValue = Object.create( AConstructor.prototype );

			// Evaluate
			let result = check.evaluateTarget( testValue, AConstructor );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should properly distinguish between prototypes", function () {

			// Define the constructor
			const AConstructor = function() {};
			const BConstructor = function() {};

			// Define the test value
			let testValue = new AConstructor();

			// Evaluate
			let result = check.evaluateTarget( testValue, BConstructor );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should properly identify extended prototypical objects (when using .prototype injection; variant #1)", function () {

			// Define the constructors
			const AConstructor = function() {};
			const BConstructor = function() {};

			// Apply inheritance
			BConstructor.prototype = new AConstructor();

			// Instantiate an instance of the child class
			let testValue = new BConstructor();

			// Evaluate
			let result1 = check.evaluateTarget( testValue, AConstructor );
			let result2 = check.evaluateTarget( testValue, BConstructor );

			// Assert
			expect( result1 ).to.equal( true );
			expect( result2 ).to.equal( true );


		} );

		it( "should properly identify extended prototypical objects (when using .prototype injection; variant #2)", function () {

			// Define the constructors
			const AConstructor = function() {};
			const BConstructor = function() {};

			// Apply inheritance
			BConstructor.prototype = AConstructor.prototype;

			// Instantiate an instance of the child class
			let testValue = new BConstructor();

			// Evaluate
			let result1 = check.evaluateTarget( testValue, AConstructor );
			let result2 = check.evaluateTarget( testValue, BConstructor );

			// Assert
			expect( result1 ).to.equal( true );
			expect( result2 ).to.equal( true );


		} );

		it( "should properly identify extended prototypical objects (when using 'utils.inherits')", function () {

			// Define the constructors
			const AConstructor = function() {};
			const BConstructor = function() {};

			// Apply inheritance
			UTIL.inherits( BConstructor, AConstructor );

			// Instantiate an instance of the child class
			let testValue = new BConstructor();

			// Evaluate
			let result1 = check.evaluateTarget( testValue, AConstructor );
			let result2 = check.evaluateTarget( testValue, BConstructor );

			// Assert
			expect( result1 ).to.equal( true );
			expect( result2 ).to.equal( true );


		} );

		it( "should properly identify extended prototypical objects (when using '_.create()')", function () {

			// Define the constructors
			const AConstructor = function() {};
			const BConstructor = function() {};

			// Apply inheritance
			BConstructor.prototype = _.create( AConstructor.prototype, { } );

			// Instantiate an instance of the child class
			let testValue = new BConstructor();

			// Evaluate
			let result1 = check.evaluateTarget( testValue, AConstructor );
			let result2 = check.evaluateTarget( testValue, BConstructor );

			// Assert
			expect( result1 ).to.equal( true );
			expect( result2 ).to.equal( true );

		} );

		it( "should properly identify class instances (created using the 'new' keyword)", function () {

			// Define the class
			class AClass {}

			// Define the test value
			let testValue = new AClass();

			// Evaluate
			let result = check.evaluateTarget( testValue, AClass );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should properly distinguish between classes", function () {

			// Define the constructor
			class AClass {}
			class BClass {}

			// Define the test value
			let testValue = new AClass();

			// Evaluate
			let result = check.evaluateTarget( testValue, BClass );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should properly identify extended class instances", function () {

			// Define the constructors
			class AClass {}
			class BClass extends AClass {}

			// Instantiate an instance of the child class
			let testValue = new BClass();

			// Evaluate
			let result1 = check.evaluateTarget( testValue, AClass );
			let result2 = check.evaluateTarget( testValue, BClass );

			// Assert
			expect( result1 ).to.equal( true );
			expect( result2 ).to.equal( true );

		} );

		it( "should resolve Core Class Definitions when given a String", function () {

			// Fetch the constructor
			let Component = Core.cls( "Core.abstract.Component" );

			// Instantiate an instance
			let testValue = new Component();

			// Evaluate
			let result1 = check.evaluateTarget( testValue, "Core.abstract.Component" );
			let result2 = check.evaluateTarget( testValue, "Core.abstract.BaseClass" );

			// Assert
			expect( result1 ).to.equal( true );
			expect( result2 ).to.equal( true );

		} );

		it( "should throw an Error when given an invalid Core Class Name", function () {

			// When we're testing for Errors, we need
			// to wrap the test in a helper function..
			let testFn = function() {

				// Call the check
				check.evaluateTarget( {}, "Core.bad.name" );

			};

			expect( testFn ).to.throw( Error );

		} );

		it( "should throw an Error when given an Core Class Name that could not be resolved", function () {

			// When we're testing for Errors, we need
			// to wrap the test in a helper function..
			let testFn = function() {

				// Call the check with a non-existent class
				check.evaluateTarget( {}, "Core.class.does.not.Exist" );

			};

			expect( testFn ).to.throw( Error );

		} );

		it( "should throw an Error when the 'Constructor' param is of an invalid type", function () {

			// When we're testing for Errors, we need
			// to wrap the test in a helper function..
			let testFn = function() {

				// Call the check with an invalid Constructor
				check.evaluateTarget( {}, false );

			};

			expect( testFn ).to.throw( Error );

		} );

	} );

	describe( "::describeExpectation", function () {

		describe( "( negate=false, ... )", function () {

			it( "should properly describe the check's expectation when a Core Class Name is passed as 'Constructor'", function () {

				// Define the 'Constructor' to use for the test.
				let testConstructor = "Core.abstract.Component";

				// Execute
				let result = check.describeExpectation( false, testConstructor );

				// Assert
				expect( result ).to.equal( "an instance of 'Core.abstract.Component'" );

			} );

			it( "should properly describe the check's expectation when a Core Class Definition is passed as 'Constructor'", function () {

				// Define the 'Constructor' to use for the test.
				let testConstructor = Core.cls( "Core.abstract.Component" );

				// Execute
				let result = check.describeExpectation( false, testConstructor );

				// Assert
				expect( result ).to.equal( "an instance of 'Core.abstract.Component'" );

			} );

			it( "should properly describe the check's expectation when an arbitrary class is passed as 'Constructor'", function () {

				// Define the 'Constructor' to use for the test.
				class testConstructor {}

				// Execute
				let result = check.describeExpectation( false, testConstructor );

				// Assert
				expect( result ).to.equal( "an instance of 'testConstructor'" );

			} );

			it( "should properly describe the check's expectation when a named function is passed as 'Constructor' (variant #1)", function () {

				// Define the 'Constructor' to use for the test.
				let testConstructor = function NamedFunction() {};

				// Execute
				let result = check.describeExpectation( false, testConstructor );

				// Assert
				expect( result ).to.equal( "an instance of 'NamedFunction'" );

			} );

			it( "should properly describe the check's expectation when a named function is passed as 'Constructor' (variant #2)", function () {

				// Define the 'Constructor' to use for the test.
				function testConstructor() {}

				// Execute
				let result = check.describeExpectation( false, testConstructor );

				// Assert
				expect( result ).to.equal( "an instance of 'testConstructor'" );

			} );

			it( "should properly describe the check's expectation when an anonymous function is passed as 'Constructor' (variant #1)", function () {

				// Define the 'Constructor' to use for the test.
				let testConstructor = function() {};

				// Execute
				let result = check.describeExpectation( false, testConstructor );

				// Assert
				expect( result ).to.equal( "an instance of 'testConstructor'" );

			} );

			it( "should properly describe the check's expectation when an anonymous function is passed as 'Constructor' (variant #2)", function () {

				// Execute
				let result = check.describeExpectation( false, function() {} );

				// Assert
				expect( result ).to.equal( "an instance of '<AnonymousFunction>'" );

			} );

			it( "should properly describe the check's expectation when a named, async, function is passed as 'Constructor' (variant #1)", function () {

				// Define the 'Constructor' to use for the test.
				let testConstructor = async function NamedFunction() {};

				// Execute
				let result = check.describeExpectation( false, testConstructor );

				// Assert
				expect( result ).to.equal( "an instance of 'NamedFunction'" );

			} );

			it( "should properly describe the check's expectation when a named, async, function is passed as 'Constructor' (variant #2)", function () {

				// Define the 'Constructor' to use for the test.
				async function testConstructor() {}

				// Execute
				let result = check.describeExpectation( false, testConstructor );

				// Assert
				expect( result ).to.equal( "an instance of 'testConstructor'" );

			} );

			it( "should properly describe the check's expectation when an anonymous, async, function is passed as 'Constructor' (variant #1)", function () {

				// Define the 'Constructor' to use for the test.
				let testConstructor = async function() {};

				// Execute
				let result = check.describeExpectation( false, testConstructor );

				// Assert
				expect( result ).to.equal( "an instance of 'testConstructor'" );

			} );

			it( "should properly describe the check's expectation when an anonymous, async, function is passed as 'Constructor' (variant #2)", function () {

				// Execute
				let result = check.describeExpectation( false, async function() {} );

				// Assert
				expect( result ).to.equal( "an instance of '<AnonymousAsyncFunction>'" );

			} );

		} );

		describe( "( negate=true, ... )", function () {

			it( "should properly describe the check's expectation when a Core Class Name is passed as 'Constructor'", function () {

				// Define the 'Constructor' to use for the test.
				let testConstructor = "Core.abstract.Component";

				// Execute
				let result = check.describeExpectation( true, testConstructor );

				// Assert
				expect( result ).to.equal( "not an instance of 'Core.abstract.Component'" );

			} );

			it( "should properly describe the check's expectation when a Core Class Definition is passed as 'Constructor'", function () {

				// Define the 'Constructor' to use for the test.
				let testConstructor = Core.cls( "Core.abstract.Component" );

				// Execute
				let result = check.describeExpectation( true, testConstructor );

				// Assert
				expect( result ).to.equal( "not an instance of 'Core.abstract.Component'" );

			} );

			it( "should properly describe the check's expectation when an arbitrary class is passed as 'Constructor'", function () {

				// Define the 'Constructor' to use for the test.
				class testConstructor {}

				// Execute
				let result = check.describeExpectation( true, testConstructor );

				// Assert
				expect( result ).to.equal( "not an instance of 'testConstructor'" );

			} );

			it( "should properly describe the check's expectation when a named function is passed as 'Constructor' (variant #1)", function () {

				// Define the 'Constructor' to use for the test.
				let testConstructor = function NamedFunction() {};

				// Execute
				let result = check.describeExpectation( true, testConstructor );

				// Assert
				expect( result ).to.equal( "not an instance of 'NamedFunction'" );

			} );

			it( "should properly describe the check's expectation when a named function is passed as 'Constructor' (variant #2)", function () {

				// Define the 'Constructor' to use for the test.
				function testConstructor() {}

				// Execute
				let result = check.describeExpectation( true, testConstructor );

				// Assert
				expect( result ).to.equal( "not an instance of 'testConstructor'" );

			} );

			it( "should properly describe the check's expectation when an anonymous function is passed as 'Constructor' (variant #1)", function () {

				// Define the 'Constructor' to use for the test.
				let testConstructor = function() {};

				// Execute
				let result = check.describeExpectation( true, testConstructor );

				// Assert
				expect( result ).to.equal( "not an instance of 'testConstructor'" );

			} );

			it( "should properly describe the check's expectation when an anonymous function is passed as 'Constructor' (variant #2)", function () {

				// Execute
				let result = check.describeExpectation( true, function() {} );

				// Assert
				expect( result ).to.equal( "not an instance of '<AnonymousFunction>'" );

			} );

			it( "should properly describe the check's expectation when a named, async, function is passed as 'Constructor' (variant #1)", function () {

				// Define the 'Constructor' to use for the test.
				let testConstructor = async function NamedFunction() {};

				// Execute
				let result = check.describeExpectation( true, testConstructor );

				// Assert
				expect( result ).to.equal( "not an instance of 'NamedFunction'" );

			} );

			it( "should properly describe the check's expectation when a named, async, function is passed as 'Constructor' (variant #2)", function () {

				// Define the 'Constructor' to use for the test.
				async function testConstructor() {}

				// Execute
				let result = check.describeExpectation( true, testConstructor );

				// Assert
				expect( result ).to.equal( "not an instance of 'testConstructor'" );

			} );

			it( "should properly describe the check's expectation when an anonymous, async, function is passed as 'Constructor' (variant #1)", function () {

				// Define the 'Constructor' to use for the test.
				let testConstructor = async function() {};

				// Execute
				let result = check.describeExpectation( true, testConstructor );

				// Assert
				expect( result ).to.equal( "not an instance of 'testConstructor'" );

			} );

			it( "should properly describe the check's expectation when an anonymous, async, function is passed as 'Constructor' (variant #2)", function () {

				// Execute
				let result = check.describeExpectation( true, async function() {} );

				// Assert
				expect( result ).to.equal( "not an instance of '<AnonymousAsyncFunction>'" );

			} );

		} );

	} );

} );
