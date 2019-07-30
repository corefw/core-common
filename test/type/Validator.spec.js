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

/* eslint func-style: "off", require-jsdoc: "off" */

// Alias a few errors that we'll be checking for...
const ValidationError = Core.cls( "Core.error.ValidationError" );

const _ = Core.dep( "_" );

describe( "Core.type.Validator", function () {

	let validator;

	before( function () {
		validator = testHelpers.initTestDependency( "Core.type.Validator" );
	} );

	describe( "#_normalizeValidationInstructions", function () {

		describe( "( <object> )", function () {

			it( "should convert non-special properties into $all instructions", function () {

				// Define the test instruction
				let testInstruction = {
					isNull     : true,
					instanceOf : "Core.fs.File"
				};

				// Define the expected result
				let expectedResult = {
					$all: [
						{
							$check  : "isNull",
							$args   : [],
							$negate : false,
						}, {
							$check  : "instanceOf",
							$args   : [ "Core.fs.File" ],
							$negate : false,
						}
					]
				};

				// Execute the normalize method
				let result = validator._normalizeValidationInstructions( testInstruction );

				// Assert
				expect( result ).to.eql( expectedResult );

			} );

			it( "should convert arrays into an object with a single $any collection", function () {

				// Define the test instruction
				let testInstruction = [ "isNull", "isBoolean" ];

				// Define the expected result
				let expectedResult = {
					$any: [
						{
							$check  : "isNull",
							$args   : [],
							$negate : false,
						}, {
							$check  : "isBoolean",
							$args   : [ ],
							$negate : false,
						}
					]
				};

				// Execute the normalize method
				let result = validator._normalizeValidationInstructions( testInstruction );

				// Assert
				expect( result ).to.eql( expectedResult );

			} );

			it( "should flatten $all collections that have only one check", function () {

				// Define the test instruction
				let testInstruction = {
					$all: [ {
						$all: [ {
							$all: [ {
								$all: [ "deepestA", "deepestB" ]
							} ]
						} ]
					} ]
				};

				// Define the expected result
				let expectedResult = {
					$all: [
						{
							$check  : "deepestA",
							$args   : [],
							$negate : false
						},
						{
							$check  : "deepestB",
							$args   : [],
							$negate : false
						}
					]
				};

				// Execute the normalize method
				let result = validator._normalizeValidationInstructions( testInstruction );

				// Assert
				expect( result ).to.eql( expectedResult );

			} );

			it( "should NOT flatten bottom-most $all collections that have only one check", function () {

				// Define the test instruction
				let testInstruction = {
					$all: [ {
						$all: [ {
							$all: [ {
								$all: [ "deepestA" ]
							} ]
						} ]
					} ]
				};

				// Define the expected result
				let expectedResult = {
					$all: [
						{
							$check  : "deepestA",
							$args   : [],
							$negate : false
						}
					]
				};

				// Execute the normalize method
				let result = validator._normalizeValidationInstructions( testInstruction );

				// Assert
				expect( result ).to.eql( expectedResult );

			} );

			it( "should merge child $all collections into parent $all collections", function () {

				// Define the test instruction
				let testInstruction = {
					$all: [
						[ "check1", "check2" ],  // <-- $any (should not be merged)
						{
							$all: [
								"check3", "check4",
								{
									$all: [
										"check5", "check6"
									]
								}
							]
						}
					]
				};

				// Define the expected result
				let expectedResult = {
					$all: [
						{
							$any: [
								{
									$check  : "check1",
									$args   : [],
									$negate : false,
								}, {
									$check  : "check2",
									$args   : [],
									$negate : false,
								}
							]
						}, {
							$check  : "check3",
							$args   : [],
							$negate : false,
						}, {
							$check  : "check4",
							$args   : [],
							$negate : false,
						}, {
							$check  : "check5",
							$args   : [],
							$negate : false,
						}, {
							$check  : "check6",
							$args   : [],
							$negate : false,
						}
					]
				};

				// Execute the normalize method
				let result = validator._normalizeValidationInstructions( testInstruction );
				//Core.inspect( result );

				// Assert
				expect( result ).to.eql( expectedResult );

			} );

			it( "should flatten $any collections that have only one check", function () {

				// Define the test instruction
				let testInstruction = {
					$any: [ {
						$any: [ {
							$any: [ {
								$any: [ "deepestA", "deepestB" ]
							} ]
						} ]
					} ]
				};

				// Define the expected result
				let expectedResult = {
					$any: [
						{
							$check  : "deepestA",
							$args   : [],
							$negate : false
						},
						{
							$check  : "deepestB",
							$args   : [],
							$negate : false
						}
					]
				};

				// Execute the normalize method
				let result = validator._normalizeValidationInstructions( testInstruction );

				// Assert
				expect( result ).to.eql( expectedResult );

			} );

			it( "should flatten $any collections that have only one check (array test)", function () {

				// Define the test instruction
				let testInstruction = [ [ [ [ [ [ "deepestA", "deepestB" ] ] ] ] ] ];

				// Define the expected result
				let expectedResult = {
					$any: [
						{
							$check  : "deepestA",
							$args   : [],
							$negate : false
						},
						{
							$check  : "deepestB",
							$args   : [],
							$negate : false
						}
					]
				};

				// Execute the normalize method
				let result = validator._normalizeValidationInstructions( testInstruction );

				// Assert
				expect( result ).to.eql( expectedResult );

			} );

			it( "should NOT flatten bottom-most $any collections that have only one check (array test)", function () {

				// Define the test instruction
				let testInstruction = [ [ [ [ [ [ "deepestA" ] ] ] ] ] ];

				// Define the expected result
				let expectedResult = {
					$any: [
						{
							$check  : "deepestA",
							$args   : [],
							$negate : false
						}
					]
				};

				// Execute the normalize method
				let result = validator._normalizeValidationInstructions( testInstruction );

				// Assert
				expect( result ).to.eql( expectedResult );

			} );

			it( "should merge child $any collections into parent $any collections", function () {

				// Define the test instruction
				let testInstruction = {
					$any: [
						{
							$all: [ "check1", "check2" ] // <-- $all (should not be merged)
						},
						{
							$any: [
								"check3", "check4",
								{
									$any: [
										"check5", "check6"
									]
								}
							]
						}
					]
				};

				// Define the expected result
				let expectedResult = {
					$any: [
						{
							$all: [
								{
									$check  : "check1",
									$args   : [],
									$negate : false,
								}, {
									$check  : "check2",
									$args   : [],
									$negate : false,
								}
							]
						}, {
							$check  : "check3",
							$args   : [],
							$negate : false,
						}, {
							$check  : "check4",
							$args   : [],
							$negate : false,
						}, {
							$check  : "check5",
							$args   : [],
							$negate : false,
						}, {
							$check  : "check6",
							$args   : [],
							$negate : false,
						}
					]
				};

				// Execute the normalize method
				let result = validator._normalizeValidationInstructions( testInstruction );

				// Assert
				expect( result ).to.eql( expectedResult );

			} );

			it( "should flag returned values as normalized", function() {

				// Define the test instruction
				let testInstruction = "isString";

				// Execute the normalize method
				let result = validator._normalizeValidationInstructions( testInstruction );

				// Assert
				expect( result[ Core.constants.validation.IS_NORMALIZED_INSTRUCTION ] ).to.equal( true );

			} );

			it( "should not modify instructions that are already well-formatted", function() {

				// Define the test instruction
				let testInstruction = { "$all": [ { "$check": "isString", "$args": [], "$negate": false } ] };

				// Define the expected result
				let expectedResult = testInstruction;

				// Execute the normalize method
				let result = validator._normalizeValidationInstructions( testInstruction );

				// Assert
				expect( result ).to.eql( expectedResult );

			} );

			it( "should be idempotent", function() {

				// Define the test instruction
				let testInstruction = { "$all": [ { "$check": "isString", "$args": [], "$negate": false } ] };

				// Locals
				let lastResult	= _.clone( testInstruction );
				let result;

				// Normalize ten times
				for( let i = 0; i < 10; i++ ) {

					// Normalize
					result = validator._normalizeValidationInstructions( lastResult );

					// Assert
					expect( result ).to.eql( lastResult 		);
					expect( result ).to.eql( testInstruction 	);

					// Save for the next run..
					lastResult = result;

				}

			} );

		} );

		describe( "( <string> )", function () {

			it( "should convert string instructions into an $all collection with a single check", function () {

				// Define the test instruction
				let testInstruction = "isNull";

				// Define the expected result
				let expectedResult = {
					$all: [
						{
							$check  : "isNull",
							$args   : [],
							$negate : false,
						}
					]
				};

				// Execute the normalize method
				let result = validator._normalizeValidationInstructions( testInstruction );

				// Assert
				expect( result ).to.eql( expectedResult );

			} );

			it( "should handle \"!\" negation", function () {

				// Define the test instruction
				let testInstruction = "!isNull";

				// Define the expected result
				let expectedResult = {
					$all: [
						{
							$check  : "isNull",
							$args   : [],
							$negate : true,
						}
					]
				};

				// Execute the normalize method
				let result = validator._normalizeValidationInstructions( testInstruction );

				// Assert
				expect( result ).to.eql( expectedResult );

			} );

			it( "should handle \"not\" negation", function () {

				// Define the test instruction
				let testInstruction = "notNull";

				// Define the expected result
				let expectedResult = {
					$all: [
						{
							$check  : "Null",	// Note: "is" will be added during evaluation
							$args   : [],
							$negate : true,
						}
					]
				};

				// Execute the normalize method
				let result = validator._normalizeValidationInstructions( testInstruction );

				// Assert
				expect( result ).to.eql( expectedResult );

			} );

			it( "should handle \"non\" negation", function () {

				// Define the test instruction
				let testInstruction = "nonNull";

				// Define the expected result
				let expectedResult = {
					$all: [
						{
							$check  : "Null",	// Note: "is" will be added during evaluation
							$args   : [],
							$negate : true,
						}
					]
				};

				// Execute the normalize method
				let result = validator._normalizeValidationInstructions( testInstruction );

				// Assert
				expect( result ).to.eql( expectedResult );

			} );

			it( "should handle double negation", function () {

				// Define the test instruction
				let testInstruction = "!nonNull";

				// Define the expected result
				let expectedResult = {
					$all: [
						{
							$check  : "Null",	// Note: "is" will be added during evaluation
							$args   : [],
							$negate : false,
						}
					]
				};

				// Execute the normalize method
				let result = validator._normalizeValidationInstructions( testInstruction );

				// Assert
				expect( result ).to.eql( expectedResult );

			} );

			it( "should handle triple negation", function () {

				// Define the test instruction
				let testInstruction = "not!nonNull";

				// Define the expected result
				let expectedResult = {
					$all: [
						{
							$check  : "Null",	// Note: "is" will be added during evaluation
							$args   : [],
							$negate : true,
						}
					]
				};

				// Execute the normalize method
				let result = validator._normalizeValidationInstructions( testInstruction );

				// Assert
				expect( result ).to.eql( expectedResult );

			} );

		} );

	} );

	describe( "#mergeInstructions", function () {

		function doMergeTest( ...instructions ) {

			let raw = validator.mergeInstructions( ...instructions );
			return validator._normalizeValidationInstructions( raw );

		}

		it( "should merge simple instructions", function () {

			// Execute the test
			let result = doMergeTest( "isString", "isBoolean" );

			// Define expectations
			let expectedResult = {
				$all: [
					{
						$check  : "isString",
						$args   : [],
						$negate : false,
					}, {
						$check  : "isBoolean",
						$args   : [],
						$negate : false,
					},
				],
			};

			// Assert
			expect( result ).to.eql( expectedResult );

		} );

		it( "should flatten instructions when possible", function () {

			// Execute the test
			let result = doMergeTest( "isString", { isBoolean: true, isNull: true } );

			// Define expectations
			let expectedResult = {
				$all: [
					{
						$check  : "isString",
						$args   : [],
						$negate : false,
					}, {
						$check  : "isBoolean",
						$args   : [],
						$negate : false,
					}, {
						$check  : "isNull",
						$args   : [],
						$negate : false,
					},
				],
			};

			// Assert
			expect( result ).to.eql( expectedResult );

		} );

	} );

	describe( ".checks", function () {

		it( "should automatically populate built-in checks", function () {
			expect( validator.checks.has( "isSet" ) ).to.equal( true );
		} );

	} );

	describe( "#executeCheck", function () {

		it( "should throw an error when given an invalid check name", function () {

			expect( function() {
				validator.executeCheck( "isNonValidCheck", 1, [] );
			} ).to.throw( Error );

		} );

		it( "should evaluate variables/values using the appropriate check class", function () {

			expect( validator.executeCheck( "isNull", null ) ).to.equal( true );
			expect( validator.executeCheck( "isNull", 1    ) ).to.equal( false );

		} );

	} );

	describe( "#isNull()", function () {

		it( "should evaluate variables/values using the `Core.type.check.simple.IsNull` check class", function () {

			expect( validator.isNull( null ) ).to.equal( true );
			expect( validator.isNull( 1    ) ).to.equal( false );

		} );

	} );

	describe( "#instanceOf()", function () {

		it( "should evaluate variables/values using the `Core.type.check.extended.IsInstanceOf` check class", function () {

			// Define the test class (Constructor)
			class ATestClass {}

			// Define the test values
			let instance      = new ATestClass();
			let notAnInstance = {};

			// Assert
			expect( validator.instanceOf( instance,      ATestClass ) ).to.equal( true );
			expect( validator.instanceOf( notAnInstance, ATestClass ) ).to.equal( false );

			// Assert for the alternatively cased variant
			expect( validator.instanceof( instance,      ATestClass ) ).to.equal( true );
			expect( validator.instanceof( notAnInstance, ATestClass ) ).to.equal( false );

		} );

	} );

	describe( "#describe()", function () {

		it( "should properly describe values", function () {

			// Define the test value
			let testValue = "hello world";

			// Execute the describe() method
			let result = validator.describe( testValue );

			// Assert
			expect( result ).to.equal( "String (\"hello world\")" );

		} );

		it( "should not add additional details or notes when `opts.noAdditions=true`", function () {

			// Define the test value
			let testValue = "hello world";

			// Execute the describe() method
			let result = validator.describe( testValue, { noAdditions: true } );

			// Assert
			expect( result ).to.equal( "String" );

		} );

		it( "should add an indefinite article when `opts.addIndefiniteArticle=true`", function () {

			// Define the test value
			let testValue = "hello world";

			// Execute the describe() method
			let result = validator.describe( testValue, { addIndefiniteArticle: true } );

			// Assert
			expect( result ).to.equal( "a String (\"hello world\")" );

		} );

	} );

	describe( "#describeA()", function () {

		it( "should alias `describe()` with `opts.addIndefiniteArticle=true`", function () {

			// Define the test value
			let testValue = "hello world";

			// Execute the describe() method
			let result = validator.describeA( testValue );

			// Assert
			expect( result ).to.equal( "a String (\"hello world\")" );

		} );

		it( "should override `opts.addIndefiniteArticle=false`", function () {

			// Define the test value
			let testValue = "hello world";

			// Execute the describe() method
			let result = validator.describeA( testValue, { addIndefiniteArticle: false } );

			// Assert
			expect( result ).to.equal( "a String (\"hello world\")" );

		} );

	} );

	describe( ".defaultValidationInstruction", function () {

		it( "should be a plain object", function() {
			expect( validator.defaultValidationInstructions ).to.be.an( "object" );
		} );

		it( "should be flagged as being 'normalized'", function() {
			expect(
				validator.defaultValidationInstructions[ Core.constants.validation.IS_NORMALIZED_INSTRUCTION ]
			).to.equal( true );
		} );

		it( "should be flagged as being the default instruction", function() {
			expect(
				validator.defaultValidationInstructions[ Core.constants.validation.IS_DEFAULT_INSTRUCTION ]
			).to.equal( true );
		} );

	} );

	describe( "#instructionHasChecks()", function () {

		describe( "( <string> )", function() {

			it( "should always return TRUE", function() {
				expect( validator.instructionHasChecks( "a_string" ) ).to.equal( true );
			} );

		} );

		describe( "( <array> )", function() {

			it( "should return TRUE for arrays containing valid checks (variant #1)", function() {

				// Define the test value
				let testValue = [ "a", "b", "c" ];

				// Do the count
				let result = validator.instructionHasChecks( testValue );

				// Assert
				expect( result ).to.equal( true );

			} );

			it( "should return TRUE for arrays containing valid checks (variant #2)", function() {

				// Define the test value
				let testValue = [ 1, 2, 3 ];

				// Do the count
				let result = validator.instructionHasChecks( testValue );

				// Assert
				expect( result ).to.equal( true );

			} );

			it( "should return FALSE for empty arrays", function() {

				// Define the test value
				let testValue = [];

				// Do the count
				let result = validator.instructionHasChecks( testValue );

				// Assert
				expect( result ).to.equal( false );

			} );

		} );

		describe( "( <object> )", function() {

			it( "should return TRUE if provided a LooseValidationInstructions that contains checks (variant #1)", function() {

				// Define the test value
				let testValue = { isString: true, isBoolean: true };

				// Do the count
				let result = validator.instructionHasChecks( testValue );

				// Assert
				expect( result ).to.equal( true );

			} );

			it( "should return TRUE if provided a LooseValidationInstructions that contains checks (variant #2)", function() {

				// Define the test value
				let testValue = { equals: "hello" };

				// Do the count
				let result = validator.instructionHasChecks( testValue );

				// Assert
				expect( result ).to.equal( true );

			} );

			it( "should return FALSE if provided a LooseValidationInstructions that does not contain a checks", function() {

				// Define the test value
				let testValue = { allowNull: false, returnFullResults: true, throwErrors: false };

				// Do the count
				let result = validator.instructionHasChecks( testValue );

				// Assert
				expect( result ).to.equal( false );

			} );

		} );

		describe( "( <CheckValidationInstruction> )", function() {

			it( "should always return TRUE", function() {

				// Define the test value
				let testValue = { $check: "isNull" };

				// Do the count
				let result = validator.instructionHasChecks( testValue );

				// Assert
				expect( result ).to.equal( true );

			} );

		} );

		describe( "( <ValidationInstructionCollection> )", function() {

			it( "should return TRUE if provided an $any collection that contains checks", function() {

				// Define the test value
				let testValue = { $any: [ "isNull", "isString" ] };

				// Do the count
				let result = validator.instructionHasChecks( testValue );

				// Assert
				expect( result ).to.equal( true );

			} );

			it( "should return FALSE if provided an $any collection that does not contain checks", function() {

				// Define the test value
				let testValue = { $any: [] };

				// Do the count
				let result = validator.instructionHasChecks( testValue );

				// Assert
				expect( result ).to.equal( false );

			} );

			it( "should return TRUE if provided an $all collection that contains checks", function() {

				// Define the test value
				let testValue = { $all: [ "isNull", "isString" ] };

				// Do the count
				let result = validator.instructionHasChecks( testValue );

				// Assert
				expect( result ).to.equal( true );

			} );

			it( "should return FALSE if provided an $all collection that does not contain checks", function() {

				// Define the test value
				let testValue = { $all: [] };

				// Do the count
				let result = validator.instructionHasChecks( testValue );

				// Assert
				expect( result ).to.equal( false );

			} );

			it( "should return FALSE for nested collections with zero checks", function() {

				// Define the test value
				let testValue = {
					$all: [
						{
							$any: [
								{
									$all: [
										{
											$any: [
												{
													$all: [

													]
												}
											]
										}
									]
								}
							]
						}, {
							$any: [
								{
									$all: [
										{
											$any: [
												{
													$all: [

													]
												}
											]
										}
									]
								}
							]
						}
					]
				};

				// Do the count
				let result = validator.instructionHasChecks( testValue );

				// Assert
				expect( result ).to.equal( false );

			} );

		} );

	} );

	describe( "#getInstructionCheckCount", function () {

		describe( "( <string> )", function() {

			it( "should always return exactly '1'", function() {
				expect( validator.getInstructionCheckCount( "a_string" ) ).to.equal( 1 );
			} );

		} );

		describe( "( <array> )", function() {

			it( "should return the number of valid instructions in the array (variant #1)", function() {

				// Define the test value
				let testValue = [ "a", "b", "c" ];

				// Do the count
				let result = validator.getInstructionCheckCount( testValue );

				// Assert
				expect( result ).to.equal( 3 );

			} );

			it( "should return the number of valid instructions in the array (variant #2)", function() {

				// Define the test value
				let testValue = [ 1, 2, 3 ];

				// Do the count
				let result = validator.getInstructionCheckCount( testValue );

				// Assert
				expect( result ).to.equal( 3 );

			} );

			it( "should return '0' (zero) for empty arrays", function() {

				// Define the test value
				let testValue = [];

				// Do the count
				let result = validator.getInstructionCheckCount( testValue );

				// Assert
				expect( result ).to.equal( 0 );

			} );

		} );

		describe( "( <object> )", function() {

			it( "should return the number of valid instructions found in LooseValidationInstructions (variant #1)", function() {

				// Define the test value
				let testValue = { isString: true, isBoolean: true };

				// Do the count
				let result = validator.getInstructionCheckCount( testValue );

				// Assert
				expect( result ).to.equal( 2 );

			} );

			it( "should return the number of valid instructions found in LooseValidationInstructions (variant #2)", function() {

				// Define the test value
				let testValue = { equals: "hello" };

				// Do the count
				let result = validator.getInstructionCheckCount( testValue );

				// Assert
				expect( result ).to.equal( 1 );

			} );

			it( "should ignore validation options", function() {

				// Define the test value
				let testValue = { isString: true, isBoolean: true, allowNull: false };

				// Do the count
				let result = validator.getInstructionCheckCount( testValue );

				// Assert
				expect( result ).to.equal( 2 );

			} );

			it( "should return '0' for plain objects that do not contain checks", function() {

				// Define the test value
				let testValue = { allowNull: false, returnFullResults: true, throwErrors: false };

				// Do the count
				let result = validator.getInstructionCheckCount( testValue );

				// Assert
				expect( result ).to.equal( 0 );

			} );

		} );

		describe( "( <CheckValidationInstruction> )", function() {

			it( "should always return exactly '1'", function() {

				// Define the test value
				let testValue = { $check: "isNull" };

				// Do the count
				let result = validator.getInstructionCheckCount( testValue );

				// Assert
				expect( result ).to.equal( 1 );

			} );

		} );

		describe( "( <ValidationInstructionCollection> )", function() {

			it( "should return the check count for a simple $any collection", function() {

				// Define the test value
				let testValue = { $any: [ "isNull", "isString" ] };

				// Do the count
				let result = validator.getInstructionCheckCount( testValue );

				// Assert
				expect( result ).to.equal( 2 );

			} );

			it( "should return zero for empty $any collections", function() {

				// Define the test value
				let testValue = { $any: [] };

				// Do the count
				let result = validator.getInstructionCheckCount( testValue );

				// Assert
				expect( result ).to.equal( 0 );

			} );

			it( "should return the check count for a simple $any collection", function() {

				// Define the test value
				let testValue = { $all: [ "isNull", "isString" ] };

				// Do the count
				let result = validator.getInstructionCheckCount( testValue );

				// Assert
				expect( result ).to.equal( 2 );

			} );

			it( "should return zero for empty $all collections", function() {

				// Define the test value
				let testValue = { $all: [] };

				// Do the count
				let result = validator.getInstructionCheckCount( testValue );

				// Assert
				expect( result ).to.equal( 0 );

			} );

			it( "should return zero for nested collections with zero checks", function() {

				// Define the test value
				let testValue = {
					$all: [
						{
							$any: [
								{
									$all: [
										{
											$any: [
												{
													$all: [

													]
												}
											]
										}
									]
								}
							]
						}, {
							$any: [
								{
									$all: [
										{
											$any: [
												{
													$all: [

													]
												}
											]
										}
									]
								}
							]
						}
					]
				};

				// Do the count
				let result = validator.getInstructionCheckCount( testValue );

				// Assert
				expect( result ).to.equal( 0 );

			} );

		} );

	} );

	describe( "#validate", function () {

		describe( "()", function () {

			it( "should test using `.defaultValidationInstruction` and ALWAYS throw a ValidationError", function () {

				// When evaluating errors, we must wrap
				// them in a helper function
				let testFn = function() {
					validator.validate();
				};

				// Assert
				expect( testFn ).to.throw( ValidationError );

			} );

		} );

		describe( "( <any> )", function () {

			it( "should test using `.defaultValidationInstruction` and throw a ValidationError for NULL values", function () {

				// A value to test..
				let testValue = null;

				// When evaluating errors, we must wrap
				// them in a helper function
				let testFn = function() {
					validator.validate( testValue );
				};

				// Assert
				expect( testFn ).to.throw( ValidationError );

			} );

			it( "should test using `.defaultValidationInstruction` and throw a ValidationError for UNDEFINED values", function () {

				// A value to test..
				let testValue = undefined;

				// When evaluating errors, we must wrap
				// them in a helper function
				let testFn = function() {
					validator.validate( testValue );
				};

				// Assert
				expect( testFn ).to.throw( ValidationError );

			} );

			it( "should test using `.defaultValidationInstruction` and should NOT throw for non-NIL values", function () {

				// A value to test..
				let testValue = Symbol.for( "anything that isn't NIL (NULL or Undefined)" );

				// When evaluating errors, we must wrap
				// them in a helper function
				let testFn = function() {
					validator.validate( testValue );
				};

				// Assert
				expect( testFn ).to.not.throw( ValidationError );

			} );

		} );

		describe( "( <any>, <EmptyObject> )", function () {

			it( "should test using `.defaultValidationInstruction` and throw a ValidationError for NULL values", function () {

				// A value to test..
				let testValue = null;

				// When evaluating errors, we must wrap
				// them in a helper function
				let testFn = function() {
					validator.validate( testValue, {} );
				};

				// Assert
				expect( testFn ).to.throw( ValidationError );

			} );

			it( "should test using `.defaultValidationInstruction` and throw a ValidationError for UNDEFINED values", function () {

				// A value to test..
				let testValue = undefined;

				// When evaluating errors, we must wrap
				// them in a helper function
				let testFn = function() {
					validator.validate( testValue, {} );
				};

				// Assert
				expect( testFn ).to.throw( ValidationError );

			} );

			it( "should test using `.defaultValidationInstruction` and should NOT throw for non-NIL values", function () {

				// A value to test..
				let testValue = Symbol.for( "anything that isn't NIL (NULL or Undefined)" );

				// When evaluating errors, we must wrap
				// them in a helper function
				let testFn = function() {
					validator.validate( testValue, {} );
				};

				// Assert
				expect( testFn ).to.not.throw( ValidationError );

			} );

		} );

		describe( "( <any>, <OptionsOnly> )", function () {

			it( "should test using `.defaultValidationInstruction` and throw a ValidationError for NULL values", function () {

				// A value to test..
				let testValue = null;

				// When evaluating errors, we must wrap
				// them in a helper function
				let testFn = function() {
					validator.validate( testValue, { allowNull: false, returnFullResults: true } );
				};

				// Assert
				expect( testFn ).to.throw( ValidationError );

			} );

			it( "should test using `.defaultValidationInstruction` and throw a ValidationError for UNDEFINED values", function () {

				// A value to test..
				let testValue = undefined;

				// When evaluating errors, we must wrap
				// them in a helper function
				let testFn = function() {
					validator.validate( testValue, { allowNull: false, returnFullResults: true } );
				};

				// Assert
				expect( testFn ).to.throw( ValidationError );

			} );

			it( "should test using `.defaultValidationInstruction` and should NOT throw for non-NIL values", function () {

				// A value to test..
				let testValue = Symbol.for( "anything that isn't NIL (NULL or Undefined)" );

				// When evaluating errors, we must wrap
				// them in a helper function
				let testFn = function() {
					validator.validate( testValue, { allowNull: false, returnFullResults: true } );
				};

				// Assert
				expect( testFn ).to.not.throw( ValidationError );

			} );

		} );

		describe( "( <any>, <NULL> )", function () {


			it( "should test using `.defaultValidationInstruction` and throw a ValidationError for NULL values", function () {

				// A value to test..
				let testValue = null;

				// When evaluating errors, we must wrap
				// them in a helper function
				let testFn = function() {
					validator.validate( testValue, null );
				};

				// Assert
				expect( testFn ).to.throw( ValidationError );

			} );

			it( "should test using `.defaultValidationInstruction` and throw a ValidationError for UNDEFINED values", function () {

				// A value to test..
				let testValue = undefined;

				// When evaluating errors, we must wrap
				// them in a helper function
				let testFn = function() {
					validator.validate( testValue, null );
				};

				// Assert
				expect( testFn ).to.throw( ValidationError );

			} );

			it( "should test using `.defaultValidationInstruction` and should NOT throw for non-NIL values", function () {

				// A value to test..
				let testValue = Symbol.for( "anything that isn't NIL (NULL or Undefined)" );

				// When evaluating errors, we must wrap
				// them in a helper function
				let testFn = function() {
					validator.validate( testValue, null );
				};

				// Assert
				expect( testFn ).to.not.throw( ValidationError );

			} );

		} );

		describe( "( <any>, <LooseValidationInstruction> )", function () {

			describe( "(Basic Functionality)", function () {

				it( "should return the passed in `value` when validation succeeds", function () {

					// A value to test..
					let testValue 		= "hello";

					// The validation instructions to use
					let instructions 	= "!isNull";

					// Do the validation
					let results			= validator.validate( testValue, instructions );

					// Assert
					expect( results ).to.equal( "hello" );

				} );

				it( "should throw an Error when validation fails", function () {

					// A value to test..
					let testValue 		= "notnull";

					// The validation instructions to use
					let instructions 	= "isNull";

					// When evaluating errors, we must wrap
					// them in a helper function
					let testFn = function() {
						validator.validate( testValue, instructions );
					};

					// Assert
					expect( testFn ).to.throw( Error );

				} );

			} );

			describe( "(Validation Options)", function () {

				describe( "(opts.throwErrors)", function () {

					it( "should throw an error, by default, when validation fails", function () {

						// A value to test..
						let testValue 		= "notnull";

						// The validation instructions to use
						let instructions 	= "isNull";

						// When evaluating errors, we must wrap
						// them in a helper function
						let testFn = function() {
							validator.validate( testValue, instructions );
						};

						// Assert
						expect( testFn ).to.throw( Error );

					} );

					it( "should not throw errors when `throwErrors=false`", function () {

						// A value to test..
						let testValue 		= "notnull";

						// The validation instructions to use
						let instructions 	= {
							isNull      : true,
							throwErrors : false
						};

						// When evaluating errors, we must wrap
						// them in a helper function
						let testFn = function() {
							validator.validate( testValue, instructions );
						};

						// Assert
						expect( testFn ).to.not.throw( Error );

					} );

					it( "should return NULL when `throwErrors=false` (and no defaultValue is defined)", function () {

						// A value to test..
						let testValue 		= "notnull";

						// The validation instructions to use
						let instructions 	= {
							isNull      : true,
							throwErrors : false
						};

						// Validate
						let result = validator.validate( testValue, instructions );

						// Assert
						expect( result ).to.equal( null );

					} );

				} );

				describe( "(opts.allowNull)", function () {

					it( "should pass for NULL values when `allowNull=true`", function () {

						// A value to test..
						let testValue 		= null;

						// The validation instructions to use
						let instructions 	= {
							isString  : true,
							allowNull : true
						};

						// When evaluating errors, we must wrap
						// them in a helper function
						let testFn = function() {
							validator.validate( testValue, instructions );
						};

						// Assert
						expect( testFn ).to.not.throw( Error );

					} );

					it( "should still fail, as usual, for non-NULL values when `allowNull=true`", function () {

						// A value to test..
						let testValue 		= "notnull";

						// The validation instructions to use
						let instructions 	= {
							isNull    : true,
							allowNull : true
						};

						// When evaluating errors, we must wrap
						// them in a helper function
						let testFn = function() {
							validator.validate( testValue, instructions );
						};

						// Assert
						expect( testFn ).to.throw( Error );

					} );

				} );

				describe( "(opts.defaultValue)", function () {

					it( "should never throw errors when a `defaultValue` passed", function () {

						// A value to test..
						let testValue 		= null;

						// The validation instructions to use
						let instructions 	= {
							isString     : true,
							defaultValue : "something"
						};

						// When evaluating errors, we must wrap
						// them in a helper function
						let testFn = function() {
							validator.validate( testValue, instructions );
						};

						// Assert
						expect( testFn ).to.not.throw( Error );

					} );

					it( "should return the `defaultValue` (if specified) on validation failure", function () {

						// A value to test..
						let testValue 		= null;

						// The validation instructions to use
						let instructions 	= {
							isString     : true,
							defaultValue : "something"
						};

						// Validate
						let result = validator.validate( testValue, instructions );

						// Assert
						expect( result ).to.equal( "something" );

					} );

					it( "should execute `defaultValue` (if specified and a function) on validation failure and return the result", function () {

						// A value to test..
						let testValue 		= null;

						// The validation instructions to use
						let instructions 	= {
							isString     : true,
							defaultValue : function() {
								return "some-return";
							}
						};

						// Validate
						let result = validator.validate( testValue, instructions );

						// Assert
						expect( result ).to.equal( "some-return" );

					} );

					it( "should return the `defaultValue` (if specified) on validation failure (against the defaultValidateInstruction)", function () {

						// A value to test..
						let testValue 		= null;

						// The validation instructions to use
						let instructions 	= {
							defaultValue: "something"
						};

						// Validate
						let result = validator.validate( testValue, instructions );

						// Assert
						expect( result ).to.equal( "something" );

					} );

				} );

			} );

		} );

	} );

	describe( "#describeExpectations()", function () {

		describe( "(One Check)", function () {

			it( "should properly describe validation expectations (variant #1)", function () {

				// The validation instructions to use
				let instructions 	= "isNull";

				// Do the validation
				let results			= validator.describeExpectations( instructions );

				// Assert
				expect( results ).to.equal( "a NULL value" );

			} );

			it( "should properly describe validation expectations (variant #2)", function () {

				// The validation instructions to use
				let instructions 	= {
					isString: true
				};

				// Do the validation
				let results			= validator.describeExpectations( instructions );

				// Assert
				expect( results ).to.equal( "a String" );

			} );

		} );

		describe( "(Two Checks)", function () {

			it( "should properly describe $all collections", function () {

				// The validation instructions to use
				let instructions 	= {
					isObject   : true,
					instanceOf : "Core.abstract.Component"
				};

				// Do the validation
				let results			= validator.describeExpectations( instructions );

				// Assert
				expect( results ).to.equal( "( an Object && an instance of 'Core.abstract.Component' )" );

			} );

			it( "should properly describe $any collections", function () {

				// The validation instructions to use
				let instructions 	= [ "isObject", "isString" ];

				// Do the validation
				let results			= validator.describeExpectations( instructions );

				// Assert
				expect( results ).to.equal( "an Object or a String" );

			} );

		} );

		describe( "(Three Checks)", function () {

			it( "should properly describe $all collections", function () {

				// The validation instructions to use
				let instructions 	= {
					isObject   : true,
					isString   : true,
					instanceOf : "Core.abstract.Component"
				};

				// Do the validation
				let results			= validator.describeExpectations( instructions );

				// Assert
				expect( results ).to.equal( "( an Object && a String && an instance of 'Core.abstract.Component' )" );

			} );

			it( "should properly describe $any collections", function () {

				// The validation instructions to use
				let instructions 	= [ "isObject", "isString", { instanceOf: "Core.abstract.Component" } ];

				// Do the validation
				let results			= validator.describeExpectations( instructions );

				// Assert
				expect( results ).to.equal( "an Object, a String, or an instance of 'Core.abstract.Component'" );

			} );

		} );

		describe( "(Four Checks)", function () {

			it( "should properly describe $all collections", function () {

				// The validation instructions to use
				let instructions 	= {
					isObject   : true,
					isString   : true,
					instanceOf : "Core.abstract.Component",
					isNull     : true,
				};

				// Do the validation
				let results			= validator.describeExpectations( instructions );

				// Assert
				expect( results ).to.equal( "( an Object && a String && an instance of 'Core.abstract.Component' && a NULL value )" );

			} );

			it( "should properly describe $any collections", function () {

				// The validation instructions to use
				let instructions 	= [ "isObject", "isString", { instanceOf: "Core.abstract.Component" }, "isNull" ];

				// Do the validation
				let results			= validator.describeExpectations( instructions );

				// Assert
				expect( results ).to.equal( "an Object, a String, an instance of 'Core.abstract.Component', or a NULL value" );

			} );

		} );

		describe( "(Five Checks)", function () {

			it( "should properly describe $all collections", function () {

				// The validation instructions to use
				let instructions 	= {
					isObject   : true,
					isString   : true,
					instanceOf : "Core.abstract.Component",
					isNull     : true,
					isBoolean  : true,
				};

				// Do the validation
				let results			= validator.describeExpectations( instructions );

				// Assert
				expect( results ).to.equal( "( an Object && a String && an instance of 'Core.abstract.Component' && a NULL value && a Boolean )" );

			} );

			it( "should properly describe $any collections", function () {

				// The validation instructions to use
				let instructions 	= [ "isObject", "isString", { instanceOf: "Core.abstract.Component" }, "isNull", "isBoolean" ];

				// Do the validation
				let results			= validator.describeExpectations( instructions );

				// Assert
				expect( results ).to.equal( "an Object, a String, an instance of 'Core.abstract.Component', a NULL value, or a Boolean" );

			} );

		} );

		describe( "(Nested Collections)", function () {

			it( "should properly describe $all(2)->$any(1) nested collections", function () {

				// The validation instructions to use
				let instructions 	= {
					$all: [
						"isString",
						{
							$any: [ "isNumber", "isInteger" ]
						}
					],
				};

				// Do the validation
				let results			= validator.describeExpectations( instructions );

				// Assert
				expect( results ).to.equal( "( a String && ( a Number or an integer ) )" );

			} );

			it( "should properly describe $all(2)->$any(2) nested collections", function () {

				// The validation instructions to use
				let instructions 	= {
					$all: [
						{
							$any: [ "isString", "isBoolean" ]
						},
						{
							$any: [ "isNumber", "isInteger" ]
						}
					],
				};

				// Do the validation
				let results			= validator.describeExpectations( instructions );

				// Assert
				expect( results ).to.equal( "( ( a String or a Boolean ) && ( a Number or an integer ) )" );

			} );

			it( "should properly describe $any(2)->$and(2) nested collections", function () {

				// The validation instructions to use
				let instructions 	= {
					$any: [
						{
							$all: [ "isString", "isBoolean" ]
						},
						{
							$all: [ "isNumber", "isInteger" ]
						}
					],
				};

				// Do the validation
				let results			= validator.describeExpectations( instructions );

				// Assert
				expect( results ).to.equal( "( a String && a Boolean ) or ( a Number && an integer )" );

			} );

			it( "should properly describe complex nested collections" );

		} );

	} );

} );


/*

	 An Object (which implements IInterface and is an instance of 'Core.x.Y'), a Boolean, or a Number was expected
	 An Object (and also an implementor of IInterface and an instance of 'Core.x.Y'), a Boolean, or a Number was expected

	 An implementor of IInterface (and also an Object) ..
	 An implementor of IInterface


	A Number (which is also an Integer, a Boolean (which is also equal to TRUE), and a NULL value) or a String (which is also an UNDEFINED value)

 */
