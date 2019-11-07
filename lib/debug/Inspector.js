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
const TIPE 	      = require( "tipe" );
const _ 	      = require( "lodash" );
const EYES        = require( "eyes" );
const STACK_TRACE = require( "stack-trace" );

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

	get _eyes() {

		const eyesConfig = {
			styles: {                  			// Styles applied to stdout
				all     : "cyan",      			// Overall style applied to everything
				label   : "underline", 			// Inspection labels, like 'array' in `array: [1, 2, 3]`
				other   : "inverted",  			// Objects which don't have a literal representation, such as functions
				key     : "bold",      			// The keys in object literals, like 'a' in `{a: 1}`
				special : "grey",      			// null, undefined...
				string  : "green",
				number  : "magenta",
				bool    : "yellow",    			// true false
				regexp  : "green",     			// /\d+/
			},

			pretty        : true,             	// Indent object literals
			hideFunctions : false,     			// Don't output functions at all
			stream        : process.stdout,   	// Stream to write to, or null
			maxLength     : ( 2048 * 10 )  		// Truncate output if longer
		};

		const inspector = EYES.inspector( eyesConfig );
		return inspector;

	}

	inspect( target, name = null ) {

		// Locals
		let me 			= this;
		let inspect		= me._eyes;
		let lineLength 	= 120;
		let titleString = "";
		let lineChar    = "=";
		let chalk		= me.chalk;

		// Output a heading
		console.log( "\n\n" );

		if( name === null ) {
			titleString = "Variable Dump";
		} else {
			titleString = "Variable Dump: " + name;
		}

		// .. title
		console.log(
			chalk.grey( _.repeat( lineChar, 6 ) ) + "  " +
			chalk.green( titleString ) +
			"  " +
			chalk.grey( _.repeat( lineChar, ( lineLength - ( titleString.length + 10 ) ) ) )
		);

		console.log( "\n" );

		// Output the variable
		inspect( target );

		// Output a footer.
		console.log( "\n" );
		console.log( chalk.grey( _.repeat( lineChar, lineLength ) ) );
		console.log( "\n\n" );

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

	get stacktrace() {

		return this._getRawStacktrace( null );

	}

	get plainStacktrace() {

		return this._getPlainRawStacktrace( null );

	}

	_getRawStacktrace( opts = null ) {

		// Locals
		let me  = this;
		let ret = [];

		// Get the stack from the `stack-trace` module..
		let raw = STACK_TRACE.get();

		// Ensure `opts` is an object.
		if( !_.isPlainObject( opts ) ) {
			opts = {};
		}

		// Apply default options
		opts = _.defaults( {}, opts, {
			ignoreFiles: []
		} );

		// `opts.ignoreFiles` MUST be an array..
		if( !Array.isArray( opts.ignoreFiles ) ) {
			opts.ignoreFiles = [];
		}

		// We'll always want to ignore the debug inspector.
		opts.ignoreFiles.push( /debug(\\|\/)Inspector(\.m*js)$/ );

		// Iterate over each raw result
		raw.forEach( function( item ) {

			// Append the CallSite object with a new getClassName() method.
			item.getClassName = function getClassName() {

				// Resolve the type name..
				let typeName = this.getTypeName();

				// If type is null, we can exit early..
				if( typeName === null ) {
					return null;
				}

				// Resolve the file name..
				let fileName = this.getFileName();

				// If the file name is not a string, we can exit early..
				if( !_.isString( fileName ) ) {
					return null;
				}

				// If the file name does not have any slashses, then
				// it probably is not a class...
				// todo: implement PATH.sep?
				if( fileName.indexOf( "/" ) === -1 ) {
					return null;
				}

				// If we've made it here, then we can try to resolve..
				return Core.assetManager.reverseLookup( fileName );

			};

			// Append the CallSite object with a new getMemberSuffix() method.
			item.getMemberSuffix = function getMemberSuffix() {

				// Resolve the class name..
				let className = this.getClassName();

				// If class is null, we can exit early..
				if( className === null ) {
					return null;
				}

				// Resolve the function name..
				let fnName = this.getFunctionName();

				// If the function name is not a string, we can exit early..
				if( !_.isString( fnName ) ) {
					return null;
				}

				// Resolve the type name..
				let typeName = this.getTypeName();

				// If the type name is exactly 'Function', then we're probably
				// dealing with a static member..
				if( typeName === "Function" ) {

					// Format the member differently for getters, setters, and methods..
					if( _.startsWith( fnName, "get " ) ) {
						return ".<static,get>" + fnName.substr( 4 );
					} else if( _.startsWith( fnName, "set " ) ) {
						return ".<static,set>" + fnName.substr( 4 );
					} else {
						return ".<static>" + fnName + "()";
					}

				} else {

					// Format the member differently for getters, setters, and methods..
					if( _.startsWith( fnName, "get " ) ) {
						return ".<get>" + fnName.substr( 4 );
					} else if( _.startsWith( fnName, "set " ) ) {
						return ".<set>" + fnName.substr( 4 );
					} else {
						return "#" + fnName + "()";
					}

				}


			};

			// Append the CallSite object with a new getMemberName() method.
			item.getMemberName = function getMemberName() {

				// Resolve the class name..
				let className = this.getClassName();

				// If class is null, we can exit early..
				if( className === null ) {
					return null;
				}

				// Resolve the member suffix
				let fnSuffix = this.getMemberSuffix();

				// If the suffix name is not a string, we can exit early..
				if( !_.isString( fnSuffix ) ) {
					return null;
				}

				// Concat and return
				return className + fnSuffix;

			};

			// Apply the filter(s)..
			let keep 		= true;
			let fileName 	= item.getFileName();

			// We'll only filter items that have a string file name
			if( _.isString( fileName ) ) {

				// Iterate over each 'ignoreFiles' filter...
				_.each( opts.ignoreFiles, function( regx ) {

					// Test the file name against the filter.
					if( regx.test( fileName ) === true ) {

						// If we match, we drop it..
						keep = false;

						// .. and we can stop looking
						return false;

					}

				} );

			}

			// Keep?
			if( keep === true ) {
				ret.push( item );
			}

		} );

		return ret;

	}

	_getPlainRawStacktrace( opts = null ) {

		// Locals
		let me  = this;
		let st  = me._getRawStacktrace( opts );
		let ret = [];

		// Create a property to CallSite.function map
		let valMap = {
			"type"          : "getTypeName",
			"className"     : "getClassName",
			"memberSuffix"  : "getMemberSuffix",
			"memberName"    : "getMemberName",
			"functionName"  : "getFunctionName",
			"methodName"    : "getMethodName",
			"fileName"      : "getFileName",
			"lineNumber"    : "getLineNumber",
			"columnNumber"  : "getColumnNumber",
			"evalOrigin"    : "getEvalOrigin",
			"isEval"        : "isEval",
			"isNative"      : "isNative",
			"isConstructor" : "isConstructor"
		};

		st.forEach( function( callSite ) {

			let itemFinal = {};

			_.each( valMap, function( functionName, propName ) {

				if( !_.isFunction( callSite[ functionName ] ) ) {
					itemFinal[ propName ] = null;
				} else {

					let res = callSite[ functionName ]();

					if( res === undefined ) {
						itemFinal[ propName ] = null;
					} else {
						itemFinal[ propName ] = res;
					}

				}

			} );

			ret.push( itemFinal );

		} );

		// All done
		return ret;

	}

	getCaller( opts ) {

		// Ensure `opts` is an object
		if( !_.isPlainObject( opts ) ) {
			opts = {};
		}

		// Apply default options
		opts = _.defaults( {}, opts, {
			lookBackIndex : 1,
			sourceObject  : null
		} );

		// Fetch the raw caller info
		let caller = this.plainStacktrace[ opts.lookBackIndex ];

		// If a 'sourceObject' is provided and it is a Core Class Instance,
		// then we may be able to resolve a more specific 'description'
		if( Core.validator.isCoreClassInstance( opts.sourceObject ) ) {

			let asClass = opts.sourceObject.className;

			if( asClass !== caller.className ) {
				caller.description = "`" + caller.memberName + "` (called as `" + asClass + caller.memberSuffix + "`)";
			} else {
				caller.description = "`" + caller.memberName + "`";
			}

			// todo: I think some debugging was going on here that was not finished..
			//if( caller.memberName === null ) {
			//	Core.inspect( caller, "caller" );
			//}

		} else {
			caller.description = "`" + caller.memberName + "`";
		}

		// All done
		return caller;

	}

}

module.exports = Inspector;
