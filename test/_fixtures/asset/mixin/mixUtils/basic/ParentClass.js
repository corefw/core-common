/**
 * @file
 * Defines the Test.fixture.asset.mixin.mixUtils.basic.ParentClass class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/**
 * This class is one of many classes used to test the functionality provided by the
 * `Core.asset.mixin.MixUtilsMixin` framework mixin.
 *
 * @memberOf Test.fixture.asset.mixin.mixUtils.basic
 * @mixes Test.fixture.asset.mixin.mixUtils.basic.ParentMixin
 * @extends Test.fixture.asset.mixin.mixUtils.basic.GrandParentClass
 */
class ParentClass extends Core.mix(
	"Test.fixture.asset.mixin.mixUtils.basic.GrandParentClass",
	"Test.fixture.asset.mixin.mixUtils.basic.ParentMixin",
	"Test.fixture.asset.mixin.mixUtils.basic.SecondParentMixin" ) {

	/**
	 * This method is used to test a developers ability to execute a specific
	 * implementation of a given method using the tools provided by `MixUtilsMixin`.
	 *
	 * @public
	 * @returns {string} A test string
	 */
	whoRanThis() {
		return "ParentClass";
	}

	/**
	 * This method is used to test mixin method chain collection (`$mixins.getMethodChain()`).
	 * Since this method is being defined at the class level, it should be ignored, and was only
	 * put here to make sure of that.
	 *
	 * @public
	 * @returns {string} A test string
	 */
	$testChain() {
		return "ParentClass";
	}

}

module.exports = ParentClass;
