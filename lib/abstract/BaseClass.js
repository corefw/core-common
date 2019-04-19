/**
 * @file
 * Defines the Core.abstract.BaseClass class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/**
 * Provides a base class that ALL framework classes should inherit from (indirectly). This class is just a thin shell
 * and does not provide any functionality; most of the fundamental framework class logic is implemented in
 * `Core.abstract.Component`. Mainly, this class exists so that `Core.abstract.Component` will have a parent class
 * and can use `Core.mix()` to mix things into it.
 *
 * @abstract
 * @memberOf Core.abstract
 */
class BaseClass {

	/**
	 * This static property identifies this class, and its children, as being class definitions
	 * (a.k.a "constructors") for Core Framework classes. It will always return TRUE.
	 *
	 * @static
	 * @default true
	 * @type {boolean}
	 */
	static get $isCoreClass() {
		return true;
	}

	constructor( cfg ) {
		// Do nothing ...
	}

}

module.exports = BaseClass;


