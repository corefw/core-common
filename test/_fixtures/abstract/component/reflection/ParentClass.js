/**
 * @file
 * Defines the Test.fixture.abstract.component.reflection.ParentClass class.
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
 * @extends Core.abstract.Component
 * @mixes Test.fixture.abstract.component.reflection.ParentMixin
 */
class ParentClass extends Core.mix(
	"Core.abstract.Component",
	"Core.debug.mixin.CallTrackerMixin",
	"Test.fixture.abstract.component.reflection.ParentMixin"
) {

	/**
	 * This method is being used to test the Core.abstract.Component's ability to introspect
	 * and gather information about its class dependencies by analysing the $construct
	 * methods in its class and mixin chain.
	 *
	 * @private
	 * @param {*} parentClassDepOne - A test dependency
	 * @param {*} parentClassDepTwo - A test dependency
	 * @returns {void}
	 */
	$construct( parentClassDepOne, parentClassDepTwo ) {

	}

}

module.exports = ParentClass;
