/**
 * @file
 * Defines the Core.logging.mixin.Loggable mixin.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

// Fetch the AssetManager
//const Am = require( "../index" ).assetManager;

// Load dependencies using the Core Framework
//const _    = Am.dep( "lodash" );
//const TIPE = Am.dep( "tipe" );

/**
 * An execution container that loads and manages the run-time state, context, and environment for
 * a single execution instance.
 *
 * @memberOf Core.logging.mixin
 */
class Loggable {

	// <editor-fold desc="--- Something ------------------------------------------------------------------------------">
	// </editor-fold>

	testme() {
		console.log( "!!!!!!!!!! TEST !!!!!!!!!!!!" );
	}

	$mixin( cls ) {

	}

	$beforeConstruct() {

	}

	$construct( breed ) {

	}

	$beforeReady() {

	}

	$afterReady() {

	}

}

module.exports = Loggable;
