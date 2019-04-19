/**
 * @file
 * Defines tests for the Core.type.Inspector class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/* eslint no-console: "off", require-jsdoc: "off", func-style: "off", no-extra-bind: "off" */

const MOMENT = Core.dep( "moment" );

describe( "Core.type.Inspector", function () {

	describe( "(Built-In 'Simple Checks')", function () {

		// Note: We dynamically build the tests in this section by iterating
		// over test data provided by the `getSimpleCheckComparisons()` helper function.

		// Init a Core.type.Inspector
		let inspector = Core.inst( "Core.type.Inspector" );

		// Gather the test data..
		let simpleCheckComparisons = getSimpleCheckComparisons();

		// Iterate over each 'simple check' defined in the test data
		simpleCheckComparisons.forEach( function( targetSimpleCheck ) {

			let _it;

			if( targetSimpleCheck.only === true ) {
				_it = it.only;
			} else {
				_it = it;
			}

			// Create a section for the 'simple check'
			describe( `#${targetSimpleCheck.name}()`, function() {

				// Add a basic check that ensures that the target 'simple check'
				// is defined and available in the inspector.
				_it( "should be registered in the 'simple check registry'", function () {
					expect( inspector.simpleChecks.has( targetSimpleCheck.name ) ).to.equal( true );
				} );

				// If the target 'simple check' is not in the registry then the previous test, above,
				// should have failed and there's no point in us adding more tests..
				if( inspector.simpleChecks.has( targetSimpleCheck.name ) ) {

					// The simple checks have an understanding of what they
					// check for; so we'll use data from the simple check
					// to populate the names of the upcoming tests.
					let scProps    = inspector.simpleChecks.get( targetSimpleCheck.name );
					let checksForA = scProps.checksForA;

					// This test will check against known, passing, values...
					_it( "should return TRUE when provided " + checksForA, function () {

						// Iterate over each, known, PASSING value.
						targetSimpleCheck.passingValues.forEach(
							function ( passingValue, index ) {

								// Capture the simple check's function/method..
								let checkFn = scProps.fn.bind( inspector );

								// Execute the simple check's function with a known, passing, value
								let result = checkFn( passingValue );

								// Create a description to use if this test fails
								let testFailDesc = "expected PASSING VALUE #" + ( index + 1 ) + " for '" + targetSimpleCheck.name + "()' to return TRUE!";

								// The call with a known, passing, value should return TRUE
								expect( result, testFailDesc ).to.equal( true );

							}
						);

					} );

					// This test will check against known, failing, values...
					_it( "should return FALSE when provided anything other than " + checksForA, function () {

						// Iterate over each, known, FAILING value.
						targetSimpleCheck.failingValues.forEach(
							function ( failingValue, index ) {

								// Capture the simple check's function/method..
								let checkFn = scProps.fn.bind( inspector );

								// Execute the simple check's function with a known, failing, value
								let result = checkFn( failingValue );

								// Create a description to use if this test fails
								let testFailDesc = "expected FAILING VALUE #" + ( index + 1 ) + " for '" + targetSimpleCheck.name + "()' to return FALSE!";

								// The call with a known, failing, value should return FALSE
								expect( result, testFailDesc ).to.equal( false );

							}
						);

					} );

				}

			} );

		} );

	} );

	describe( "(Value Descriptions)", function() {

		describe( "#getFirstSimpleCheckMatch()", function() {

			// Note: We dynamically build the tests in this section by iterating
			// over test data provided by the `getSimpleCheckMatchData()` helper function.

			// Init a Core.type.Inspector
			let inspector = Core.inst( "Core.type.Inspector" );

			// Gather the test data..
			let simpleCheckMatchData = getSimpleCheckMatchData();

			// Iterate over each of the relevant check functions
			simpleCheckMatchData.forEach( function( expectedMatches, checkName ) {

				it( `should return '${checkName}' as the first match when applicable`, function() {

					// Iterate over each value that is expected to match the current check.
					expectedMatches.forEach( function( matchValue, index ) {

						// Execute the `getFirstSimpleCheckMatch` method..
						let result = inspector.getFirstSimpleCheckMatch( matchValue );

						// Craft a failure message for if the upcoming test fails.
						let failMsg = "'" + checkName + "' Value #" + ( index + 1 ) + " did not match '" + checkName + "' as expected; instead, it matched '" + result.name + "' before any other check!";

						// Assert
						expect( result.name, failMsg ).to.equal( checkName );

					} );

				} );

			} );

		} );

		describe( "#describe", function() {

			let inspector;

			before( function() {

				// Init a Core.type.Inspector
				inspector = Core.inst( "Core.type.Inspector" );

			} );

			describe( "( <String> )", function() {

				it( "should properly describe empty strings", function() {

					// This is what we want described..
					let valueToDescribe = "";

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					// -> string (empty)
					expect( res ).to.equal( "empty String" );

				} );

				it( "should properly describe short strings", function() {

					// This is what we want described..
					let valueToDescribe = "0123456789";

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					// -> string ("0123456789")
					expect( res ).to.have.string( "String" );
					expect( res ).to.have.string( valueToDescribe );

				} );

				it( "should properly describe long strings", function() {

					// This is what we want described..
					let valueToDescribe = "012345678901234567890123456789012345678901234567890123456789";

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					// -> string ("0123456789...", length=50)
					expect( res ).to.have.string( "String" );
					expect( res ).to.have.string( "length" );
					expect( res ).to.have.string( valueToDescribe.length + "" );

				} );

			} );

			describe( "( <Arguments> )", function() {

				let argExample;

				before( function() {

					function tmp( a, b, c, d ) {
						argExample = arguments;
					}

					tmp( 1, 2, 3, 4 );

				} );

				it( "should properly describe empty arguments objects", function() {

					// This is what we want described..
					let valueToDescribe = arguments;

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					// -> arguments object (empty)
					expect( res ).to.equal( "empty Arguments Object" );

				} );

				it( "should properly describe non-empty arguments objects", function() {

					// This is what we want described..
					let valueToDescribe = argExample;

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					// -> arguments object (length=4)
					expect( res ).to.equal( "Arguments Object (length=4)" );

				} );

			} );

			describe( "( <Array> )", function() {

				it( "should properly describe empty arrays", function() {

					// This is what we want described..
					let valueToDescribe = [];

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					// -> array (empty)
					expect( res ).to.equal( "empty Array" );

				} );

				it( "should properly describe non-empty arrays", function() {

					// This is what we want described..
					let valueToDescribe = [ 1, 2, 3, 4 ];

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					// -> array (length=4)
					expect( res ).to.equal( "Array (length=4)" );

				} );

			} );

			describe( "( <ArrayBuffer> )", function() {

				it( "should properly describe ArrayBuffers", function() {

					// This is what we want described..
					let valueToDescribe = new ArrayBuffer( 2 );

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					// -> ArrayBuffer (byteLength=2)
					expect( res ).to.equal( "ArrayBuffer (byteLength=2)" );

				} );

			} );

			describe( "( <Array-Like Object> )", function() {

				it( "should properly describe empty array-like objects", function() {

					// This is what we want described..
					let valueToDescribe = { length: 0 };

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					expect( res ).to.equal( "empty array-like Object" );

				} );

				it( "should properly describe non-empty array-like objects", function() {

					// This is what we want described..
					let valueToDescribe = { length: 2 };

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					expect( res ).to.equal( "array-like Object (length=2)" );

				} );

			} );

			describe( "( <Boolean> )", function() {

				it( "should properly describe TRUE values", function() {

					// This is what we want described..
					let valueToDescribe = true;

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					// -> boolean (TRUE)
					expect( res ).to.equal( "Boolean (TRUE)" );

				} );

				it( "should properly describe FALSE values", function() {

					// This is what we want described..
					let valueToDescribe = false;

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					// -> boolean (FALSE)
					expect( res ).to.equal( "Boolean (FALSE)" );

				} );

			} );

			describe( "( <Buffer> )", function() {

				it( "should properly describe Buffers", function() {

					// This is what we want described..
					let valueToDescribe = new Buffer( 33 );

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					expect( res ).to.equal( "Buffer (length=33)" );

				} );

			} );

			describe( "( <Integer> )", function() {

				it( "should properly describe integers", function() {

					// This is what we want described..
					let valueToDescribe = 42;

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					expect( res ).to.equal( "integer (Number; value=42)" );

				} );

			} );

			describe( "( <null> )", function() {

				it( "should properly describe NULL values", function() {

					// This is what we want described..
					let valueToDescribe = null;

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					expect( res ).to.equal( "NULL value" );

				} );

			} );

			describe( "( <undefined> )", function() {

				it( "should properly describe UNDEFINED values", function() {

					// This is what we want described..
					let valueToDescribe = undefined;

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					expect( res ).to.equal( "UNDEFINED value" );

				} );

			} );

			describe( "( <Function> )", function() {

				it( "should properly describe anonymous, non-async, functions", function() {

					// This is what we want described..
					let anAnonymousFunction = function() {};

					// Execute describe()
					let res = inspector.describe( anAnonymousFunction );

					// Assert..
					expect( res ).to.equal( "Function (anonymous; as=anAnonymousFunction)" );

				} );

				it( "should properly describe named, non-async, functions", function() {

					// This is what we want described..
					let valueToDescribe = function aNamedFunction() {};

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					expect( res ).to.equal( "Function (name=aNamedFunction)" );

				} );

				it( "should properly describe non-async, arrow, functions that have ANY name", function() {

					// This is what we want described..
					let anArrowFunction = ( a ) => {};

					// Execute describe()
					let res = inspector.describe( anArrowFunction );

					// Assert..
					expect( res ).to.equal( "Function (arrow; as=anArrowFunction)" );

				} );

				it( "should properly describe non-async, arrow, functions that have NO name", function() {

					// Execute describe()
					let res = inspector.describe( ( a ) => {} );

					// Assert..
					expect( res ).to.equal( "Function (arrow)" );

				} );

				it( "should properly describe bound, anonymous, non-async, functions that have NO name as though they are 'anonymous'", function() {

					// This is what we want described..
					let aBoundFn = ( function() {} ).bind( this );

					// Execute describe()
					let res = inspector.describe( aBoundFn );

					// Assert..
					expect( res ).to.equal( "Function (bound; anonymous)" );

				} );

				it( "should semi-properly describe bound, anonymous, non-async, functions that have ANY name as though they are 'named'", function() {



					// Note: This is a case where the describe() method cannot resolve the full truth;
					// the bind() operation obscures its ability to resolve the fact that the original
					// function was anonymous, so it does not mention 'anonymous' in the description.
					// See the note in `Core.type.Inspector::isAnonymousFunction()` for more info.



					// This is what we want described..
					let anAnonymousFunction = function() {};
					let aBoundFn = anAnonymousFunction.bind( this );

					// Execute describe()
					let res = inspector.describe( aBoundFn );

					// Assert..
					expect( res ).to.equal( "Function (bound; name=anAnonymousFunction)" );

				} );

				it( "should properly describe bound, named, non-async, functions", function() {

					// This is what we want described..
					function aNamedFunction() {}
					let aBoundFn = aNamedFunction.bind( this );

					// Execute describe()
					let res = inspector.describe( aBoundFn );

					// Assert..
					expect( res ).to.equal( "Function (bound; name=aNamedFunction)" );


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

					// Execute describe()
					let res = inspector.describe( aBoundFn );

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

					// Execute describe()
					let res = inspector.describe( aBoundFn );

					// Assert..
					expect( res ).to.equal( "Function (bound; anonymous)" );


				} );

			} );

			describe( "( <AsyncFunction> )", function() {

				it( "should properly describe anonymous, async, functions", function() {

					// This is what we want described..
					let anAnonymousFunction = async function() {};

					// Execute describe()
					let res = inspector.describe( anAnonymousFunction );

					// Assert..
					expect( res ).to.equal( "Async Function (anonymous; as=anAnonymousFunction)" );

				} );

				it( "should properly describe named, async, functions", function() {

					// This is what we want described..
					let valueToDescribe = async function aNamedFunction() {};

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					expect( res ).to.equal( "Async Function (name=aNamedFunction)" );

				} );

				it( "should properly describe async, arrow, functions that have ANY name", function() {

					// This is what we want described..
					let anArrowFunction = async ( a ) => {};

					// Execute describe()
					let res = inspector.describe( anArrowFunction );

					// Assert..
					expect( res ).to.equal( "Async Function (arrow; as=anArrowFunction)" );

				} );

				it( "should properly describe async, arrow, functions that have NO name", function() {

					// Execute describe()
					let res = inspector.describe( async ( a ) => {} );

					// Assert..
					expect( res ).to.equal( "Async Function (arrow)" );

				} );

				it( "should properly describe bound, anonymous, async, functions that have NO name as though they are 'anonymous'", function() {

					// This is what we want described..
					let aBoundFn = ( async function() {} ).bind( this );

					// Execute describe()
					let res = inspector.describe( aBoundFn );

					// Assert..
					expect( res ).to.equal( "Async Function (bound; anonymous)" );

				} );

				it( "should semi-properly describe bound, anonymous, async, functions that have ANY name as though they are 'named'", function() {



					// Note: This is a case where the describe() method cannot resolve the full truth;
					// the bind() operation obscures its ability to resolve the fact that the original
					// function was anonymous, so it does not mention 'anonymous' in the description.
					// See the note in `Core.type.Inspector::isAnonymousFunction()` for more info.



					// This is what we want described..
					let anAnonymousFunction = async function() {};
					let aBoundFn = anAnonymousFunction.bind( this );

					// Execute describe()
					let res = inspector.describe( aBoundFn );

					// Assert..
					expect( res ).to.equal( "Async Function (bound; name=anAnonymousFunction)" );

				} );

				it( "should properly describe bound, named, async, functions", function() {

					// This is what we want described..
					async function aNamedFunction() {}
					let aBoundFn = aNamedFunction.bind( this );

					// Execute describe()
					let res = inspector.describe( aBoundFn );

					// Assert..
					expect( res ).to.equal( "Async Function (bound; name=aNamedFunction)" );


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

					// Execute describe()
					let res = inspector.describe( aBoundFn );

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

					// Execute describe()
					let res = inspector.describe( aBoundFn );

					// Assert..
					expect( res ).to.equal( "Async Function (bound; anonymous)" );


				} );

			} );

			describe( "( <Map> )", function() {

				it( "should properly describe empty Map objects", function() {

					// This is what we want described..
					let valueToDescribe = new Map();

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					expect( res ).to.equal( "empty Map Object" );


				} );

				it( "should properly describe non-empty Map objects", function() {

					// This is what we want described..
					let valueToDescribe = new Map();
					valueToDescribe.set( "a", 1 );
					valueToDescribe.set( "b", 2 );
					valueToDescribe.set( "c", 3 );

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					expect( res ).to.equal( "Map Object (size=3)" );

				} );

			} );

			describe( "( <Number> )", function() {

				it( "should properly describe non-whole Numbers", function() {

					// This is what we want described..
					let valueToDescribe = 1.2;

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					expect( res ).to.equal( "Number (value=1.2)" );

				} );

			} );

			describe( "( <RegExp> )", function() {

				it( "should properly describe RegExp objects", function() {

					// This is what we want described..
					let valueToDescribe = /^(async)*(\(\)|[\$_a-zA-Z]+\w*|\([\$_a-zA-Z]+\w*(,[\$_a-zA-Z]+\w*)*\))=>/ig;

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					expect( res ).to.equal( "RegExp Object" );

				} );

			} );

			describe( "( <Set> )", function() {

				it( "should properly describe empty Sets", function() {

					// This is what we want described..
					let valueToDescribe = new Set();

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					expect( res ).to.equal( "empty Set Object" );

				} );

				it( "should properly describe non-empty Sets", function() {

					// This is what we want described..
					let valueToDescribe = new Set();
					valueToDescribe.add( 1 );
					valueToDescribe.add( 2 );
					valueToDescribe.add( 3 );
					valueToDescribe.add( 4 );

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					expect( res ).to.equal( "Set Object (size=4)" );

				} );

			} );

			describe( "( <Date> )", function() {

				it( "should properly describe Date objects", function() {

					// This is what we want described..
					let valueToDescribe = new Date( "2010-10-10T10:10:10-00:00" );

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					//expect( res ).to.equal( "something" );
					expect( res ).to.equal( "Date Object (\"2010-10-10T10:10:10+00:00\")" );

				} );

			} );

			describe( "( <Moment> )", function() {

				it( "should properly describe Moment.js objects", function() {

					// This is what we want described..
					let valueToDescribe = MOMENT( "2010-10-10T10:10:10-00:00" );

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					expect( res ).to.equal( "Moment Object (\"2010-10-10T10:10:10+00:00\")" );

				} );

			} );

			describe( "( <Error> )", function() {

				it( "should properly describe Error objects with no message", function() {

					// This is what we want described..
					let valueToDescribe = new Error();

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					expect( res ).to.equal( "Error Object (with an empty message)" );


				} );

				it( "should properly describe Error objects with an empty message", function() {

					// This is what we want described..
					let valueToDescribe = new Error( "" );

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					expect( res ).to.equal( "Error Object (with an empty message)" );

				} );

				it( "should properly describe Error objects with a short message", function() {

					// This is what we want described..
					let valueToDescribe = new Error( "Something is rotten in Denmark" );

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					expect( res ).to.equal( "Error Object (\"Something is rotten in Denmark\")" );

				} );

				it( "should properly describe Error objects with a long message", function() {

					// This is what we want described..
					let valueToDescribe = new Error( "Something is rotten in the state of Denmark. We really should do something about it" );

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					expect( res ).to.equal( "Error Object (\"Something is rotten in the state of...\")" );

				} );

			} );

			describe( "( <Symbol> )", function() {

				it( "should properly describe transient symbols", function() {

					// This is what we want described..
					let valueToDescribe = Symbol( "foo" );

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					expect( res ).to.equal( "transient Symbol(foo)" );

				} );

				it( "should properly describe global symbols", function() {

					// This is what we want described..
					let valueToDescribe = Symbol.for( "foo" );

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					expect( res ).to.equal( "global Symbol(foo)" );

				} );

			} );

			describe( "( <TypedArray> )", function() {

				it( "should properly describe TypedArrays", function() {

					// This is what we want described..
					let valueToDescribe = new Uint8Array( 12 );

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					expect( res ).to.equal( "TypedArray (Uint8Array; length=12)" );

				} );

			} );

			describe( "( <WeakMap> )", function() {

				it( "should properly describe WeakMaps", function() {

					// This is what we want described..
					let valueToDescribe = new WeakMap();

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					expect( res ).to.equal( "WeakMap Object" );

				} );

			} );

			describe( "( <WeakSet> )", function() {

				it( "should properly describe WeakSets", function() {

					// This is what we want described..
					let valueToDescribe = new WeakSet();

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					expect( res ).to.equal( "WeakSet Object" );

				} );

			} );

			describe( "( <NaN> )", function() {

				it( "should properly describe NaN values", function() {

					// This is what we want described..
					let valueToDescribe = NaN;

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					expect( res ).to.equal( "NaN literal" );

				} );

			} );

			describe( "( <PlainObject> )", function() {

				it( "should properly describe Plain Object's with no keys", function() {

					// This is what we want described..
					let valueToDescribe = {};

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					expect( res ).to.equal( "empty Plain Object" );

				} );

				it( "should properly describe Plain Object's with a few keys", function() {

					// This is what we want described..
					let valueToDescribe = { something: "old", andSomething: "new", thenSomething: "borrowed", finallySomething: "blue" };

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					expect( res ).to.equal( "Plain Object (keys=\"something\",\"andSomething\",\"thenSomething\",\"finallySomething\")" );

				} );

				it( "should properly describe Plain Object's with many keys", function() {

					// This is what we want described..
					let valueToDescribe = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 10, k: 11 };

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					expect( res ).to.equal( "Plain Object (keys=\"a\",\"b\",\"c\"...; total=11)" );

				} );

			} );

			describe( "( <Object> )", function() {

				it( "should properly describe objects with constructors", function() {

					//let x = function() {};
					class x {}
					let y = new x();

					// This is what we want described..
					let valueToDescribe = y;

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					expect( res ).to.equal( "Object (constructor.name=\"x\")" );

				} );

			} );

			describe( "( <CoreClass> )", function() {

				it( "should properly describe Core Framework Classes (a.k.a constructors)", function() {

					// This is what we want described..
					let valueToDescribe = Core.cls( "Core.abstract.Component" );

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					expect( res ).to.equal( "Core Class Definition (\"Core.abstract.Component\")" );

				} );

			} );

			describe( "( <CoreClassName> )", function() {

				it( "should properly describe Core Class Names", function() {

					// This is what we want described..
					let valueToDescribe = "Core.abstract.Component";

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					expect( res ).to.equal( "Core Class Name (String; \"Core.abstract.Component\")" );

				} );

			} );

			describe( "( <CoreClassInstance> )", function() {

				it( "should properly describe Core Class Instances", function() {

					// This is what we want described..
					let valueToDescribe = Core.inst( "Core.abstract.Component" );

					// Execute describe()
					let res = inspector.describe( valueToDescribe );

					// Assert..
					expect( res ).to.equal( "Core Class Instance (\"Core.abstract.Component\")" );

				} );

			} );



		} );

	} );

} );

