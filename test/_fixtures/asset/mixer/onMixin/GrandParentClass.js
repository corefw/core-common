/**
 * @file
 * Defines the Test.fixture.asset.mixer.onMixin.GrandParentClass class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/**
 * This class is one of many classes used to test the `Core.asset.Mixer`'s automatic execution of the
 * special, mixin, method `$mixin`.
 *
 * @memberOf Test.fixture.asset.mixer.onMixin
 * @mixes Test.fixture.asset.mixer.onMixin.GrandParentMixin
 * @extends Core.abstract.Component
 */
class GrandParentClass extends Core.mix(
	"Core.abstract.Component",
	"Core.debug.mixin.CallTrackerMixin",
	"Test.fixture.asset.mixer.onMixin.GrandParentMixin"
) {

	/**
	 * This is a control; because it is defined at the class level, it is not a special mixin
	 * method and should not be executed by `Core.asset.Mixer`.
	 *
	 * @private
	 * @param {Object} data - Various information about the mixin, other mixins, the base class, and
	 * the MixedResult class.
	 * @returns {void}
	 */
	$mixin( data ) {

		// This method is being provided by a simple helper mixin
		// (`Core.debug.mixin.CallTrackerMixin`)
		this.logManualMethodCall( "$mixin", "GrandParentClass", arguments, this );

	}

}

module.exports = GrandParentClass;
