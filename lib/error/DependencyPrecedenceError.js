/**
 * @file
 * Defines the Core.error.DependencyPrecedenceError class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/**
 * Thrown whenever a class or mixin relies on a dependency that has not yet been loaded via $construct.
 *
 * At the time of this writing, there is no automatic way of determining this and all errors of this type
 * will be emitted in situations where it can be predicted by the developer. As such, its entirely possible
 * that this error could be emitted mistakenly (so take care).
 *
 * @memberOf Core.error
 * @extends Core.error.GenericError
 */
class DependencyPrecedenceError extends Core.cls( "Core.error.GenericError" ) {

	// Example:
	// If a class mixes Core.asset.mixin.Parenting and calls this.$spawn() from its own $construct method.
	// Because Core.asset.mixin.Parenting has a required dependency (classLoader), and because the $construct()
	// method of the mixing class will be called prior to Parenting::$construct(), then classLoader will be
	// UNDEFINED at the time that $spawn is called, resulting in this error.

	static get defaultMessage() {

		return "Attempted to use a class dependency before it was initialized. This could be caused by, " +
			"for example, a method call to a 'mixed in' method prior to that mixin's $construct method being called, " +
			"which would make the mixin method unable to access a required dependency of the mixin.";

	}

}

module.exports = DependencyPrecedenceError;
