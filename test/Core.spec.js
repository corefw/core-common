/**
 * @file
 * Defines tests for the root Core class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/* eslint no-console: "off", require-jsdoc: "off", func-style: "off", no-extra-bind: "off", no-unused-vars: "off", no-undef: "off", space-in-parens: "off" */

describe( "Core", function () {

	describe( "(Singleton Alias Methods)", function () {

		describe( "#classExists()", function() {

			it( "should return TRUE when a class definition can be found", function() {

				expect( Core.classExists( "Core.abstract.Component" ) ).to.equal( true );
				expect( Core.classExists( "Core.asset.Manager"      ) ).to.equal( true );

			} );

			it( "should return FALSE when a class definition cannot be found", function() {

				expect( Core.classExists( "Core.class.Missing"      ) ).to.equal( false );

			} );

		} );

	} );

} );
