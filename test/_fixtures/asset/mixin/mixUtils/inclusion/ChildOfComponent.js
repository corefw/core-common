/**
 * @file
 * Defines the Test.fixture.asset.mixin.mixUtils.inclusion.ChildOfComponent class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/**
 * This class tests the inclusion of `Core.asset.mixin.MixUtilsMixin` in all classes
 * that extend `Core.abstract.Component`.
 *
 * @memberOf Test.fixture.asset.mixin.mixUtils.inclusion
 * @extends Core.abstract.Component
 */
class ChildOfComponent extends Core.cls( "Core.abstract.Component" ) {

}

module.exports = ChildOfComponent;
