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

	describe( "(Some Concept)", function () {

		describe( "#_someMethod", function () {

			describe( "( <string> )", function () {

				it( "should do something", function () {

				} );

			} );

		} );

	} );


} );
