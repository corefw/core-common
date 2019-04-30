/**
 * @file
 * Defines tests for the Core.debug.Inspector class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/* eslint func-style: "off", require-jsdoc: "off", comma-spacing: "off" */

describe( "Core.debug.Inspector", function () {

	describe( ".plainStacktrace", function () {

		it( "should return predictable stack trace data for methods", function() {

			// We have a fixture for this..
			let fixture = Core.inst( "Test.fixture.debug.inspector.stacktraces.StackTestOne" );

			// Fetch the stack trace..
			let result = fixture.stackMethodEntryPoint();

			// Assert..
			expect( result[ 0 ].memberName ).to.equal( "Test.fixture.debug.inspector.stacktraces.StackTestOne#finalStackMethod()" );

		} );

		it( "should return predictable stack trace data for getters/accessors", function() {

			// We have a fixture for this..
			let fixture = Core.inst( "Test.fixture.debug.inspector.stacktraces.StackTestOne" );

			// Fetch the stack trace..
			let result = fixture.getterEntryPoint;

			// Assert..
			expect( result[ 0 ].memberName ).to.equal( "Test.fixture.debug.inspector.stacktraces.StackTestOne.<get>getterEntryPoint" );

		} );

		it( "should return predictable stack trace data for setters/mutators", function() {

			// We have a fixture for this..
			let fixture = Core.inst( "Test.fixture.debug.inspector.stacktraces.StackTestOne" );

			// First, perform a set operation; the stack will be cached.
			fixture.setterEntryPoint = "Go, go, gadget...";

			// Fetch the stack trace..
			let result = fixture._setterStack;

			// Assert..
			expect( result[ 0 ].memberName ).to.equal( "Test.fixture.debug.inspector.stacktraces.StackTestOne.<set>setterEntryPoint" );

		} );

		it( "should return predictable stack trace data for STATIC methods", function() {

			// We have a fixture for this..
			let Fixture = Core.cls( "Test.fixture.debug.inspector.stacktraces.StackTestOne" );

			// Fetch the stack trace..
			let result = Fixture.staticStackMethodEntryPoint();

			// Assert..
			expect( result[ 0 ].memberName ).to.equal( "Test.fixture.debug.inspector.stacktraces.StackTestOne.<static>staticStackMethodEntryPoint()" );

		} );


		it( "should return predictable stack trace data for STATIC getters/accessors", function() {

			// We have a fixture for this..
			let Fixture = Core.cls( "Test.fixture.debug.inspector.stacktraces.StackTestOne" );

			// Fetch the stack trace..
			let result = Fixture.staticGetterEntryPoint;

			// Assert..
			expect( result[ 0 ].memberName ).to.equal( "Test.fixture.debug.inspector.stacktraces.StackTestOne.<static,get>staticGetterEntryPoint" );

		} );

		it( "should return predictable stack trace data for STATIC setters/mutators", function() {

			// We have a fixture for this..
			let Fixture = Core.cls( "Test.fixture.debug.inspector.stacktraces.StackTestOne" );

			// First, perform a set operation; the stack will be cached.
			Fixture.staticSetterEntryPoint = "Go, go, gadget...";

			// Fetch the stack trace..
			let result = Fixture._staticSetterStack;

			// Assert..
			expect( result[ 0 ].memberName ).to.equal( "Test.fixture.debug.inspector.stacktraces.StackTestOne.<static,set>staticSetterEntryPoint" );

		} );

	} );

	describe( "#getCaller()", function () {

		it( "should resolve methods as callers", function () {

			// We have a fixture for this..
			let fixture = Core.inst( "Test.fixture.debug.inspector.stacktraces.CallerTest" );

			// Fetch the caller
			let result = fixture.methodEntryPoint();

			// Assert..
			expect( result.memberName ).to.equal( "Test.fixture.debug.inspector.stacktraces.CallerTest#methodEntryPoint()" );

		} );

		it( "should resolve accessors as callers", function () {

			// We have a fixture for this..
			let fixture = Core.inst( "Test.fixture.debug.inspector.stacktraces.CallerTest" );

			// Fetch the caller
			let result = fixture.getterEntryPoint;

			// Assert..
			expect( result.memberName ).to.equal( "Test.fixture.debug.inspector.stacktraces.CallerTest.<get>getterEntryPoint" );

		} );

		it( "should resolve mutators as callers", function () {

			// We have a fixture for this..
			let fixture = Core.inst( "Test.fixture.debug.inspector.stacktraces.CallerTest" );

			// First, call the setter; it will cache the caller info
			fixture.setterEntryPoint = "Weeeee";

			// Fetch the caller
			let result = fixture._setterCaller;

			// Assert..
			expect( result.memberName ).to.equal( "Test.fixture.debug.inspector.stacktraces.CallerTest.<set>setterEntryPoint" );

		} );

		it( "should resolve STATIC methods as callers", function () {

			// We have a fixture for this..
			let Fixture = Core.cls( "Test.fixture.debug.inspector.stacktraces.CallerTest" );

			// Fetch the caller
			let result = Fixture.staticMethodEntryPoint();

			// Assert..
			expect( result.memberName ).to.equal( "Test.fixture.debug.inspector.stacktraces.CallerTest.<static>staticMethodEntryPoint()" );

		} );

		it( "should resolve STATIC accessors as callers", function () {

			// We have a fixture for this..
			let Fixture = Core.cls( "Test.fixture.debug.inspector.stacktraces.CallerTest" );

			// Fetch the caller
			let result = Fixture.staticGetterEntryPoint;

			// Assert..
			expect( result.memberName ).to.equal( "Test.fixture.debug.inspector.stacktraces.CallerTest.<static,get>staticGetterEntryPoint" );

		} );

		it( "should resolve STATIC mutators as callers", function () {

			// We have a fixture for this..
			let Fixture = Core.cls( "Test.fixture.debug.inspector.stacktraces.CallerTest" );

			// First, call the setter; it will cache the caller info
			Fixture.staticSetterEntryPoint = "Weeeee";

			// Fetch the caller
			let result = Fixture._staticSetterCaller;

			// Assert..
			expect( result.memberName ).to.equal( "Test.fixture.debug.inspector.stacktraces.CallerTest.<static,set>staticSetterEntryPoint" );

		} );


	} );

} );
