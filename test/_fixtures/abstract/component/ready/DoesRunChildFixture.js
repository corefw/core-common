/**
 * @file
 * Defines the Test.fixture.abstract.component.ready.DoesRunChildFixture class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/**
 * Extends the `DoesRunParentFixture` to allow for more specific $ready logic testing.
 *
 * @memberOf Test.fixture.abstract.component.ready
 * @extends Test.fixture.abstract.component.ready.DoesRunParentFixture
 */
class DoesRunChildFixture extends Core.cls( "Test.fixture.abstract.component.ready.DoesRunParentFixture" ) {

	$ready() {

		// Used to determine that $ready was called for this class.
		this.readyRanForChild = true;

	}

}

module.exports = DoesRunChildFixture;
