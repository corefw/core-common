/**
 * @file
 * Defines the Test.fixture.asset.mixer.basic.Mixin mixin.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/**
 * This is a mixin that will be used to test the Core.asset.Mixer's basic mixing logic.
 *
 * @memberOf Test.fixture.asset.mixer.basic
 */
class Mixin {

	/**
	 * This method is used to ensure that basic mixin logic is working and
	 * that methods are being copied from the mixin to the target class.
	 *
	 * @public
	 * @returns {string} A test string.
	 */
	aSimpleMethod() {
		return "it works!";
	}

	/**
	 * This property getter is used to ensure that basic mixin logic is working
	 * and that methods are being copied from the mixin to the target class.
	 *
	 * @public
	 * @default "it works!"
	 * @type {string}
	 */
	get aSimpleProperty() {
		return "it works!";
	}

	/**
	 * This method is used to test override precedence. Although the mixin will override
	 * the ParentClass' implementation of this method, the child class should override
	 * the mixin, so this implementation SHOULD NOT be called.
	 *
	 * @public
	 * @returns {string} A test string
	 */
	aFinalChildMethod() {
		return "Mixin";
	}

	/**
	 * This method is used to test override precedence. This mixin should override
	 * the ParentClass implementation and since ChildClass does not, itself, provide
	 * and override, then this implementation SHOULD be called.
	 *
	 * @public
	 * @returns {string} A test string
	 */
	aFinalMixinMethod() {
		return "Mixin";
	}

	/**
	 * This method is used to the ability of child classes to call overridden mixin
	 * methods using the `super` keyword (though, it is probably a bad idea to do so, since
	 * there's no way for the child to know what `super` refers to).
	 *
	 * This method should override the ParentClass' implementation and a call to `super.aTestOfChildSuper()`,
	 * from within the child class, SHOULD invoke this method.
	 *
	 * @public
	 * @returns {string} A test string
	 */
	aTestOfChildSuper() {
		return "Mixin";
	}

}

module.exports = Mixin;
