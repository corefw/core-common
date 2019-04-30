/**
 * @file
 * Defines the Test.fixture.debug.inspector.stacktraces.CallerTest class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/**
 * Tests the reflection logic provided by Core.abstract.Component.
 *
 * @memberOf Test.fixture.debug.inspector.stacktraces
 * @extends Core.abstract.Component
 */
class CallerTest extends Core.cls( "Core.abstract.Component" ) {

	methodEntryPoint() {
		return this.getCaller();
	}

	get getterEntryPoint() {
		return this.getCaller();
	}

	set setterEntryPoint( ignoredValue ) {
		this._setterCaller = this.getCaller();
	}

	getCaller() {
		return Core.debugInspector.getCaller();
	}

	// ----

	static staticMethodEntryPoint() {
		return this.getStaticCaller();
	}

	static get staticGetterEntryPoint() {
		return this.getStaticCaller();
	}

	static set staticSetterEntryPoint( ignoredValue ) {
		this._staticSetterCaller = this.getStaticCaller();
	}

	static getStaticCaller() {
		return Core.debugInspector.getCaller();
	}

}

module.exports = CallerTest;
