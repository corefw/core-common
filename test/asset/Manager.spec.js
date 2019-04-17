/**
 * @file
 * Defines tests for the Core.asset.Manager class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

const PATH = require( "path" );

describe( "Core.asset.Manager", function() {

	afterEach( function() {

		// Clean up the 'Testing' namespaces..
		Core.assetManager.removeMatchingNsPrefixes( /Testing\./ );

	} );

	describe( "(Namespace Management)", function() {

		describe( "#_resolveClassPath()", function() {

			it( "should properly resolve class paths", function() {

				// Establish our expectations.
				let expected = PATH.join( __dirname, "/fake/Something.js" );

				// Register a temporary namespace
				Core.assetManager.registerNamespace(
					"Testing.path.resolution.",
					[ __dirname, "fake" ]
				);

				// Execute the resolver method
				let result = Core.assetManager._resolveClassPath( "Testing.path.resolution.Something" );

				// Assert
				expect( result ).to.equal( expected );

			} );

			it( "should give preference to more-specific namespaces", function() {

				// Establish our expectations.
				let expected = PATH.join( __dirname, "/specific/Something.js" );

				// Register a few temporary namespace, with varying
				// levels of specificity.
				Core.assetManager.registerNamespace(
					"Testing.specificity.a",
					[ __dirname, "moderatelySpecific" ]
				);
				Core.assetManager.registerNamespace(
					"Testing.specificity.",
					[ __dirname, "inspecific" ]
				);
				Core.assetManager.registerNamespace(
					"Testing.specificity.a.b",
					[ __dirname, "specific" ]
				);

				// Execute the resolver method
				let result = Core.assetManager._resolveClassPath( "Testing.specificity.a.b.Something" );

				// Assert
				expect( result ).to.equal( expected );

			} );

		} );

		describe( "#registerNamespace()", function() {

			it( "should not create duplicates", function() {

				// Count the number of namespace registrations before we start.
				let startCount = getNsCount();

				// Register a temporary namespace
				Core.assetManager.registerNamespace(
					"Testing.ns.duplicates.",
					[ __dirname, "fake" ]
				);

				// This preliminary check just ensures that the number
				// increments after each registration..
				let secondCount = getNsCount();
				expect( secondCount ).to.equal( ( startCount + 1 ) );

				// Register the same namespace, again..
				Core.assetManager.registerNamespace(
					"Testing.ns.duplicates.",
					[ __dirname, "fake" ]
				);

				// This time, it should not have increased..
				let finalCount = getNsCount();
				expect( finalCount, "The namespace count should not have increased after registering a duplicate namespace prefix!" ).to.equal( secondCount );

			} );

			it( "should overwrite existing values", function() {

				// Establish our expectations.
				let firstExpectation  = PATH.join( __dirname, "/first/Check.js" );
				let secondExpectation = PATH.join( __dirname, "/second/Check.js" );

				// Register a temporary namespace
				Core.assetManager.registerNamespace(
					"Testing.ns.overwrite.",
					[ __dirname, "first" ]
				);

				// Execute the resolver method
				let firstResult = Core.assetManager._resolveClassPath( "Testing.ns.overwrite.Check" );

				// This preliminary check just ensures that we're able to
				// predict the resolution path. This should always pass
				// because basic resolution is covered by an earlier test.
				expect( firstResult, "Our preliminary resolution test failed!" ).to.equal( firstExpectation );

				// Ok, now we'll overwrite..
				Core.assetManager.registerNamespace(
					"Testing.ns.overwrite.",
					[ __dirname, "second" ]
				);

				// Execute the resolver method
				let secondResult = Core.assetManager._resolveClassPath( "Testing.ns.overwrite.Check" );

				// Now we can do the real test; our initial NS settings should have been overwritten...
				expect( secondResult, "Adding the same namespace prefix a second time should have overwrote the original settings!" ).to.equal( secondExpectation );

			} );

		} );

		describe( "#removeExactNsPrefix()", function() {

			beforeEach( function() {

				// Add two namespaces for testing
				Core.assetManager.registerNamespace(
					"Testing.remove.one.a",
					[ __dirname, "fake" ]
				);
				Core.assetManager.registerNamespace(
					"Testing.remove.one.b.",
					[ __dirname, "fake" ]
				);

			} );

			it( "should remove exactly one namespace", function() {

				// Define the string we'll use for matching..
				let str = "Testing.remove.one.b";

				// Get the current number of namespaces
				let startCount = getNsCount();

				// Execute
				Core.assetManager.removeExactNsPrefix( str );

				// Get the new count
				let finalCount = getNsCount();

				// One namespace should have been removed
				expect( finalCount ).to.equal( ( startCount - 1 ) );

			} );

			it( "should NOT remove partial matches", function() {

				// Define the string we'll use for matching..
				let str = "Testing.remove.one";

				// Get the current number of namespaces
				let startCount = getNsCount();

				// Execute
				Core.assetManager.removeExactNsPrefix( str );

				// Get the new count
				let finalCount = getNsCount();

				// Nothing should have been removed
				expect( finalCount ).to.equal( startCount );

			} );

			it( "should return TRUE when a namespace is removed", function() {

				// Define the string we'll use for matching..
				let str = "Testing.remove.one.b";

				// Execute
				let result = Core.assetManager.removeExactNsPrefix( str );

				// One namespace should have been removed
				expect( result ).to.equal( true );

			} );

			it( "should NOT remove partial matches", function() {

				// Define the string we'll use for matching..
				let str = "Testing.remove.one";

				// Execute
				let result = Core.assetManager.removeExactNsPrefix( str );

				// Nothing should have been removed
				expect( result ).to.equal( false );

			} );

			it( "should be case sensitive", function() {

				// Define the string we'll use for matching..
				let str = "testing.remove.one.b";

				// Get the current number of namespaces
				let startCount = getNsCount();

				// Execute
				Core.assetManager.removeExactNsPrefix( str );

				// Get the new count
				let finalCount = getNsCount();

				// Nothing should have been removed
				expect( finalCount ).to.equal( startCount );

			} );

		} );

		describe( "#removeMatchingNsPrefixes", function() {

			beforeEach( function() {

				// Add three namespaces for testing
				Core.assetManager.registerNamespace(
					"Testing.remove.many.a",
					[ __dirname, "fake" ]
				);
				Core.assetManager.registerNamespace(
					"Testing.remove.matching.b",
					[ __dirname, "fake" ]
				);
				Core.assetManager.registerNamespace(
					"Testing.delete.some.c",
					[ __dirname, "fake" ]
				);

			} );

			describe( "( <string> )", function() {

				it( "should remove namespaces that start with the given string", function() {

					// Define the string we'll use for matching..
					// (It should match two of the namespaces)
					let str = "Testing.remove";

					// Get the current number of namespaces
					let startCount = getNsCount();

					// Execute
					Core.assetManager.removeMatchingNsPrefixes( str );

					// Get the new count
					let finalCount = getNsCount();

					// Two namespaces should have been removed
					expect( finalCount ).to.be.below( startCount );

				} );

				it( "should NOT remove namespaces that do NOT start with the given string", function() {

					// Define the string we'll use for matching..
					// (It should not match any of the namespaces)
					let str = "Do.not.match";

					// Get the current number of namespaces
					let startCount = getNsCount();

					// Execute
					Core.assetManager.removeMatchingNsPrefixes( str );

					// Get the new count
					let finalCount = getNsCount();

					// Nothing should have been removed
					expect( finalCount ).to.equal( startCount );

				} );

				it( "should NOT remove namespaces that match the string in places other than the start", function() {

					// Define the string we'll use for matching..
					// (It should not match any of the namespaces)
					let str = "remove.";

					// Get the current number of namespaces
					let startCount = getNsCount();

					// Execute
					Core.assetManager.removeMatchingNsPrefixes( str );

					// Get the new count
					let finalCount = getNsCount();

					// Nothing should have been removed
					expect( finalCount ).to.equal( startCount );

				} );

				it( "should return TRUE when one or more namespaces are removed", function() {

					// Define the string we'll use for matching..
					// (It should match two of the namespaces)
					let str = "Testing.remove";

					// Execute
					let result = Core.assetManager.removeMatchingNsPrefixes( str );

					// Two namespaces should have been removed
					expect( result ).to.equal( true );

				} );

				it( "should return FALSE when nothing is removed", function() {

					// Define the string we'll use for matching..
					// (It should not match any of the namespaces)
					let str = "Do.not.match";

					// Execute
					let result = Core.assetManager.removeMatchingNsPrefixes( str );

					// Nothing should have been removed
					expect( result ).to.equal( false );

				} );


				it( "should be case sensitive", function() {

					// Define the string we'll use for matching..
					// (It should not match any of the namespaces)
					let str = "testing.remove";

					// Get the current number of namespaces
					let startCount = getNsCount();

					// Execute
					Core.assetManager.removeMatchingNsPrefixes( str );

					// Get the new count
					let finalCount = getNsCount();

					// Nothing should have been removed
					expect( finalCount ).to.equal( startCount );

				} );

			} );

			describe( "( <RegExp> )", function() {

				it( "should remove namespaces that match the regex", function() {

					// Define the regex we'll use for matching..
					// (It should match two of the namespaces)
					let regx = /\.remove\./;

					// Get the current number of namespaces
					let startCount = getNsCount();

					// Execute
					Core.assetManager.removeMatchingNsPrefixes( regx );

					// Get the new count
					let finalCount = getNsCount();

					// Two namespaces should have been removed
					expect( finalCount ).to.be.below( startCount );

				} );

				it( "should NOT remove namespaces that do not match the regex", function() {

					// Define the regex we'll use for matching..
					// (It should not match any of the namespaces)
					let regx = /\.dontmatchanything\./;

					// Get the current number of namespaces
					let startCount = getNsCount();

					// Execute
					Core.assetManager.removeMatchingNsPrefixes( regx );

					// Get the new count
					let finalCount = getNsCount();

					// Two namespaces should have been removed
					expect( finalCount ).to.equal( startCount );

				} );

				it( "should return TRUE when one or more namespaces are removed", function() {

					// Define the regex we'll use for matching..
					// (It should match two of the namespaces)
					let regx = /\.remove\./;

					// Execute
					let result = Core.assetManager.removeMatchingNsPrefixes( regx );

					// Two namespaces should have been removed
					expect( result ).to.equal( true );

				} );

				it( "should return FALSE when nothing is removed", function() {

					// Define the regex we'll use for matching..
					// (It should not match any of the namespaces)
					let regx = /\.dontmatchanything\./;

					// Execute
					let result = Core.assetManager.removeMatchingNsPrefixes( regx );

					// Two namespaces should have been removed
					expect( result ).to.equal( false );

				} );

			} );

			describe( "( <InvalidType> )", function() {

				it( "should throw an error", function() {

					expect( function() {

						// Execute
						Core.assetManager.removeMatchingNsPrefixes( true );

					} ).to.throw( Error );

				} );

			} );

		} );

	} );


} );

/**
 * A simple helper function that returns the number of namespaces
 * in the Asset Manager's namespace store.
 *
 * @private
 * @returns {Number} The number of namespaces in the store.
 */
function getNsCount() {
	return Core.assetManager._namespaces.length;
}
