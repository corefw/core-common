/**
 * @file
 * Defines the Test.fixture.type.mixin.validating.RequireTestTwo class.
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
 */
class RequireTestTwo extends Core.cls( "Core.abstract.Component" ) {

	$construct( someDep ) {

	}

}

module.exports = RequireTestTwo;
