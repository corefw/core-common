/**
 * @file
 * Defines the Test.fixture.type.mixin.validating.TestClassOne class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/**
 * A fixture class used to test the `Core.type.mixin.Validating` framework mixin.
 *
 * @memberOf Test.fixture.type.mixin.validating
 * @mixes Test.fixture.type.mixin.validating.TestMixinOne
 */
class TestClassOne extends Core.mix( "Core.abstract.Component", "Test.fixture.type.mixin.validating.TestMixinOne" ) {

	passingValidate1() {
		return this.$validate( "a", {
			"isString": true
		} );
	}

	failingValidate1() {
		return this.$validate( 1, {
			"isString": true
		} );
	}

	paramTest1( someParam ) {
		return this.$validateParam( "someParam", someParam, [ "isBoolean", "isString" ] );
	}

	objTestBasic( obj ) {

		return this.$validateObject( "obj", obj, {
			a : "isString",
			b : "isBoolean"
		} );

	}

	objTestGlobalMergeA( obj ) {

		return this.$validateObject( "obj", obj, {
			a: "isNumber"
		}, "isInteger" );

	}

	objTestGlobalMergeB( obj ) {

		return this.$validateObject( "obj", obj, {
			a: "isInteger"
		}, "isNumber" );

	}

	objDynamicTest( obj, propertyOptions, globalOptions ) {

		return this.$validateObject( "obj", obj, propertyOptions, globalOptions );

	}

}

module.exports = TestClassOne;
