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

}

module.exports = TestClassOne;
