/**
 * @file
 * Defines the Test.fixture.asset.mixer.onMixin.GrandParentMixin mixin.
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
class GrandParentMixin {

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
		this.logManualMethodCall( "$mixin", "GrandParentMixin", arguments, this );

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

		// Although this method should be called, we cannot use our handy little
		// method call tracker this mixin because this mixin is mixed at the same
		// level as the tracker mixin and $beforeMixin() will be called prior
		// to ANY mixins being mixed at this level.

		// (So how many pickled peppers did Peter Piper pick?)

		// Still, I can test with the other mixins, so its not a big deal.

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
		this.logManualMethodCall( "$afterMixin", "GrandParentMixin", arguments, this );

	}

}

module.exports = GrandParentMixin;
