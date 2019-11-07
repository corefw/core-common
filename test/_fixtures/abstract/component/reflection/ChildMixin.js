/**
 * @file
 * Defines the Test.fixture.abstract.component.reflection.ChildMixin mixin.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/**
 * Tests the reflection logic provided by Core.abstract.Component.
 *
 * @memberOf Test.fixture.abstract.component.reflection
 */
class ChildMixin {

	/**
	 * This method is being used to test the Core.abstract.Component's ability to introspect
	 * and gather information about its class dependencies by analysing the $construct
	 * methods in its class and mixin chain.
	 *
	 * @private
	 * @param {*} childMixinDepOne - A test dependency
	 * @param {*} childMixinDepTwo - A test dependency
	 * @returns {void}
	 */
	$construct( childMixinDepOne, childMixinDepTwo ) {

	}

}

module.exports = ChildMixin;
