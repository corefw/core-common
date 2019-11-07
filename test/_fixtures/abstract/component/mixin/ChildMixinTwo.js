/**
 * @file
 * Defines the Test.fixture.abstract.component.mixin.ChildMixinTwo mixin.
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
 */
class ChildMixinTwo {

	/**
	 * Tests $construct logic for classes and, especially, mixins.
	 *
	 * @private
	 * @param {*} cmtOne - A class dependency for test.
	 * @param {*} cmtTwo - A class dependency for test.
	 * @returns {Object|boolean|void} Can return overrides or can halt $construct execution
	 * for classes down the line by returning false.
	 */
	$construct( cmtOne, cmtTwo ) {
		this.__cmtOne = cmtOne;
		this.__cmtTwo = cmtTwo;


		// This method is being provided by a simple helper mixin
		// (`Core.debug.mixin.CallTrackerMixin`)
		this.logManualMethodCall( "$construct", "ChildMixinTwo", arguments, this );

	}

	/**
	 * This should execute...
	 *
	 * @returns {void}
	 */
	$beforeConstruct() {
		// This method is being provided by a simple helper mixin (`Core.debug.mixin.CallTrackerMixin`)
		this.logManualMethodCall( "$beforeConstruct", "ChildMixinTwo", arguments, this );
	}

	/**
	 * This should execute...
	 *
	 * @returns {void}
	 */
	$afterConstruct() {
		// This method is being provided by a simple helper mixin (`Core.debug.mixin.CallTrackerMixin`)
		this.logManualMethodCall( "$afterConstruct", "ChildMixinTwo", arguments, this );
	}

	/**
	 * This should execute...
	 *
	 * @returns {void}
	 */
	$beforeReady() {
		// This method is being provided by a simple helper mixin (`Core.debug.mixin.CallTrackerMixin`)
		this.logManualMethodCall( "$beforeReady", "ChildMixinTwo", arguments, this );
	}

	/**
	 * This should execute...
	 *
	 * @returns {void}
	 */
	$afterReady() {
		// This method is being provided by a simple helper mixin (`Core.debug.mixin.CallTrackerMixin`)
		this.logManualMethodCall( "$afterReady", "ChildMixinTwo", arguments, this );
	}

}

module.exports = ChildMixinTwo;
