/**
 * @file
 * Defines the Test.fixture.abstract.component.construct.DoesRunFixture class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/**
 * A simple test fixture that ensures basic $construct logic works.
 *
 * @memberOf Test.fixture.abstract.component.construct
 * @extends Core.abstract.BaseClass
 */
class DoesRunFixture extends Core.cls( "Core.abstract.Component" ) {

	$construct() {

		// Allows us to write a test that ensures
		// that this $construct method was executed.
		this.didConstructExecute = true;

		// This is to test execution order of $construct
		// in the class inheritance hierarchy.
		this.lastToRunConstruct = "DoesRunFixture";

	}

}

module.exports = DoesRunFixture;
