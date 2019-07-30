/**
 * @file
 * Defines the Core.logging.Logger class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

// Load dependencies using the Core Framework
// const { _, TIPE } = Core.deps( "_", "tipe" );

/**
 * A class that facilitates log output.
 *
 * @memberOf Core.logging
 * @extends Core.abstract.Component
 */
class Logger extends class Component extends Core.mix(
	"Core.abstract.Component",
	"Core.asset.mixin.Parenting"
) {

	$construct( context, output, minLogLevel = "info" ) {

		// Require the `context` class dep
		this._context = this.$require( "context", {
			instanceOf: "Core.context.Context",
		} );

		// Require the `output` class dep
		this._rawOutput = this.$require( "output", {
			$any: [
				{ instanceOf: "Core.logging.output.BaseOutput" },
				{ instanceOf: "Core.logging.output.Collection" }
			],
		} );

	}

	// <editor-fold desc="--- Outputs --------------------------------------------------------------------------------">

	set _rawOutput( newVal ) {

		// Locals
		let me = this;

		// Wrap the provided output in a collection
		// (if it's already a collection, the new collection will ingest it)
		this.outputs = $spawn( "Core.logging.output.Collection", {
			initialValues: newVal
		} );

	}

	// </editor-fold>


	_validateLogLevel( logLevel ) {

	}

	_normalizeLogLevel( logLevel ) {

	}

	/**
	 *
	 *
	 * @access public
	 * @default null
	 * @type {?string}
	 */
	get minLogLevel() {
		//return this.getConfigValue( "minLogLevel", null );
	}

	set minLogLevel( val ) {
		//this.setConfigValue( "minLogLevel", val );
	}




}

module.exports = Logger;
