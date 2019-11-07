/**
 * @file
 * Defines tests for the Core.logging.output.Collection class.
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

describe( "Core.logging.output.Collection", function () {

	describe( "#$construct()", function () {

		it( "should throw an Error when provided an invalid collection value", function () {

			function testCollection() {

				let col = new Core.logging.output.Collection( {
					initialValues: true
				} );

			}

			expect( testCollection ).to.throw( ValidationError );

		} );

		it( "should NOT throw an Error when provided a valid output class instance", function () {

			function testCollection() {

				let output = new Core.logging.output.Console();

				let col = new Core.logging.output.Collection( {
					initialValues: output
				} );

			}

			expect( testCollection ).to.not.throw( ValidationError );

		} );

		it( "should NOT throw an Error when provided a valid output collection", function () {

			let target;

			function testCollection() {

				let outputA = new Core.logging.output.Console();
				let outputB = new Core.logging.output.Console();

				let source = new Core.logging.output.Collection( {
					initialValues: [ outputA, outputB ]
				} );

				target = new Core.logging.output.Collection( {
					initialValues: source
				} );

			}

			expect( testCollection ).to.not.throw( ValidationError );
			expect( target.size    ).to.equal( 2 );

		} );

	} );


} );
