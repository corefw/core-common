/**
 * @file
 * Defines tests for the Core.asset.ioc.Container class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

const TEST_VALUES = {
	RESOLUTION_VALUE_ONE : "resolved-one",
	RESOLUTION_VALUE_TWO : "resolved-two"
};

describe( "Core.asset.ioc.Container", function() {

	let ioc;
	beforeEach( function() {

		// Create a new IoC container before each test..
		ioc = Core.inst( "Core.asset.ioc.Container", { } );

		// .. and register a few, simple, items to test against.
		ioc.singleton( "one", function() {
			return TEST_VALUES.RESOLUTION_VALUE_ONE;
		} );
		ioc.singleton( "two", function() {
			return TEST_VALUES.RESOLUTION_VALUE_TWO;
		} );
		ioc.prop( "aStaticValue", TEST_VALUES.RESOLUTION_VALUE_ONE );

	} );

	describe( "#singleton()", function() {

		it( "should register singleton factory functions", function() {

			expect( ioc.store.one ).to.be.a( "function" );

		} );

		it( "should register singleton factories that can be identified as factories", function() {

			expect( ioc.store.one.$isIocFactory ).to.equal( true );

		} );

		describe( "-> factoryWrapper()", function() {

			it( "should update the store with resolved values (i.e. only executed once)", function() {

				// Preliminary/Control Check:
				// Ensure that the current value in the store is a function..
				expect( ioc.store.one ).to.be.a( "function" );

				// Resolve the value
				let res = ioc.resolve( "one" );

				// Test the value..
				expect( res ).to.equal( TEST_VALUES.RESOLUTION_VALUE_ONE );

				// Now ensure that the store was updated with the resolved value, replacing the factory..
				expect( ioc.store.one ).to.be.a( "string" );
				expect( ioc.store.one ).to.equal( TEST_VALUES.RESOLUTION_VALUE_ONE );


			} );


		} );

	} );

	describe( "#resolve()", function() {

		it( "should return resolved values", function() {

			// Resolve one of our singletons
			let res = ioc.resolve( "one" );

			// It should be a resolved value and NOT a factory..
			expect( res ).to.be.a( "string" );
			expect( res ).to.equal( TEST_VALUES.RESOLUTION_VALUE_ONE );

		} );

	} );

	describe( "#resolveMany", function() {

		describe( "( <Array> )", function() {

			it( "should return the expected values as Map", function() {

				// Create the array of values we're looking for..
				let resolutionNames = [ "one", "two" ];

				// Execute
				let result = ioc.resolveMany( resolutionNames );

				// Test..
				expect( result              ).to.be.a( "map" );
				expect( result.has( "one" ) ).to.equal( true );
				expect( result.has( "two" ) ).to.equal( true );
				expect( result.get( "one" ) ).to.equal( TEST_VALUES.RESOLUTION_VALUE_ONE );
				expect( result.get( "two" ) ).to.equal( TEST_VALUES.RESOLUTION_VALUE_TWO );

			} );

			it( "should NOT return any values that are not present in the store", function() {

				// Create the array of values we're looking for..
				let resolutionNames = [ "one", "bad" ];

				// Execute
				let result = ioc.resolveMany( resolutionNames );

				// Test..
				expect( result.has( "one" ) ).to.equal( true  );
				expect( result.has( "bad" ) ).to.equal( false );

			} );

			it( "should NOT return any values that were not requested", function() {

				// Create the array of values we're looking for..
				let resolutionNames = [ "two" ];

				// Execute
				let result = ioc.resolveMany( resolutionNames );

				// Test..
				expect( result.has( "one" ) ).to.equal( false  );

			} );

		} );

		describe( "( <Set> )", function() {

			it( "should return the expected values as a Map", function() {

				// Create the array of values we're looking for..
				let resolutionNames = new Set( [ "one", "two" ] );

				// Execute
				let result = ioc.resolveMany( resolutionNames );

				// Test..
				expect( result              ).to.be.a( "map" );
				expect( result.has( "one" ) ).to.equal( true );
				expect( result.has( "two" ) ).to.equal( true );
				expect( result.get( "one" ) ).to.equal( TEST_VALUES.RESOLUTION_VALUE_ONE );
				expect( result.get( "two" ) ).to.equal( TEST_VALUES.RESOLUTION_VALUE_TWO );

			} );

			it( "should NOT return any values that are not present in the store", function() {

				// Create the array of values we're looking for..
				let resolutionNames = new Set( [ "one", "bad" ] );

				// Execute
				let result = ioc.resolveMany( resolutionNames );

				// Test..
				expect( result.has( "one" ) ).to.equal( true  );
				expect( result.has( "bad" ) ).to.equal( false );

			} );

			it( "should NOT return any values that were not requested", function() {

				// Create the array of values we're looking for..
				let resolutionNames = new Set( [ "two" ] );

				// Execute
				let result = ioc.resolveMany( resolutionNames );

				// Test..
				expect( result.has( "one" ) ).to.equal( false  );

			} );

		} );

		describe( "( <Object> )", function() {

			it( "should return the expected values as a Map", function() {

				// Create the array of values we're looking for..
				let resolutionNames = { one: "the value can be anything", two: "can also can be anything" };

				// Execute
				let result = ioc.resolveMany( resolutionNames );

				// Test..
				expect( result              ).to.be.a( "map" );
				expect( result.has( "one" ) ).to.equal( true );
				expect( result.has( "two" ) ).to.equal( true );
				expect( result.get( "one" ) ).to.equal( TEST_VALUES.RESOLUTION_VALUE_ONE );
				expect( result.get( "two" ) ).to.equal( TEST_VALUES.RESOLUTION_VALUE_TWO );

			} );

			it( "should NOT return any values that are not present in the store", function() {

				// Create the array of values we're looking for..
				let resolutionNames = { one: "the value can be anything", bad: "should not be found" };

				// Execute
				let result = ioc.resolveMany( resolutionNames );

				// Test..
				expect( result.has( "one" ) ).to.equal( true  );
				expect( result.has( "bad" ) ).to.equal( false );

			} );

			it( "should NOT return any values that were not requested", function() {

				// Create the array of values we're looking for..
				let resolutionNames = { two: "can also can be anything" };

				// Execute
				let result = ioc.resolveMany( resolutionNames );

				// Test..
				expect( result.has( "one" ) ).to.equal( false  );

			} );

		} );

	} );

	describe( "#has()", function() {

		it( "return TRUE when given the name of an existing container item", function() {

			expect( ioc.has( "one" ) ).to.equal( true );
			expect( ioc.has( "two" ) ).to.equal( true );

		} );

		it( "return FALSE when given the name of a non-existing container item", function() {

			expect( ioc.has( "notThere" ) 		).to.equal( false );
			expect( ioc.has( "alsoNotThere" ) 	).to.equal( false );

		} );

	} );

	describe( "#prop()", function() {

		it( "should create static values in the container store", function() {

			expect( ioc.store.aStaticValue        ).to.be.a( "string" );
			expect( ioc.store.aStaticValue        ).to.equal( TEST_VALUES.RESOLUTION_VALUE_ONE );
			expect( ioc.resolve( "aStaticValue" ) ).to.equal( TEST_VALUES.RESOLUTION_VALUE_ONE );

		} );

	} );


} );
