/**
 * @file
 * Defines the Test.fixture.abstract.component.mixin.ChildClass class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/**
 * Tests the mixin logic provided by Core.abstract.Component.
 *
 * @memberOf Test.fixture.abstract.component.mixin
 * @extends Test.fixture.abstract.component.mixin.ParentClass
 * @mixes Test.fixture.abstract.component.mixin.ChildMixinOne
 * @mixes Test.fixture.abstract.component.mixin.ChildMixinTwo
 */
class ChildClass extends Core.mix(
	"Test.fixture.abstract.component.mixin.ParentClass",
	"Test.fixture.abstract.component.mixin.ChildMixinOne",
	"Test.fixture.abstract.component.mixin.ChildMixinTwo"
) {

	/**
	 * Tests $construct logic for classes and, especially, mixins.
	 *
	 * @private
	 * @param {*} ccOne - A class dependency for test.
	 * @param {*} ccTwo - A class dependency for test.
	 * @returns {Object|boolean|void} Can return overrides or can halt $construct execution
	 * for classes down the line by returning false.
	 */
	$construct( ccOne, ccTwo ) {
		this.__ccOne = ccOne;
		this.__ccTwo = ccTwo;

		// This method is being provided by a simple helper mixin
		// (`Core.debug.mixin.CallTrackerMixin`)
		this.logManualMethodCall( "$construct", "ChildClass", arguments, this );

	}

}

module.exports = ChildClass;
