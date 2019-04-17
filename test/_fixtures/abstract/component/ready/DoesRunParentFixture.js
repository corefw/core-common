/**
 * @file
 * Defines the Test.fixture.abstract.component.ready.DoesRunParentFixture class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/**
 * A simple test fixture that ensures basic $ready logic works.
 *
 * @memberOf Test.fixture.abstract.component.ready
 * @extends Core.abstract.Component
 */
class DoesRunParentFixture extends Core.cls( "Core.abstract.Component" ) {

	$ready() {

		// Used to determine that $ready was called for this class.
		this.readyRanForParent = true;

	}

}

module.exports = DoesRunParentFixture;
