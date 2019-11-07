/**
 * @file
 * Defines the Test.fixture.abstract.component.construct.ConfigValueChildFixture class.
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
 * @extends Test.fixture.abstract.component.construct.ConfigValueFixture
 */
class ConfigValueChildFixture extends Core.cls( "Test.fixture.abstract.component.construct.ConfigValueFixture" ) {

	$construct() {

		return {
			anotherSetting: "overridden"
		};

	}

	get anotherSettingInConfig() {
		return this.$getConfig( "anotherSetting" );
	}

}

module.exports = ConfigValueChildFixture;
