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

/* eslint func-style: "off", require-jsdoc: "off" */

describe.only( "Core.type.mixin.Validating", function () {

	describe( "#$validate()", function () {

		describe( "(Basic Functionality)", function () {

			it( "should forward calls to `Core.type.Validator::validate()`", function () {

				// We have a fixture for this...
				let fixture = Core.inst( "Test.fixture.type.mixin.validating.TestClassOne" );

				// Perform a validation..
				let res = fixture.passingValidate1();

				// Assert
				expect( res.success ).to.equal( true );

			} );

			it( "should throw errors when validation fails", function () {

				// We have a fixture for this...
				let fixture = Core.inst( "Test.fixture.type.mixin.validating.TestClassOne" );

				// Any time we're testing for errors, we need to wrap with a helper
				function helperFn() {
					fixture.failingValidate1();
				}

				// Assert
				expect( helperFn ).to.throw( Core.cls( "Core.error.ValidationError" ) );

			} );

		} );

		describe( "(Error Decoration for Class Member Sources)", function () {

			it( "should indicate the source of validation errors", function () {

				// We have a fixture for this...
				let fixture = Core.inst( "Test.fixture.type.mixin.validating.TestClassOne" );

				// Throw & Catch
				let result;
				try {
					fixture.failingValidate1();
				} catch( err ) {
					result = err;
				}

				// Assert on parts of the error message
				expect( result.message ).to.have.string( "Validation failed" );
				expect( result.message ).to.have.string( "TestClassOne#failingValidate1" );

				// Since the validating method was part of the class, we SHOULD NOT
				// have a 'called as' reference in the error..
				expect( result.message ).to.not.have.string( "called as" );

			} );

		} );

		describe( "(Error Decoration for Mixin Member Sources)", function () {

			it( "should indicate the source of validation errors", function () {

				// We have a fixture for this...
				let fixture = Core.inst( "Test.fixture.type.mixin.validating.TestClassOne" );

				// Throw & Catch
				let result;
				try {
					fixture.failingMixinValidate1();
				} catch( err ) {
					result = err;
				}

				// Assert on parts of the error message
				expect( result.message ).to.have.string( "Validation failed" );
				expect( result.message ).to.have.string( "TestMixinOne#failingMixinValidate1" );

				// Since the validating method was part of the mixin, we SHOULD
				// have a 'called as' reference in the error..
				expect( result.message ).to.have.string( "called as" );
				expect( result.message ).to.have.string( "TestClassOne#failingMixinValidate1" );

			} );

		} );

	} );


} );
