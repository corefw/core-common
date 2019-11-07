/**
 * @file
 * Defines tests for the Core.util.mixin.Configurable mixin.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */



/* eslint no-console: "off", require-jsdoc: "off", func-style: "off", no-extra-bind: "off", no-unused-vars: "off", no-undef: "off", space-in-parens: "off" */

// Alias a few errors that we'll be checking for...
const PropertyValidationError   = Core.cls( "Core.error.PropertyValidationError"   );
//const DependencyValidationError = Core.cls( "Core.error.DependencyValidationError" );


describe( "Core.util.mixin.Configurable", function () {

	let testConfigObject;

	beforeEach( function () {

		testConfigObject = {
			i : 1,
			b : true,
			s : "a_string"
		};

	} );

	describe( "#$parseCfg()", function () {

		describe( "(With Peer: Core.type.mixin.Validating)", function () {

			let fixture;

			beforeEach( function () {

				// We have a fixture for this...
				fixture    = Core.inst( "Test.fixture.util.mixin.configurable.ValidatingClass" );

			} );

			describe( "(Type-Independent Tests)", function () {

				it( "should apply default values for missing properties in the config object", function () {

					let result = fixture.$parseCfg( testConfigObject, {
						c: 1
					} );

					expect( result.c ).to.equal( 1 );

				} );

				it( "should not apply default values for existing properties in the config object", function () {

					let result = fixture.$parseCfg( testConfigObject, {
						i: 99
					} );

					expect( result.i ).to.equal( 1 );

				} );

				it( "should allow the default value to be specified in the property options object", function () {

					let result = fixture.$parseCfg( testConfigObject, {
						c: {
							defaultValue: 1
						}
					} );

					expect( result.c ).to.equal( 1 );

				} );

				it( "should interpret empty property options objects as { defaultValue: null }", function () {

					let result = fixture.$parseCfg( testConfigObject, {
						c: {}
					} );

					expect( result.c ).to.equal( null );

				} );

				it( "should apply a NULL default value when specified", function () {

					let result = fixture.$parseCfg( testConfigObject, {
						c: null
					} );

					expect( result.c ).to.equal( null );

				} );

				it( "should allow custom validation options", function () {

					function testValidation() {

						fixture.$parseCfg( testConfigObject, {
							b: {
								validate: {
									isBoolean: false
								}
							}
						} );

					}

					expect( testValidation ).to.throw( PropertyValidationError );

				} );

				it( "should apply the default value specified in the property options when validation fails", function () {

					let result = fixture.$parseCfg( testConfigObject, {
						b: {
							validate: {
								isBoolean: false
							},
							defaultValue: "a_default_value"
						}
					} );

					expect( result.b ).to.equal( "a_default_value" );

				} );

				it( "should apply the default value specified in the validation options when validation fails", function () {

					let result = fixture.$parseCfg( testConfigObject, {
						b: {
							validate: {
								isBoolean    : false,
								defaultValue : "a_default_value"
							},
						}
					} );

					expect( result.b ).to.equal( "a_default_value" );

				} );

				it( "should give precedence to default values defined in the property options", function () {

					let result = fixture.$parseCfg( testConfigObject, {
						b: {
							validate: {
								isBoolean    : false,
								defaultValue : "a_validate_options_default_value"
							},
							defaultValue: "a_property_options_default_value"
						}
					} );

					expect( result.b ).to.equal( "a_property_options_default_value" );

				} );

				it( "should call the defaultValue function, if provided, to resolve a default value", function () {

					let result = fixture.$parseCfg( testConfigObject, {
						b: {
							validate: {
								isBoolean    : false,
								defaultValue : "a_validate_options_default_value"
							},
							defaultValue: function() {
								return "a_default_returned_from_a_function";
							}
						}
					} );

					expect( result.b ).to.equal( "a_default_returned_from_a_function" );

				} );

			} );

			describe( "(For Boolean Properties)", function () {

				it( "should infer the boolean type when given a boolean default", function () {

					let result = fixture.$parseCfg( testConfigObject, {
						s: {
							defaultValue: true
						}
					} );

					expect( result.s ).to.equal( true );

				} );

				it( "should NOT infer the boolean type when given an 'any' type", function () {

					let result = fixture.$parseCfg( testConfigObject, {
						s: {
							defaultValue : true,
							type         : "any"
						}
					} );

					expect( result.s ).to.equal( "a_string" );

				} );

				it( "should throw an error when no default value is provided, but the type is specified as 'boolean', and an invalid value is given", function () {

					function testValidation() {

						fixture.$parseCfg( testConfigObject, {
							s: {
								type: "boolean"
							}
						} );

					}

					expect( testValidation ).to.throw( PropertyValidationError );

				} );

			} );

			describe( "(For Number Properties)", function () {

				it( "should infer the number type when given a number default", function () {

					let result = fixture.$parseCfg( testConfigObject, {
						s: {
							defaultValue: 1
						}
					} );

					expect( result.s ).to.equal( 1 );

				} );

				it( "should NOT infer the number type when given an 'any' type", function () {

					let result = fixture.$parseCfg( testConfigObject, {
						s: {
							defaultValue : 1,
							type         : "any"
						}
					} );

					expect( result.s ).to.equal( "a_string" );

				} );

				it( "should throw an error when no default value is provided, but the type is specified as 'boolean', and an invalid value is given", function () {

					function testValidation() {

						fixture.$parseCfg( testConfigObject, {
							s: {
								type: "number"
							}
						} );

					}

					expect( testValidation ).to.throw( PropertyValidationError );

				} );

			} );

			describe( "(For String Properties)", function () {

				it( "should infer the string type when given a string default", function () {

					let result = fixture.$parseCfg( testConfigObject, {
						i: {
							defaultValue: "some_string"
						}
					} );

					expect( result.i ).to.equal( "some_string" );

				} );

				it( "should NOT infer the string type when given an 'any' type", function () {

					let result = fixture.$parseCfg( testConfigObject, {
						i: {
							defaultValue : "some_string",
							type         : "any"
						}
					} );

					expect( result.i ).to.equal( 1 );

				} );

				it( "should throw an error when no default value is provided, but the type is specified as 'string', and an invalid value is given", function () {

					function testValidation() {

						fixture.$parseCfg( testConfigObject, {
							i: {
								type: "string"
							}
						} );

					}

					expect( testValidation ).to.throw( PropertyValidationError );

				} );

			} );

			describe( "(For Everything Else)", function () {

				it( "should NOT infer a type when given a default of an unrecognized type", function () {

					let result = fixture.$parseCfg( testConfigObject, {
						s: {
							defaultValue: new Map()
						}
					} );

					expect( result.s ).to.equal( "a_string" );

				} );

				it( "should NOT throw an error when the type is specified as an unknown type and no `validate` config is provided", function () {

					function testValidation() {

						fixture.$parseCfg( testConfigObject, {
							s: {
								type: "somethingStrange"
							}
						} );

					}

					expect( testValidation ).to.not.throw( PropertyValidationError );

				} );

				it( "should throw an error when the type is specified as an unknown type, but a `validate` config is provided, and validation fails", function () {

					function testValidation() {

						fixture.$parseCfg( testConfigObject, {
							s: {
								type     : "somethingStrange",
								validate : {
									isBoolean: true
								}
							}
						} );

					}

					expect( testValidation ).to.throw( PropertyValidationError );

				} );

			} );

		} );

		describe( "(Without Peer: Core.type.mixin.Validating)", function () {

			let fixture;

			beforeEach( function () {

				// We have a fixture for this...
				fixture    = Core.inst( "Test.fixture.util.mixin.configurable.NonValidatingClass" );

			} );

			describe( "(Type-Independent Tests)", function () {

				it( "should throw an error if ANY `validate` config is passed", function () {

					function testValidation() {

						fixture.$parseCfg( testConfigObject, {
							b: {
								validate: {
									isBoolean: true
								}
							}
						} );

					}

					expect( testValidation ).to.throw( PropertyValidationError );

				} );

				it( "should apply default values for missing properties in the config object", function () {

					let result = fixture.$parseCfg( testConfigObject, {
						c: 1
					} );

					expect( result.c ).to.equal( 1 );

				} );

				it( "should not apply default values for existing properties in the config object", function () {

					let result = fixture.$parseCfg( testConfigObject, {
						i: 99
					} );

					expect( result.i ).to.equal( 1 );

				} );

				it( "should allow the default value to be specified in the property options object", function () {

					let result = fixture.$parseCfg( testConfigObject, {
						c: {
							defaultValue: 1
						}
					} );

					expect( result.c ).to.equal( 1 );

				} );

				it( "should interpret empty property options objects as { defaultValue: null }", function () {

					let result = fixture.$parseCfg( testConfigObject, {
						c: {}
					} );

					expect( result.c ).to.equal( null );

				} );

				it( "should apply a NULL default value when specified", function () {

					let result = fixture.$parseCfg( testConfigObject, {
						c: null
					} );

					expect( result.c ).to.equal( null );

				} );

				it( "should accept ANY config value, even when given a default with a recognized type", function () {

					let result = fixture.$parseCfg( testConfigObject, {
						s: {
							defaultValue: true
						}
					} );

					expect( result.s ).to.equal( "a_string" );

				} );

				it( "should accept ANY config value, even (or especially) when given the 'any' type", function () {

					let result = fixture.$parseCfg( testConfigObject, {
						s: {
							defaultValue : 1,
							type         : "any"
						}
					} );

					expect( result.s ).to.equal( "a_string" );

				} );

				it( "should NOT throw an error when the type is specified and an invalid value is given", function () {

					function testValidation() {

						fixture.$parseCfg( testConfigObject, {
							s: {
								type: "boolean"
							}
						} );

					}

					expect( testValidation ).to.not.throw( PropertyValidationError );

				} );

			} );

		} );

	} );

	describe( "#$spliceCfg()", function () {

		let fixture;

		beforeEach( function () {

			// We have a fixture for this...
			fixture    = Core.inst( "Test.fixture.util.mixin.configurable.ValidatingClass" );

		} );

		it( "should generate a spliced config", function () {

			// Create a splice
			let splice = fixture.$spliceCfg( testConfigObject, {
				s: null
			} );

			// Assert ...
			expect( splice.s ).to.equal( "a_string" );

		} );

		it( "should remove properties from the original config object by-reference", function () {

			// Sanity check
			expect( testConfigObject.s ).to.equal( "a_string" );

			// Create a splice
			let splice = fixture.$spliceCfg( testConfigObject, {
				s: null
			} );

			// Assert
			expect( testConfigObject.s ).to.equal( undefined );

		} );

		it( "should create default values on the spliced config, as needed", function () {

			// Create a splice
			let splice = fixture.$spliceCfg( testConfigObject, {
				somethingMissing: "no_longer_missing"
			} );

			// Assert
			expect( splice.somethingMissing ).to.equal( "no_longer_missing" );

		} );


		it( "should NOT create default values on the original config", function () {

			// Create a splice
			let splice = fixture.$spliceCfg( testConfigObject, {
				somethingMissing: "no_longer_missing"
			} );

			// Assert
			expect( testConfigObject.somethingMissing ).to.equal( undefined );

		} );

		it( "should throw validation errors, as expected", function () {

			function testValidation() {

				fixture.$spliceCfg( testConfigObject, {
					s: {
						validate: {
							isBoolean: true
						}
					}
				} );

			}

			expect( testValidation ).to.throw( PropertyValidationError );

		} );


	} );

} );
