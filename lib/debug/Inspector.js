/**
 * @file
 * Defines the Core.debug.Inspector class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/* eslint no-console: "off" */

// Load dependencies using the traditional method
const TIPE 	= require( "tipe" );
const _ 	= require( "lodash" );

// Other constants
const KEY_COLUMN_WIDTH = 30;

/**
 * A utility for inspecting arbitrary variables.
 *
 * @memberOf Core.debug
 * @extends Core.abstract.Component
 */
class Inspector {

	get chalk() {
		return require( "chalk" );
	}

	summarize( target ) {

	}

	getType( target ) {
		return TIPE( target );
	}

	summarizeChain( target, name = "TargetObject", depth = 1 ) {

		// Locals
		let me = this;
		let chalk = me.chalk;

		// Skip 'Object'
		if( target.constructor && target.constructor.name === "Object" ) {
			return;
		}

		// Heading
		console.log( "\n\n" );
		console.log( chalk.yellow.bold( _.repeat( "-", 3 ) + " " + "Summarizing Prototype Chain " + " " + _.repeat( "-", 60 ) ) );
		console.log( "" );

		// Summary
		console.log( "  " + chalk.cyan.bold( "Summary:" ) );
		me._keyVal( "Target", name );
		me._keyVal( "Depth", depth );
		me._keyVal( "Type", me.getType( target ) );

		if( target.constructor !== undefined && target.constructor.name !== undefined ) {
			me._keyVal( "Constructor", target.constructor.name );
		}

		console.log( "" );

		// Members
		console.log( "  " + chalk.cyan.bold( "OwnProperties:" ) );
		let props = Object.getOwnPropertyNames( target );
		_.each( props, function( prop ) {

			console.log( "   " + chalk.green( "[ " + _.padEnd( prop, KEY_COLUMN_WIDTH ) + " ]" ) + " : " + chalk.yellow.dim( "<" + me.getType( target[ prop ] ) + ">" ) );

		} );

		// Dive Deeper
		if( target.prototype ) {
			me.summarizeChain( target.prototype, ( name + ".prototype" ), ( depth + 1 ) );
		} else if( Object.getPrototypeOf( target ) ) {
			me.summarizeChain( Object.getPrototypeOf( target ), ( name + ".(prototypeOf)" ), ( depth + 1 ) );
		}

		if( depth === 1 ) {
			console.log( "\n\n" );
		}

	}

	_keyVal( key, val ) {

		// Locals
		let me        = this;
		let chalk     = me.chalk;
		let keyPadded = _.padEnd( key, 14 );

		console.log( "   " + chalk.grey( keyPadded + ":" ) + " " + chalk.cyan( val ) );

	}

	get perfHooks() {
		return Core.dep( "perf_hooks" );
	}

	inspect( target ) {

	}

	/**
	 * Wraps a function with performance-monitoring logic that logs each time the function
	 * is called and how long it took the function to execute.
	 *
	 * @example
	 * ready() {
	 * 		this._someFn = Core.inspector.monitorFunctionPerformance( this._someFn, this );
	 * }
	 *
	 * @public
	 * @param {function} fn - The function to monitor
	 * @param {*} scope - The scope in which the function will be executed.
	 * @returns {function} The wrapped function.
	 */
	monitorFunctionPerformance( fn, scope ) {

		// Locals
		let me 		= this;
		let chalk 	= me.chalk;

		// Load the performance library
		const { PerformanceObserver, performance } = me.perfHooks;

		// Resolve a name for the function (for the logs)
		let name = me._resolveFunctionName( fn, scope );

		// Announce the mfp call
		console.log( "\n\n" + chalk.bold( "Adding a performance monitor to: " + chalk.yellow( name ) ) + "\n" );

		// Bind the function
		let bound = fn.bind( scope );

		// Wrap the function
		let ret = performance.timerify( bound );

		// Create an observer
		let obs = new PerformanceObserver( ( list ) => {

			// Resolve the duration
			let duration = ( list.getEntries()[ 0 ].duration ).toFixed( 2 );

			// Announce the results
			console.log( "\n\n" + chalk.bold( "Execution of " + chalk.yellow( name ) ) + " finished in " + duration + " ms\n" );

		} );

		// Attach the observer
		obs.observe( { entryTypes: [ "function" ] } );

		// Return the wrapped function
		return ret;

	}

	_resolveFunctionName( fn, scope ) {

		let className = "";

		if( scope.className ) {
			className = scope.className + "::";
		} else if( scope.$amClassName ) {
			className = scope.$amClassName + "::";
		}

		let functionName = fn.name + "()";

		return className + functionName;

	}

	_tmp() {

		const { performance } = require( "perf_hooks" );

		let st1 = performance.mark( "start" );


		let st2 = performance.mark( "end" );

		console.log( performance.measure( "end", st1, st2 ) );

	}


}

module.exports = Inspector;
