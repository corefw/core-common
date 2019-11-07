/**
 * @file
 * Defines the `Core.error.mixin.Throwing` mixin.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

// Load dependencies using the Core Framework
// const { _ } = Core.deps( "_" );

/**
 * Provides classes with method(s) for throwing errors.
 *
 * Note: This mixin is applied to `Core.abstract.Component`, making it generally
 * available to most framework classes.
 *
 * @memberOf Core.error.mixin
 */
class Throwing {

	/**
	 * This is an alias for `Core.error.Manager#throw()` that injects a special 'info' object with a `$thrownBy`
	 * property that references `this`, which can be used to format error messages in a way that indicates
	 * the class that threw the error.
	 *
	 * @private
	 * @param {*} args - Arguments that will be forwarded to `Core.error.Manager#throw()`.
	 * @returns {void}
	 */
	$throw( ...args ) {

		// Prepend the args with a special info object that references 'this'
		args.unshift( {
			$thrownBy: this
		} );

		// Defer to the error manager
		Core.errorManager.throw( ...args );

	}

}

module.exports = Throwing;
