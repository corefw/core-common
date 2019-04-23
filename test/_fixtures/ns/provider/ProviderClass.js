/**
 * @file
 * Defines the Test.fixture.ns.provider.ProviderClass class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

let ProxyApplicator = require( "../../../../lib/ns/ProxyApplicator" );

/**
 * A mock "namespace provider" that is used to test the Proxy provided by the `Core.ns.ProxyApplicator` class.
 *
 * @memberOf Test.fixture.ns.provider
 */
class ProviderClass {

	static get rootNamespace() {
		return "Ns.test";
	}

	static cls( className ) {
		return "load:" + className;
	}

}

// Apply the Namespace Provider Proxy
module.exports = ProxyApplicator.apply( ProviderClass );