/**
 * Returns data for testing the Core.type.Inspector's `getFirstSimpleCheckMatch()` method.
 *
 * The returned map will be keyed with the name of one of Core.type.Inspector's 'simple checks'; the
 * corresponding value will be an array of values that, when passed to `getFirstSimpleCheckMatch()`,
 * should return the check specified by the key.
 *
 * @example
 * scmd.set( "isBoolean", [ true, false ] );
 * inspector.getFirstSimpleCheckMatch( true );  // -> result.name === "isBoolean"
 * inspector.getFirstSimpleCheckMatch( false ); // -> result.name === "isBoolean"
 *
 * @returns {Map<string,Array>} Testing data for the Core.type.Inspector's `getFirstSimpleCheckMatch()` method.
 */
function getSimpleCheckMatchData() {

	let scmd = new Map();

	scmd.set( "isCoreClassName",
		[
			"Core.ns.Something"
		]
	);

	scmd.set( "isCoreClass",
		[
			Core.cls( "Core.abstract.Component" )
		]
	);

	scmd.set( "isCoreClassInstance",
		[
			Core.inst( "Core.abstract.Component" )
		]
	);

	scmd.set( "isArguments",
		[
			arguments
		]
	);

	scmd.set( "isInteger",
		[
			1
		]
	);

	scmd.set( "isNull",
		[
			null
		]
	);

	scmd.set( "isUndefined",
		[
			undefined
		]
	);

	scmd.set( "isArray",
		[
			[], [ 1, 2, 3 ]
		]
	);

	scmd.set( "isBoolean",
		[
			true, false
		]
	);

	scmd.set( "isFunction",
		[
			function() {}, aConstructor
		]
	);

	scmd.set( "isAsyncFunction",
		[
			async function() {}
		]
	);

	scmd.set( "isMap",
		[
			new Map()
		]
	);

	scmd.set( "isNumber",
		[
			1.2
		]
	);

	scmd.set( "isRegExp",
		[
			/abc/
		]
	);

	scmd.set( "isSet",
		[
			new Set()
		]
	);

	scmd.set( "isString",
		[
			"hello world"
		]
	);

	scmd.set( "isBuffer",
		[
			new Buffer( 2 )
		]
	);

	scmd.set( "isDate",
		[
			new Date()
		]
	);

	scmd.set( "isMoment",
		[
			MOMENT()
		]
	);

	scmd.set( "isError",
		[
			new Error()
		]
	);

	scmd.set( "isSymbol",
		[
			Symbol.iterator, Symbol( "abc" ), Symbol.for( "xyz" )
		]
	);

	scmd.set( "isArrayBuffer",
		[
			new ArrayBuffer( 2 )
		]
	);

	scmd.set( "isTypedArray",
		[
			new Uint8Array( 2 )
		]
	);

	scmd.set( "isWeakMap",
		[
			new WeakMap()
		]
	);

	scmd.set( "isWeakSet",
		[
			new WeakSet()
		]
	);

	scmd.set( "isNaN",
		[
			NaN
		]
	);

	scmd.set( "isArrayLikeObject",
		[
			{ length: 1 }
		]
	);

	scmd.set( "isPlainObject",
		[
			{ hello: "world" }
		]
	);

	scmd.set( "isObject",
		[
			new aConstructor()
		]
	);

	return scmd;

}

