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

	/*
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
	 */

	$construct( logger ) {

		this.logger = this.$require( "logger", {
			instanceOf : "Core.logging.Logger",
			allowNull  : true
		} );

	}

	get logger() {
		return this._logger;
	}

	set logger( val ) {
		this._logger = val;
	}

	/**
	 * Creates a log event with a 'trace' severity code.
	 *
	 * @param {...*} args - Log event info.
	 * @returns {void}
	 */
	$trace( ...args ) {
		args.unshift( "trace" );
		this.$log.apply( this, args );
	}

	/**
	 * Creates a log event with a 'debug' severity code.
	 *
	 * @param {...*} args - Log event info.
	 * @returns {void}
	 */
	$debug( ...args ) {
		args.unshift( "debug" );
		this.$log.apply( this, args );
	}

	/**
	 * Creates a log event with an 'info' severity code.
	 *
	 * @param {...*} args - Log event info.
	 * @returns {void}
	 */
	$info( ...args ) {
		args.unshift( "info" );
		this.$log.apply( this, args );
	}

	/**
	 * Creates a log event with a 'notice' severity code.
	 *
	 * @param {...*} args - Log event info.
	 * @returns {void}
	 */
	$notice( ...args ) {
		args.unshift( "notice" );
		this.$log.apply( this, args );
	}

	/**
	 * Creates a log event with a 'warning' severity code.
	 *
	 * @param {...*} args - Log event info.
	 * @returns {void}
	 */
	$warning( ...args ) {
		args.unshift( "warning" );
		this.$log.apply( this, args );
	}

	/**
	 * Creates a log event with a 'warning' severity code.
	 *
	 * @param {...*} args - Log event info.
	 * @returns {void}
	 */
	$warn( ...args ) {
		args.unshift( "warning" );
		this.$log.apply( this, args );
	}

	/**
	 * Creates a log event with an 'error' severity code.
	 *
	 * @param {...*} args - Log event info.
	 * @returns {void}
	 */
	$error( ...args ) {
		args.unshift( "error" );
		this.$log.apply( this, args );
	}

	/**
	 * Creates a log event with a 'critical' severity code.
	 *
	 * @param {...*} args - Log event info.
	 * @returns {void}
	 */
	$critical( ...args ) {
		args.unshift( "critical" );
		this.$log.apply( this, args );
	}

	/**
	 * Creates a log event with a 'critical' severity code.
	 *
	 * @param {...*} args - Log event info.
	 * @returns {void}
	 */
	$crit( ...args ) {
		args.unshift( "critical" );
		this.$log.apply( this, args );
	}

	/**
	 * Creates a log event with a 'alert' severity code.
	 *
	 * @param {...*} args - Log event info.
	 * @returns {void}
	 */
	$alert( ...args ) {
		args.unshift( "alert" );
		this.$log.apply( this, args );
	}

	/**
	 * Creates a log event with a 'emergency' severity code.
	 *
	 * @param {...*} args - Log event info.
	 * @returns {void}
	 */
	$emergency( ...args ) {
		args.unshift( "emergency" );
		this.$log.apply( this, args );
	}

	$log( ...args ) {

		// Locals
		let me = this;

		// Skip if we don't have a logger
		if( me.logger === undefined || me.logger === null ) {
			console.log("-skip log event-");
			return;
		}

		// Initialize the log event
		let event = me.logger.initLogEvent.apply( me.logger, args );

		// Apply the application.component value
		event.application.component = me.$amClassName;

		// Send the final event to the logger for output...
		this.logger.log( event );

	}

}

module.exports = Loggable;
