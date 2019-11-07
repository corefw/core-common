/**
 * @file
 * Defines the Test.fixture.asset.mixer.basic.ChildClass class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/**
 * This is a class that will be used to test the Core.asset.Mixer's basic mixing logic.
 *
 * @memberOf Test.fixture.asset.mixer.basic
 * @extends Test.fixture.asset.mixer.basic.ParentClass
 * @mixes Test.fixture.asset.mixer.basic.Mixin
 */
class ChildClass extends Core.mix( "Test.fixture.asset.mixer.basic.ParentClass", "Test.fixture.asset.mixer.basic.Mixin" ) {

	/**
	 * This method is used to test override precedence. Although the mixin will override
	 * the ParentClass' implementation of this method, this child class should override
	 * the mixin, so this implementation SHOULD be called.
	 *
	 * @public
	 * @returns {string} A test string
	 */
	aFinalChildMethod() {
		return "ChildClass";
	}

	/**
	 * This method is used to the ability of child classes to call overridden mixin
	 * methods using the `super` keyword (though, it is probably a bad idea to do so, since
	 * there's no way for the child to know what `super` refers to).
	 *
	 * This method should override Mixin's implementation and a call to `super.aTestOfChildSuper()`,
	 * from within this child class, SHOULD invoke the MIXIN method.
	 *
	 * @public
	 * @returns {string} A test string
	 */
	aTestOfChildSuper() {
		return super.aTestOfChildSuper();
	}

}

module.exports = ChildClass;
