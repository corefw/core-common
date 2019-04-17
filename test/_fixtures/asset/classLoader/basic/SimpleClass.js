/**
 * @file
 * Defines the Test.fixture.asset.classLoader.basic.SimpleClass class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/**
 * This is a class that will be used to test the Core.asset.ClassLoader's basic logic.
 *
 * @memberOf Test.fixture.asset.classLoader.basic
 * @extends Core.abstract.Component
 */
class SimpleClass extends Core.cls( "Core.abstract.Component" ) {

	$construct( fakeStaticDep, fakeSingletonDep, aThirdDep ) {

		this.constructArgValues = {
			fakeStaticDep, fakeSingletonDep, aThirdDep
		};

	}

}

module.exports = SimpleClass;
