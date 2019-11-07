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

// Alias a few errors that we'll be checking for...
const PropertyValidationError   = Core.cls( "Core.error.PropertyValidationError"   );
const DependencyValidationError = Core.cls( "Core.error.DependencyValidationError" );

describe( "Core.type.mixin.Validating", function () {

	describe( "#$validate()", function () {

		describe( "(Basic Functionality)", function () {

			it( "should forward calls to `Core.type.Validator::validate()`", function () {

				// We have a fixture for this...
				let fixture = Core.inst( "Test.fixture.type.mixin.validating.TestClassOne" );

				// Perform a validation..
				let res = fixture.passingValidate1();

				// Assert
				expect( res ).to.equal( "a" );

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

		describe( "(Default Values)", function () {

			it( "should NOT throw an error when a defaultValue is provided", function () {

				// Anytime we test for errors, we need to use a helper.
				function testDefaultValue() {

					// We have a fixture for this...
					let testInstance = Core.inst( "Test.fixture.type.mixin.validating.TestClassOne" );

					// Call `$validate()` directly (for simplicity's sake)
					// Note: $validate was not intended to be called directly and the error messages it produces will
					//       be malformed a bit. So, we won't look at the errors too closely; we're only testing
					//       to see if an error is thrown at all.
					return testInstance.$validate( 1, {
						isString     : true,
						defaultValue : "a_default_value"
					} );

				}

				// Assert
				expect( testDefaultValue ).to.not.throw( Error );

			} );


			it( "should return the defaultValue if it is provided and the target fails validation", function () {

				// Anytime we test for errors, we need to use a helper.
				function testDefaultValue() {

					// We have a fixture for this...
					let testInstance = Core.inst( "Test.fixture.type.mixin.validating.TestClassOne" );

					// Call `$validate()` directly (for simplicity's sake)
					// Note: $validate was not intended to be called directly and the error messages it produces will
					//       be malformed a bit. So, we won't look at the errors too closely; we're only testing
					//       to see if an error is thrown at all.
					return testInstance.$validate( 1, {
						isString     : true,
						defaultValue : "a_default_value"
					} );

				}

				// Assert
				expect( testDefaultValue() ).to.equal( "a_default_value" );

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

	describe.skip( "#$validateObject()", function () {

		describe( "(Basic Functionality)", function () {

			it( "should NOT throw when validation succeeds", function () {

				// Define the test object
				let testObject = {
					a : "hello",
					b : true
				};

				// Anytime we test for errors, we need to use a helper.
				function testObjectValidation() {

					// We have a fixture for this...
					let testInstance = Core.inst( "Test.fixture.type.mixin.validating.TestClassOne" );

					// Execute the test method
					return testInstance.objTestBasic( testObject );

				}

				// Assert
				expect( testObjectValidation ).to.not.throw( Error );

			} );

			it( "should throw when validation fails", function () {

				// Define the test object
				let testObject = {
					a : "hello",
					b : "not_a_boolean"
				};

				// Anytime we test for errors, we need to use a helper.
				function testObjectValidation() {

					// We have a fixture for this...
					let testInstance = Core.inst( "Test.fixture.type.mixin.validating.TestClassOne" );

					// Execute the test method
					return testInstance.objTestBasic( testObject );

				}

				// Assert
				expect( testObjectValidation ).to.throw( PropertyValidationError );

			} );

		} );

		describe( "(Global Options)", function () {

			it( "should NOT throw when a property meets its 'property-specific validation' and the 'global validation'", function () {

				// Define the test object
				let testObject = {
					a: 12
				};

				// Anytime we test for errors, we need to use a helper.
				function testObjectValidation() {

					// We have a fixture for this...
					let testInstance = Core.inst( "Test.fixture.type.mixin.validating.TestClassOne" );

					// Execute the test method
					return testInstance.objTestGlobalMergeA( testObject );

				}

				// Assert
				expect( testObjectValidation ).to.not.throw( Error );

			} );

			it( "should throw when a property meets its 'property-specific validation' but fails the 'global validation'", function () {

				// Define the test object
				let testObject = {
					a: 12.1
				};

				// Anytime we test for errors, we need to use a helper.
				function testObjectValidation() {

					// We have a fixture for this...
					let testInstance = Core.inst( "Test.fixture.type.mixin.validating.TestClassOne" );

					// Execute the test method
					return testInstance.objTestGlobalMergeA( testObject );

				}

				// Assert
				expect( testObjectValidation ).to.throw( PropertyValidationError );

			} );

			it( "should throw when a property meets the 'global validation' but fails its 'property-specific validation'", function () {

				// Define the test object
				let testObject = {
					a: 12.1
				};

				// Anytime we test for errors, we need to use a helper.
				function testObjectValidation() {

					// We have a fixture for this...
					let testInstance = Core.inst( "Test.fixture.type.mixin.validating.TestClassOne" );

					// Execute the test method
					return testInstance.objTestGlobalMergeB( testObject );

				}

				// Assert
				expect( testObjectValidation ).to.throw( PropertyValidationError );

			} );

			it( "should apply 'global validation' to all of an object's 'own properties' (even when no 'property-specific' rules are provided)", function () {

				// Define the test object
				let testObject = {
					someProp: "not_a_boolean"
				};

				// Anytime we test for errors, we need to use a helper.
				function testObjectValidation() {

					// We have a fixture for this...
					let testInstance = Core.inst( "Test.fixture.type.mixin.validating.TestClassOne" );

					// Execute the test method
					return testInstance.objDynamicTest( testObject, null, "isBoolean" );

				}

				// Assert
				expect( testObjectValidation ).to.throw( PropertyValidationError );

			} );

			it( "should apply 'global validation' to all of an object's 'own properties' (even when no MATCHING 'property-specific' rules are provided)", function () {

				// Define the test object
				let testObject = {
					a : 1,
					b : "not_a_number"
				};

				// Anytime we test for errors, we need to use a helper.
				function testObjectValidation() {

					// We have a fixture for this...
					let testInstance = Core.inst( "Test.fixture.type.mixin.validating.TestClassOne" );

					// Execute the test method
					return testInstance.objDynamicTest( testObject, { a: "isInteger" }, "isNumber" );

				}

				// Assert
				expect( testObjectValidation ).to.throw( PropertyValidationError );

			} );

			it( "should merge options in addition to instructions", function () {

				// Define the test object
				let testObject = {
					a : 1,
					b : null
				};

				// Anytime we test for errors, we need to use helpers.
				function failObjectValidation() {

					// We have a fixture for this...
					let testInstance = Core.inst( "Test.fixture.type.mixin.validating.TestClassOne" );

					// Execute the test method
					return testInstance.objDynamicTest( testObject, null, "isNumber" );

				}
				function passObjectValidation() {

					// We have a fixture for this...
					let testInstance = Core.inst( "Test.fixture.type.mixin.validating.TestClassOne" );

					// Execute the test method
					return testInstance.objDynamicTest( testObject, { b: { allowNull: true } }, "isNumber" );

				}

				// This one should fail ...
				expect( failObjectValidation ).to.throw( PropertyValidationError );

				// ... but this one should pass ...
				expect( passObjectValidation ).to.not.throw( Error );

			} );

			it( "should give property-specific options precedence over global options", function () {

				// Define the test object
				let testObject = {
					a : 1,
					b : null
				};


				// Anytime we test for errors, we need to use helpers.
				function failObjectValidation() {

					// We have a fixture for this...
					let testInstance = Core.inst( "Test.fixture.type.mixin.validating.TestClassOne" );

					// Execute the test method
					return testInstance.objDynamicTest( testObject, null, { isNumber: true, allowNull: false } );

				}
				function passObjectValidation() {

					// We have a fixture for this...
					let testInstance = Core.inst( "Test.fixture.type.mixin.validating.TestClassOne" );

					// Execute the test method
					return testInstance.objDynamicTest( testObject,
						{ b: { allowNull: true } },
						{ isNumber: true, allowNull: false }
					);

				}

				// This one should fail ...
				expect( failObjectValidation ).to.throw( PropertyValidationError );

				// ... but this one should pass ...
				expect( passObjectValidation ).to.not.throw( Error );

			} );

		} );

		describe( "(Default Values)", function () {

			it( "should apply property-specific defaults for missing values", function () {

				// Define the test object
				let testObject = {};

				// Anytime we test for errors, we need to use a helper.
				function testObjectValidation() {

					// We have a fixture for this...
					let testInstance = Core.inst( "Test.fixture.type.mixin.validating.TestClassOne" );

					// Execute the test method
					return testInstance.objDynamicTest( testObject,
						{
							a: {
								defaultValue: "defaulted"
							}
						}
					);

				}

				// Execute the helper
				let result = testObjectValidation();

				// Assert
				expect( result.a ).to.equal( "defaulted" );

			} );

			it( "should apply property-specific defaults for invalid values (variant #1)", function () {

				// Define the test object
				let testObject = {
					a: "not_a_number"
				};

				// Anytime we test for errors, we need to use a helper.
				function testObjectValidation() {

					// We have a fixture for this...
					let testInstance = Core.inst( "Test.fixture.type.mixin.validating.TestClassOne" );

					// Execute the test method
					return testInstance.objDynamicTest( testObject,
						{
							a: {
								isNumber     : true,
								defaultValue : "defaulted"
							}
						}
					);

				}

				// Execute the helper
				let result;
				try {
					result = testObjectValidation();
				} catch( err ) {
					Core.inspect( Core.errorManager.info( err ) );
				}


				// Assert
				expect( result.a ).to.equal( "defaulted" );

			} );

			it.skip( "should apply property-specific defaults for invalid values (variant #2)", function () {

				// Define the test object
				let testObject = {
					a: "not_a_number"
				};

				// Anytime we test for errors, we need to use a helper.
				function testObjectValidation() {

					// We have a fixture for this...
					let testInstance = Core.inst( "Test.fixture.type.mixin.validating.TestClassOne" );

					// Execute the test method
					return testInstance.objDynamicTest( testObject,
						{
							a: {
								defaultValue: "defaulted"
							}
						}, {
							isNumber: true
						}
					);

				}

				// Execute the helper
				let result;
				try {
					result = testObjectValidation();
				} catch( err ) {
					Core.inspect( Core.errorManager.info( err ) );
				}


				// Assert
				expect( result.a ).to.equal( "defaulted" );

			} );

			it( "should NOT apply property-specific defaults for valid values (variant #1)", function () {

				// Define the test object
				let testObject = {
					a: 42
				};

				// Anytime we test for errors, we need to use a helper.
				function testObjectValidation() {

					// We have a fixture for this...
					let testInstance = Core.inst( "Test.fixture.type.mixin.validating.TestClassOne" );

					// Execute the test method
					return testInstance.objDynamicTest( testObject,
						{
							a: {
								defaultValue: "defaulted"
							}
						}
					);

				}

				// Execute the helper
				let result = testObjectValidation();

				// Assert
				expect( result.a ).to.equal( 42 );

			} );


			it( "should NOT apply property-specific defaults for valid values (variant #2)", function () {

				// Define the test object
				let testObject = {
					a: 42
				};

				// Anytime we test for errors, we need to use a helper.
				function testObjectValidation() {

					// We have a fixture for this...
					let testInstance = Core.inst( "Test.fixture.type.mixin.validating.TestClassOne" );

					// Execute the test method
					return testInstance.objDynamicTest( testObject,
						{
							a: {
								defaultValue : "defaulted",
								isInteger    : true
							}
						}
					);

				}

				// Execute the helper
				let result = testObjectValidation();

				// Assert
				expect( result.a ).to.equal( 42 );

			} );

		} );

		describe( "(Error Decoration for Class Member Sources)", function () {

			it( "should indicate the source of validation errors", function () {

				// Define the test object
				let testObject = {
					a : "hello",
					b : "not_a_boolean"
				};

				// We have a fixture for this...
				let fixture = Core.inst( "Test.fixture.type.mixin.validating.TestClassOne" );

				// Throw & Catch
				let result;
				try {
					fixture.objTestBasic( testObject );
				} catch( err ) {
					result = err;
				}

				// Assert on parts of the error message
				expect( result.message ).to.have.string( "Validation failed" 			);
				expect( result.message ).to.have.string( "obj.b" 						);
				expect( result.message ).to.have.string( "TestClassOne#objTestBasic" 	);

				// Since the validating method was part of the class, we SHOULD NOT
				// have a 'called as' reference in the error..
				expect( result.message ).to.not.have.string( "called as" );


			} );

		} );

		describe( "(Error Decoration for Mixin Member Sources)", function () {


			it( "should indicate the source of validation errors", function () {

				// Define the test object
				let testObject = {
					a : "hello",
					b : "not_a_boolean"
				};

				// We have a fixture for this...
				let fixture = Core.inst( "Test.fixture.type.mixin.validating.TestClassOne" );

				// Throw & Catch
				let result;
				try {
					fixture.objTestMixin( testObject );
				} catch( err ) {
					result = err;
				}

				// Assert on parts of the error message
				expect( result.message ).to.have.string( "Validation failed" 			);
				expect( result.message ).to.have.string( "obj.b" 						);
				expect( result.message ).to.have.string( "TestMixinOne#objTestMixin" 	);

				// Since the validating method was part of the mixin, we SHOULD
				// have a 'called as' reference in the error..
				expect( result.message ).to.have.string( "called as" 					);
				expect( result.message ).to.have.string( "TestClassOne#objTestMixin" 	);


			} );

		} );

	} );

	describe( "#$validateParam()", function () {

		describe( "(Basic Functionality)", function () {

			it( "should forward calls to `Core.type.Validator::validate()`", function () {

				// We have a fixture for this...
				let fixture = Core.inst( "Test.fixture.type.mixin.validating.TestClassOne" );

				// Perform a validation..
				let res = fixture.paramTest1( "hello" );

				// Assert
				expect( res ).to.equal( "hello" );

			} );

			it( "should throw errors when validation fails", function () {

				// We have a fixture for this...
				let fixture = Core.inst( "Test.fixture.type.mixin.validating.TestClassOne" );

				// Any time we're testing for errors, we need to wrap with a helper
				function helperFn() {
					fixture.paramTest1( 42 );
				}

				// Assert
				expect( helperFn ).to.throw( Core.cls( "Core.error.ParamValidationError" ) );

			} );

		} );

		describe( "(Default Values)", function () {

			it( "should NOT throw an error when a defaultValue is provided", function () {

				// Anytime we test for errors, we need to use a helper.
				function testDefaultValue() {

					// We have a fixture for this...
					let testInstance = Core.inst( "Test.fixture.type.mixin.validating.TestClassOne" );

					// Call `$validateParam()` directly (for simplicity's sake)
					// Note: $validateParam was not intended to be called directly and the error messages it produces
					//       will be malformed a bit. So, we won't look at the errors too closely; we're only testing
					//       to see if an error is thrown at all.
					return testInstance.$validateParam( "someParam", 1, {
						isString     : true,
						defaultValue : "a_default_value"
					} );

				}

				// Assert
				expect( testDefaultValue ).to.not.throw( Error );

			} );


			it( "should return the defaultValue if it is provided and the target fails validation", function () {

				// Anytime we test for errors, we need to use a helper.
				function testDefaultValue() {

					// We have a fixture for this...
					let testInstance = Core.inst( "Test.fixture.type.mixin.validating.TestClassOne" );

					// Call `$validateParam()` directly (for simplicity's sake)
					// Note: $validateParam was not intended to be called directly and the error messages it produces
					//       will be malformed a bit. So, we won't look at the errors too closely; we're only testing
					//       to see if an error is thrown at all.
					return testInstance.$validateParam( "someParam", 1, {
						isString     : true,
						defaultValue : "a_default_value"
					} );

				}

				// Assert
				expect( testDefaultValue() ).to.equal( "a_default_value" );

			} );

		} );

		describe( "(Error Decoration for Class Member Sources)", function () {

			it( "should indicate the source of validation errors", function () {

				// We have a fixture for this...
				let fixture = Core.inst( "Test.fixture.type.mixin.validating.TestClassOne" );

				// Throw & Catch
				let result;
				try {
					fixture.paramTest1( 42 );
				} catch( err ) {
					result = err;
				}

				// Assert on parts of the error message
				expect( result.message ).to.have.string( "Validation failed" 		);
				expect( result.message ).to.have.string( "someParam" 				);
				expect( result.message ).to.have.string( "TestClassOne#paramTest1" 	);

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
					fixture.mixinParamTest1( 42 );
				} catch( err ) {
					result = err;
				}

				// Assert on parts of the error message
				expect( result.message ).to.have.string( "Validation failed" );
				expect( result.message ).to.have.string( "someParam" 				);
				expect( result.message ).to.have.string( "TestMixinOne#mixinParamTest1" );

				// Since the validating method was part of the mixin, we SHOULD
				// have a 'called as' reference in the error..
				expect( result.message ).to.have.string( "called as" );
				expect( result.message ).to.have.string( "TestClassOne#mixinParamTest1" );

			} );

		} );

	} );

	describe( "#$require", function () {

		describe( "( <any> )", function () {

			describe( "(Basic Functionality)", function () {

				it( "should test using `.defaultValidationInstruction` and throw for non-existent dependencies", function () {

					// Anytime we test for errors, we need to use a helper.
					function testRequire() {

						// We have a fixture for this...
						let testInstance = Core.inst( "Test.fixture.type.mixin.validating.RequireTestTwo" );

						// Call `$require()` directly (for simplicity's sake)
						// Note: $require was not intended to be called directly and the error messages it produces will
						//       be malformed a bit. So, we won't look at the errors too closely; we're only testing to
						//       see if an error is thrown at all.
						return testInstance.$require( "nonExistentDep" );

					}

					// Assert
					expect( testRequire ).to.throw( DependencyValidationError );

				} );

				it( "should test using `.defaultValidationInstruction` and throw for missing dependencies", function () {

					// Anytime we test for errors, we need to use a helper.
					function testRequire() {

						// We have a fixture for this...
						let testInstance = Core.inst( "Test.fixture.type.mixin.validating.RequireTestTwo" );

						// Call `$require()` directly (for simplicity's sake)
						// Note: $require was not intended to be called directly and the error messages it produces will
						//       be malformed a bit. So, we won't look at the errors too closely; we're only testing to
						//       see if an error is thrown at all.
						return testInstance.$require( "someDep" );

					}

					// Assert
					expect( testRequire ).to.throw( DependencyValidationError );

				} );

			} );

			describe( "(Error Decoration for Class Member Sources)", function () {

				it( "should indicate the source of validation errors", function () {

					// Throw & Catch
					let result;
					try {

						Core.inst( "Test.fixture.type.mixin.validating.RequireTestThree", {
							// intentionally skip classRequirement
							mixinRequirement: 42
						} );

					} catch( err ) {

						result = err;

					}

					// Assert on parts of the error message
					expect( result.message ).to.have.string( "Validation failed"			);
					expect( result.message ).to.have.string( "classRequirement"				);
					expect( result.message ).to.have.string( "RequireTestThree#$construct"	);

					// Since the validating method was part of the class, we SHOULD NOT
					// have a 'called as' reference in the error..
					expect( result.message ).to.not.have.string( "called as" );

				} );

			} );

			describe( "(Error Decoration for Mixin Member Sources)", function () {


				it( "should indicate the source of validation errors", function () {

					// Throw & Catch
					let result;
					try {

						Core.inst( "Test.fixture.type.mixin.validating.RequireTestThree", {
							classRequirement: 42
							// intentionally skip mixinRequirement
						} );

					} catch( err ) {

						result = err;

					}

					// Assert on parts of the error message
					expect( result.message ).to.have.string( "Validation failed"			);
					expect( result.message ).to.have.string( "mixinRequirement"				);
					expect( result.message ).to.have.string( "RequireMixinThree#$construct"	);

					// Since the validating method was part of the mixin, we SHOULD
					// have a 'called as' reference in the error..
					expect( result.message ).to.have.string( "called as" );
					expect( result.message ).to.have.string( "RequireTestThree#$construct"	);

				} );

			} );

		} );

		describe( "( <any>, <ValidationInstruction> )", function () {

			let requireTestValues;

			before( function() {
				requireTestValues = {
					CRA : "hello",
					CRB : true,
					MRA : "world",
					MRB : false
				};
			} );

			describe( "(Basic Functionality)", function () {

				it( "should NOT throw when all requirements are fulfilled", function () {

					// Locals
					let testInstance;

					// Anytime we test for errors, we need to use a helper.
					function testRequire() {

						// We have a fixture for this...
						testInstance = Core.inst( "Test.fixture.type.mixin.validating.RequireTestOne", {
							classRequirementA : requireTestValues.CRA,
							classRequirementB : requireTestValues.CRB,
							mixinRequirementA : requireTestValues.MRA,
							mixinRequirementB : requireTestValues.MRB
						} );

					}

					// Assert
					expect( testRequire ).to.not.throw( Error );

					// Sanity Check: Ensure that both $construct methods
					// were executed and all dependency values were stored.
					expect( testInstance._classRequirementA ).to.equal( requireTestValues.CRA );
					expect( testInstance._classRequirementB ).to.equal( requireTestValues.CRB );
					expect( testInstance._mixinRequirementA ).to.equal( requireTestValues.MRA );
					expect( testInstance._mixinRequirementB ).to.equal( requireTestValues.MRB );

				} );

				it( "should throw when requirements are missing", function () {

					// Anytime we test for errors, we need to use a helper.
					function testRequire() {

						// We have a fixture for this...
						Core.inst( "Test.fixture.type.mixin.validating.RequireTestOne", {
							classRequirementA : requireTestValues.CRA,
							// intentionally skip classRequirementB
							mixinRequirementA : requireTestValues.MRA,
							mixinRequirementB : requireTestValues.MRB
						} );

					}

					// Assert
					expect( testRequire ).to.throw( Core.cls( "Core.error.DependencyValidationError" ) );

				} );

				it( "should throw when requirements are invalid", function () {

					// Anytime we test for errors, we need to use a helper.
					function testRequire() {

						// We have a fixture for this...
						Core.inst( "Test.fixture.type.mixin.validating.RequireTestOne", {
							classRequirementA : requireTestValues.CRA,
							classRequirementB : "not_a_boolean",
							mixinRequirementA : requireTestValues.MRA,
							mixinRequirementB : requireTestValues.MRB
						} );

					}

					// Assert
					expect( testRequire ).to.throw( Core.cls( "Core.error.DependencyValidationError" ) );

				} );

			} );

			describe( "(Default Values)", function () {

				it( "should NOT throw an error when a defaultValue is provided", function () {

					// Anytime we test for errors, we need to use a helper.
					function testDefaultValue() {

						// We have a fixture for this...
						let testInstance = Core.inst( "Test.fixture.type.mixin.validating.RequireTestOne", {
							classRequirementA : requireTestValues.CRA,
							classRequirementB : requireTestValues.CRB,
							mixinRequirementA : requireTestValues.MRA,
							mixinRequirementB : requireTestValues.MRB
						} );

						// Call `$require()` directly (for simplicity's sake)
						// Note: $require was not intended to be called directly and the error messages it produces will
						//       be malformed a bit. So, we won't look at the errors too closely; we're only testing to
						//       see if an error is thrown at all.
						return testInstance.$require( "nonExistentDependency", {
							isString     : true,
							defaultValue : "a_default_value"
						} );

					}

					// Assert
					expect( testDefaultValue ).to.not.throw( Error );

				} );

				it( "should return the defaultValue if it is provided and the target fails validation", function () {

					// Anytime we test for errors, we need to use a helper.
					function testDefaultValue() {

						// We have a fixture for this...
						let testInstance = Core.inst( "Test.fixture.type.mixin.validating.RequireTestOne", {
							classRequirementA : requireTestValues.CRA,
							classRequirementB : requireTestValues.CRB,
							mixinRequirementA : requireTestValues.MRA,
							mixinRequirementB : requireTestValues.MRB
						} );

						// Call `$require()` directly (for simplicity's sake)
						// Note: $require was not intended to be called directly and the error messages it produces will
						//       be malformed a bit. So, we won't look at the errors too closely; we're only testing to
						//       see if an error is thrown at all.
						return testInstance.$require( "nonExistentDependency", {
							isString     : true,
							defaultValue : "a_default_value"
						} );

					}

					// Assert
					expect( testDefaultValue() ).to.equal( "a_default_value" );

				} );


				// --


				it( "should NOT throw for non-existent dependencies when ONLY a defaultValue is provided", function () {

					// Anytime we test for errors, we need to use a helper.
					function testDefaultValue() {

						// We have a fixture for this...
						let testInstance = Core.inst( "Test.fixture.type.mixin.validating.RequireTestTwo" );

						// Call `$require()` directly (for simplicity's sake)
						// Note: $require was not intended to be called directly and the error messages it produces will
						//       be malformed a bit. So, we won't look at the errors too closely; we're only testing to
						//       see if an error is thrown at all.
						return testInstance.$require( "nonExistentDep", {
							// We ONLY provide a default value...
							defaultValue: "a_default_value"
						} );

					}

					// Assert
					expect( testDefaultValue ).to.not.throw( Error );

				} );

				it( "should return the defaultValue for non-existent dependencies when ONLY a defaultValue is provided", function () {

					// Anytime we test for errors, we need to use a helper.
					function testDefaultValue() {

						// We have a fixture for this...
						let testInstance = Core.inst( "Test.fixture.type.mixin.validating.RequireTestTwo" );

						// Call `$require()` directly (for simplicity's sake)
						// Note: $require was not intended to be called directly and the error messages it produces will
						//       be malformed a bit. So, we won't look at the errors too closely; we're only testing to
						//       see if an error is thrown at all.
						return testInstance.$require( "nonExistingDep", {
							// We ONLY provide a default value...
							defaultValue: "a_default_value"
						} );

					}

					// Assert
					expect( testDefaultValue() ).to.equal( "a_default_value" );

				} );

				it( "should return the defaultValue for missing dependencies when ONLY a defaultValue is provided", function () {

					// Anytime we test for errors, we need to use a helper.
					function testDefaultValue() {

						// We have a fixture for this...
						let testInstance = Core.inst( "Test.fixture.type.mixin.validating.RequireTestTwo" );

						// Call `$require()` directly (for simplicity's sake)
						// Note: $require was not intended to be called directly and the error messages it produces will
						//       be malformed a bit. So, we won't look at the errors too closely; we're only testing to
						//       see if an error is thrown at all.
						return testInstance.$require( "someDep", {
							// We ONLY provide a default value...
							defaultValue: "a_default_value"
						} );

					}

					// Assert
					expect( testDefaultValue() ).to.equal( "a_default_value" );

				} );




			} );

			describe( "(Error Decoration for Class Member Sources)", function () {

				it( "should indicate the source of validation errors", function () {

					// Throw & Catch
					let result;
					try {

						Core.inst( "Test.fixture.type.mixin.validating.RequireTestOne", {
							classRequirementA : requireTestValues.CRA,
							// intentionally skip classRequirementB
							mixinRequirementA : requireTestValues.MRA,
							mixinRequirementB : requireTestValues.MRB
						} );

					} catch( err ) {

						result = err;

					}

					// Assert on parts of the error message
					expect( result.message ).to.have.string( "Validation failed" 		 );
					expect( result.message ).to.have.string( "classRequirementB" 		 );
					expect( result.message ).to.have.string( "RequireTestOne#$construct" );

					// Since the validating method was part of the class, we SHOULD NOT
					// have a 'called as' reference in the error..
					expect( result.message ).to.not.have.string( "called as" );

				} );

			} );

			describe( "(Error Decoration for Mixin Member Sources)", function () {


				it( "should indicate the source of validation errors", function () {

					// Throw & Catch
					let result;
					try {

						Core.inst( "Test.fixture.type.mixin.validating.RequireTestOne", {
							classRequirementA : requireTestValues.CRA,
							classRequirementB : requireTestValues.CRB,
							mixinRequirementA : requireTestValues.MRA,
							mixinRequirementB : "not_a_boolean"
						} );

					} catch( err ) {

						result = err;

					}

					// Assert on parts of the error message
					expect( result.message ).to.have.string( "Validation failed" 		 );
					expect( result.message ).to.have.string( "mixinRequirementB" 		 );
					expect( result.message ).to.have.string( "RequireMixinOne#$construct" );

					// Since the validating method was part of the mixin, we SHOULD
					// have a 'called as' reference in the error..
					expect( result.message ).to.have.string( "called as" );
					expect( result.message ).to.have.string( "RequireTestOne#$construct" );

				} );

			} );

		} );

	} );

} );
