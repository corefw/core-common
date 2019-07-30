/**
 * @file
 * Defines the Test.fixture.type.mixin.validating.RequireTestOne class.
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
 * @mixes Test.fixture.type.mixin.validating.RequireMixinOne
 */
class RequireTestOne extends Core.mix( "Core.abstract.Component", "Test.fixture.type.mixin.validating.RequireMixinOne" ) {

	$construct( classRequirementA, classRequirementB ) {

		this._classRequirementA = this.$require( "classRequirementA", "isString" );
		this._classRequirementB = this.$require( "classRequirementB", "isBoolean" );

	}


}

module.exports = RequireTestOne;
