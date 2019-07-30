/**
 * @file
 * Defines the Test.fixture.type.mixin.validating.RequireTestThree class.
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
 * @mixes Test.fixture.type.mixin.validating.RequireMixinThree
 */
class RequireTestThree extends Core.mix( "Core.abstract.Component", "Test.fixture.type.mixin.validating.RequireMixinThree" ) {

	$construct( classRequirement ) {

		this.$require( "classRequirement" );

	}


}

module.exports = RequireTestThree;
