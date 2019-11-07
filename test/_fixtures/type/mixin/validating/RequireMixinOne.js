/**
 * @file
 * Defines the Test.fixture.type.mixin.validating.RequireMixinOne mixin.
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
class RequireMixinOne {

	$construct( mixinRequirementA, mixinRequirementB ) {

		this._mixinRequirementA = this.$require( "mixinRequirementA", "isString" );
		this._mixinRequirementB = this.$require( "mixinRequirementB", "isBoolean" );

	}

}

module.exports = RequireMixinOne;
