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

	// <editor-fold desc="--- Universal Class Properties -------------------------------------------------------------">


	/**
	 * The name of this class. If the class definition file was loaded using `Core.asset.Manager` (e.g. `Core.cls`)
	 * or if this class was instantiated by a `Core.asset.ClassLoader` (both of whom inject meta information into
	 * the classes and class instances that they handle), then the full, namespaced, name of the class will be returned.
	 *
	 * If this class definition was loaded traditionally (i.e. via `require()`) and was instantiated traditionally
	 * (i.e. via the `new` keyword`), then namespace information will not be available and this property will return
	 * the simplified name provided by `this.constructor`.
	 *
	 * @access public
	 * @type {string}
	 */
	get className() {

		// Locals
		let me = this;

		if( me.$corefw !== undefined && me.$corefw.fullClassName !== undefined && me.$corefw.fullClassName !== null ) {
			return me.$corefw.fullClassName;
		} else if( me.$amClassName !== undefined && me.$amClassName !== null ) {
			return me.$amClassName;
		} else {
			return me.constructor.name;
		}

	}



	// </editor-fold>

}

module.exports = BaseClass;


