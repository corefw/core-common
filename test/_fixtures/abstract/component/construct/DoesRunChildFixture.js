/**
 * @file
 * Defines the Test.fixture.abstract.component.construct.DoesRunChildFixture class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/**
 * Extends the `DoesRunFixture` to allow for more specific $construct logic testing.
 *
 * @memberOf Test.fixture.abstract.component.construct
 * @extends Test.fixture.abstract.component.construct.DoesRunFixture
 */
class DoesRunChildFixture extends Core.cls( "Test.fixture.abstract.component.construct.DoesRunFixture" ) {

	$construct() {

		// This is to test execution order of $construct
		// in the class inheritance hierarchy.
		this.lastToRunConstruct = "DoesRunChildFixture";

	}

}

module.exports = DoesRunChildFixture;
