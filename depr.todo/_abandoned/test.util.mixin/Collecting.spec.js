/**
 * @file
 * Defines tests for the Core.util.mixin.Collecting mixin.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/* eslint func-style: "off", require-jsdoc: "off" */
const TEST_COLLECTION_NAME_A = "hello";
const TEST_COLLECTION_NAME_B = "world";

// Alias a few errors that we'll be checking for...
//const PropertyValidationError   = Core.cls( "Core.error.PropertyValidationError"   );

describe.skip( "Core.util.mixin.Collecting", function () {

	describe( "#hasCollection()", function () {

		it( "should return TRUE for collections that have been initialized", function () {

			// We have a fixture for this...
			let fixture = Core.inst( "Test.fixture.util.mixin.collecting.TestClassOne" );

			// Init a collection
			fixture._initCollection( TEST_COLLECTION_NAME_A );

			// Check for the collection
			let res = fixture.hasCollection( TEST_COLLECTION_NAME_A );

			// Assert
			expect( res ).to.equal( true );

		} );

		it( "should return FALSE for collections that have not been initialized", function () {

			// We have a fixture for this...
			let fixture = Core.inst( "Test.fixture.util.mixin.collecting.TestClassOne" );

			// Check for the collection
			let res = fixture.hasCollection( TEST_COLLECTION_NAME_B );

			// Assert
			expect( res ).to.equal( false );

		} );

	} );

	describe( "#deleteCollection()", function () {

		it( "should work as expected", function () {

			// We have a fixture for this...
			let fixture = Core.inst( "Test.fixture.util.mixin.collecting.TestClassOne" );

			// Init a collection
			fixture._initCollection( TEST_COLLECTION_NAME_A );

			// Sanity Check
			expect( fixture.hasCollection( TEST_COLLECTION_NAME_A ) ).to.equal( true );

			// Delete
			fixture.deleteCollection( TEST_COLLECTION_NAME_A );

			// Assert
			expect( fixture.hasCollection( TEST_COLLECTION_NAME_A ) ).to.equal( false );

		} );

	} );

	describe( "#addValueToCollection", function () {

		describe( "( <String> )", function () {

			it( "should add a new value to a collection", function () {

				// We have a fixture for this...
				let fixture = Core.inst( "Test.fixture.util.mixin.collecting.TestClassOne" );

				// Add the value
				fixture.addValueToCollection( TEST_COLLECTION_NAME_A, "hi" );

				// Fetch all colllection values as an array
				let res = fixture.getCollectionValues( TEST_COLLECTION_NAME_A );

				// Assert
				expect( res[ 0 ] ).to.equal( "hi" );

			} );

		} );


		describe( "( <Array> )", function () {

			it( "should add all values within the array to the collection", function () {

				// We have a fixture for this...
				let fixture = Core.inst( "Test.fixture.util.mixin.collecting.TestClassOne" );

				// Add the array
				fixture.addValueToCollection( TEST_COLLECTION_NAME_A, [ "a", "b" ] );

				// Fetch all colllection values as an array
				let res = fixture.getCollectionValues( TEST_COLLECTION_NAME_A );

				// Assert
				expect( res[ 0 ] ).to.equal( "a" );
				expect( res[ 1 ] ).to.equal( "b" );

			} );

		} );


		describe( "( <Set> )", function () {

			it( "should add all values within the array to the collection", function () {

				// We have a fixture for this...
				let fixture = Core.inst( "Test.fixture.util.mixin.collecting.TestClassOne" );

				// Create a set for testing
				let s = new Set( [ "a", "b" ] );

				// Add the set
				fixture.addValueToCollection( TEST_COLLECTION_NAME_A, s );

				// Fetch all colllection values as an array
				let res = fixture.getCollectionValues( TEST_COLLECTION_NAME_A );

				// Assert
				expect( res[ 0 ] ).to.equal( "a" );
				expect( res[ 1 ] ).to.equal( "b" );

			} );

		} );

	} );

	describe( "#addValueToCollection", function () {

		describe( "( <String> )", function () {

			it( "should add a new value to a collection", function () {

				// We have a fixture for this...
				let fixture = Core.inst( "Test.fixture.util.mixin.collecting.TestClassOne" );

				// Add the value
				fixture.addValueToCollection( TEST_COLLECTION_NAME_A, "hi" );

				// Fetch all colllection values as an array
				let res = fixture.getCollectionValues( TEST_COLLECTION_NAME_A );

				// Assert
				expect( res[ 0 ] ).to.equal( "hi" );

			} );

		} );


		describe( "( <Array> )", function () {

			it( "should add all values within the array to the collection", function () {

				// We have a fixture for this...
				let fixture = Core.inst( "Test.fixture.util.mixin.collecting.TestClassOne" );

				// Add the array
				fixture.addValueToCollection( TEST_COLLECTION_NAME_A, [ "a", "b" ] );

				// Fetch all colllection values as an array
				let res = fixture.getCollectionValues( TEST_COLLECTION_NAME_A );

				// Assert
				expect( res[ 0 ] ).to.equal( "a" );
				expect( res[ 1 ] ).to.equal( "b" );

			} );

		} );


		describe( "( <Set> )", function () {

			it( "should add all values within the array to the collection", function () {

				// We have a fixture for this...
				let fixture = Core.inst( "Test.fixture.util.mixin.collecting.TestClassOne" );

				// Create a set for testing
				let s = new Set( [ "a", "b" ] );

				// Add the set
				fixture.addValueToCollection( TEST_COLLECTION_NAME_A, s );

				// Fetch all colllection values as an array
				let res = fixture.getCollectionValues( TEST_COLLECTION_NAME_A );

				// Assert
				expect( res[ 0 ] ).to.equal( "a" );
				expect( res[ 1 ] ).to.equal( "b" );

			} );

		} );

	} );

} );
