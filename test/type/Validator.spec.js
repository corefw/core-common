/**
 * @file
 * Defines tests for the Core.type.Validator class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

describe.only( "Core.type.Validator", function () {

	let someVar;

	before( function () {
		someVar = "something";
	} );

	describe( "#_someMethod", function () {

		describe( "( <string> )", function () {

			it( "should do something", function () {

			} );

		} );

	} );

	describe( "(Some Concept)", function () {

		describe( "#_someMethod", function () {

			describe( "( <string> )", function () {

				it( "should do something", function () {

				} );

			} );

		} );

	} );


} );