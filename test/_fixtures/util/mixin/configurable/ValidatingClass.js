/**
 * @file
 * Defines the Test.fixture.util.mixin.configurable.ValidatingClass class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/**
 * A fixture class used to test the `Core.util.mixin.Configurable` framework mixin when it is used in concert
 * with the `Core.type.mixin.Validating` mixin.
 *
 * @memberOf Test.fixture.util.mixin.configurable
 * @extends Core.abstract.BaseClass
 * @mixes Core.type.mixin.Validating
 * @mixes Core.util.mixin.Configurable
 */
class ValidatingClass extends Core.mix(
	"Core.abstract.BaseClass",
	"Core.type.mixin.Validating",
	"Core.util.mixin.Configurable"
) {


}

module.exports = ValidatingClass;
