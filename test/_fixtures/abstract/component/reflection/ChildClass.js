/**
 * @file
 * Defines the Test.fixture.abstract.component.reflection.ChildClass class.
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
 * @extends Test.fixture.abstract.component.reflection.ParentClass
 * @mixes Test.fixture.abstract.component.reflection.ChildMixin
 */
class ChildClass extends Core.mix(
	"Test.fixture.abstract.component.reflection.ParentClass",
	"Test.fixture.abstract.component.reflection.ChildMixin"
) {

	/**
	 * This method is being used to test the Core.abstract.Component's ability to introspect
	 * and gather information about its class dependencies by analysing the $construct
	 * methods in its class and mixin chain.
	 *
	 * @private
	 * @param {*} childClassDepOne - A test dependency
	 * @param {*} childClassDepTwo - A test dependency
	 * @returns {void}
	 */
	$construct( childClassDepOne, childClassDepTwo ) {

	}

}

module.exports = ChildClass;
