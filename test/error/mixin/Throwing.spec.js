/**
 * @file
 * Defines tests for the Core.error.mixin.Throwing mixin.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/* eslint func-style: "off", require-jsdoc: "off" */

describe( "Core.error.mixin.Throwing", function () {

	describe( "#$throw", function () {

		describe( "( <Object:info>, <string:message>, <string:value1>, <Object:info>, <string:ShortClassName>, <number:value2>, <Error:cause>, <Object:info> )", function() {

			let component;
			let testCause;
			let testError;

			before( function() {

				// Create a component (which uses our mixin)
				component = Core.inst( "Core.abstract.Component" );

				// Create a "cause"
				testCause = new Error( "A.CAUSE" );

				// Throw & Catch
				try {
					component.$throw( { a: 1, x: 1 }, "%s and %05d is bad", "a", { b: 2, x: 2 }, "ValidationError", 1, testCause, { c: 3, x: 3 } );
				} catch( err ) {
					testError = err;
				}

			} );


			it( "should throw an error that is an instance of the appropriate class", function () {

				expect( testError ).to.be.an.instanceof( Core.cls( "Core.error.ValidationError" ) );

			} );

			it( "should throw an error with a properly formatted message", function () {

				// Assert that the message came out ok ..
				expect( testError.message ).to.have.string( "a and 00001 is bad" );

			} );

			it( "should return an error that contains 'causal' information in its 'message'", function () {

				// Assert
				expect( testError.message ).to.have.string( testCause.message );

			} );

			it( "should return an error that has a 'cause' reference", function () {

				// Assert
				expect( testError.jse_cause ).to.equal( testCause );

			} );

			it( "should return an error with 'info' imbued into it as expected", function () {

				// Extract the 'info'
				let info = Core.errorManager.info( testError );

				// .. and assert that the test 'info' made it
				expect( info.a ).to.equal( 1 );
				expect( info.b ).to.equal( 2 );
				expect( info.c ).to.equal( 3 );
				expect( info.x ).to.equal( 3 );

			} );

			it( "should have the '$thrownBy' property injected into the 'info' object", function () {

				// Extract the 'info'
				let info = Core.errorManager.info( testError );

				// .. and assert that the test 'info' made it
				expect( info.$thrownBy ).to.equal( component );

			} );

		} );


	} );

} );