/**
 * This helper function returns test data that will be used to test the
 * built-in 'simple checks' registered in a new Core.type.Inspector.
 *
 * Each element in the returned Set will contain the name of a check that
 * should be registered, values that should PASS (return TRUE), and values
 * that should FAIL (return FALSE).
 *
 * @private
 * @returns {Set<Object>} Test data that can be used to test the built-in 'simple checks'.
 */
function getSimpleCheckComparisons() {

	let simpleCheckComparisons = new Set();

	// Define passing and failing test values for the `isArguments` check.
	simpleCheckComparisons.add(
		{
			name          : "isArguments",
			passingValues : [ arguments ],
			failingValues : [ 1, "2", [ 1, 2, 3 ] ],
		}
	);

	// Define passing and failing test values for the `isArray` check.
	simpleCheckComparisons.add(
		{
			name          : "isArray",
			passingValues : [ [], [ 1, 2, 3 ] ],
			failingValues : [ 1, "2", new Set(), new Map() ],
		}
	);

	// Define passing and failing test values for the `isArrayBuffer` check.
	simpleCheckComparisons.add(
		{
			name          : "isArrayBuffer",
			passingValues : [ new ArrayBuffer( 2 ) ],
			failingValues : [ new Array( 2 ), 1, "2", [ 1, 2 ] ],
		}
	);

	// Define passing and failing test values for the `isArrayLike` check.
	simpleCheckComparisons.add(
		{
			name          : "isArrayLike",
			passingValues : [ [ 1, 2 ], "aString" ],
			failingValues : [ 1, null, false ],
		}
	);

	// Define passing and failing test values for the `isArrayLikeObject` check.
	simpleCheckComparisons.add(
		{
			name          : "isArrayLikeObject",
			passingValues : [ [ 1, 2 ], { length: 0 } ],
			failingValues : [ "aString", 1, true ],
		}
	);

	// Define passing and failing test values for the `isBoolean` check.
	simpleCheckComparisons.add(
		{
			name          : "isBoolean",
			passingValues : [ true, false ],
			failingValues : [ 1, null, [], {} ],
		}
	);

	// Define passing and failing test values for the `isBuffer` check.
	simpleCheckComparisons.add(
		{
			name          : "isBuffer",
			passingValues : [ new Buffer( 2 ) ],
			failingValues : [ new Uint8Array( 2 ), true, false, 1, "2" ],
		}
	);

	// Define passing and failing test values for the `isDate` check.
	simpleCheckComparisons.add(
		{
			name          : "isDate",
			passingValues : [ new Date() ],
			failingValues : [ "Mon April 23 2012", 1, 2, false, null, [] ],
		}
	);

	// Define passing and failing test values for the `isEmpty` check.
	simpleCheckComparisons.add(
		{
			name          : "isEmpty",
			passingValues : [ null, true, 1, [], {}, "", undefined ],
			failingValues : [ [ 1 ], "notEmpty", { a: 1 } ],
		}
	);

	// Define passing and failing test values for the `isError` check.
	simpleCheckComparisons.add(
		{
			name          : "isError",
			passingValues : [ new Error() ],
			failingValues : [ Error, "a", 1, [], {} ],
		}
	);

	// Define passing and failing test values for the `isFinite` check.
	simpleCheckComparisons.add(
		{
			name          : "isFinite",
			passingValues : [ 3, Number.MIN_VALUE ],
			failingValues : [ Infinity, "3" ],
		}
	);

	// Define passing and failing test values for the `isFunction` check.
	simpleCheckComparisons.add(
		{
			name          : "isFunction",
			passingValues : [ function() {} ],
			failingValues : [ /abc/, 1, "2", [], {} ],
		}
	);

	// Define passing and failing test values for the `isArrowFunction` check.
	let arrow1 = () => {};
	let arrow2 = ( $$a, __b ) => {};
	let arrow3 = functioN => {};
	let arrow4 = $a => $a + 1;
	let arrow5 = __a => ( { foo: "bar" } );
	let arrow6 = (

	) => {};
	let anon1 = function() {};
	let named1 = function named2() { return a => {}; };
	function named2( a, b, c ) {}

	simpleCheckComparisons.add(
		{
			name          : "isArrowFunction",
			passingValues : [ arrow1, arrow2, arrow3, arrow4, arrow5, arrow6, () => {}, a => {} ],
			failingValues : [ anon1, named1, function() {}, named2, function named4() {}, 1, "2", [] ],
		}
	);

	// Define passing and failing test values for the `isArrowFunction` check.
	simpleCheckComparisons.add(
		{
			name          : "isNonArrowFunction",
			passingValues : [ anon1, named1, function() {}, named2, function named4() {} ],
			failingValues : [ arrow1, arrow2, arrow3, arrow4, arrow5, arrow6, () => {}, a => {}, 1, "2", [] ],
		}
	);

	// Define passing and failing test values for the `isAsyncFunction` check.
	let async1 = async function() {};
	let async2 = async () => {};
	let async3 = async function namedAsync() {};
	simpleCheckComparisons.add(
		{
			name          : "isAsyncFunction",
			passingValues : [ async1, async2, async3, async function fourth() {}, async function() {} ],
			failingValues : [ arrow1, arrow2, arrow3, arrow4, arrow5, arrow6, anon1, named1, named2, 1, "2", true, [] ]
		}
	);

	// Define passing and failing test values for the `isNonAsyncFunction` check.
	simpleCheckComparisons.add(
		{
			name          : "isNonAsyncFunction",
			passingValues : [ arrow1, arrow2, arrow3, arrow4, arrow5, arrow6, anon1, named1, named2 ],
			failingValues : [ async1, async2, async3, async function fourth() {}, async function() {}, 1, "2", true, [] ],
		}
	);

	// Define passing and failing test values for the `isBoundFunction` check.
	let bound1 = arrow1.bind( this );
	let bound2 = arrow2.bind( this );
	let bound3 = arrow4.bind( this );
	let bound4 = anon1.bind( this );
	let bound5 = named2.bind( this );
	let bound6 = async1.bind( this );

	simpleCheckComparisons.add(
		{
			name          : "isBoundFunction",
			passingValues : [ bound1, bound2, bound3, bound4, bound4, bound5, bound6, arrow3.bind( this ) ],
			failingValues : [ arrow1, arrow2, arrow3, arrow4, arrow5, arrow6, anon1, named1, named2, async1,
				async2, async3, async function fourth() {}, async function() {}, 1, "2", true, [] ],
		}
	);

	// Define passing and failing test values for the `isUnboundFunction` check.
	simpleCheckComparisons.add(
		{
			name          : "isUnboundFunction",
			passingValues : [ arrow1, arrow2, arrow3, arrow4, arrow5, arrow6, anon1, named1, named2, async1,
				async2, async3, async function fourth() {}, async function() {} ],
			failingValues: [ bound1, bound2, bound3, bound4, bound4, bound5, bound6, arrow3.bind( this ), 1, "2", true, [] ],
		}
	);

	// Define passing and failing test values for the `isAnonymousFunction` check.

	class testCls {
		static myStaticFn() {}
		myInstanceFn() {}
	}
	testCls.prototype.clsAnonFn = function() {};
	let inst1 = new testCls();

	// --

	let obj1 = {
		anonFn  : function() {},
		namedFn : function named() {}
	};

	// --

	let testCls2 = function() {
		this.namedFnA = function namedFnA() {};
		this.anonFnA = function() {};
	};
	testCls2.prototype.namedFnB = function namedFnB() {};
	testCls2.prototype.anonFnB = function() {};
	let inst2 = new testCls2();


	simpleCheckComparisons.add(
		{
			name          : "isAnonymousFunction",
			passingValues : [ obj1.anonFn, inst1.clsAnonFn, inst2.anonFnA, inst2.anonFnB, anon1, function() {},
				() => {}, anon1, arrow1, arrow3 ],
			failingValues: [ obj1.namedFn, testCls.myStaticFn, inst1.myInstanceFn, inst2.namedFnA, inst2.namedFnB,
				named1, named2, function namedx() {}, 1, "2", [], true ],
		}
	);

	// Define passing and failing test values for the `isNamedFunction` check.
	simpleCheckComparisons.add(
		{
			name          : "isNamedFunction",
			passingValues : [ obj1.namedFn, testCls.myStaticFn, inst1.myInstanceFn, inst2.namedFnA, inst2.namedFnB,
				named1, named2, function namedx() {} ],
			failingValues: [ obj1.anonFn, inst1.clsAnonFn, inst2.anonFnA, inst2.anonFnB, anon1, function() {},
				() => {}, anon1, arrow1, arrow3, 1, "2", [], true ]
		}
	);

	// Define passing and failing test values for the `isInteger` check.
	simpleCheckComparisons.add(
		{
			name          : "isInteger",
			passingValues : [ 1, 100, Number.MAX_SAFE_INTEGER ],
			failingValues : [ Number.MIN_VALUE, Infinity, NaN, "1" ],
		}
	);

	// Define passing and failing test values for the `isLength` check.
	simpleCheckComparisons.add(
		{
			name          : "isLength",
			passingValues : [ 3 ],
			failingValues : [ Number.MIN_VALUE, Infinity, "3", false, {} ],
		}
	);

	// Define passing and failing test values for the `isMap` check.
	simpleCheckComparisons.add(
		{
			name          : "isMap",
			passingValues : [ new Map() ],
			failingValues : [ new WeakMap(), 1, "2", false, [] ],
		}
	);

	// Define passing and failing test values for the `isNaN` check.
	simpleCheckComparisons.add(
		{
			name          : "isNaN",
			passingValues : [ NaN ],
			failingValues : [ undefined, null, 1, "2" ],
		}
	);

	// Define passing and failing test values for the `isNative` check.
	let notNative = function() {};
	let aNative = notNative.bind( this );

	simpleCheckComparisons.add(
		{
			name          : "isNative",
			passingValues : [ Array.prototype.push, aNative ],
			failingValues : [ function() {}, 1, "2" ],
		}
	);

	// Define passing and failing test values for the `isNil` check.
	simpleCheckComparisons.add(
		{
			name          : "isNil",
			passingValues : [ null, undefined ],
			failingValues : [ 1, "2", [], false ],
		}
	);

	// Define passing and failing test values for the `isNull` check.
	simpleCheckComparisons.add(
		{
			name          : "isNull",
			passingValues : [ null ],
			failingValues : [ undefined, 1, "2", [] ],
		}
	);

	// Define passing and failing test values for the `isNumber` check.
	simpleCheckComparisons.add(
		{
			name          : "isNumber",
			passingValues : [ 3, Number.MIN_VALUE, Infinity, NaN ],
			failingValues : [ "3", true, [] ],
		}
	);

	// Define passing and failing test values for the `isObject` check.
	simpleCheckComparisons.add(
		{
			name          : "isObject",
			passingValues : [ {}, [ 1, 2, 3 ] ],
			failingValues : [ null, "2", undefined ],
		}
	);

	// Define passing and failing test values for the `isObjectLike` check.
	simpleCheckComparisons.add(
		{
			name          : "isObjectLike",
			passingValues : [ {}, [] ],
			failingValues : [ null, undefined, 1, "1", NaN ],
		}
	);

	// Define passing and failing test values for the `isPlainObject` check.
	simpleCheckComparisons.add(
		{
			name          : "isPlainObject",
			passingValues : [ Object.create( null ), { x: 0, y: 0 }, {} ],
			failingValues : [ new aConstructor(), 1, [ 1, 2, 3 ] ],
		}
	);

	// Define passing and failing test values for the `isRegExp` check.
	simpleCheckComparisons.add(
		{
			name          : "isRegExp",
			passingValues : [ /abc/ ],
			failingValues : [ "/abc/", 1, false, {}, [] ],
		}
	);

	// Define passing and failing test values for the `isSafeInteger` check.
	simpleCheckComparisons.add(
		{
			name          : "isSafeInteger",
			passingValues : [ 3, Number.MAX_SAFE_INTEGER ],
			failingValues : [ Infinity, NaN, "3", Number.MIN_VALUE ],
		}
	);

	// Define passing and failing test values for the `isSet` check.
	simpleCheckComparisons.add(
		{
			name          : "isSet",
			passingValues : [ new Set() ],
			failingValues : [ new WeakSet(), [], "1", true ],
		}
	);

	// Define passing and failing test values for the `isString` check.
	simpleCheckComparisons.add(
		{
			name          : "isString",
			passingValues : [ "aString" ],
			failingValues : [ 1, false, [], {} ],
		}
	);

	// Define passing and failing test values for the `isSymbol` check.
	simpleCheckComparisons.add(
		{
			name          : "isSymbol",
			passingValues : [ Symbol.iterator, Symbol( "test" ), Symbol.for( "another test" ) ],
			failingValues : [ "abc", 1, false, [] ],
		}
	);

	// Define passing and failing test values for the `isTypedArray` check.
	simpleCheckComparisons.add(
		{
			name          : "isTypedArray",
			passingValues : [ new Uint8Array( 2 ) ],
			failingValues : [ "a", [], new Set() ],
		}
	);

	// Define passing and failing test values for the `isUndefined` check.
	simpleCheckComparisons.add(
		{
			name          : "isUndefined",
			passingValues : [ undefined ],
			failingValues : [ null, false, "", 1 ],
		}
	);

	// Define passing and failing test values for the `isWeakMap` check.
	simpleCheckComparisons.add(
		{
			name          : "isWeakMap",
			passingValues : [ new WeakMap() ],
			failingValues : [ new WeakSet(), new Map(), [], {} ],
		}
	);

	// Define passing and failing test values for the `isWeakSet` check.
	simpleCheckComparisons.add(
		{
			name          : "isWeakSet",
			passingValues : [ new WeakSet() ],
			failingValues : [ new Set(), [], 1 ],
		}
	);


	// -- Moment.js --


	// Define passing and failing test values for the `isMoment` check.
	simpleCheckComparisons.add(
		{
			name          : "isMoment",
			passingValues : [ MOMENT() ],
			failingValues : [ new Date(), new Set(), [], 1 ],
			//only: true
		}
	);


	// -- Special Framework Checks --


	class aQuickTest extends Core.cls( "Core.abstract.BaseClass" ) {}

	// Define passing and failing test values for the `isCoreClass` check.
	simpleCheckComparisons.add(
		{
			name          : "isCoreClass",
			passingValues : [ Core.cls( "Core.abstract.Component" ), aQuickTest ],
			failingValues : [ Core.inst( "Core.abstract.Component" ), new aConstructor(), new Set(), [], 1 ],
		}
	);

	// Define passing and failing test values for the `isCoreClassName` check.
	simpleCheckComparisons.add(
		{
			name          : "isCoreClassName",
			passingValues : [
				"Core.Something",
				"Core.ns.Something",
				"Core.ns.someThing.Something",
				"Test.ns.ns.Something"
			],
			failingValues: [
				"Core.something",
				"Core",
				"Core.Something.Something",
				"Test",
				Core.cls( "Core.abstract.Component" ),
				Core.inst( "Core.abstract.Component" )
			],
		}
	);

	// Define passing and failing test values for the `isCoreClassLike` check.
	simpleCheckComparisons.add(
		{
			name          : "isCoreClassLike",
			passingValues : [
				"Core.Something",
				"Core.ns.Something",
				"Core.ns.someThing.Something",
				"Test.ns.ns.Something",
				Core.cls( "Core.abstract.Component" ),
				aQuickTest
			],
			failingValues: [
				"Core.something",
				"Core",
				"Core.Something.Something",
				"Test",
				Core.inst( "Core.abstract.Component" ),
				new aConstructor(),
				new Set(),
				[],
				1
			],
		}
	);

	// Define passing and failing test values for the `isCoreClassInstance` check.
	simpleCheckComparisons.add(
		{
			name          : "isCoreClassInstance",
			passingValues : [ Core.inst( "Core.abstract.Component" ), new aQuickTest() ],
			failingValues : [ Core.cls( "Core.abstract.Component" ), aQuickTest, "Core.ns.Something", new aConstructor(), 1 ],
		}
	);

	return simpleCheckComparisons;

}

/**
 * This helper function provides the basis for a constructor function,
 * which is used to test the "isPlainObject" simple check.
 *
 * @private
 * @returns {void}
 */
function aConstructor() {

}
