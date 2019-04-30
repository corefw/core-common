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

describe.skip( "Core.type.Inspector", function () {

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
































		} );

	} );

} );
