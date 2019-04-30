/**
 * @file
 * Defines the Test.fixture.debug.inspector.stacktraces.StackTestOne class.
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
class StackTestOne extends Core.cls( "Core.abstract.Component" ) {

	stackMethodEntryPoint() {
		return this.firstStackMethod( "finalStackMethod" );
	}

	firstStackMethod( fn ) {
		return this.secondStackMethod( fn );
	}

	secondStackMethod( fn ) {
		return this.thirdStackMethod( fn );
	}

	thirdStackMethod( fn ) {
		return this.fourthStackMethod( fn );
	}

	fourthStackMethod( fn ) {
		return this[ fn ]();
	}

	finalStackMethod() {
		return Core.debugInspector.plainStacktrace;
	}

	get getterEntryPoint() {
		return Core.debugInspector.plainStacktrace;
	}

	set setterEntryPoint( ignoredValue ) {
		this._setterStack = Core.debugInspector.plainStacktrace;
	}

	static staticStackMethodEntryPoint() {
		return Core.debugInspector.plainStacktrace;
	}

	static get staticGetterEntryPoint() {
		return Core.debugInspector.plainStacktrace;
	}

	static set staticSetterEntryPoint( ignoredValue ) {
		this._staticSetterStack = Core.debugInspector.plainStacktrace;
	}

}

module.exports = StackTestOne;
