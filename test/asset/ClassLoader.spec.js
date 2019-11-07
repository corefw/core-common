/**
 * @file
 * Defines tests for the Core.asset.ClassLoader class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

describe( "Core.asset.ClassLoader", function() {

	describe( "#$construct()", function() {

		it( "should throw an error if no `iocContainer` is provided", function() {

			expect( function() {

				Core.inst( "Core.asset.ClassLoader" );

			} ).to.throw( Error );

		} );

		it( "should throw an error if `iocContainer` is not an 'instanceOf' Core.asset.ioc.Container", function() {

			expect( function() {

				Core.inst( "Core.asset.ClassLoader", {
					iocContainer: Core.inst( "Core.abstract.Component" )
				} );

			} ).to.throw( Error );

		} );

	} );

	describe( "#_injectIocValues()", function() {

		let classLoader;

		beforeEach( function() {

			// ClassLoaders need an IoC container
			let ioc = Core.inst( "Core.asset.ioc.Container" );

			// Populate the ioc container, a bit
			ioc.singleton( "fakeSingletonDep", function() {
				return "whatWeExpected";
			} );
			ioc.prop( "fakeStaticDep", "alsoWhatWeExpected" );
			ioc.prop( "notADep", "This item should not be injected" );

			// Spawn a ClassLoader
			classLoader = Core.inst( "Core.asset.ClassLoader", {
				iocContainer: ioc
			} );

		} );

		it( "should inject existing IoC values for missing class dependencies into config objects", function() {

			// Define a config object..
			let explicitValues = {};

			// Get a fixture class
			let SimpleClass = Core.cls( "Test.fixture.asset.classLoader.basic.SimpleClass" );

			// Do the injection
			let finalConfig = classLoader._injectIocValues( SimpleClass, explicitValues );

			// Assert..
			expect( finalConfig.fakeSingletonDep ).to.be.a(  "string"             );
			expect( finalConfig.fakeSingletonDep ).to.equal( "whatWeExpected"     );
			expect( finalConfig.fakeStaticDep    ).to.be.a(  "string"             );
			expect( finalConfig.fakeStaticDep    ).to.equal( "alsoWhatWeExpected" );

		} );

		it( "should NOT overwrite explicit values", function() {

			// Define a config object..
			let explicitValues = {
				fakeStaticDep: "anExplicitValue"
			};

			// Get a fixture class
			let SimpleClass = Core.cls( "Test.fixture.asset.classLoader.basic.SimpleClass" );

			// Do the injection
			let finalConfig = classLoader._injectIocValues( SimpleClass, explicitValues );

			// Assert..
			expect( finalConfig.fakeSingletonDep ).to.be.a(  "string"             );
			expect( finalConfig.fakeSingletonDep ).to.equal( "whatWeExpected"     );
			expect( finalConfig.fakeStaticDep    ).to.be.a(  "string"             );
			expect( finalConfig.fakeStaticDep    ).to.equal( "anExplicitValue"    );

		} );

		it( "should NOT inject values that are not dependencies of the target class", function() {

			// Define a config object..
			let explicitValues = {};

			// Get a fixture class
			let SimpleClass = Core.cls( "Test.fixture.asset.classLoader.basic.SimpleClass" );

			// Do the injection
			let finalConfig = classLoader._injectIocValues( SimpleClass, explicitValues );

			// Assert..
			expect( finalConfig.notADep ).to.be.an( "undefined" );

		} );

	} );

} );
