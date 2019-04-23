/**
 * @file
 * Defines tests for the Core.type.check.Collection class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/* eslint func-style: "off", require-jsdoc: "off" */

describe( "Core.type.check.Collection", function () {

	describe( "#_loadBuiltInChecks()", function () {

		it( "should run automatically by default", function () {

			// Create a collection
			let collection = Core.inst( "Core.type.check.Collection" );

			// Ensure that _loadBuiltInChecks ran by checking
			// for one of our known built-in check classes.
			expect( collection.store.has( "isset" ) ).to.equal( true );

		} );

		it( "should NOT run automatically if autoLoadBuiltInChecks=false", function () {

			// Create a collection
			let collection = Core.inst( "Core.type.check.Collection", {
				autoLoadBuiltInChecks: false
			} );

			// Ensure that _loadBuiltInChecks ran by checking
			// for one of our known built-in check classes.
			expect( collection.store.has( "isset" ) ).to.equal( false );

		} );

	} );

	describe( ".descriptiveChecks", function () {

		let collection;

		before( function () {

			// Create a collection
			collection = Core.inst( "Core.type.check.Collection" );

		} );


		it( "should be a Map Object containing all checks that have `.descriptive=true`", function () {

			expect( collection.descriptiveChecks.has( "iscoreclass" ) ).to.equal( true );

		} );

		it( "should NOT contain any checks that have `.descriptive=false`", function () {

			expect( collection.descriptiveChecks.has( "isfinite" ) ).to.equal( false );

		} );

	} );

	describe( "#getFirstDescriptiveMatch()", function () {

		let collection;

		before( function () {

			// Create a collection
			collection = Core.inst( "Core.type.check.Collection" );

		} );


		it( "should behave as expected", function () {

			// Ensure that the method returns the expected 'first descriptive match'
			let result = collection.getFirstDescriptiveMatch( "Core.some.class.Name" );

			// Asset
			expect( result.checkName ).to.equal( "isCoreClassName" );

		} );

	} );

} );
