/**
 * @file
 * Defines tests for the Core.error.Manager class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/* eslint func-style: "off", require-jsdoc: "off" */

const VERROR             = Core.dep( "verror" );
const TEST_ERROR_MESSAGE = "_a_test_";

describe( "Core.error.Manager", function () {

	describe( "(Accessibility)", function () {

		it( "should be available via the `Core` root class", function () {
			expect( Core.errorManager.className ).to.equal( "Core.error.Manager" );
		} );

		it( "should be available via the Asset Manager", function () {
			expect( Core.inst( "Core.error.Manager" ).className ).to.equal( "Core.error.Manager" );
		} );

	} );

	describe( "#createError", function () {

		let errorManager;

		before( function () {
			errorManager = Core.inst( "Core.error.Manager" );
		} );

		describe( "(Basic Usage)", function () {

			describe( "( <string:message> )", function () {

				it( "should not THROW the errors it creates", function () {

					// Any time we evaluate errors, we need
					// to wrap the operation in a helper function.
					function aTest() {

						// Execute
						errorManager.createError( "An Error Message" );

					}

					expect( aTest ).to.not.throw();

				} );

				it( "should return a `Core.error.GenericError`", function () {

					// Execute
					let result = errorManager.createError( TEST_ERROR_MESSAGE );

					// Assert
					expect( result              ).to.be.an.instanceof( Error );
					expect( result.$amClassName ).to.equal( "Core.error.GenericError" );
					expect( result.message      ).to.have.string( TEST_ERROR_MESSAGE );

				} );

				it( "should include the name of the error class when thrown", function () {

					// Execute
					let result = errorManager.createError( TEST_ERROR_MESSAGE );

					// Capture the error message
					let message = result + "";

					// Assert
					expect( message ).to.have.string( "Core.error.GenericError" );

				} );

			} );

			describe( "( <ErrorConstructor>, <string:message> )", function () {

				it( "should return an Error object when its constructor is passed", function () {

					// Execute
					let result = errorManager.createError( Error, TEST_ERROR_MESSAGE );

					// Assert
					expect( result.constructor.name ).to.equal( "Error" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );
					expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

				} );

				it( "should return a RangeError object when its constructor is passed", function () {

					// Execute
					let result = errorManager.createError( RangeError, TEST_ERROR_MESSAGE );

					// Assert
					expect( result.constructor.name ).to.equal( "RangeError" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );
					expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

				} );

				it( "should return a VError object when its constructor is passed", function () {

					// Execute
					let result = errorManager.createError( VERROR, TEST_ERROR_MESSAGE );

					// Assert
					expect( result.constructor.name ).to.equal( "VError" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );
					expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

				} );

				it( "should return a WError object when its constructor is passed", function () {

					// Execute
					let result = errorManager.createError( VERROR.WError, TEST_ERROR_MESSAGE );

					// Assert
					expect( result.constructor.name ).to.equal( "WError" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );
					expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

				} );

				it( "should return a SError object when its constructor is passed", function () {


					// Execute
					let result = errorManager.createError( VERROR.SError, TEST_ERROR_MESSAGE );

					// Assert
					expect( result.constructor.name ).to.equal( "SError" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );
					expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

				} );

			} );

			describe( "( <CoreClass>, <string:message> )", function () {

				it( "should return an instantiated Core Error Class", function () {

					// Execute
					let result = errorManager.createError( Core.cls( "Core.error.ValidationError" ), TEST_ERROR_MESSAGE );

					// Assert
					expect( result              ).to.be.an.instanceof( Error );
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );
					expect( result.message      ).to.have.string( TEST_ERROR_MESSAGE );

				} );

			} );

			describe( "( <string:FullClassName>, <string:message> )", function () {

				it( "should return an instantiated Core Error Class", function () {

					// Execute
					let result = errorManager.createError( "Core.error.ValidationError", TEST_ERROR_MESSAGE );

					// Assert
					expect( result              ).to.be.an.instanceof( Error );
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );
					expect( result.message      ).to.have.string( TEST_ERROR_MESSAGE );

				} );

			} );

			describe( "( <string:ShortClassName>, <string:message> )", function () {

				it( "should infer `Core.error` and return an instantiated Core Error Class", function () {

					// Execute
					let result = errorManager.createError( "ValidationError", TEST_ERROR_MESSAGE );

					// Assert
					expect( result              ).to.be.an.instanceof( Error );
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );
					expect( result.message      ).to.have.string( TEST_ERROR_MESSAGE );

				} );

			} );

		} );

		describe( "(Missing Message)", function () {

			describe( "()", function () {

				it( "should return a `Core.error.GenericError`", function () {

					// Execute
					let result = errorManager.createError();

					// Assert
					expect( result              ).to.be.an.instanceof( Error );
					expect( result.$amClassName ).to.equal( "Core.error.GenericError" );

				} );

				it( "should return a default message", function () {

					// Execute
					let result = errorManager.createError();

					// Assert
					expect( result              ).to.be.an.instanceof( Error );
					expect( result.$amClassName ).to.equal( "Core.error.GenericError" );
					expect( result.message      ).to.have.string( "unknown error" );

				} );

			} );

			describe( "( <ErrorConstructor> )", function () {

				it( "should return an Error object when its constructor is passed", function () {

					// Execute
					let result = errorManager.createError( Error );

					// Assert
					expect( result.constructor.name ).to.equal( "Error" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );

				} );

				it( "should return a RangeError object when its constructor is passed", function () {

					// Execute
					let result = errorManager.createError( RangeError );

					// Assert
					expect( result.constructor.name ).to.equal( "RangeError" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );

				} );

				it( "should return a VError object when its constructor is passed", function () {

					// Execute
					let result = errorManager.createError( VERROR );

					// Assert
					expect( result.constructor.name ).to.equal( "VError" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );

				} );

				it( "should return a WError object when its constructor is passed", function () {

					// Execute
					let result = errorManager.createError( VERROR.WError );

					// Assert
					expect( result.constructor.name ).to.equal( "WError" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );

				} );

				it( "should return a SError object when its constructor is passed", function () {


					// Execute
					let result = errorManager.createError( VERROR.SError );

					// Assert
					expect( result.constructor.name ).to.equal( "SError" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );

				} );

				it( "should return a default message", function () {

					// Execute
					let result = errorManager.createError( Error );

					// Assert
					expect( result.message      ).to.have.string( "unknown error" );

				} );

			} );

			describe( "( <CoreClass> )", function () {

				it( "should return an instantiated Core Error Class", function () {

					// Execute
					let result = errorManager.createError( Core.cls( "Core.error.ValidationError" ) );

					// Assert
					expect( result              ).to.be.an.instanceof( Error );
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );

				} );

				it( "should return a default message (overridden by the Error Class)", function () {

					// Execute
					let result = errorManager.createError( Core.cls( "Core.error.ValidationError" ) );

					// Assert
					expect( result.message      ).to.have.string( "validation error" );

				} );

			} );

			describe( "( <string:FullClassName> )", function () {

				it( "should return an instantiated Core Error Class", function () {

					// Execute
					let result = errorManager.createError( "Core.error.ValidationError" );

					// Assert
					expect( result              ).to.be.an.instanceof( Error );
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );

				} );

				it( "should return a default message (overridden by the Error Class)", function () {

					// Execute
					let result = errorManager.createError( "Core.error.ValidationError" );

					// Assert
					expect( result.message      ).to.have.string( "validation error" );

				} );

			} );

			describe( "( <string:ShortClassName> )", function () {

				it( "should infer `Core.error` and return an instantiated Core Error Class", function () {

					// Execute
					let result = errorManager.createError( "ValidationError" );

					// Assert
					expect( result              ).to.be.an.instanceof( Error );
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );

				} );

				it( "should return a default message (overridden by the Error Class)", function () {

					// Execute
					let result = errorManager.createError( "ValidationError" );

					// Assert
					expect( result.message      ).to.have.string( "validation error" );

				} );

			} );

		} );

		describe( "(Cause)", function () {

			let cause;

			beforeEach( function() {

				// Create a "cause"
				cause = new Error( "A.CAUSE" );

			} );

			describe( "( <Error:cause>, <string:message> )", function () {

				it( "should return a `Core.error.GenericError`", function () {

					// Execute
					let result = errorManager.createError( cause, TEST_ERROR_MESSAGE );

					// Assert
					expect( result              ).to.be.an.instanceof( Error );
					expect( result.$amClassName ).to.equal( "Core.error.GenericError" );
					expect( result.message      ).to.have.string( TEST_ERROR_MESSAGE );

				} );

				it( "should contain 'causal' information in the 'message' of the returned error", function () {

					// Execute
					let result = errorManager.createError( cause, TEST_ERROR_MESSAGE );

					// Assert
					expect( result.message      ).to.have.string( cause.message );

				} );

				it( "should contain a 'cause' reference within the returned error", function () {

					// Execute
					let result = errorManager.createError( cause, TEST_ERROR_MESSAGE );

					// Assert
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

			describe( "( <string:message>, <Error:cause> )", function () {

				it( "should return a `Core.error.GenericError`", function () {

					// Execute
					let result = errorManager.createError( TEST_ERROR_MESSAGE, cause );

					// Assert
					expect( result              ).to.be.an.instanceof( Error );
					expect( result.$amClassName ).to.equal( "Core.error.GenericError" );
					expect( result.message      ).to.have.string( TEST_ERROR_MESSAGE );

				} );

				it( "should contain 'causal' information in the 'message' of the returned error", function () {

					// Execute
					let result = errorManager.createError( TEST_ERROR_MESSAGE, cause );

					// Assert
					expect( result.message      ).to.have.string( cause.message );

				} );

				it( "should contain a 'cause' reference within the returned error", function () {

					// Execute
					let result = errorManager.createError( TEST_ERROR_MESSAGE, cause );

					// Assert
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

			// --

			describe( "( <ErrorConstructor>, <Error:cause>, <string:message> )", function () {

				it( "should return an Error object when its constructor is passed", function () {

					// Note: The built-in Error constructor does not support a `cause`
					// (that functionality is added by the `VError` module)
					// Still, we need to ensure that nothing breaks when a `cause` is provided.

					// Execute
					let result = errorManager.createError( Error, cause, TEST_ERROR_MESSAGE );

					// Assert
					expect( result.constructor.name ).to.equal( "Error" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );
					expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

					// Since Error objects do not support a 'cause', then the
					// cause should not be referenced in the message.
					expect( result.message          ).to.not.have.string( cause.message );

				} );

				it( "should return a RangeError object when its constructor is passed", function () {

					// Note: The built-in RangeError constructor does not support a `cause`
					// (that functionality is added by the `VError` module)
					// Still, we need to ensure that nothing breaks when a `cause` is provided.

					// Execute
					let result = errorManager.createError( RangeError, cause, TEST_ERROR_MESSAGE );

					// Assert
					expect( result.constructor.name ).to.equal( "RangeError" );
					expect( result                  ).to.be.an.instanceof( RangeError );
					expect( result.$amClassName     ).to.equal( undefined );
					expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

					// Since RangeError objects do not support a 'cause', then the
					// cause should not be referenced in the message.
					expect( result.message          ).to.not.have.string( cause.message );

				} );

				it( "should return a VError object when its constructor is passed", function () {

					// Execute
					let result = errorManager.createError( VERROR, cause, TEST_ERROR_MESSAGE );

					// Assert
					expect( result.constructor.name ).to.equal( "VError" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );
					expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

					// VError objects DO support a `cause`, and the
					// cause should be reflected in the message.
					expect( result.message      ).to.have.string( cause.message );

					// .. and there should be a reference to the `cause`
					expect( result.jse_cause ).to.equal( cause );

				} );

				it( "should return a WError object when its constructor is passed", function () {

					// Execute
					let result = errorManager.createError( VERROR.WError, cause, TEST_ERROR_MESSAGE );

					// Assert
					expect( result.constructor.name ).to.equal( "WError" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );
					expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

					// WError objects DO support a `cause`, but they do not
					// add causal information to the `message`.
					expect( result.message      ).to.not.have.string( cause.message );

					// .. but there should still be a reference to the `cause`
					expect( result.jse_cause ).to.equal( cause );

				} );

				it( "should return a SError object when its constructor is passed", function () {

					// Execute
					let result = errorManager.createError( VERROR.SError, cause, TEST_ERROR_MESSAGE );

					// Assert
					expect( result.constructor.name ).to.equal( "SError" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );
					expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

					// SError objects DO support a `cause`, and the
					// cause should be reflected in the message.
					expect( result.message      ).to.have.string( cause.message );

					// .. and there should be a reference to the `cause`
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

			describe( "( <Error:cause>, <ErrorConstructor>, <string:message> )", function () {

				it( "should return an Error object when its constructor is passed", function () {

					// Note: The built-in Error constructor does not support a `cause`
					// (that functionality is added by the `VError` module)
					// Still, we need to ensure that nothing breaks when a `cause` is provided.

					// Execute
					let result = errorManager.createError( cause, Error, TEST_ERROR_MESSAGE );

					// Assert
					expect( result.constructor.name ).to.equal( "Error" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );
					expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

					// Since Error objects do not support a 'cause', then the
					// cause should not be referenced in the message.
					expect( result.message          ).to.not.have.string( cause.message );

				} );

				it( "should return a RangeError object when its constructor is passed", function () {

					// Note: The built-in RangeError constructor does not support a `cause`
					// (that functionality is added by the `VError` module)
					// Still, we need to ensure that nothing breaks when a `cause` is provided.

					// Execute
					let result = errorManager.createError( cause, RangeError, TEST_ERROR_MESSAGE );

					// Assert
					expect( result.constructor.name ).to.equal( "RangeError" );
					expect( result                  ).to.be.an.instanceof( RangeError );
					expect( result.$amClassName     ).to.equal( undefined );
					expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

					// Since RangeError objects do not support a 'cause', then the
					// cause should not be referenced in the message.
					expect( result.message          ).to.not.have.string( cause.message );

				} );

				it( "should return a VError object when its constructor is passed", function () {

					// Execute
					let result = errorManager.createError( cause, VERROR, TEST_ERROR_MESSAGE );

					// Assert
					expect( result.constructor.name ).to.equal( "VError" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );
					expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

					// VError objects DO support a `cause`, and the
					// cause should be reflected in the message.
					expect( result.message      ).to.have.string( cause.message );

					// .. and there should be a reference to the `cause`
					expect( result.jse_cause ).to.equal( cause );

				} );

				it( "should return a WError object when its constructor is passed", function () {

					// Execute
					let result = errorManager.createError( cause, VERROR.WError, TEST_ERROR_MESSAGE );

					// Assert
					expect( result.constructor.name ).to.equal( "WError" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );
					expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

					// WError objects DO support a `cause`, but they do not
					// add causal information to the `message`.
					expect( result.message      ).to.not.have.string( cause.message );

					// .. but there should still be a reference to the `cause`
					expect( result.jse_cause ).to.equal( cause );

				} );

				it( "should return a SError object when its constructor is passed", function () {

					// Execute
					let result = errorManager.createError( cause, VERROR.SError, TEST_ERROR_MESSAGE );

					// Assert
					expect( result.constructor.name ).to.equal( "SError" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );
					expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

					// SError objects DO support a `cause`, and the
					// cause should be reflected in the message.
					expect( result.message      ).to.have.string( cause.message );

					// .. and there should be a reference to the `cause`
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

			describe( "( <string:message>, <ErrorConstructor>, <Error:cause> )", function () {

				it( "should return an Error object when its constructor is passed", function () {

					// Note: The built-in Error constructor does not support a `cause`
					// (that functionality is added by the `VError` module)
					// Still, we need to ensure that nothing breaks when a `cause` is provided.

					// Execute
					let result = errorManager.createError( TEST_ERROR_MESSAGE, Error  );

					// Assert
					expect( result.constructor.name ).to.equal( "Error" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );
					expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

					// Since Error objects do not support a 'cause', then the
					// cause should not be referenced in the message.
					expect( result.message          ).to.not.have.string( cause.message );

				} );

				it( "should return a RangeError object when its constructor is passed", function () {

					// Note: The built-in RangeError constructor does not support a `cause`
					// (that functionality is added by the `VError` module)
					// Still, we need to ensure that nothing breaks when a `cause` is provided.

					// Execute
					let result = errorManager.createError( TEST_ERROR_MESSAGE, RangeError );

					// Assert
					expect( result.constructor.name ).to.equal( "RangeError" );
					expect( result                  ).to.be.an.instanceof( RangeError );
					expect( result.$amClassName     ).to.equal( undefined );
					expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

					// Since RangeError objects do not support a 'cause', then the
					// cause should not be referenced in the message.
					expect( result.message          ).to.not.have.string( cause.message );

				} );

				it( "should return a VError object when its constructor is passed", function () {

					// Execute
					let result = errorManager.createError( TEST_ERROR_MESSAGE, VERROR, cause );

					// Assert
					expect( result.constructor.name ).to.equal( "VError" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );
					expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

					// VError objects DO support a `cause`, and the
					// cause should be reflected in the message.
					expect( result.message      ).to.have.string( cause.message );

					// .. and there should be a reference to the `cause`
					expect( result.jse_cause ).to.equal( cause );

				} );

				it( "should return a WError object when its constructor is passed", function () {

					// Execute
					let result = errorManager.createError( TEST_ERROR_MESSAGE, VERROR.WError, cause );

					// Assert
					expect( result.constructor.name ).to.equal( "WError" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );
					expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

					// WError objects DO support a `cause`, but they do not
					// add causal information to the `message`.
					expect( result.message      ).to.not.have.string( cause.message );

					// .. but there should still be a reference to the `cause`
					expect( result.jse_cause ).to.equal( cause );

				} );

				it( "should return a SError object when its constructor is passed", function () {

					// Execute
					let result = errorManager.createError( TEST_ERROR_MESSAGE, VERROR.SError, cause );

					// Assert
					expect( result.constructor.name ).to.equal( "SError" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );
					expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

					// SError objects DO support a `cause`, and the
					// cause should be reflected in the message.
					expect( result.message      ).to.have.string( cause.message );

					// .. and there should be a reference to the `cause`
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

			describe( "( <string:message>, <Error:cause>, <ErrorConstructor> )", function () {

				it( "should return an Error object when its constructor is passed", function () {

					// Note: The built-in Error constructor does not support a `cause`
					// (that functionality is added by the `VError` module)
					// Still, we need to ensure that nothing breaks when a `cause` is provided.

					// Execute
					let result = errorManager.createError( TEST_ERROR_MESSAGE, cause, Error );

					// Assert
					expect( result.constructor.name ).to.equal( "Error" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );
					expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

					// Since Error objects do not support a 'cause', then the
					// cause should not be referenced in the message.
					expect( result.message          ).to.not.have.string( cause.message );

				} );

				it( "should return a RangeError object when its constructor is passed", function () {

					// Note: The built-in RangeError constructor does not support a `cause`
					// (that functionality is added by the `VError` module)
					// Still, we need to ensure that nothing breaks when a `cause` is provided.

					// Execute
					let result = errorManager.createError( TEST_ERROR_MESSAGE, cause, RangeError );

					// Assert
					expect( result.constructor.name ).to.equal( "RangeError" );
					expect( result                  ).to.be.an.instanceof( RangeError );
					expect( result.$amClassName     ).to.equal( undefined );
					expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

					// Since RangeError objects do not support a 'cause', then the
					// cause should not be referenced in the message.
					expect( result.message          ).to.not.have.string( cause.message );

				} );

				it( "should return a VError object when its constructor is passed", function () {

					// Execute
					let result = errorManager.createError( TEST_ERROR_MESSAGE, cause, VERROR );

					// Assert
					expect( result.constructor.name ).to.equal( "VError" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );
					expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

					// VError objects DO support a `cause`, and the
					// cause should be reflected in the message.
					expect( result.message      ).to.have.string( cause.message );

					// .. and there should be a reference to the `cause`
					expect( result.jse_cause ).to.equal( cause );

				} );

				it( "should return a WError object when its constructor is passed", function () {

					// Execute
					let result = errorManager.createError( TEST_ERROR_MESSAGE, cause, VERROR.WError );

					// Assert
					expect( result.constructor.name ).to.equal( "WError" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );
					expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

					// WError objects DO support a `cause`, but they do not
					// add causal information to the `message`.
					expect( result.message      ).to.not.have.string( cause.message );

					// .. but there should still be a reference to the `cause`
					expect( result.jse_cause ).to.equal( cause );

				} );

				it( "should return a SError object when its constructor is passed", function () {

					// Execute
					let result = errorManager.createError( TEST_ERROR_MESSAGE, cause, VERROR.SError );

					// Assert
					expect( result.constructor.name ).to.equal( "SError" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );
					expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

					// SError objects DO support a `cause`, and the
					// cause should be reflected in the message.
					expect( result.message      ).to.have.string( cause.message );

					// .. and there should be a reference to the `cause`
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

			describe( "( <ErrorConstructor>, <string:message>, <Error:cause> )", function () {

				it( "should return an Error object when its constructor is passed", function () {

					// Note: The built-in Error constructor does not support a `cause`
					// (that functionality is added by the `VError` module)
					// Still, we need to ensure that nothing breaks when a `cause` is provided.

					// Execute
					let result = errorManager.createError( Error, TEST_ERROR_MESSAGE, cause );

					// Assert
					expect( result.constructor.name ).to.equal( "Error" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );
					expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

					// Since Error objects do not support a 'cause', then the
					// cause should not be referenced in the message.
					expect( result.message          ).to.not.have.string( cause.message );

				} );

				it( "should return a RangeError object when its constructor is passed", function () {

					// Note: The built-in RangeError constructor does not support a `cause`
					// (that functionality is added by the `VError` module)
					// Still, we need to ensure that nothing breaks when a `cause` is provided.

					// Execute
					let result = errorManager.createError( RangeError, TEST_ERROR_MESSAGE, cause );

					// Assert
					expect( result.constructor.name ).to.equal( "RangeError" );
					expect( result                  ).to.be.an.instanceof( RangeError );
					expect( result.$amClassName     ).to.equal( undefined );
					expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

					// Since RangeError objects do not support a 'cause', then the
					// cause should not be referenced in the message.
					expect( result.message          ).to.not.have.string( cause.message );

				} );

				it( "should return a VError object when its constructor is passed", function () {

					// Execute
					let result = errorManager.createError( VERROR, TEST_ERROR_MESSAGE, cause );

					// Assert
					expect( result.constructor.name ).to.equal( "VError" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );
					expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

					// VError objects DO support a `cause`, and the
					// cause should be reflected in the message.
					expect( result.message      ).to.have.string( cause.message );

					// .. and there should be a reference to the `cause`
					expect( result.jse_cause ).to.equal( cause );

				} );

				it( "should return a WError object when its constructor is passed", function () {

					// Execute
					let result = errorManager.createError( VERROR.WError, TEST_ERROR_MESSAGE, cause );

					// Assert
					expect( result.constructor.name ).to.equal( "WError" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );
					expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

					// WError objects DO support a `cause`, but they do not
					// add causal information to the `message`.
					expect( result.message      ).to.not.have.string( cause.message );

					// .. but there should still be a reference to the `cause`
					expect( result.jse_cause ).to.equal( cause );

				} );

				it( "should return a SError object when its constructor is passed", function () {

					// Execute
					let result = errorManager.createError( VERROR.SError, TEST_ERROR_MESSAGE, cause );

					// Assert
					expect( result.constructor.name ).to.equal( "SError" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );
					expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

					// SError objects DO support a `cause`, and the
					// cause should be reflected in the message.
					expect( result.message      ).to.have.string( cause.message );

					// .. and there should be a reference to the `cause`
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

			describe( "( <Error:cause>, <string:message>, <ErrorConstructor> )", function () {

				it( "should return an Error object when its constructor is passed", function () {

					// Note: The built-in Error constructor does not support a `cause`
					// (that functionality is added by the `VError` module)
					// Still, we need to ensure that nothing breaks when a `cause` is provided.

					// Execute
					let result = errorManager.createError( cause, TEST_ERROR_MESSAGE, Error );

					// Assert
					expect( result.constructor.name ).to.equal( "Error" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );
					expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

					// Since Error objects do not support a 'cause', then the
					// cause should not be referenced in the message.
					expect( result.message          ).to.not.have.string( cause.message );

				} );

				it( "should return a RangeError object when its constructor is passed", function () {

					// Note: The built-in RangeError constructor does not support a `cause`
					// (that functionality is added by the `VError` module)
					// Still, we need to ensure that nothing breaks when a `cause` is provided.

					// Execute
					let result = errorManager.createError( cause, TEST_ERROR_MESSAGE, RangeError );

					// Assert
					expect( result.constructor.name ).to.equal( "RangeError" );
					expect( result                  ).to.be.an.instanceof( RangeError );
					expect( result.$amClassName     ).to.equal( undefined );
					expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

					// Since RangeError objects do not support a 'cause', then the
					// cause should not be referenced in the message.
					expect( result.message          ).to.not.have.string( cause.message );

				} );

				it( "should return a VError object when its constructor is passed", function () {

					// Execute
					let result = errorManager.createError( cause, TEST_ERROR_MESSAGE, VERROR );

					// Assert
					expect( result.constructor.name ).to.equal( "VError" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );
					expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

					// VError objects DO support a `cause`, and the
					// cause should be reflected in the message.
					expect( result.message      ).to.have.string( cause.message );

					// .. and there should be a reference to the `cause`
					expect( result.jse_cause ).to.equal( cause );

				} );

				it( "should return a WError object when its constructor is passed", function () {

					// Execute
					let result = errorManager.createError( cause, TEST_ERROR_MESSAGE, VERROR.WError );

					// Assert
					expect( result.constructor.name ).to.equal( "WError" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );
					expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

					// WError objects DO support a `cause`, but they do not
					// add causal information to the `message`.
					expect( result.message      ).to.not.have.string( cause.message );

					// .. but there should still be a reference to the `cause`
					expect( result.jse_cause ).to.equal( cause );

				} );

				it( "should return a SError object when its constructor is passed", function () {

					// Execute
					let result = errorManager.createError( cause, TEST_ERROR_MESSAGE, VERROR.SError );

					// Assert
					expect( result.constructor.name ).to.equal( "SError" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );
					expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

					// SError objects DO support a `cause`, and the
					// cause should be reflected in the message.
					expect( result.message      ).to.have.string( cause.message );

					// .. and there should be a reference to the `cause`
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

			// --

			describe( "( <CoreClass>, <Error:cause>, <string:message> )", function () {

				it( "should return an instantiated Core Error Class", function () {

					// Execute
					let result = errorManager.createError( Core.cls( "Core.error.ValidationError" ), cause, TEST_ERROR_MESSAGE );

					// Assert
					expect( result              ).to.be.an.instanceof( Error );
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );
					expect( result.message      ).to.have.string( TEST_ERROR_MESSAGE );

				} );

				it( "should return an error object with causal information in the message", function () {

					// Execute
					let result = errorManager.createError( Core.cls( "Core.error.ValidationError" ), cause, TEST_ERROR_MESSAGE );

					// Assert
					expect( result.message      ).to.have.string( cause.message );

				} );

				it( "should return an error object with a reference to the cause", function () {

					// Execute
					let result = errorManager.createError( Core.cls( "Core.error.ValidationError" ), cause, TEST_ERROR_MESSAGE );

					// Assert
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

			describe( "( <Error:cause>, <CoreClass>, <string:message> )", function () {

				it( "should return an instantiated Core Error Class", function () {

					// Execute
					let result = errorManager.createError( cause, Core.cls( "Core.error.ValidationError" ), TEST_ERROR_MESSAGE );

					// Assert
					expect( result              ).to.be.an.instanceof( Error );
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );
					expect( result.message      ).to.have.string( TEST_ERROR_MESSAGE );

				} );

				it( "should return an error object with causal information in the message", function () {

					// Execute
					let result = errorManager.createError( cause, Core.cls( "Core.error.ValidationError" ), TEST_ERROR_MESSAGE );

					// Assert
					expect( result.message      ).to.have.string( cause.message );

				} );

				it( "should return an error object with a reference to the cause", function () {

					// Execute
					let result = errorManager.createError( cause, Core.cls( "Core.error.ValidationError" ), TEST_ERROR_MESSAGE );

					// Assert
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

			describe( "( <string:message>, <CoreClass>, <Error:cause> )", function () {

				it( "should return an instantiated Core Error Class", function () {

					// Execute
					let result = errorManager.createError( TEST_ERROR_MESSAGE, Core.cls( "Core.error.ValidationError" ), cause );

					// Assert
					expect( result              ).to.be.an.instanceof( Error );
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );
					expect( result.message      ).to.have.string( TEST_ERROR_MESSAGE );

				} );

				it( "should return an error object with causal information in the message", function () {

					// Execute
					let result = errorManager.createError( TEST_ERROR_MESSAGE, Core.cls( "Core.error.ValidationError" ), cause );

					// Assert
					expect( result.message      ).to.have.string( cause.message );

				} );

				it( "should return an error object with a reference to the cause", function () {

					// Execute
					let result = errorManager.createError( TEST_ERROR_MESSAGE, Core.cls( "Core.error.ValidationError" ), cause );

					// Assert
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

			describe( "( <string:message>, <Error:cause>, <CoreClass> )", function () {

				it( "should return an instantiated Core Error Class", function () {

					// Execute
					let result = errorManager.createError( TEST_ERROR_MESSAGE, cause, Core.cls( "Core.error.ValidationError" ) );

					// Assert
					expect( result              ).to.be.an.instanceof( Error );
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );
					expect( result.message      ).to.have.string( TEST_ERROR_MESSAGE );

				} );

				it( "should return an error object with causal information in the message", function () {

					// Execute
					let result = errorManager.createError( TEST_ERROR_MESSAGE, cause, Core.cls( "Core.error.ValidationError" ) );

					// Assert
					expect( result.message      ).to.have.string( cause.message );

				} );

				it( "should return an error object with a reference to the cause", function () {

					// Execute
					let result = errorManager.createError( TEST_ERROR_MESSAGE, cause, Core.cls( "Core.error.ValidationError" ) );

					// Assert
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

			describe( "( <CoreClass>, <string:message>, <Error:cause> )", function () {

				it( "should return an instantiated Core Error Class", function () {

					// Execute
					let result = errorManager.createError( Core.cls( "Core.error.ValidationError" ), TEST_ERROR_MESSAGE, cause );

					// Assert
					expect( result              ).to.be.an.instanceof( Error );
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );
					expect( result.message      ).to.have.string( TEST_ERROR_MESSAGE );

				} );

				it( "should return an error object with causal information in the message", function () {

					// Execute
					let result = errorManager.createError( Core.cls( "Core.error.ValidationError" ), TEST_ERROR_MESSAGE, cause );

					// Assert
					expect( result.message      ).to.have.string( cause.message );

				} );

				it( "should return an error object with a reference to the cause", function () {

					// Execute
					let result = errorManager.createError( Core.cls( "Core.error.ValidationError" ), TEST_ERROR_MESSAGE, cause );

					// Assert
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

			describe( "( <Error:cause>, <string:message>, <CoreClass> )", function () {

				it( "should return an instantiated Core Error Class", function () {

					// Execute
					let result = errorManager.createError( cause, TEST_ERROR_MESSAGE, Core.cls( "Core.error.ValidationError" ) );

					// Assert
					expect( result              ).to.be.an.instanceof( Error );
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );
					expect( result.message      ).to.have.string( TEST_ERROR_MESSAGE );

				} );

				it( "should return an error object with causal information in the message", function () {

					// Execute
					let result = errorManager.createError( cause, TEST_ERROR_MESSAGE, Core.cls( "Core.error.ValidationError" ) );

					// Assert
					expect( result.message      ).to.have.string( cause.message );

				} );

				it( "should return an error object with a reference to the cause", function () {

					// Execute
					let result = errorManager.createError( cause, TEST_ERROR_MESSAGE, Core.cls( "Core.error.ValidationError" ) );

					// Assert
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

			// --

			describe( "( <string:FullClassName>, <Error:cause>, <string:message> )", function () {

				it( "should return an instantiated Core Error Class", function () {

					// Execute
					let result = errorManager.createError( "Core.error.ValidationError", cause, TEST_ERROR_MESSAGE );

					// Assert
					expect( result              ).to.be.an.instanceof( Error );
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );
					expect( result.message      ).to.have.string( TEST_ERROR_MESSAGE );

				} );

				it( "should return an error object with causal information in the message", function () {

					// Execute
					let result = errorManager.createError( "Core.error.ValidationError", cause, TEST_ERROR_MESSAGE );

					// Assert
					expect( result.message      ).to.have.string( cause.message );

				} );

				it( "should return an error object with a reference to the cause", function () {

					// Execute
					let result = errorManager.createError( "Core.error.ValidationError", cause, TEST_ERROR_MESSAGE );

					// Assert
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

			describe( "( <Error:cause>, <string:FullClassName>, <string:message> )", function () {

				it( "should return an instantiated Core Error Class", function () {

					// Execute
					let result = errorManager.createError( cause, "Core.error.ValidationError", TEST_ERROR_MESSAGE );

					// Assert
					expect( result              ).to.be.an.instanceof( Error );
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );
					expect( result.message      ).to.have.string( TEST_ERROR_MESSAGE );

				} );

				it( "should return an error object with causal information in the message", function () {

					// Execute
					let result = errorManager.createError( cause, "Core.error.ValidationError", TEST_ERROR_MESSAGE );

					// Assert
					expect( result.message      ).to.have.string( cause.message );

				} );

				it( "should return an error object with a reference to the cause", function () {

					// Execute
					let result = errorManager.createError( cause, "Core.error.ValidationError", TEST_ERROR_MESSAGE );

					// Assert
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

			describe( "( <string:message>, <string:FullClassName>, <Error:cause> )", function () {

				it( "should return an instantiated Core Error Class", function () {

					// Execute
					let result = errorManager.createError( TEST_ERROR_MESSAGE, "Core.error.ValidationError", cause );

					// Assert
					expect( result              ).to.be.an.instanceof( Error );
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );
					expect( result.message      ).to.have.string( TEST_ERROR_MESSAGE );

				} );

				it( "should return an error object with causal information in the message", function () {

					// Execute
					let result = errorManager.createError( TEST_ERROR_MESSAGE, "Core.error.ValidationError", cause );

					// Assert
					expect( result.message      ).to.have.string( cause.message );

				} );

				it( "should return an error object with a reference to the cause", function () {

					// Execute
					let result = errorManager.createError( TEST_ERROR_MESSAGE, "Core.error.ValidationError", cause );

					// Assert
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

			describe( "( <string:message>, <Error:cause>, <string:FullClassName> )", function () {

				it( "should return an instantiated Core Error Class", function () {

					// Execute
					let result = errorManager.createError( TEST_ERROR_MESSAGE, cause, "Core.error.ValidationError" );

					// Assert
					expect( result              ).to.be.an.instanceof( Error );
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );
					expect( result.message      ).to.have.string( TEST_ERROR_MESSAGE );

				} );

				it( "should return an error object with causal information in the message", function () {

					// Execute
					let result = errorManager.createError( TEST_ERROR_MESSAGE, cause, "Core.error.ValidationError" );

					// Assert
					expect( result.message      ).to.have.string( cause.message );

				} );

				it( "should return an error object with a reference to the cause", function () {

					// Execute
					let result = errorManager.createError( TEST_ERROR_MESSAGE, cause, "Core.error.ValidationError" );

					// Assert
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

			describe( "( <string:FullClassName>, <string:message>, <Error:cause> )", function () {

				it( "should return an instantiated Core Error Class", function () {

					// Execute
					let result = errorManager.createError( "Core.error.ValidationError", TEST_ERROR_MESSAGE, cause );

					// Assert
					expect( result              ).to.be.an.instanceof( Error );
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );
					expect( result.message      ).to.have.string( TEST_ERROR_MESSAGE );

				} );

				it( "should return an error object with causal information in the message", function () {

					// Execute
					let result = errorManager.createError( "Core.error.ValidationError", TEST_ERROR_MESSAGE, cause );

					// Assert
					expect( result.message      ).to.have.string( cause.message );

				} );

				it( "should return an error object with a reference to the cause", function () {

					// Execute
					let result = errorManager.createError( "Core.error.ValidationError", TEST_ERROR_MESSAGE, cause );

					// Assert
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

			describe( "( <Error:cause>, <string:message>, <string:FullClassName> )", function () {

				it( "should return an instantiated Core Error Class", function () {

					// Execute
					let result = errorManager.createError( cause, TEST_ERROR_MESSAGE, "Core.error.ValidationError" );

					// Assert
					expect( result              ).to.be.an.instanceof( Error );
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );
					expect( result.message      ).to.have.string( TEST_ERROR_MESSAGE );

				} );

				it( "should return an error object with causal information in the message", function () {

					// Execute
					let result = errorManager.createError( cause, TEST_ERROR_MESSAGE, "Core.error.ValidationError" );

					// Assert
					expect( result.message      ).to.have.string( cause.message );

				} );

				it( "should return an error object with a reference to the cause", function () {

					// Execute
					let result = errorManager.createError( cause, TEST_ERROR_MESSAGE, "Core.error.ValidationError" );

					// Assert
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

			// --


			describe( "( <string:ShortClassName>, <Error:cause>, <string:message> )", function () {

				it( "should infer `Core.error` and return an instantiated Core Error Class", function () {

					// Execute
					let result = errorManager.createError( "ValidationError", cause, TEST_ERROR_MESSAGE );

					// Assert
					expect( result              ).to.be.an.instanceof( Error );
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );
					expect( result.message      ).to.have.string( TEST_ERROR_MESSAGE );

				} );

				it( "should return an error object with causal information in the message", function () {

					// Execute
					let result = errorManager.createError( "ValidationError", cause, TEST_ERROR_MESSAGE );

					// Assert
					expect( result.message      ).to.have.string( cause.message );

				} );

				it( "should return an error object with a reference to the cause", function () {

					// Execute
					let result = errorManager.createError( "ValidationError", cause, TEST_ERROR_MESSAGE );

					// Assert
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

			describe( "( <Error:cause>, <string:ShortClassName>, <string:message> )", function () {

				it( "should infer `Core.error` and return an instantiated Core Error Class", function () {

					// Execute
					let result = errorManager.createError( cause, "ValidationError", TEST_ERROR_MESSAGE );

					// Assert
					expect( result              ).to.be.an.instanceof( Error );
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );
					expect( result.message      ).to.have.string( TEST_ERROR_MESSAGE );

				} );

				it( "should return an error object with causal information in the message", function () {

					// Execute
					let result = errorManager.createError( cause, "ValidationError", TEST_ERROR_MESSAGE );

					// Assert
					expect( result.message      ).to.have.string( cause.message );

				} );

				it( "should return an error object with a reference to the cause", function () {

					// Execute
					let result = errorManager.createError( cause, "ValidationError", TEST_ERROR_MESSAGE );

					// Assert
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

			describe( "( <string:message>, <string:ShortClassName>, <Error:cause> )", function () {

				it( "should infer `Core.error` and return an instantiated Core Error Class", function () {

					// Execute
					let result = errorManager.createError( TEST_ERROR_MESSAGE, "ValidationError", cause );

					// Assert
					expect( result              ).to.be.an.instanceof( Error );
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );
					expect( result.message      ).to.have.string( TEST_ERROR_MESSAGE );

				} );

				it( "should return an error object with causal information in the message", function () {

					// Execute
					let result = errorManager.createError( TEST_ERROR_MESSAGE, "ValidationError", cause );

					// Assert
					expect( result.message      ).to.have.string( cause.message );

				} );

				it( "should return an error object with a reference to the cause", function () {

					// Execute
					let result = errorManager.createError( TEST_ERROR_MESSAGE, "ValidationError", cause );

					// Assert
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

			describe( "( <string:message>, <Error:cause>, <string:ShortClassName> )", function () {

				it( "should infer `Core.error` and return an instantiated Core Error Class", function () {

					// Execute
					let result = errorManager.createError( TEST_ERROR_MESSAGE, cause, "ValidationError" );

					// Assert
					expect( result              ).to.be.an.instanceof( Error );
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );
					expect( result.message      ).to.have.string( TEST_ERROR_MESSAGE );

				} );

				it( "should return an error object with causal information in the message", function () {

					// Execute
					let result = errorManager.createError( TEST_ERROR_MESSAGE, cause, "ValidationError" );

					// Assert
					expect( result.message      ).to.have.string( cause.message );

				} );

				it( "should return an error object with a reference to the cause", function () {

					// Execute
					let result = errorManager.createError( TEST_ERROR_MESSAGE, cause, "ValidationError" );

					// Assert
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

			describe( "( <string:ShortClassName>, <string:message>, <Error:cause> )", function () {

				it( "should infer `Core.error` and return an instantiated Core Error Class", function () {

					// Execute
					let result = errorManager.createError( "ValidationError", TEST_ERROR_MESSAGE, cause );

					// Assert
					expect( result              ).to.be.an.instanceof( Error );
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );
					expect( result.message      ).to.have.string( TEST_ERROR_MESSAGE );

				} );

				it( "should return an error object with causal information in the message", function () {

					// Execute
					let result = errorManager.createError( "ValidationError", TEST_ERROR_MESSAGE, cause );

					// Assert
					expect( result.message      ).to.have.string( cause.message );

				} );

				it( "should return an error object with a reference to the cause", function () {

					// Execute
					let result = errorManager.createError( "ValidationError", TEST_ERROR_MESSAGE, cause );

					// Assert
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

			describe( "( <Error:cause>, <string:message>, <string:ShortClassName> )", function () {

				it( "should infer `Core.error` and return an instantiated Core Error Class", function () {

					// Execute
					let result = errorManager.createError( cause, TEST_ERROR_MESSAGE, "ValidationError" );

					// Assert
					expect( result              ).to.be.an.instanceof( Error );
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );
					expect( result.message      ).to.have.string( TEST_ERROR_MESSAGE );

				} );

				it( "should return an error object with causal information in the message", function () {

					// Execute
					let result = errorManager.createError( cause, TEST_ERROR_MESSAGE, "ValidationError" );

					// Assert
					expect( result.message      ).to.have.string( cause.message );

				} );

				it( "should return an error object with a reference to the cause", function () {

					// Execute
					let result = errorManager.createError( cause, TEST_ERROR_MESSAGE, "ValidationError" );

					// Assert
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

		} );

		describe( "(Cause w/o Message)", function () {


			let cause;

			beforeEach( function() {

				// Create a "cause"
				cause = new Error( "A.CAUSE" );

			} );

			describe( "( <Error:cause> )", function () {

				it( "should return a `Core.error.GenericError`", function () {

					// Execute
					let result = errorManager.createError( cause );

					// Assert
					expect( result              ).to.be.an.instanceof( Error );
					expect( result.$amClassName ).to.equal( "Core.error.GenericError" );

				} );

				it( "should return an Error with a default error message", function () {

					// Execute
					let result = errorManager.createError( cause );

					// Assert
					expect( result.message ).to.have.string( "unknown error" );

				} );

				it( "should contain 'causal' information in the 'message' of the returned error", function () {

					// Execute
					let result = errorManager.createError( cause );

					// Assert
					expect( result.message      ).to.have.string( cause.message );

				} );

				it( "should contain a 'cause' reference within the returned error", function () {

					// Execute
					let result = errorManager.createError( cause );

					// Assert
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

			// --

			describe( "( <ErrorConstructor>, <Error:cause> )", function () {

				it( "should return an Error object when its constructor is passed", function () {

					// Note: The built-in Error constructor does not support a `cause`
					// (that functionality is added by the `VError` module)
					// Still, we need to ensure that nothing breaks when a `cause` is provided.

					// Execute
					let result = errorManager.createError( Error, cause );

					// Assert
					expect( result.constructor.name ).to.equal( "Error" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );

					// Even though we don't have a `message`, the error should be provided with a default
					expect( result.message ).to.have.string( "unknown error" );

					// Since Error objects do not support a 'cause', then the
					// cause should not be referenced in the message.
					expect( result.message          ).to.not.have.string( cause.message );

				} );

				it( "should return a RangeError object when its constructor is passed", function () {

					// Note: The built-in RangeError constructor does not support a `cause`
					// (that functionality is added by the `VError` module)
					// Still, we need to ensure that nothing breaks when a `cause` is provided.

					// Execute
					let result = errorManager.createError( RangeError, cause );

					// Assert
					expect( result.constructor.name ).to.equal( "RangeError" );
					expect( result                  ).to.be.an.instanceof( RangeError );
					expect( result.$amClassName     ).to.equal( undefined );

					// Even though we don't have a `message`, the error should be provided with a default
					expect( result.message ).to.have.string( "unknown error" );

					// Since RangeError objects do not support a 'cause', then the
					// cause should not be referenced in the message.
					expect( result.message          ).to.not.have.string( cause.message );

				} );

				it( "should return a VError object when its constructor is passed", function () {

					// Execute
					let result = errorManager.createError( VERROR, cause );

					// Assert
					expect( result.constructor.name ).to.equal( "VError" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );

					// Even though we don't have a `message`, the error should be provided with a default
					expect( result.message ).to.have.string( "unknown error" );

					// VError objects DO support a `cause`, and the
					// cause should be reflected in the message.
					expect( result.message      ).to.have.string( cause.message );

					// .. and there should be a reference to the `cause`
					expect( result.jse_cause ).to.equal( cause );

				} );

				it( "should return a WError object when its constructor is passed", function () {

					// Execute
					let result = errorManager.createError( VERROR.WError, cause );

					// Assert
					expect( result.constructor.name ).to.equal( "WError" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );

					// Even though we don't have a `message`, the error should be provided with a default
					expect( result.message ).to.have.string( "unknown error" );

					// WError objects DO support a `cause`, but they do not
					// add causal information to the `message`.
					expect( result.message      ).to.not.have.string( cause.message );

					// .. but there should still be a reference to the `cause`
					expect( result.jse_cause ).to.equal( cause );

				} );

				it( "should return a SError object when its constructor is passed", function () {

					// Execute
					let result = errorManager.createError( VERROR.SError, cause );

					// Assert
					expect( result.constructor.name ).to.equal( "SError" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );

					// Even though we don't have a `message`, the error should be provided with a default
					expect( result.message ).to.have.string( "unknown error" );

					// SError objects DO support a `cause`, and the
					// cause should be reflected in the message.
					expect( result.message      ).to.have.string( cause.message );

					// .. and there should be a reference to the `cause`
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

			describe( "( <Error:cause>, <ErrorConstructor> )", function () {

				it( "should return an Error object when its constructor is passed", function () {

					// Note: The built-in Error constructor does not support a `cause`
					// (that functionality is added by the `VError` module)
					// Still, we need to ensure that nothing breaks when a `cause` is provided.

					// Execute
					let result = errorManager.createError( cause, Error );

					// Assert
					expect( result.constructor.name ).to.equal( "Error" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );

					// Even though we don't have a `message`, the error should be provided with a default
					expect( result.message ).to.have.string( "unknown error" );

					// Since Error objects do not support a 'cause', then the
					// cause should not be referenced in the message.
					expect( result.message          ).to.not.have.string( cause.message );

				} );

				it( "should return a RangeError object when its constructor is passed", function () {

					// Note: The built-in RangeError constructor does not support a `cause`
					// (that functionality is added by the `VError` module)
					// Still, we need to ensure that nothing breaks when a `cause` is provided.

					// Execute
					let result = errorManager.createError( cause, RangeError );

					// Assert
					expect( result.constructor.name ).to.equal( "RangeError" );
					expect( result                  ).to.be.an.instanceof( RangeError );
					expect( result.$amClassName     ).to.equal( undefined );

					// Even though we don't have a `message`, the error should be provided with a default
					expect( result.message ).to.have.string( "unknown error" );

					// Since RangeError objects do not support a 'cause', then the
					// cause should not be referenced in the message.
					expect( result.message          ).to.not.have.string( cause.message );

				} );

				it( "should return a VError object when its constructor is passed", function () {

					// Execute
					let result = errorManager.createError( cause, VERROR );

					// Assert
					expect( result.constructor.name ).to.equal( "VError" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );

					// Even though we don't have a `message`, the error should be provided with a default
					expect( result.message ).to.have.string( "unknown error" );

					// VError objects DO support a `cause`, and the
					// cause should be reflected in the message.
					expect( result.message      ).to.have.string( cause.message );

					// .. and there should be a reference to the `cause`
					expect( result.jse_cause ).to.equal( cause );

				} );

				it( "should return a WError object when its constructor is passed", function () {

					// Execute
					let result = errorManager.createError( cause, VERROR.WError );

					// Assert
					expect( result.constructor.name ).to.equal( "WError" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );

					// Even though we don't have a `message`, the error should be provided with a default
					expect( result.message ).to.have.string( "unknown error" );

					// WError objects DO support a `cause`, but they do not
					// add causal information to the `message`.
					expect( result.message      ).to.not.have.string( cause.message );

					// .. but there should still be a reference to the `cause`
					expect( result.jse_cause ).to.equal( cause );

				} );

				it( "should return a SError object when its constructor is passed", function () {

					// Execute
					let result = errorManager.createError( cause, VERROR.SError );

					// Assert
					expect( result.constructor.name ).to.equal( "SError" );
					expect( result                  ).to.be.an.instanceof( Error );
					expect( result.$amClassName     ).to.equal( undefined );

					// Even though we don't have a `message`, the error should be provided with a default
					expect( result.message ).to.have.string( "unknown error" );

					// SError objects DO support a `cause`, and the
					// cause should be reflected in the message.
					expect( result.message      ).to.have.string( cause.message );

					// .. and there should be a reference to the `cause`
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

			// --

			describe( "( <CoreClass>, <Error:cause> )", function () {

				it( "should return an instantiated Core Error Class", function () {

					// Execute
					let result = errorManager.createError( Core.cls( "Core.error.ValidationError" ), cause );

					// Assert
					expect( result              ).to.be.an.instanceof( Error );
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );

				} );

				it( "should return an error object with a default message (that is influenced by the Error Class)", function () {

					// Execute
					let result = errorManager.createError( Core.cls( "Core.error.ValidationError" ), cause );

					// Assert
					expect( result.message ).to.have.string( "validation error" );

				} );

				it( "should return an error object with causal information in the message", function () {

					// Execute
					let result = errorManager.createError( Core.cls( "Core.error.ValidationError" ), cause );

					// Assert
					expect( result.message      ).to.have.string( cause.message );

				} );

				it( "should return an error object with a reference to the cause", function () {

					// Execute
					let result = errorManager.createError( Core.cls( "Core.error.ValidationError" ), cause );

					// Assert
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

			describe( "( <Error:cause>, <CoreClass> )", function () {

				it( "should return an instantiated Core Error Class", function () {

					// Execute
					let result = errorManager.createError( cause, Core.cls( "Core.error.ValidationError" ) );

					// Assert
					expect( result              ).to.be.an.instanceof( Error );
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );

				} );

				it( "should return an error object with a default message (that is influenced by the Error Class)", function () {

					// Execute
					let result = errorManager.createError( cause, Core.cls( "Core.error.ValidationError" ) );

					// Assert
					expect( result.message ).to.have.string( "validation error" );

				} );

				it( "should return an error object with causal information in the message", function () {

					// Execute
					let result = errorManager.createError( cause, Core.cls( "Core.error.ValidationError" ) );

					// Assert
					expect( result.message      ).to.have.string( cause.message );

				} );

				it( "should return an error object with a reference to the cause", function () {

					// Execute
					let result = errorManager.createError( cause, Core.cls( "Core.error.ValidationError" ) );

					// Assert
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

			// --

			describe( "( <string:FullClassName>, <Error:cause> )", function () {

				it( "should return an instantiated Core Error Class", function () {

					// Execute
					let result = errorManager.createError( "Core.error.ValidationError", cause );

					// Assert
					expect( result              ).to.be.an.instanceof( Error );
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );

				} );

				it( "should return an error object with a default message (that is influenced by the Error Class)", function () {

					// Execute
					let result = errorManager.createError( "Core.error.ValidationError", cause );

					// Assert
					expect( result.message ).to.have.string( "validation error" );

				} );

				it( "should return an error object with causal information in the message", function () {

					// Execute
					let result = errorManager.createError( "Core.error.ValidationError", cause );

					// Assert
					expect( result.message      ).to.have.string( cause.message );

				} );

				it( "should return an error object with a reference to the cause", function () {

					// Execute
					let result = errorManager.createError( "Core.error.ValidationError", cause );

					// Assert
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

			describe( "( <Error:cause>, <string:FullClassName> )", function () {

				it( "should return an instantiated Core Error Class", function () {

					// Execute
					let result = errorManager.createError( cause, "Core.error.ValidationError" );

					// Assert
					expect( result              ).to.be.an.instanceof( Error );
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );

				} );

				it( "should return an error object with a default message (that is influenced by the Error Class)", function () {

					// Execute
					let result = errorManager.createError( cause, "Core.error.ValidationError" );

					// Assert
					expect( result.message ).to.have.string( "validation error" );

				} );

				it( "should return an error object with causal information in the message", function () {

					// Execute
					let result = errorManager.createError( cause, "Core.error.ValidationError" );

					// Assert
					expect( result.message      ).to.have.string( cause.message );

				} );

				it( "should return an error object with a reference to the cause", function () {

					// Execute
					let result = errorManager.createError( cause, "Core.error.ValidationError" );

					// Assert
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

			// --

			describe( "( <string:ShortClassName>, <Error:cause> )", function () {

				it( "should infer `Core.error` and return an instantiated Core Error Class", function () {

					// Execute
					let result = errorManager.createError( "ValidationError", cause );

					// Assert
					expect( result              ).to.be.an.instanceof( Error );
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );

				} );

				it( "should return an error object with a default message (that is influenced by the Error Class)", function () {

					// Execute
					let result = errorManager.createError( "ValidationError", cause );

					// Assert
					expect( result.message ).to.have.string( "validation error" );

				} );

				it( "should return an error object with causal information in the message", function () {

					// Execute
					let result = errorManager.createError( "ValidationError", cause );

					// Assert
					expect( result.message      ).to.have.string( cause.message );

				} );

				it( "should return an error object with a reference to the cause", function () {

					// Execute
					let result = errorManager.createError( "ValidationError", cause );

					// Assert
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

			describe( "( <Error:cause>, <string:ShortClassName> )", function () {

				it( "should infer `Core.error` and return an instantiated Core Error Class", function () {

					// Execute
					let result = errorManager.createError( cause, "ValidationError" );

					// Assert
					expect( result              ).to.be.an.instanceof( Error );
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );

				} );

				it( "should return an error object with a default message (that is influenced by the Error Class)", function () {

					// Execute
					let result = errorManager.createError( cause, "ValidationError" );

					// Assert
					expect( result.message ).to.have.string( "validation error" );

				} );

				it( "should return an error object with causal information in the message", function () {

					// Execute
					let result = errorManager.createError( cause, "ValidationError" );

					// Assert
					expect( result.message      ).to.have.string( cause.message );

				} );

				it( "should return an error object with a reference to the cause", function () {

					// Execute
					let result = errorManager.createError( cause, "ValidationError" );

					// Assert
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

		} );

		describe( "(Printf)", function () {

			describe( "( <string:message>, <string:value> )", function () {

				it( "should return a `Core.error.GenericError`", function () {

					// Execute
					let result = errorManager.createError( "%s is bad", "a" );

					// Assert
					expect( result.$amClassName ).to.equal( "Core.error.GenericError" );
					expect( result.message      ).to.have.string( "a is bad" );

				} );

			} );

			describe( "( <string:message>, <string:value1>, <number:value2> )", function () {

				it( "should return a `Core.error.GenericError`", function () {

					// Execute
					let result = errorManager.createError( "%s and %05d is bad", "a", 1 );

					// Assert
					expect( result.$amClassName ).to.equal( "Core.error.GenericError" );
					expect( result.message      ).to.have.string( "a and 00001 is bad" );

				} );

			} );

			describe( "( <CoreClass>, <string:message>, <string:value1>, <number:value2> )", function () {

				it( "should return an instantiated Core Error Class object", function () {

					// Execute
					let result = errorManager.createError( Core.cls( "Core.error.ValidationError" ), "%s and %05d is bad", "a", 1 );

					// Ensure our class was picked up..
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );

					// .. and that the message still came out ok ..
					expect( result.message      ).to.have.string( "a and 00001 is bad" );

				} );

			} );

			describe( "( <string:message>, <string:value1>, <CoreClass>, <number:value2> )", function () {

				it( "should return an instantiated Core Error Class object", function () {

					// Execute
					let result = errorManager.createError( "%s and %05d is bad", "a", Core.cls( "Core.error.ValidationError" ), 1 );

					// Ensure our class was picked up..
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );

					// .. and that the message still came out ok ..
					expect( result.message      ).to.have.string( "a and 00001 is bad" );

				} );

			} );


			describe( "( <string:FullClassName>, <string:message>, <string:value1>, <number:value2> )", function () {

				it( "should return an instantiated Core Error Class object", function () {

					// Execute
					let result = errorManager.createError( "Core.error.ValidationError", "%s and %05d is bad", "a", 1 );

					// Ensure our class was picked up..
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );

					// .. and that the message still came out ok ..
					expect( result.message      ).to.have.string( "a and 00001 is bad" );

				} );

			} );

			describe( "( <string:message>, <string:value1>, <string:FullClassName>, <number:value2> )", function () {

				it( "should return an instantiated Core Error Class object", function () {

					// Execute
					let result = errorManager.createError( "%s and %05d is bad", "a", "Core.error.ValidationError", 1 );

					// Ensure our class was picked up..
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );

					// .. and that the message still came out ok ..
					expect( result.message      ).to.have.string( "a and 00001 is bad" );

				} );

			} );

			describe( "( <string:ShortClassName>, <string:message>, <string:value1>, <number:value2> )", function () {

				it( "should infer `Core.error` and return an instantiated Core Error Class object", function () {

					// Execute
					let result = errorManager.createError( "ValidationError", "%s and %05d is bad", "a", 1 );

					// Ensure our class was picked up..
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );

					// .. and that the message still came out ok ..
					expect( result.message      ).to.have.string( "a and 00001 is bad" );

				} );

			} );

			describe( "( <string:message>, <string:value1>, <string:ShortClassName>, <number:value2> )", function () {

				it( "should infer `Core.error` and return an instantiated Core Error Class object", function () {

					// Execute
					let result = errorManager.createError( "%s and %05d is bad", "a", "ValidationError", 1 );

					// Ensure our class was picked up..
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );

					// .. and that the message still came out ok ..
					expect( result.message      ).to.have.string( "a and 00001 is bad" );

				} );

			} );


			describe( "( <Error:cause>, <string:message>, <string:value1>, <string:ShortClassName>, <number:value2> )", function () {

				let cause;

				beforeEach( function() {

					// Create a "cause"
					cause = new Error( "A.CAUSE" );

				} );

				it( "should infer `Core.error` and return an instantiated Core Error Class object", function () {

					// Execute
					let result = errorManager.createError( cause, "%s and %05d is bad", "a", "ValidationError", 1 );

					// Ensure our class was picked up..
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );

					// .. and that the message still came out ok ..
					expect( result.message      ).to.have.string( "a and 00001 is bad" );

				} );

				it( "should contain 'causal' information in the 'message' of the returned error", function () {

					// Execute
					let result = errorManager.createError( cause, "%s and %05d is bad", "a", "ValidationError", 1 );

					// Assert
					expect( result.message      ).to.have.string( cause.message );

				} );

				it( "should contain a 'cause' reference within the returned error", function () {

					// Execute
					let result = errorManager.createError( cause, "%s and %05d is bad", "a", "ValidationError", 1 );

					// Assert
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

			describe( "( <string:message>, <string:value1>, <string:ShortClassName>, <number:value2>, <Error:cause> )", function () {

				let cause;

				beforeEach( function() {

					// Create a "cause"
					cause = new Error( "A.CAUSE" );

				} );

				it( "should infer `Core.error` and return an instantiated Core Error Class object", function () {

					// Execute
					let result = errorManager.createError( "%s and %05d is bad", "a", "ValidationError", 1, cause );

					// Ensure our class was picked up..
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );

					// .. and that the message still came out ok ..
					expect( result.message      ).to.have.string( "a and 00001 is bad" );

				} );

				it( "should contain 'causal' information in the 'message' of the returned error", function () {

					// Execute
					let result = errorManager.createError( "%s and %05d is bad", "a", "ValidationError", 1, cause );

					// Assert
					expect( result.message      ).to.have.string( cause.message );

				} );

				it( "should contain a 'cause' reference within the returned error", function () {

					// Execute
					let result = errorManager.createError( "%s and %05d is bad", "a", "ValidationError", 1, cause );

					// Assert
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

		} );

		describe( "('info' Properties)", function () {

			describe( "( <string:message>, <string:value1>, <string:ShortClassName>, <number:value2>, <Error:cause>, <Object:info> )", function () {

				let cause;

				beforeEach( function() {

					// Create a "cause"
					cause = new Error( "A.CAUSE" );

				} );

				it( "should infer `Core.error` and return an instantiated Core Error Class object", function () {

					// Execute
					let result = errorManager.createError( "%s and %05d is bad", "a", "ValidationError", 1, cause, { hello: "world" } );

					// Ensure our class was picked up..
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );

				} );

				it( "should return an error with a properly formatted message", function () {

					// Execute
					let result = errorManager.createError( "%s and %05d is bad", "a", "ValidationError", 1, cause, { hello: "world" } );

					// Assert that the message came out ok ..
					expect( result.message      ).to.have.string( "a and 00001 is bad" );

				} );

				it( "should return an error imbued with additional 'info'", function () {

					// Execute
					let result = errorManager.createError( "%s and %05d is bad", "a", "ValidationError", 1, cause, { hello: "world" } );

					// Extract the 'info'
					let info = errorManager.info( result );

					// .. and assert that the test 'info' made it
					expect( info.hello ).to.equal( "world" );

				} );

				it( "should contain 'causal' information in the 'message' of the returned error", function () {

					// Execute
					let result = errorManager.createError( "%s and %05d is bad", "a", "ValidationError", 1, cause, { hello: "world" } );

					// Assert
					expect( result.message      ).to.have.string( cause.message );

				} );

				it( "should contain a 'cause' reference within the returned error", function () {

					// Execute
					let result = errorManager.createError( "%s and %05d is bad", "a", "ValidationError", 1, cause, { hello: "world" } );

					// Assert
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

			describe( "( <string:message>, <string:value1>, <Object:info>, <string:ShortClassName>, <number:value2>, <Error:cause> )", function () {

				let cause;

				beforeEach( function() {

					// Create a "cause"
					cause = new Error( "A.CAUSE" );

				} );

				it( "should infer `Core.error` and return an instantiated Core Error Class object", function () {

					// Execute
					let result = errorManager.createError( "%s and %05d is bad", "a", { hello: "world" }, "ValidationError", 1, cause );

					// Ensure our class was picked up..
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );

				} );

				it( "should return an error with a properly formatted message", function () {

					// Execute
					let result = errorManager.createError( "%s and %05d is bad", "a", { hello: "world" }, "ValidationError", 1, cause );

					// Assert that the message came out ok ..
					expect( result.message      ).to.have.string( "a and 00001 is bad" );

				} );

				it( "should return an error imbued with additional 'info'", function () {

					// Execute
					let result = errorManager.createError( "%s and %05d is bad", "a", { hello: "world" }, "ValidationError", 1, cause );

					// Extract the 'info'
					let info = errorManager.info( result );

					// .. and assert that the test 'info' made it
					expect( info.hello ).to.equal( "world" );

				} );

				it( "should contain 'causal' information in the 'message' of the returned error", function () {

					// Execute
					let result = errorManager.createError( "%s and %05d is bad", "a", { hello: "world" }, "ValidationError", 1, cause );

					// Assert
					expect( result.message      ).to.have.string( cause.message );

				} );

				it( "should contain a 'cause' reference within the returned error", function () {

					// Execute
					let result = errorManager.createError( "%s and %05d is bad", "a", { hello: "world" }, "ValidationError", 1, cause );

					// Assert
					expect( result.jse_cause ).to.equal( cause );

				} );

			} );

			describe( "( <Object:info>, <string:message>, <string:value1>, <Object:info>, <string:ShortClassName>, <number:value2>, <Error:cause>, <Object:info> )", function () {

				let cause;

				beforeEach( function() {

					// Create a "cause"
					cause = new Error( "A.CAUSE" );

				} );

				it( "should infer `Core.error` and return an instantiated Core Error Class object", function () {

					// Instantiate
					let result = errorManager.createError( { a: 1, x: 1 }, "%s and %05d is bad", "a", { b: 2, x: 2 }, "ValidationError", 1, cause, { c: 3, x: 3 } );

					// Ensure our class was picked up..
					expect( result.$amClassName ).to.equal( "Core.error.ValidationError" );

				} );

				it( "should return an error with a properly formatted message", function () {

					// Instantiate
					let result = errorManager.createError( { a: 1, x: 1 }, "%s and %05d is bad", "a", { b: 2, x: 2 }, "ValidationError", 1, cause, { c: 3, x: 3 } );

					// Assert that the message came out ok ..
					expect( result.message      ).to.have.string( "a and 00001 is bad" );

				} );

				it( "should contain 'causal' information in the 'message' of the returned error", function () {

					// Instantiate
					let result = errorManager.createError( { a: 1, x: 1 }, "%s and %05d is bad", "a", { b: 2, x: 2 }, "ValidationError", 1, cause, { c: 3, x: 3 } );

					// Assert
					expect( result.message      ).to.have.string( cause.message );

				} );

				it( "should contain a 'cause' reference within the returned error", function () {

					// Instantiate
					let result = errorManager.createError( { a: 1, x: 1 }, "%s and %05d is bad", "a", { b: 2, x: 2 }, "ValidationError", 1, cause, { c: 3, x: 3 } );

					// Assert
					expect( result.jse_cause ).to.equal( cause );

				} );

				it( "should merge all 'plain objects' into a single 'info' object", function () {

					// Instantiate
					let result = errorManager.createError( { a: 1, x: 1 }, "%s and %05d is bad", "a", { b: 2, x: 2 }, "ValidationError", 1, cause, { c: 3, x: 3 } );

					// Extract the 'info'
					let info = errorManager.info( result );

					// .. and assert that the test 'info' made it
					expect( info.a ).to.equal( 1 );
					expect( info.b ).to.equal( 2 );
					expect( info.c ).to.equal( 3 );

				} );

				it( "should give last-instance priority when merging 'info' objects", function () {

					// Instantiate
					let result = errorManager.createError( { a: 1, x: 1 }, "%s and %05d is bad", "a", { b: 2, x: 2 }, "ValidationError", 1, cause, { c: 3, x: 3 } );

					// Extract the 'info'
					let info = errorManager.info( result );

					// We should use the last value of 'x'
					expect( info.x ).to.equal( 3 );

				} );

			} );

		} );

	} );

	describe( "#throw", function () {

		let errorManager;

		before( function () {
			errorManager = Core.inst( "Core.error.Manager" );
		} );

		/*

		Note: Although `#throw()` supports a ton of different signatures, it usually passes its
		      params/arguments to`#createError()`, verbatim, so MOST of the multitude of available
		      signatures is covered by that method's tests.

		      For `#throw()`, we need to test the following:

		      	- The one, unique, signature that it provides: #throw( <Error> )
		      	  (which, unlike all of the other signatures, does not CREATE an error, but, rather, throws
		      	  and existing error object)

		      	- In all other cases, we'll test that it passes its arguments, verbatim, to `#createError()`

		      	- .. and we'll ensure that the error, whether created or not, is thrown.

		 */

		describe( "( <Error> )", function () {

			it( "should throw the provided error when it is a built-in Error", function() {

				let testError = new Error( TEST_ERROR_MESSAGE );

				// Part 1. Ensure that the `testError` gets thrown
				// .. any time we test for errors, we need a helper function
				function testThrow() {
					errorManager.throw( testError );
				}

				// Assert that it throws..
				expect( testThrow ).to.throw( Error );

				// Part 2. Inspect the thrown error
				let result;
				try {
					testThrow();
				} catch( err ) {
					result = err;
				}

				// We should receive EXACTLY the same error back..
				// (as opposed to a new instance that looks indentical)
				expect( result ).to.equal( testError );

				// Assert a few details
				expect( result.constructor.name ).to.equal( "Error" );
				expect( result                  ).to.be.an.instanceof( Error );
				expect( result.$amClassName     ).to.equal( undefined );
				expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

			} );

			it( "should throw the provided error when it is a Core Error Class instance", function() {

				let testError = errorManager.createError( "ValidationError", TEST_ERROR_MESSAGE );

				// Part 1. Ensure that the `testError` gets thrown
				// .. any time we test for errors, we need a helper function
				function testThrow() {
					errorManager.throw( testError );
				}

				// Assert that it throws..
				expect( testThrow ).to.throw( Error );

				// Part 2. Inspect the thrown error
				let result;
				try {
					testThrow();
				} catch( err ) {
					result = err;
				}

				// We should receive EXACTLY the same error back..
				// (as opposed to a new instance that looks indentical)
				expect( result ).to.equal( testError );

				// Assert a few details
				expect( result                  ).to.be.an.instanceof( Error );
				expect( result.$amClassName     ).to.equal( "Core.error.ValidationError" );
				expect( result.message          ).to.have.string( TEST_ERROR_MESSAGE );

			} );

		} );

		describe( "( <string:message>, <string:value1>, <Object:info>, <string:ShortClassName>, <number:value2>, <Error:cause> )", function () {

			let cause;
			let helperFn;

			beforeEach( function() {

				// Create a "cause"
				cause = new Error( "A.CAUSE" );

				// Define a helper that throws the error
				helperFn = function() {
					errorManager.throw( "%s and %05d is bad", "a", { hello: "world" }, "ValidationError", 1, cause );
				};

			} );

			it( "should infer `Core.error` and throw an instantiated Core Error Class object", function () {

				expect( helperFn ).to.throw( Core.error.ValidationError );

			} );

			it( "should throw an error with a properly formatted message", function () {

				// Throw & Catch
				let result;
				try {
					helperFn();
				} catch( err ) {
					result = err;
				}

				// Assert that the message came out ok ..
				expect( result.message      ).to.have.string( "a and 00001 is bad" );

			} );

			it( "should return an error imbued with additional 'info'", function () {

				// Throw & Catch
				let result;
				try {
					helperFn();
				} catch( err ) {
					result = err;
				}

				// Extract the 'info'
				let info = errorManager.info( result );

				// .. and assert that the test 'info' made it
				expect( info.hello ).to.equal( "world" );

			} );

			it( "should contain 'causal' information in the 'message' of the returned error", function () {

				// Throw & Catch
				let result;
				try {
					helperFn();
				} catch( err ) {
					result = err;
				}

				// Assert
				expect( result.message      ).to.have.string( cause.message );

			} );

			it( "should contain a 'cause' reference within the returned error", function () {

				// Throw & Catch
				let result;
				try {
					helperFn();
				} catch( err ) {
					result = err;
				}

				// Assert
				expect( result.jse_cause ).to.equal( cause );

			} );

		} );

	} );

	describe( "#_supportsCause()", function () {

		let errorManager;

		before( function () {
			errorManager = Core.inst( "Core.error.Manager" );
		} );

		it( "should return TRUE for Core Error Classes", function() {

			// Define our test constructor
			let testConstructor = Core.cls( "Core.error.GenericError" );

			// Execute the _supportsCause method
			let result = errorManager._supportsCause( testConstructor );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE for VError constructors", function() {

			// Define our test constructor
			let testConstructor = VERROR;

			// Execute the _supportsCause method
			let result = errorManager._supportsCause( testConstructor );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE for WError constructors", function() {

			// Define our test constructor
			let testConstructor = VERROR.WError;

			// Execute the _supportsCause method
			let result = errorManager._supportsCause( testConstructor );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return TRUE for SError constructors", function() {

			// Define our test constructor
			let testConstructor = VERROR.SError;

			// Execute the _supportsCause method
			let result = errorManager._supportsCause( testConstructor );

			// Assert
			expect( result ).to.equal( true );

		} );

		it( "should return FALSE for the built-in Error constructor", function() {

			// Define our test constructor
			let testConstructor = Error;

			// Execute the _supportsCause method
			let result = errorManager._supportsCause( testConstructor );

			// Assert
			expect( result ).to.equal( false );

		} );

		it( "should return FALSE for the built-in RangeError constructor", function() {

			// Define our test constructor
			let testConstructor = RangeError;

			// Execute the _supportsCause method
			let result = errorManager._supportsCause( testConstructor );

			// Assert
			expect( result ).to.equal( false );

		} );

	} );

} );
