/**
 * @file
 * Defines tests for the Core.error.ValidationError class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/* eslint func-style: "off", require-jsdoc: "off" */

describe( "Core.error.ValidationError", function () {

	describe( ".defaultMessage", function() {

		it( "should provide a sane default message", function() {

			// Instantiate
			let testInstance = new Core.error.ValidationError();

			// Check for the default message
			expect( testInstance.message ).to.have.string( "validation error" );

		} );

	} );

} );
