/**
 * @file
 * Defines the Test.fixture.abstract.component.mixin.ParentMixinTwo mixin.
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
class ParentMixinTwo {

	/**
	 * Tests $construct logic for classes and, especially, mixins.
	 *
	 * @private
	 * @param {*} pmtOne - A class dependency for test.
	 * @param {*} pmtTwo - A class dependency for test.
	 * @returns {Object|boolean|void} Can return overrides or can halt $construct execution
	 * for classes down the line by returning false.
	 */
	$construct( pmtOne, pmtTwo ) {
		this.__pmtOne = pmtOne;
		this.__pmtTwo = pmtTwo;

		// This method is being provided by a simple helper mixin
		// (`Core.debug.mixin.CallTrackerMixin`)
		this.logManualMethodCall( "$construct", "ParentMixinTwo", arguments, this );

		// This tests a mixin's ability to override config values for mixins further down the line.
		return {
			cmoTwo: "ParentMixinTwo"
		};

	}


	/**
	 * This should execute...
	 *
	 * @returns {void}
	 */
	$beforeConstruct() {
		// This method is being provided by a simple helper mixin (`Core.debug.mixin.CallTrackerMixin`)
		this.logManualMethodCall( "$beforeConstruct", "ParentMixinTwo", arguments, this );
	}

	/**
	 * This should execute...
	 *
	 * @returns {void}
	 */
	$afterConstruct() {
		// This method is being provided by a simple helper mixin (`Core.debug.mixin.CallTrackerMixin`)
		this.logManualMethodCall( "$afterConstruct", "ParentMixinTwo", arguments, this );
	}

	/**
	 * This should execute...
	 *
	 * @returns {void}
	 */
	$beforeReady() {
		// This method is being provided by a simple helper mixin (`Core.debug.mixin.CallTrackerMixin`)
		this.logManualMethodCall( "$beforeReady", "ParentMixinTwo", arguments, this );
	}

	/**
	 * This should execute...
	 *
	 * @returns {void}
	 */
	$afterReady() {
		// This method is being provided by a simple helper mixin (`Core.debug.mixin.CallTrackerMixin`)
		this.logManualMethodCall( "$afterReady", "ParentMixinTwo", arguments, this );
	}
}

module.exports = ParentMixinTwo;
