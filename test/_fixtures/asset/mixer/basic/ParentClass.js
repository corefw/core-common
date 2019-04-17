/**
 * @file
 * Defines the Test.fixture.asset.mixer.basic.ParentClass class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/**
 * This is a parent class that will be used to test the Core.asset.Mixer's basic mixing logic.
 *
 * @memberOf Test.fixture.asset.mixer.basic
 * @extends Core.abstract.Component
 */
class ParentClass extends Core.cls( "Core.abstract.Component" ) {

	/**
	 * This method is used to test override precedence. Although the mixin will override
	 * this class' implementation of this method, the child class should override
	 * the mixin. Either way, this implementation SHOULD NOT be called.
	 *
	 * @public
	 * @returns {string} A test string
	 */
	aFinalChildMethod() {
		return "ParentClass";
	}

	/**
	 * This method is used to test override precedence. The mixin should override
	 * this method. So, this implementation SHOULD NOT be called.
	 *
	 * @public
	 * @returns {string} A test string
	 */
	aFinalMixinMethod() {
		return "ParentClass";
	}

	/**
	 * This method is used to the ability of child classes to call overridden mixin
	 * methods using the `super` keyword.
	 *
	 * Without mixins, child classes should be able to use the `super` keyword to call overridden
	 * methods in their parent class. However, since mixin methods are applied on top of parent classes,
	 * calls to `super.aTestOfChildSuper()`, from within this child class, should result in a call to
	 * the MIXIN's implementation.
	 *
	 * Either way, this implementation SHOULD NOT be called.
	 *
	 * @public
	 * @returns {string} A test string
	 */
	aTestOfChildSuper() {
		return "ParentClass";
	}

}

module.exports = ParentClass;
