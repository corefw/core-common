/**
 * @file
 * Defines the Test.fixture.asset.mixer.onMixin.ChildMixin mixin.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/**
 * This mixin is one of many classes used to test the `Core.asset.Mixer`'s automatic execution of the
 * special, mixin, method `$mixin`.
 *
 * @memberOf Test.fixture.asset.mixer.onMixin
 */
class ChildMixin {


	/**
	 * This special, mixin, method SHOULD be executed by `Core.asset.Mixer`.
	 *
	 * @private
	 * @param {Object} data - Various information about the mixin, other mixins, the base class, and
	 * the MixedResult class.
	 * @returns {void}
	 */
	$mixin( data ) {

		// This method is being provided by a simple helper mixin
		// (`Core.debug.mixin.CallTrackerMixin`)
		this.logManualMethodCall( "$mixin", "ChildMixin", arguments, this );

	}

	/**
	 * This special, mixin, method SHOULD be executed by `Core.asset.Mixer`.
	 *
	 * @private
	 * @param {Object} data - Various information about the mixin, other mixins, the base class, and
	 * the MixedResult class.
	 * @returns {void}
	 */
	$beforeMixin( data ) {

		// This method is being provided by a simple helper mixin
		// (`Core.debug.mixin.CallTrackerMixin`)
		this.logManualMethodCall( "$beforeMixin", "ChildMixin", arguments, this );

	}

	/**
	 * This special, mixin, method SHOULD be executed by `Core.asset.Mixer`.
	 *
	 * @private
	 * @param {Object} data - Various information about the mixin, other mixins, the base class, and
	 * the MixedResult class.
	 * @returns {void}
	 */
	$afterMixin( data ) {

		// This method is being provided by a simple helper mixin
		// (`Core.debug.mixin.CallTrackerMixin`)
		this.logManualMethodCall( "$afterMixin", "ChildMixin", arguments, this );

	}

}

module.exports = ChildMixin;
