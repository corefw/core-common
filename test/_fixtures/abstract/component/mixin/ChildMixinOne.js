/**
 * @file
 * Defines the Test.fixture.abstract.component.mixin.ChildMixinOne mixin.
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
class ChildMixinOne {

	/**
	 * Tests $construct logic for classes and, especially, mixins.
	 *
	 * @private
	 * @param {*} cmoOne - A class dependency for test.
	 * @param {*} cmoTwo - A class dependency for test.
	 * @returns {Object|boolean|void} Can return overrides or can halt $construct execution
	 * for classes down the line by returning false.
	 */
	$construct( cmoOne, cmoTwo ) {
		this.__cmoOne = cmoOne;
		this.__cmoTwo = cmoTwo;

		// This method is being provided by a simple helper mixin
		// (`Core.debug.mixin.CallTrackerMixin`)
		this.logManualMethodCall( "$construct", "ChildMixinOne", arguments, this );

	}

	/**
	 * This should execute...
	 *
	 * @returns {void}
	 */
	$beforeConstruct() {
		// This method is being provided by a simple helper mixin (`Core.debug.mixin.CallTrackerMixin`)
		this.logManualMethodCall( "$beforeConstruct", "ChildMixinOne", arguments, this );
	}

	/**
	 * This should execute...
	 *
	 * @returns {void}
	 */
	$afterConstruct() {
		// This method is being provided by a simple helper mixin (`Core.debug.mixin.CallTrackerMixin`)
		this.logManualMethodCall( "$afterConstruct", "ChildMixinOne", arguments, this );
	}

	/**
	 * This should execute...
	 *
	 * @returns {void}
	 */
	$beforeReady() {
		// This method is being provided by a simple helper mixin (`Core.debug.mixin.CallTrackerMixin`)
		this.logManualMethodCall( "$beforeReady", "ChildMixinOne", arguments, this );
	}

	/**
	 * This should execute...
	 *
	 * @returns {void}
	 */
	$afterReady() {
		// This method is being provided by a simple helper mixin (`Core.debug.mixin.CallTrackerMixin`)
		this.logManualMethodCall( "$afterReady", "ChildMixinOne", arguments, this );
	}

}

module.exports = ChildMixinOne;
