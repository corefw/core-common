/**
 * @file
 * Defines the Test.fixture.asset.mixer.reserved.Mixin mixin.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/**
 * This is a mixin that will be used to test the Core.asset.Mixer's ability to skip (refuse to mix)
 * certain, reserved/special, mixin methods.
 *
 * @memberOf Test.fixture.asset.mixer.reserved
 */
class Mixin {

	/**
	 * This is a control method; it is not reserved and should be copied.
	 *
	 * @public
	 * @returns {void}
	 */
	notReserved() {
		return "not-reserved";
	}

	/**
	 * This is a special/reserved method that should NOT be copied into classes.
	 * (Instead, it is executed by the Mixer class on newly mixed classes)
	 *
	 * @public
	 * @param {*} MixedClass - The newly mixed class
	 * @returns {void}
	 */
	$mixin( MixedClass ) {
		return "dont-mix-me!";
	}

	/**
	 * This is a special/reserved method that should NOT be copied into classes.
	 * (Instead, it is used to augment class $construct methods by allowing mixins to require class dependencies)
	 *
	 * @public
	 * @returns {void}
	 */
	$construct() {
		return "dont-mix-me!";
	}

	/**
	 * This is a special/reserved method that should NOT be copied into classes.
	 * (Instead, it is run before any $construct methods, during class initialization)
	 *
	 * @public
	 * @returns {void}
	 */
	$beforeConstruct() {
		return "dont-mix-me!";
	}

	/**
	 * This is a special/reserved method that should NOT be copied into classes.
	 * (Instead, it is run immediately after all $construct methods, during class initialization)
	 *
	 * @public
	 * @returns {void}
	 */
	$afterConstruct() {
		return "dont-mix-me!";
	}

	/**
	 * This is a special/reserved method that should NOT be copied into classes.
	 * (Instead, it is run before the $ready method, during class initialization)
	 *
	 * @public
	 * @returns {void}
	 */
	$beforeReady() {
		return "dont-mix-me!";
	}

	/**
	 * This is a special/reserved method that should NOT be copied into classes.
	 * (Instead, it is run immediately the $ready method, during class initialization)
	 *
	 * @public
	 * @returns {void}
	 */
	$afterReady() {
		return "dont-mix-me!";
	}


}

module.exports = Mixin;
