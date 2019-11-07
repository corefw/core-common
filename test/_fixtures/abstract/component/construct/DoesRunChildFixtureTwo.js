/**
 * @file
 * Defines the Test.fixture.abstract.component.construct.DoesRunChildFixtureTwo class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/**
 * Extends the `DoesRunChildFixture` to test an inheriting class' ability to cancel
 * the execution of its parent class' $construct method.
 *
 * @memberOf Test.fixture.abstract.component.construct
 * @extends Test.fixture.abstract.component.construct.DoesRunChildFixture
 */
class DoesRunChildFixtureTwo extends Core.cls( "Test.fixture.abstract.component.construct.DoesRunChildFixture" ) {

	$construct() {

		// Under normal circumstances, this value would be
		// overwritten by parent $construct methods.
		this.lastToRunConstruct = "DoesRunChildFixtureTwo";

		// .. but it shouldn't be in this case,
		// because we're returning false.
		return false;

	}

}

module.exports = DoesRunChildFixtureTwo;
