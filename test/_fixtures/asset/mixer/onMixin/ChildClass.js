/**
 * @file
 * Defines the Test.fixture.asset.mixer.onMixin.ChildClass class.
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
 * @mixes Test.fixture.asset.mixer.onMixin.ChildMixin
 * @extends Test.fixture.asset.mixer.onMixin.ParentClass
 */
class ChildClass extends Core.mix( "Test.fixture.asset.mixer.onMixin.ParentClass", "Test.fixture.asset.mixer.onMixin.ChildMixin" ) {

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
		this.logManualMethodCall( "$mixin", "ChildClass", arguments, this );

	}

}

module.exports = ChildClass;
