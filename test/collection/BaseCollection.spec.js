/**
 * @file
 * Defines tests for the Core.collection.BaseCollection class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/* eslint no-console: "off", require-jsdoc: "off", func-style: "off", no-extra-bind: "off", no-unused-vars: "off", no-undef: "off", space-in-parens: "off" */

// Convenience references for errors.
const ValidationError = Core.error.ValidationError;

describe( "Core.collection.BaseCollection", function () {

	describe( "#$construct()", function () {

		it( "should persist the `validationConfig` dependency, when provided", function () {

			function initCollection() {

				let col = Core.inst( "Core.collection.BaseCollection", {
					validationConfig: {
						a: 1,
					},
				} );

				return col.validationConfig;

			}

			// The initialization config above SHOULD NOT throw an error.
			expect( initCollection ).to.not.throw( ValidationError );

			// .. and the validation config should be persisted verbatim
			let res = initCollection();
			expect( res ).to.be.an( "object" );
			expect( res.a ).to.not.be.an( "undefined" );
			expect( res.a ).to.equal( 1 );

		} );

		it( "should accept a NULL value for the `validationConfig` dependency", function () {

			function initCollection() {

				let col = Core.inst( "Core.collection.BaseCollection", {
					validationConfig: null,
				} );

				return col.validationConfig;

			}

			// The initialization config above SHOULD NOT throw an error.
			expect( initCollection ).to.not.throw( ValidationError );

			// .. and the validation config should be persisted verbatim
			let res = initCollection();
			expect( res ).to.equal( null );

		} );

		it( "should only accept a plain object or NULL for the `validationConfig` dependency", function () {

			function initCollection() {

				let col = Core.inst( "Core.collection.BaseCollection", {
					validationConfig: [],
				} );

			}

			// The initialization config above SHOULD throw an error.
			expect( initCollection ).to.throw( ValidationError );

		} );

		it( "should persist any items/values passed as `initialValues`", function () {

			// Create a collection
			let col = Core.inst( "Core.collection.BaseCollection", {
				initialValues: [ 1, 2, 3 ]
			} );

			// Ensure the initial values made it
			expect( col.size ).to.equal( 3 );

		} );

	} );

	describe( ".validationConfig", function () {

		describe( "<get>", function () {

			it( "should return an object when a validationConfig is set", function () {

				let col = Core.inst( "Core.collection.BaseCollection", {
					validationConfig: {
						a: 1,
					},
				} );

				expect( col.validationConfig ).to.be.an( "object" );

			} );

			it( "should return NULL when a validationConfig is NOT set", function () {

				let col = Core.inst( "Core.collection.BaseCollection" );

				expect( col.validationConfig ).to.equal( null );

			} );

		} );

		describe( "<set>", function () {

			it( "should accept and store valid validation config objects", function () {

				// Create a collection
				let col = Core.inst( "Core.collection.BaseCollection" );

				// Sanity Check
				expect( col.validationConfig ).to.equal( null );

				// Set the validation config
				col.validationConfig = { a: 1 };

				// Assert
				expect( col.validationConfig ).to.be.an( "object" );
				expect( col.validationConfig.a ).to.equal( 1 );

			} );

			it( "should accept a NULL value", function () {

				// Create a collection
				let col = Core.inst( "Core.collection.BaseCollection" );

				// Sanity Check
				expect( col.validationConfig ).to.equal( null );

				// Set the validation config
				col.validationConfig = null;

				// Assert
				expect( col.validationConfig ).to.equal( null );

			} );

			it( "should throw an Error when an invalid validationConfig is passed", function () {

				function testCollection() {

					// Create a collection
					let col = Core.inst( "Core.collection.BaseCollection" );

					// Sanity Check
					expect( col.validationConfig ).to.equal( null );

					// Set the validation config
					col.validationConfig = true;

				}

				// Assert
				expect( testCollection ).to.throw( ValidationError );

			} );

		} );

	} );

	describe( "#clearValidationConfig()", function () {

		it( "should clear the existing validationConfig", function () {

			// Create a collection
			let col = Core.inst( "Core.collection.BaseCollection", {
				validationConfig: {
					a: 1,
				},
			} );

			// Sanity Check
			expect( col.validationConfig ).to.be.an( "object" );

			// Clear the config
			col.clearValidationConfig();

			// Assert
			expect( col.validationConfig ).to.equal( null );

		} );

	} );

	describe( ".hasValidationConfig", function () {

		it( "should return TRUE if the collection has a validationConfig", function () {

			// Create a collection
			let col = Core.inst( "Core.collection.BaseCollection", {
				validationConfig: {
					a: 1,
				},
			} );

			// Assert
			expect( col.hasValidationConfig ).to.equal( true );

		} );

		it( "should return FALSE if the collection does NOT have a validationConfig", function () {

			// Create a collection
			let col = Core.inst( "Core.collection.BaseCollection" );

			// Assert
			expect( col.hasValidationConfig ).to.equal( false );

		} );

	} );

	describe( ".size", function () {

		it( "should accurately reflect the current size of the collection", function () {

			// Create a collection
			let col = Core.inst( "Core.collection.BaseCollection" );

			// Manually inject a few values
			col._store.add( 1 );
			col._store.add( 2 );
			col._store.add( 3 );

			// Assert
			expect( col.size ).to.equal( 3 );

		} );

	} );

	describe( ".length", function () {

		it( "should accurately reflect the current size of the collection", function () {

			// Create a collection
			let col = Core.inst( "Core.collection.BaseCollection" );

			// Manually inject a few values
			col._store.add( 1 );
			col._store.add( 2 );
			col._store.add( 3 );

			// Assert
			expect( col.length ).to.equal( 3 );

		} );

	} );

	describe( ".count", function () {

		it( "should accurately reflect the current size of the collection", function () {

			// Create a collection
			let col = Core.inst( "Core.collection.BaseCollection" );

			// Manually inject a few values
			col._store.add( 1 );
			col._store.add( 2 );
			col._store.add( 3 );

			// Assert
			expect( col.count ).to.equal( 3 );

		} );

	} );

	describe( "#add", function () {

		describe( "( <item> )", function () {

			it( "should always accept a single item when no validationConfig exists", function () {

				// Create a collection
				let col = Core.inst( "Core.collection.BaseCollection" );

				// Sanity Check
				expect( col.size ).to.equal( 0 );

				// Add an item
				col.add( 1 );

				// Ensure the item was added
				expect( col.size ).to.equal( 1 );

			} );

			it( "should throw an Error if the item fails validation", function () {

				function testCollection() {

					// Create a collection
					let col = Core.inst( "Core.collection.BaseCollection", {
						validationConfig: {
							isBoolean: true,
						},
					} );

					// Add an item
					col.add( 1 );

				}

				// Assert
				expect( testCollection ).to.throw( ValidationError );

			} );

			it( "should NOT throw an Error if the item passes validation", function () {

				function testCollection() {

					// Create a collection
					let col = Core.inst( "Core.collection.BaseCollection", {
						validationConfig: {
							isBoolean: true,
						},
					} );

					// Add an item
					col.add( true );

				}

				// Assert
				expect( testCollection ).to.not.throw( ValidationError );

			} );

		} );

		describe( "( <array> )", function () {

			it( "should always add all provided values when no validationConfig exists", function () {

				// Create a collection
				let col = Core.inst( "Core.collection.BaseCollection" );

				// Sanity Check
				expect( col.size ).to.equal( 0 );

				// Add the items
				col.add( [ 1, 2 ] );

				// Ensure the item was added
				expect( col.size ).to.equal( 2 );

			} );

			it( "should throw an Error if any item fails validation", function () {

				function testCollection() {

					// Create a collection
					let col = Core.inst( "Core.collection.BaseCollection", {
						validationConfig: {
							isBoolean: true,
						},
					} );

					// Add the items
					col.add( [ true, 1 ] );

				}

				// Assert
				expect( testCollection ).to.throw( ValidationError );

			} );

			it( "should NOT throw an Error if all of the items passes validation", function () {

				function testCollection() {

					// Create a collection
					let col = Core.inst( "Core.collection.BaseCollection", {
						validationConfig: {
							isBoolean: true,
						},
					} );

					// Add the items
					col.add( [ true, false ] );

				}

				// Assert
				expect( testCollection ).to.not.throw( ValidationError );

			} );

		} );

		describe( "( <set> )", function () {

			it( "should always add all provided values when no validationConfig exists", function () {

				// Create a collection
				let col = Core.inst( "Core.collection.BaseCollection" );

				// Sanity Check
				expect( col.size ).to.equal( 0 );

				// Create the set to be added
				let items = new Set( [ 1, 2 ] );

				// Add the items
				col.add( items );

				// Ensure the item was added
				expect( col.size ).to.equal( 2 );

			} );

			it( "should throw an Error if any item fails validation", function () {

				function testCollection() {

					// Create a collection
					let col = Core.inst( "Core.collection.BaseCollection", {
						validationConfig: {
							isBoolean: true,
						},
					} );

					// Create the set to be added
					let items = new Set( [ true, 1 ] );

					// Add the items
					col.add( items );

				}

				// Assert
				expect( testCollection ).to.throw( ValidationError );

			} );

			it( "should NOT throw an Error if all of the items passes validation", function () {

				function testCollection() {

					// Create a collection
					let col = Core.inst( "Core.collection.BaseCollection", {
						validationConfig: {
							isBoolean: true,
						},
					} );

					// Create the set to be added
					let items = new Set( [ true, false ] );

					// Add the items
					col.add( items );

				}

				// Assert
				expect( testCollection ).to.not.throw( ValidationError );

			} );

		} );

		describe( "( <Core.collection.BaseCollection> )", function () {

			it( "should always add all provided values when no validationConfig exists", function () {

				// Create a source collection
				let source = Core.inst( "Core.collection.BaseCollection", {
					initialValues: [ 1, 2, 3 ]
				} );

				// Create a target collection
				let target = Core.inst( "Core.collection.BaseCollection" );

				// Sanity Check
				expect( target.size ).to.equal( 0 );

				// Add the source collection
				target.add( source );

				// Ensure the item was added
				expect( target.size ).to.equal( 3 );

			} );

			it( "should throw an Error if any item fails validation", function () {

				function testCollection() {

					// Create a source collection
					let source = Core.inst( "Core.collection.BaseCollection", {
						initialValues: [ true, false, 1 ]
					} );

					// Create a target collection
					let target = Core.inst( "Core.collection.BaseCollection", {
						validationConfig: {
							isBoolean: true,
						},
					} );

					// Add the source collection
					target.add( source );

				}

				// Assert
				expect( testCollection ).to.throw( ValidationError );

			} );

			it( "should NOT throw an Error if all of the items passes validation", function () {

				function testCollection() {

					// Create a source collection
					let source = Core.inst( "Core.collection.BaseCollection", {
						initialValues: [ true, false, true ]
					} );

					// Create a target collection
					let target = Core.inst( "Core.collection.BaseCollection", {
						validationConfig: {
							isBoolean: true,
						},
					} );

					// Add the source collection
					target.add( source );

				}

				// Assert
				expect( testCollection ).to.not.throw( ValidationError );

			} );

		} );

	} );

	describe( "#setValues", function () {

		describe( "()", function () {

			it( "should clear existing values", function () {

				// Create a collection
				let col = Core.inst( "Core.collection.BaseCollection", {
					initialValues: [ "a", "b", "c" ]
				} );

				// Sanity Check
				expect( col.size ).to.equal( 3 );

				// Overwrite values
				col.setValues();

				// Ensure the values were cleared
				expect( col.size ).to.equal( 0 );
				expect( col.has( "a" ) ).to.equal( false );
				expect( col.has( "b" ) ).to.equal( false );
				expect( col.has( "c" ) ).to.equal( false );

			} );

		} );

		describe( "( <NULL> )", function () {

			it( "should clear existing values", function () {

				// Create a collection
				let col = Core.inst( "Core.collection.BaseCollection", {
					initialValues: [ "a", "b", "c" ]
				} );

				// Sanity Check
				expect( col.size ).to.equal( 3 );

				// Overwrite values
				col.setValues( null );

				// Ensure the values were cleared
				expect( col.size ).to.equal( 0 );
				expect( col.has( "a" ) ).to.equal( false );
				expect( col.has( "b" ) ).to.equal( false );
				expect( col.has( "c" ) ).to.equal( false );

			} );

		} );

		describe( "( <array> )", function () {

			it( "should overwrite the existing values", function () {

				// Create a collection
				let col = Core.inst( "Core.collection.BaseCollection", {
					initialValues: [ "a", "b", "c" ]
				} );

				// Sanity Check
				expect( col.size ).to.equal( 3 );

				// Overwrite values
				col.setValues( [ 1, 2 ] );

				// Ensure the values were changed
				expect( col.size ).to.equal( 2 );
				expect( col.has( "a" ) ).to.equal( false );
				expect( col.has( "b" ) ).to.equal( false );
				expect( col.has( "c" ) ).to.equal( false );
				expect( col.has( 1   ) ).to.equal( true  );
				expect( col.has( 2   ) ).to.equal( true  );

			} );

		} );

	} );

	describe( "#toArray()", function () {

		it( "should return the values of the collection as an array", function () {

			// Create a collection
			let col = Core.inst( "Core.collection.BaseCollection", {
				initialValues: [ 2, 3, 1 ]
			} );

			// Re-capture Array
			let arr = col.toArray();

			// Assert
			expect( arr ).to.be.an( "array" );
			expect( arr[ 0 ] ).to.equal( 2 );
			expect( arr[ 1 ] ).to.equal( 3 );
			expect( arr[ 2 ] ).to.equal( 1 );

		} );

	} );

	describe( ".values", function () {

		describe( "<get>", function () {

			it( "should return the values of the collection as an array", function () {

				// Create a collection
				let col = Core.inst( "Core.collection.BaseCollection", {
					initialValues: [ 2, 3, 1 ]
				} );

				// Re-capture Array
				let arr = col.values;

				// Assert
				expect( arr ).to.be.an( "array" );
				expect( arr[ 0 ] ).to.equal( 2 );
				expect( arr[ 1 ] ).to.equal( 3 );
				expect( arr[ 2 ] ).to.equal( 1 );

			} );

		} );

		describe( "<set>", function () {

			describe( "= undefined", function () {

				it( "should clear existing values", function () {

					// Create a collection
					let col = Core.inst( "Core.collection.BaseCollection", {
						initialValues: [ "a", "b", "c" ]
					} );

					// Sanity Check
					expect( col.size ).to.equal( 3 );

					// Overwrite values
					col.values = undefined;

					// Ensure the values were cleared
					expect( col.size ).to.equal( 0 );
					expect( col.has( "a" ) ).to.equal( false );
					expect( col.has( "b" ) ).to.equal( false );
					expect( col.has( "c" ) ).to.equal( false );

				} );

			} );

			describe( "= null", function () {

				it( "should clear existing values", function () {

					// Create a collection
					let col = Core.inst( "Core.collection.BaseCollection", {
						initialValues: [ "a", "b", "c" ]
					} );

					// Sanity Check
					expect( col.size ).to.equal( 3 );

					// Overwrite values
					col.values = null;

					// Ensure the values were cleared
					expect( col.size ).to.equal( 0 );
					expect( col.has( "a" ) ).to.equal( false );
					expect( col.has( "b" ) ).to.equal( false );
					expect( col.has( "c" ) ).to.equal( false );

				} );

			} );

			describe( "= <array>", function () {

				it( "should overwrite the existing values", function () {

					// Create a collection
					let col = Core.inst( "Core.collection.BaseCollection", {
						initialValues: [ "a", "b", "c" ]
					} );

					// Sanity Check
					expect( col.size ).to.equal( 3 );

					// Overwrite values
					col.values = [ 1, 2 ];

					// Ensure the values were changed
					expect( col.size ).to.equal( 2 );
					expect( col.has( "a" ) ).to.equal( false );
					expect( col.has( "b" ) ).to.equal( false );
					expect( col.has( "c" ) ).to.equal( false );
					expect( col.has( 1   ) ).to.equal( true  );
					expect( col.has( 2   ) ).to.equal( true  );

				} );

			} );

		} );

	} );

	describe( "#toSet()", function () {

		it( "should return the values of the collection as a Set", function () {

			// Create a collection
			let col = Core.inst( "Core.collection.BaseCollection", {
				initialValues: [ 2, 3, 1 ]
			} );

			// Extract the Set
			let s = col.toSet();

			// Assert
			expect( s ).to.be.an( "set" );

			// Extract the iterator from the set
			let i = s.values();

			// Assert
			expect( i.next().value ).to.equal( 2 );
			expect( i.next().value ).to.equal( 3 );
			expect( i.next().value ).to.equal( 1 );

		} );

		it( "should NOT return a reference to the collection's internal store", function () {

			// Create a collection
			let col = Core.inst( "Core.collection.BaseCollection", {
				initialValues: [ 2, 3, 1 ]
			} );

			// Sanity Check
			expect( col.size ).to.equal( 3 );

			// Extract the Set
			let s = col.toSet();

			// Remove an item from the returned Set
			s.delete( 1 );

			// Ensure the collection did not change
			expect( col.size ).to.equal( 3 );

		} );

	} );

	describe( "#clear()", function () {

		it( "should clear the collection", function () {

			// Create a collection
			let col = Core.inst( "Core.collection.BaseCollection", {
				initialValues: [ 2, 3, 1 ]
			} );

			// Sanity Check
			expect( col.size ).to.equal( 3 );

			// Clear the set
			col.clear();

			// Ensure the collection was cleared
			expect( col.size ).to.equal( 0 );

		} );

	} );

	describe( "#remove()", function () {

		it( "should remove an item from the collection", function () {

			// Create a collection
			let col = Core.inst( "Core.collection.BaseCollection", {
				initialValues: [ 2, 3, 1 ]
			} );

			// Sanity Check
			expect( col.size ).to.equal( 3 );

			// Remove an item
			col.remove( 2 );

			// Ensure one item was removed
			expect( col.size ).to.equal( 2 );

		} );

		it( "should return TRUE if a value was removed", function () {

			// Create a collection
			let col = Core.inst( "Core.collection.BaseCollection", {
				initialValues: [ 2, 3, 1 ]
			} );

			// Sanity Check
			expect( col.size ).to.equal( 3 );

			// Remove an item
			let res = col.remove( 2 );

			// Assert
			expect( res ).to.equal( true );

		} );

		it( "should return FALSE if a value was NOT removed", function () {

			// Create a collection
			let col = Core.inst( "Core.collection.BaseCollection", {
				initialValues: [ 2, 3, 1 ]
			} );

			// Sanity Check
			expect( col.size ).to.equal( 3 );

			// Remove an item
			let res = col.remove( 4 );

			// Assert
			expect( res ).to.equal( false );

		} );


	} );

	describe( "#delete()", function () {

		it( "should remove an item from the collection", function () {

			// Create a collection
			let col = Core.inst( "Core.collection.BaseCollection", {
				initialValues: [ 2, 3, 1 ]
			} );

			// Sanity Check
			expect( col.size ).to.equal( 3 );

			// Remove an item
			col.delete( 2 );

			// Ensure one item was removed
			expect( col.size ).to.equal( 2 );

		} );

		it( "should return TRUE if a value was removed", function () {

			// Create a collection
			let col = Core.inst( "Core.collection.BaseCollection", {
				initialValues: [ 2, 3, 1 ]
			} );

			// Sanity Check
			expect( col.size ).to.equal( 3 );

			// Remove an item
			let res = col.delete( 2 );

			// Assert
			expect( res ).to.equal( true );

		} );

		it( "should return FALSE if a value was NOT removed", function () {

			// Create a collection
			let col = Core.inst( "Core.collection.BaseCollection", {
				initialValues: [ 2, 3, 1 ]
			} );

			// Sanity Check
			expect( col.size ).to.equal( 3 );

			// Remove an item
			let res = col.delete( 4 );

			// Assert
			expect( res ).to.equal( false );

		} );

	} );

	describe( "#has()", function () {

		it( "should return TRUE if the collection contains the target value", function () {

			// Create a collection
			let col = Core.inst( "Core.collection.BaseCollection", {
				initialValues: [ 2, 3, 1 ]
			} );

			// Capture result
			let res = col.has( 2 );

			// Ensure one item was removed
			expect( res ).to.equal( true );

		} );

		it( "should return FALSE if the collection DOES NOT contain the target value", function () {

			// Create a collection
			let col = Core.inst( "Core.collection.BaseCollection", {
				initialValues: [ 2, 3, 1 ]
			} );

			// Capture result
			let res = col.has( 4 );

			// Ensure one item was removed
			expect( res ).to.equal( false );

		} );

	} );

	describe( "#forEach()", function () {

		it( "should iterate over values as expected", function () {

			// Create a collection
			let col = Core.inst( "Core.collection.BaseCollection", {
				initialValues: [ 2, 3, 1 ]
			} );

			// Create a result container than can be tested
			let result = "";

			// Iterate
			col.forEach( function iterationTest( val, index, colRef ) {
				result += "" + val;
			} );

			// Assert
			expect( result ).to.equal( "231" );

		} );

		it( "should call the callback with a valid index", function () {

			// Create a collection
			let col = Core.inst( "Core.collection.BaseCollection", {
				initialValues: [ 2, 3, 1 ]
			} );

			// Create a result container than can be tested
			let result = "";

			// Iterate
			col.forEach( function iterationTest( val, index, colRef ) {
				result += "" + index;
			} );

			// Assert
			expect( result ).to.equal( "012" );

		} );

		it( "should call the callback with a valid collection reference", function () {

			// Create a collection
			let col = Core.inst( "Core.collection.BaseCollection", {
				initialValues: [ 2, 3, 1 ]
			} );

			// Create a result container than can be tested
			let result = "";

			// Iterate
			col.forEach( function iterationTest( val, index, colRef ) {

				// Assert
				expect( colRef ).to.equal( col );

			} );

		} );

		it( "should default `thisArg` to the collection", function () {

			// Create a collection
			let col = Core.inst( "Core.collection.BaseCollection", {
				initialValues: [ 2, 3, 1 ]
			} );

			// Create a result container than can be tested
			let result = "";

			// Iterate
			col.forEach( function iterationTest( val, index, colRef ) {

				// Assert
				expect( this ).to.equal( col );

			} );

		} );

		it( "should allow `this` to be overridden with an object", function () {

			// Create a collection
			let col = Core.inst( "Core.collection.BaseCollection", {
				initialValues: [ 2, 3, 1 ]
			} );

			// Create a result container than can be tested
			let result = "";

			// Iterate
			col.forEach( function iterationTest( val, index, colRef ) {

				// Assert
				expect( this.a ).to.equal( 1 );

			}, { a: 1 } );

		} );

		it( "should allow `this` to be overridden with NULL", function () {

			// Create a collection
			let col = Core.inst( "Core.collection.BaseCollection", {
				initialValues: [ 2, 3, 1 ]
			} );

			// Create a result container than can be tested
			let result = "";

			// Iterate
			col.forEach( function iterationTest( val, index, colRef ) {

				// Assert
				expect( this ).to.equal( null );

			}, null );

		} );

	} );

	describe( "#each()", function () {

		it( "should iterate over values as expected", function () {

			// Create a collection
			let col = Core.inst( "Core.collection.BaseCollection", {
				initialValues: [ 2, 3, 1 ]
			} );

			// Create a result container than can be tested
			let result = "";

			// Iterate
			col.each( function iterationTest( val, index, colRef ) {
				result += "" + val;
			} );

			// Assert
			expect( result ).to.equal( "231" );

		} );

		it( "should call the callback with a valid index", function () {

			// Create a collection
			let col = Core.inst( "Core.collection.BaseCollection", {
				initialValues: [ 2, 3, 1 ]
			} );

			// Create a result container than can be tested
			let result = "";

			// Iterate
			col.each( function iterationTest( val, index, colRef ) {
				result += "" + index;
			} );

			// Assert
			expect( result ).to.equal( "012" );

		} );

		it( "should call the callback with a valid collection reference", function () {

			// Create a collection
			let col = Core.inst( "Core.collection.BaseCollection", {
				initialValues: [ 2, 3, 1 ]
			} );

			// Create a result container than can be tested
			let result = "";

			// Iterate
			col.each( function iterationTest( val, index, colRef ) {

				// Assert
				expect( colRef ).to.equal( col );

			} );

		} );

		it( "should default `thisArg` to the collection", function () {

			// Create a collection
			let col = Core.inst( "Core.collection.BaseCollection", {
				initialValues: [ 2, 3, 1 ]
			} );

			// Create a result container than can be tested
			let result = "";

			// Iterate
			col.each( function iterationTest( val, index, colRef ) {

				// Assert
				expect( this ).to.equal( col );

			} );

		} );

		it( "should allow `this` to be overridden with an object", function () {

			// Create a collection
			let col = Core.inst( "Core.collection.BaseCollection", {
				initialValues: [ 2, 3, 1 ]
			} );

			// Create a result container than can be tested
			let result = "";

			// Iterate
			col.each( function iterationTest( val, index, colRef ) {

				// Assert
				expect( this.a ).to.equal( 1 );

			}, { a: 1 } );

		} );

		it( "should allow `this` to be overridden with NULL", function () {

			// Create a collection
			let col = Core.inst( "Core.collection.BaseCollection", {
				initialValues: [ 2, 3, 1 ]
			} );

			// Create a result container than can be tested
			let result = "";

			// Iterate
			col.each( function iterationTest( val, index, colRef ) {

				// Assert
				expect( this ).to.equal( null );

			}, null );

		} );

	} );

} );
