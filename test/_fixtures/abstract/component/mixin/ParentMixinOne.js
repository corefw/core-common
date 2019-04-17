/**
 * @file
 * Defines the Test.fixture.abstract.component.mixin.ParentMixinOne mixin.
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
class ParentMixinOne {

	/**
	 * Tests $construct logic for classes and, especially, mixins.
	 *
	 * @private
	 * @param {*} pmoOne - A class dependency for test.
	 * @param {*} pmoTwo - A class dependency for test.
	 * @returns {Object|boolean|void} Can return overrides or can halt $construct execution
	 * for classes down the line by returning false.
	 */
	$construct( pmoOne, pmoTwo ) {
		this.__pmoOne = pmoOne;
		this.__pmoTwo = pmoTwo;

		// This method is being provided by a simple helper mixin
		// (`Core.debug.mixin.CallTrackerMixin`)
		this.logManualMethodCall( "$construct", "ParentMixinOne", arguments, this );

		// This tests the ability for mixins to halt additional  $construct calls
		// (only works for mixins because class $construct methods are always called first).
		if( pmoTwo === false ) {
			return false;
		}

	}

	/**
	 * This should execute...
	 *
	 * @returns {void}
	 */
	$beforeConstruct() {
		// This method is being provided by a simple helper mixin (`Core.debug.mixin.CallTrackerMixin`)
		this.logManualMethodCall( "$beforeConstruct", "ParentMixinOne", arguments, this );
	}

	/**
	 * This should execute...
	 *
	 * @returns {void}
	 */
	$afterConstruct() {
		// This method is being provided by a simple helper mixin (`Core.debug.mixin.CallTrackerMixin`)
		this.logManualMethodCall( "$afterConstruct", "ParentMixinOne", arguments, this );
	}

	/**
	 * This should execute...
	 *
	 * @returns {void}
	 */
	$beforeReady() {
		// This method is being provided by a simple helper mixin (`Core.debug.mixin.CallTrackerMixin`)
		this.logManualMethodCall( "$beforeReady", "ParentMixinOne", arguments, this );
	}

	/**
	 * This should execute...
	 *
	 * @returns {void}
	 */
	$afterReady() {
		// This method is being provided by a simple helper mixin (`Core.debug.mixin.CallTrackerMixin`)
		this.logManualMethodCall( "$afterReady", "ParentMixinOne", arguments, this );
	}

}

module.exports = ParentMixinOne;
