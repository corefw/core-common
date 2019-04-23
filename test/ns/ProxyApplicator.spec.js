/**
 * @file
 * Defines tests for the Core.ns.ProxyApplicator class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/* eslint no-console: "off", require-jsdoc: "off", func-style: "off", no-extra-bind: "off", no-unused-vars: "off", no-undef: "off", space-in-parens: "off" */

let Fixture = require( "../_fixtures/ns/provider/ProviderClass" );


describe( "Core.ns.ProxyApplicator", function () {

	describe( "-> Test.fixture.ns.provider.ProviderClass", function () {

		describe( ".a.path.one", function () {

			it( "should return a new `Core.ns.GenericProvider`", function () {

				expect( Fixture.a.path.one.constructor.name ).to.equal( "GenericProvider" );

			} );

			it( "should return a `Core.ns.GenericProvider` that has an understanding of its own namespace path", function () {

				let result = Fixture.a.path.one;
				let nsName = result.$nsProviderMeta.fullNsName;

				expect( nsName ).to.equal( "Ns.test.a.path.one" );

			} );

			it( "should use caching to avoid duplicating namespace providers", function () {

				let resA = Fixture.cache.this.provider;
				resA.cacheMe = 1;

				let resB = Fixture.cache.this.provider;
				expect( resB.cacheMe ).to.equal( 1 );

			} );

		} );

		describe( ".a.path.to.a.Class", function () {

			it( "should call the root provider's `cls()` method", function () {

				expect( Fixture.a.path.to.a.Class ).to.equal( "load:Ns.test.a.path.to.a.Class" );

			} );

		} );

	} );

	describe( "-> Core", function () {

		describe( ".asset.ioc", function () {

			it( "should return a new `Core.ns.GenericProvider`", function () {

				expect( Core.asset.ioc.constructor.name ).to.equal( "GenericProvider" );

			} );

			it( "should return a `Core.ns.GenericProvider` that has an understanding of its own namespace path", function () {

				let result = Core.asset.ioc;
				let nsName = result.$nsProviderMeta.fullNsName;

				expect( nsName ).to.equal( "Core.asset.ioc" );

			} );

		} );

		describe( ".asset.ioc.Container", function () {

			it( "should return the the class definition/constructor for `Core.asset.ioc.Container`", function () {

				expect( Core.asset.ioc.Container.prototype.$amClassName ).to.equal( "Core.asset.ioc.Container" );

			} );

		} );

		describe( ".type.Validator", function () {

			it( "should return the the class definition/constructor for `Core.type.Validator`", function () {

				expect( Core.type.Validator.prototype.$amClassName ).to.equal( "Core.type.Validator" );

			} );

		} );

	} );

} );
