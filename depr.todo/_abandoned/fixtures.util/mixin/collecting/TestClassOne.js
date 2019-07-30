/**
 * @file
 * Defines the Test.fixture.util.mixin.collecting.TestClassOne class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/**
 * A fixture class used to test the `Core.util.mixin.Collecting` framework mixin.
 *
 * @memberOf Test.fixture.util.mixin.collecting
 * @mixes Core.util.mixin.Collecting
 */
class TestClassOne extends Core.mix( "Core.abstract.Component", "Core.util.mixin.Collecting" ) {


}

module.exports = TestClassOne;
