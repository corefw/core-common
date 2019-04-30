/**
 * @file
 * Defines the Test.fixture.type.mixin.validating.TestMixinOne mixin.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/**
 * A fixture mixin used to test the `Core.type.mixin.Validating` framework mixin.
 *
 * @memberOf Test.fixture.type.mixin.validating
 */
class TestMixinOne {

	failingMixinValidate1() {
		return this.$validate( 1, {
			"isString": true
		} );
	}

}

module.exports = TestMixinOne;
