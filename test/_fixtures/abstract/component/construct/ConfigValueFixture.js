/**
 * @file
 * Defines the Test.fixture.abstract.component.construct.ConfigValueFixture class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/**
 * This fixture tests configuration values.
 *
 * @memberOf Test.fixture.abstract.component.construct
 * @extends Core.abstract.Component
 */
class ConfigValueFixture extends Core.cls( "Core.abstract.Component" ) {

	$construct( someSetting, anotherSetting ) {

		this.someSetting 	= someSetting;
		this.anotherSetting = anotherSetting;

	}

}

module.exports = ConfigValueFixture;
