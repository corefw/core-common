/**
 * @file
 * Defines the Test.fixture.asset.mixer.reserved.SomeClass class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/**
 * This is a class that will be used to test the Core.asset.Mixer's ability to skip (refuse to mix)
 * certain, reserved/special, mixin methods.
 *
 * @memberOf Test.fixture.asset.mixer.reserved
 * @extends Core.abstract.Component
 * @mixes Test.fixture.asset.mixer.reserved.Mixin
 */
class SomeClass extends Core.mix( "Core.abstract.Component", "Test.fixture.asset.mixer.reserved.Mixin" ) {

}

module.exports = SomeClass;
