/**
 * @file
 * Defines the Test.fixture.abstract.component.mixin.ParentClass class.
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
 * @extends Core.abstract.Component
 * @mixes Test.fixture.abstract.component.mixin.ParentMixinOne
 * @mixes Test.fixture.abstract.component.mixin.ParentMixinTwo
 */
class ParentClass extends Core.mix(
	"Core.abstract.Component",
	"Core.debug.mixin.CallTrackerMixin",
	"Test.fixture.abstract.component.mixin.ParentMixinOne",
	"Test.fixture.abstract.component.mixin.ParentMixinTwo"
) {

	/**
	 * Tests $construct logic for classes and, especially, mixins.
	 *
	 * @private
	 * @param {*} pcOne - A class dependency for test.
	 * @param {*} pcTwo - A class dependency for test.
	 * @returns {Object|boolean|void} Can return overrides or can halt $construct execution
	 * for classes down the line by returning false.
	 */
	$construct( pcOne, pcTwo ) {
		this.__pcOne = pcOne;
		this.__pcTwo = pcTwo;

		// This method is being provided by a simple helper mixin
		// (`Core.debug.mixin.CallTrackerMixin`)
		this.logManualMethodCall( "$construct", "ParentClass", arguments, this );

	}

}

module.exports = ParentClass;
