/**
 * @file
 * Defines the Test.fixture.asset.mixin.mixUtils.basic.GrandParentMixin mixin.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/**
 * This mixin is one of many classes used to test the functionality provided by the
 * `Core.asset.mixin.MixUtilsMixin` framework mixin.
 *
 * @memberOf Test.fixture.asset.mixin.mixUtils.basic
 */
class GrandParentMixin {

	/**
	 * This method is used to test a developers ability to execute a specific
	 * implementation of a given method using the tools provided by `MixUtilsMixin`.
	 *
	 * @public
	 * @returns {string} A test string
	 */
	whoRanThis() {
		return "GrandParentMixin";
	}

	/**
	 * This method is used to test mixin method chain collection (`$mixins.getMethodChain()`).
	 * Since this method is being defined on a mixin, it should be collected by `$mixins.getMethodChain()`.
	 *
	 * @public
	 * @returns {string} A test string
	 */
	$testChain() {
		return "GrandParentMixin";
	}

}

module.exports = GrandParentMixin;
