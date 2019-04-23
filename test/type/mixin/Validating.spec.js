/**
 * @file
 * Defines tests for the Core.type.mixin.Validating mixin.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

describe( "Core.type.mixin.Validating", function () {

	let component;

	before( function() {
		component = Core.inst( "Core.abstract.Component" );
	} );

	describe( "#$validate()", function () {

		it( "should forward calls to `Core.type.Validator::validate()`", function () {

			let res = component.$validate( "a", {
				check: "isString"
			} );

		} );

	} );


} );
