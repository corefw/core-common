/**
 * @file
 * Defines the Core.type.Inspector class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/* eslint complexity: "off", no-fallthrough: "off" */

// Load dependencies using the Core Framework
const { _, TIPE, A, MOMENT } = Core.deps( "_", "tipe", "a", "moment" );

// Constants
const CORE_CLASS_NAME_REGEX = /^[A-Z][a-z0-9]+\.([a-z][A-Za-z0-9]+\.)*[A-Z][a-z0-9]+$/;

/**
 * Inspects variables and derives information about their type.
 *
 * @memberOf Core.type
 * @extends Core.abstract.Component
 */
class Inspector extends Core.cls( "Core.abstract.Component" ) {

	$construct() {

		this._initBuiltInSimpleChecks();

	}


	// <editor-fold desc="--- Logic for describing variables/values --------------------------------------------------">



	/**
	 * Provides a short description of the TYPE of the provided `value`.
	 *
	 * @param {*} value - The variable to describe.
	 * @param {Object} opts - Additional options
	 * @param {boolean} [opts.addIndefiniteArticle=false] - When TRUE, an indefinite article will be added to the front
	 * of the returned description; otherwise, when FALSE (default), the description will not be prefixed with an
	 * indefinite article.
	 * @param {boolean} [opts.noAdditions=false] - When TRUE, the simplified version of the description will always
	 * be returned (nothing will be appended to the end); otherwise, when FALSE (default), this method will attach
	 * some ancillary information for some variable types to provide a little more insight into the contents of the
	 * variable.
	 * @returns {string} A short description of `value`.
	 */
	describe( value, opts ) {

		// Locals
		let me = this;
		let ret;

		// Ensure `opts` is an object.
		if( !this.isPlainObject( opts ) ) {
			opts = {};
		}

		// Apply default options
		opts = _.defaults( {}, opts, {
			addIndefiniteArticle : false,
			noAdditions          : false
		} );

		// First, find the first 'simple check' match for the provided
		// value, as this should be the most informative attribute.
		let firstSimpleCheckMatch = this.getFirstSimpleCheckMatch( value );

		// Get the default/generic description..
		if( opts.addIndefiniteArticle === true ) {
			ret = firstSimpleCheckMatch.checksForA;
		} else {
			ret = firstSimpleCheckMatch.checksFor;
		}

		// We can exit early if 'noAdditions' is TRUE.
		if( opts.noAdditions === true ) {
			return ret;
		}

		// Depending on which check was the first to match our value, we may want to
		// hand-craft the description with more info about the variable's contents..
		switch( firstSimpleCheckMatch.name ) {

			case "isString":

				if( value.length === 0 ) {

					if( opts.addIndefiniteArticle === true ) {
						ret = "an empty " + firstSimpleCheckMatch.checksFor;
					} else {
						ret = "empty " + firstSimpleCheckMatch.checksFor;
					}

				} else if( value.length <= 20 ) {
					ret += ` ("${value}")`;
				} else {
					let sub = value.substr( 0, 10 );
					ret += ` ("${sub}...", length=${value.length})`;
				}
				break;

			case "isBoolean":

				if( value === true ) {
					ret += " (TRUE)";
				} else {
					ret += " (FALSE)";
				}
				break;

			case "isArray":
			case "isArrayLikeObject":
			case "isArguments":

				if( value.length === 0 ) {

					if( opts.addIndefiniteArticle === true ) {
						ret = "an empty " + firstSimpleCheckMatch.checksFor;
					} else {
						ret = "empty " + firstSimpleCheckMatch.checksFor;
					}

				} else {
					ret += " (length=" + value.length + ")";
				}
				break;

			case "isSet":
			case "isMap":

				if( value.size === 0 ) {

					if( opts.addIndefiniteArticle === true ) {
						ret = "an empty " + firstSimpleCheckMatch.checksFor;
					} else {
						ret = "empty " + firstSimpleCheckMatch.checksFor;
					}

				} else {
					ret += " (size=" + value.size + ")";
				}
				break;

			case "isBuffer":
				ret += " (length=" + value.length + ")";
				break;

			case "isArrayBuffer":
				ret += " (byteLength=" + value.byteLength + ")";
				break;

			case "isInteger":
				ret += " (Number; value=" + value + ")";
				break;

			case "isNumber":
				ret += " (value=" + value + ")";
				break;

			case "isAsyncFunction":
			case "isFunction":

				let extraDesc;
				let nameDesc;

				// Build the extra description info (the info in parenthesis)
				// Start with bound..
				if( me.isBoundFunction( value ) ) {
					extraDesc = "bound; ";
				} else {
					extraDesc = "";
				}

				// Next, consider if its an arrow function
				if( me.isArrowFunction( value ) ) {
					extraDesc += "arrow";
					nameDesc = "; as";
				} else {

					// For non-arrow function, consider if its anonymous or named..
					if( me.isAnonymousFunction( value ) ) {
						extraDesc += "anonymous";
						nameDesc = "; as";
					} else {
						//extraDesc += "named";
						nameDesc = "name";
					}

				}

				// Check for a name
				if( value.name !== undefined && value.name !== null	&& value.name !== "" && value.name !== "bound " ) {

					let finalName;
					if( _.startsWith( value.name, "bound " ) ) {
						finalName = value.name.substr( 6 );
					} else {
						finalName = value.name;
					}

					extraDesc += nameDesc + "=" + finalName;
				}

				ret += " (" + extraDesc + ")";

				break;

			case "isDate":
				value = MOMENT( value );
				// fall through \/

			case "isMoment":
				ret += " (\"" + value.format() + "\")";
				break;

			case "isError":

				if ( value.message === undefined || value.message === null || value.message === "" ) {
					ret += " (with an empty message)";
				} else if ( value.message.length < 40 ) {
					ret += " (\"" + value.message + "\")";
				} else {
					ret += " (\"" + value.message.substr( 0, 35 ) + "...\")";
				}

				break;

			case "isSymbol":

				if( Symbol.keyFor( value ) === undefined ) {
					ret = "transient " + value.toString();
				} else {
					ret = "global " + value.toString();
				}

				if( opts.addIndefiniteArticle === true ) {
					ret = "a " + ret;
				}

				break;

			case "isTypedArray":
				ret += " (" + value.constructor.name + "; length=" + value.length + ")";
				break;

			case "isPlainObject":

				let keys = Object.getOwnPropertyNames( value );

				if( keys.length === 0 ) {

					if( opts.addIndefiniteArticle === true ) {
						ret = "an empty " + firstSimpleCheckMatch.checksFor;
					} else {
						ret = "empty " + firstSimpleCheckMatch.checksFor;
					}

				} else if( keys.length < 5 ) {

					ret += " (keys=\"" + keys.join( "\",\"" ) + "\")";

				} else {

					let truncatedKeys = keys.slice( 0, 3 );
					ret += " (keys=\"" + truncatedKeys.join( "\",\"" ) + "\"...; total=" + keys.length + ")";

				}

				break;

			case "isObject":

				if( !me.isNil( value.constructor ) && !me.isNil( value.constructor.name ) ) {
					ret += " (constructor.name=\"" + value.constructor.name + "\")";
				}

				break;

			case "isCoreClass":

				if( !me.isNil( value.prototype ) && !me.isNil( value.prototype.$amClassName ) ) {
					ret += " (\"" + value.prototype.$amClassName + "\")";
				}

				break;

			case "isCoreClassName":
				ret += " (String; \"" + value + "\")";
				break;

			case "isCoreClassInstance":
				ret += " (\"" + value.className + "\")";
				break;

			case "isWeakMap":
			case "isWeakSet":
			case "isNaN":
			case "isRegExp":
			case "isUndefined":
			case "isNull":
				break;

			default:

				// tmp debug
				console.log( "=== NO ADDITIONS FOR: " + firstSimpleCheckMatch.name + " ===" );

				console.log( "" );
				console.log( "Value:" );
				console.log( value );

				console.log( "" );
				console.log( "Own Property Names:" );
				console.log( Object.getOwnPropertyNames( value ) );

				console.log( "==================================" );

				// tmp debug

				// Not all variable types have additions.
				break;

		}

		// All done
		return ret;

	}

	/**
	 *
	 * Important: Simple checks with a describePriority greater than or equal to 900 will not be matched. If the
	 * first match that a value encounters is with a check that has >= 900 describePriority, then this method
	 * will throw an Error.
	 *
	 * @private
	 * @throws Error If no matches could be found (every variable value should match at least one check)
	 * @param {*} value - The value to check
	 * @returns {Object} Information about the first 'simple check' match for the provided value.
	 */
	getFirstSimpleCheckMatch( value ) {

		// Locals
		let me     = this;
		let checks = me._prioritizedSimpleChecks;
		let ret    = null;

		// Iterate until we find a match
		_.each( checks, function( check ) {

			// We won't match on checks with a
			// describePriority of 900 or greater.
			if( check.describePriority >= 900 ) {
				return false;
			}

			if( check.fn.apply( me, [ value ] ) === true ) {

				// Save the matched check
				ret = check;

				// Stop looking for more
				return false;

			}

		} );

		// Every variable should match at least one 'simple check'..
		if( ret === null ) {
			throw new Error( "Core.type.Inspector::getFirstSimpleCheckMatch() failed to identify the provided value! This should never happen and is a bug." );
		}

		// All done..
		return ret;

	}

	/**
	 * Gets an array of 'simple checks', sorted by 'describePriority', which informs 'describe()' operations
	 * which check results are most indicative of a value's type.
	 *
	 * In other words, many variables will pass more than one 'simple check', but not all checks are equally
	 * informative. For example, if a value is an object (passes 'isObject') then it should also be object-like
	 * (passes 'isObjectLike'), but the fact that it is an object is more significant than the fact that it is
	 * object-like.  Thus, 'isObject' is considered to be higher priority than 'isObjectLike' and it will have a lower
	 * value for 'describePriority', making it appear before 'isObjectLike' in the '_prioritizedSimpleChecks' array.
	 *
	 * @private
	 * @type {Object[]}
	 */
	get _prioritizedSimpleChecks() {

		// Locals
		let me = this;

		// Rebuild the cache, if needed..
		if( me.isNil( me._prioritizedSimpleCheckCache ) ) {
			me._resolvePrioritizedSimpleChecks();
		}

		// Return the cache value
		return me._prioritizedSimpleCheckCache;

	}

	/**
	 * Builds the `_prioritizedSimpleCheckCache` variable, which is a cache value for `_prioritizedSimpleChecks`.
	 * See the `_prioritizedSimpleChecks` getter for more information.
	 *
	 * @see `_prioritizedSimpleChecks`
	 * @private
	 * @returns {void}
	 */
	_resolvePrioritizedSimpleChecks() {

		// Locals
		let me     = this;
		let checks = [ ...me.simpleChecks.values() ];

		// Sort the 'simple checks' by:
		// - ASC describePriority
		// - ASC name
		let final  = checks.sort( ( a, b ) => {

			if( a.describePriority > b.describePriority ) {
				return 1;
			} else if ( a.describePriority < b.describePriority ) {
				return -1;
			} else {

				if( a.name > b.name ) {
					return 1;
				} else if ( a.name < b.name ) {
					return -1;
				} else {
					return 0; // Equal
				}


			}

		} );

		// Persist the value to the cache
		me._prioritizedSimpleCheckCache = final;

	}




	// </editor-fold>


	// <editor-fold desc="--- Fundamental Members & Logic for 'simple checks' ----------------------------------------">





	/**
	 * Returns the 'simple check registry', which contains information about all of the 'simple checks'
	 * (functions that check a value and return a boolean to indicate something about its type).
	 *
	 * @access public
	 * @default null
	 * @type {?string}
	 */
	get simpleChecks() {

		if( this._simpleChecks === undefined ) {
			this._simpleChecks = new Map();
		}

		return this._simpleChecks;

	}

	/**
	 * Adds a "simple check" (one that always returns a boolean value) to the  simple check registry.
	 * This method is used to add the built-in simple checks and also allows implementors to add
	 * custom, simple, checks.
	 *
	 * @param {Object} checkOptions - Information about the simple check being added.
	 *
	 * @returns {void}
	 */
	addSimpleCheck( checkOptions ) {

		// Locals
		let me = this;

		// Ensure `checkOptions` is a config object.
		if( !me.isPlainObject( checkOptions ) ) {
			checkOptions = {};
		}

		// Apply default options
		checkOptions = _.defaults( {}, checkOptions, {
			name             : null,
			fn               : null,
			source           : "Custom Simple Check",
			checksFor        : null,
			checksForA       : null,
			desc             : null,
			describePriority : 500
		} );

		// `name` is required..
		if( checkOptions.name === null ) {
			throw new Error( "Invalid `checkOptions` in Core.type.Inspector::addSimpleCheck(). `checkOptions.name` is required and must be a non-empty string." );
		}

		// `fn` is required..
		if( checkOptions.fn === null ) {
			throw new Error( "Invalid `checkOptions` in Core.type.Inspector::addSimpleCheck(). `checkOptions.fn` is required and must be a function that returns a boolean." );
		}

		// `checksFor` is required..
		if( checkOptions.checksFor === null ) {
			throw new Error( "Invalid `checkOptions` in Core.type.Inspector::addSimpleCheck(). `checkOptions.checksFor` is required and must be a non-empty string that describes what the check function identifies." );
		}

		// We can guess at a `desc`, if it was not provided..
		if( checkOptions.desc === null ) {
			checkOptions.desc = "Checks if a value is " + A( checkOptions.checksFor ) + ".";
		}

		// Add a version of `checksFor` that is prefixed with an indefinite article.
		if( me.isNil( checkOptions.checksForA ) ) {
			checkOptions.checksForA = A( checkOptions.checksFor );
		}

		// Add it..
		me.simpleChecks.set( checkOptions.name, checkOptions );

		// Invalidate the "prioritized simple checks" cache object.
		// (see the getter for `_prioritizedSimpleChecks` for more info.
		me._prioritizedSimpleCheckCache = null;

	}

	/**
	 * Adds all of the 'simple check' functions (those that evaluate a value and return a boolean that indicates
	 * something about its type) provided by this class to the 'simple check registry'.
	 *
	 * Note: this method is called automatically by the $construct method.
	 *
	 * @private
	 * @returns {void}
	 */
	_initBuiltInSimpleChecks() {

		// Locals
		let me = this;

		// Add `isArguments`
		this.addSimpleCheck( {
			name             : "isArguments",
			fn               : me.isArguments,
			source           : "LoDash::isArguments()",
			checksFor        : "Arguments Object",
			desc             : "Checks if a value is likely an arguments object.",
			describePriority : 90,
		} );

		// Add `isArray`
		this.addSimpleCheck( {
			name             : "isArray",
			fn               : me.isArray,
			source           : "LoDash::isArray()",
			checksFor        : "Array",
			desc             : "Checks if a value is classified as an Array object.",
			describePriority : 100,
		} );

		// Add `isArrayBuffer`
		this.addSimpleCheck( {
			name             : "isArrayBuffer",
			fn               : me.isArrayBuffer,
			source           : "LoDash::isArrayBuffer()",
			checksFor        : "ArrayBuffer",
			desc             : "Checks if a value is classified as an ArrayBuffer object.",
			describePriority : 104,
		} );

		// Add `isArrayLike`
		this.addSimpleCheck( {
			name             : "isArrayLike",
			fn               : me.isArrayLike,
			source           : "LoDash::isArrayLike()",
			checksFor        : "array-like value",
			describePriority : 900,
			desc             : "Checks if a value is array-like. A value is considered array-like if it's not a function and " +
				"has a value.length that's an integer greater than or equal to 0 and less than or equal to " +
				"Number.MAX_SAFE_INTEGER.",
		} );

		// Add `isArrayLikeObject`
		this.addSimpleCheck( {
			name             : "isArrayLikeObject",
			fn               : me.isArrayLikeObject,
			source           : "LoDash::isArrayLikeObject()",
			checksFor        : "array-like Object",
			describePriority : 110,
			desc             : "Checks if a value is an array-like object. A value is considered to be an array-like object " +
				"if it is an object and has a value.length that's an integer greater than or equal to 0 and less than " +
				"or equal to Number.MAX_SAFE_INTEGER.",
		} );

		// Add `isBoolean`
		this.addSimpleCheck( {
			name             : "isBoolean",
			fn               : me.isBoolean,
			source           : "LoDash::isBoolean()",
			checksFor        : "Boolean",
			desc             : "Checks if a value is classified as a boolean primitive or object.",
			describePriority : 100,
		} );

		// Add `isBuffer`
		this.addSimpleCheck( {
			name             : "isBuffer",
			fn               : me.isBuffer,
			source           : "LoDash::isBuffer()",
			checksFor        : "Buffer",
			desc             : "Checks if a value is a buffer.",
			describePriority : 102,
		} );

		// Add `isDate`
		this.addSimpleCheck( {
			name             : "isDate",
			fn               : me.isDate,
			source           : "LoDash::isDate()",
			checksFor        : "Date Object",
			desc             : "Checks if a value is classified as a date object.",
			describePriority : 102,
		} );

		// Add `isEmpty`
		this.addSimpleCheck( {
			name             : "isEmpty",
			fn               : me.isEmpty,
			source           : "LoDash::isEmpty()",
			checksFor        : "non-empty value",
			describePriority : 900,
			desc             : "Checks if value is an empty object, collection, map, or set.\n\n" +
				"Objects are considered empty if they have no own enumerable string keyed properties.\n\n" +
				"Array-like values such as arguments objects, arrays, buffers, strings, or jQuery-like collections are\n" +
				"considered empty if they have a length of 0. Similarly, maps and sets are considered empty if they have a\n" +
				"size of 0.",
		} );

		// Add `isError`
		this.addSimpleCheck( {
			name             : "isError",
			fn               : me.isError,
			source           : "LoDash::isError()",
			checksFor        : "Error Object",
			desc             : "Checks if a value is an Error, EvalError, RangeError, ReferenceError, SyntaxError, TypeError, or URIError object.",
			describePriority : 102,
		} );

		// Add `isFinite`
		this.addSimpleCheck( {
			name             : "isFinite",
			fn               : me.isFinite,
			source           : "LoDash::isFinite()",
			checksFor        : "finite Number",
			desc             : "Checks if a value is a finite primitive number.",
			describePriority : 900,
		} );

		// Add `isFunction`
		this.addSimpleCheck( {
			name             : "isFunction",
			fn               : me.isFunction,
			source           : "LoDash::isFunction()",
			checksFor        : "Function",
			desc             : "Checks if a value is classified as a Function object.",
			describePriority : 100,
		} );

		// Add `isInteger`
		this.addSimpleCheck( {
			name             : "isInteger",
			fn               : me.isInteger,
			source           : "LoDash::isInteger()",
			checksFor        : "integer",
			desc             : "Checks if a value is an integer.",
			describePriority : 90,
		} );

		// Add `isLength`
		this.addSimpleCheck( {
			name             : "isLength",
			fn               : me.isLength,
			source           : "LoDash::isLength()",
			checksFor        : "array-like length",
			desc             : "Checks if a value is a valid array-like length.",
			describePriority : 900,
		} );

		// Add `isMap`
		this.addSimpleCheck( {
			name             : "isMap",
			fn               : me.isMap,
			source           : "LoDash::isMap()",
			checksFor        : "Map Object",
			desc             : "Checks if a value is classified as a Map object.",
			describePriority : 100,
		} );

		// Add `isNaN`
		this.addSimpleCheck( {
			name             : "isNaN",
			fn               : me.isNaN,
			source           : "LoDash::isNaN()",
			checksFor        : "NaN literal",
			desc             : "Checks if a value is NaN (literally and exactly).",
			describePriority : 89,
		} );

		// Add `isNative`
		this.addSimpleCheck( {
			name             : "isNative",
			fn               : me.isNative,
			source           : "LoDash::isNative()",
			checksFor        : "native Function",
			desc             : "Checks if a value is a pristine native function.",
			describePriority : 900,
		} );

		// Add `isNil`
		this.addSimpleCheck( {
			name             : "isNil",
			fn               : me.isNil,
			source           : "LoDash::isNil()",
			checksFor        : "nil value",
			desc             : "Checks if a value is NULL or UNDEFINED.",
			describePriority : 900,
		} );

		// Add `isNull`
		this.addSimpleCheck( {
			name             : "isNull",
			fn               : me.isNull,
			source           : "LoDash::isNull()",
			checksFor        : "NULL value",
			desc             : "Checks if a value is exactly NULL.",
			describePriority : 95,
		} );

		// Add `isNumber`
		this.addSimpleCheck( {
			name             : "isNumber",
			fn               : me.isNumber,
			source           : "LoDash::isNumber()",
			checksFor        : "Number",
			desc             : "Checks if a value is classified as a Number primitive or object.",
			describePriority : 100,
		} );

		// Add `isObject`
		this.addSimpleCheck( {
			name             : "isObject",
			fn               : me.isObject,
			source           : "LoDash::isObject()",
			checksFor        : "Object",
			describePriority : 210,
			desc             : "Checks if a value is the language type of Object. (e.g. arrays, functions, objects, regexes, " +
				"new Number(0), and new String('')).",
		} );

		// Add `isObjectLike`
		this.addSimpleCheck( {
			name             : "isObjectLike",
			fn               : me.isObjectLike,
			source           : "LoDash::isObjectLike()",
			checksFor        : "object-like value",
			desc             : "Checks if a value is object-like. A value is object-like if it's not null and has a typeof result of \"object\".",
			describePriority : 900,
		} );

		// Add `isPlainObject`
		this.addSimpleCheck( {
			name      : "isPlainObject",
			fn        : me.isPlainObject,
			source    : "LoDash::isPlainObject()",
			checksFor : "Plain Object",
			desc      : "Checks if a value is a plain object, that is, an object created by the Object constructor or " +
				"one with a [[Prototype]] of NULL.",
			describePriority: 200,
		} );

		// Add `isRegExp`
		this.addSimpleCheck( {
			name             : "isRegExp",
			fn               : me.isRegExp,
			source           : "LoDash::isRegExp()",
			checksFor        : "RegExp Object",
			desc             : "Checks if a value is classified as a RegExp object.",
			describePriority : 100,
		} );

		// Add `isSafeInteger`
		this.addSimpleCheck( {
			name             : "isSafeInteger",
			fn               : me.isSafeInteger,
			source           : "LoDash::isSafeInteger()",
			checksFor        : "safe integer",
			describePriority : 900,
			desc             : "Checks if a value is a safe integer. An integer is safe if it's an IEEE-754 double precision " +
				"number which isn't the result of a rounded unsafe integer.",
		} );

		// Add `isSet`
		this.addSimpleCheck( {
			name             : "isSet",
			fn               : me.isSet,
			source           : "LoDash::isSet()",
			checksFor        : "Set Object",
			desc             : "Checks if a value is classified as a Set object.",
			describePriority : 100,
		} );

		// Add `isString`
		this.addSimpleCheck( {
			name             : "isString",
			fn               : me.isString,
			source           : "LoDash::isString()",
			checksFor        : "String",
			desc             : "Checks if a value is classified as a String primitive or object.",
			describePriority : 100,
		} );

		// Add `isSymbol`
		this.addSimpleCheck( {
			name             : "isSymbol",
			fn               : me.isSymbol,
			source           : "LoDash::isSymbol()",
			checksFor        : "Symbol",
			desc             : "Checks if a value is classified as a Symbol primitive or object.",
			describePriority : 102,
		} );

		// Add `isTypedArray`
		this.addSimpleCheck( {
			name             : "isTypedArray",
			fn               : me.isTypedArray,
			source           : "LoDash::isTypedArray()",
			checksFor        : "TypedArray",
			desc             : "Checks if a value is classified as a typed array.",
			describePriority : 104,
		} );

		// Add `isUndefined`
		this.addSimpleCheck( {
			name             : "isUndefined",
			fn               : me.isUndefined,
			source           : "LoDash::isUndefined()",
			checksFor        : "UNDEFINED value",
			desc             : "Checks if a value is undefined.",
			describePriority : 95,
		} );

		// Add `isWeakMap`
		this.addSimpleCheck( {
			name             : "isWeakMap",
			fn               : me.isWeakMap,
			source           : "LoDash::isWeakMap()",
			checksFor        : "WeakMap Object",
			desc             : "Checks if a value is classified as a WeakMap object.",
			describePriority : 104,
		} );

		// Add `isWeakSet`
		this.addSimpleCheck( {
			name             : "isWeakSet",
			fn               : me.isWeakSet,
			source           : "LoDash::isWeakSet()",
			checksFor        : "WeakSet Object",
			desc             : "Checks if a value is classified as a WeakSet object.",
			describePriority : 104,
		} );


		// --- Additional Function Checks ---


		// Add `isArrowFunction`
		this.addSimpleCheck( {
			name             : "isArrowFunction",
			fn               : me.isArrowFunction,
			source           : "Core Framework",
			checksFor        : "Arrow Function",
			desc             : "Checks if a value is an arrow function.",
			describePriority : 900,
		} );

		// Add `isNonArrowFunction`
		this.addSimpleCheck( {
			name             : "isNonArrowFunction",
			fn               : me.isNonArrowFunction,
			source           : "Core Framework",
			checksFor        : "non-Arrow Function",
			desc             : "Checks if a value is a non-arrow function.",
			describePriority : 900,
		} );

		// Add `isAnonymousFunction`
		this.addSimpleCheck( {
			name             : "isAnonymousFunction",
			fn               : me.isAnonymousFunction,
			source           : "Core Framework",
			checksFor        : "anonymous Function",
			desc             : "Checks if a value is an anonymous function.",
			describePriority : 900,
		} );

		// Add `isNamedFunction`
		this.addSimpleCheck( {
			name             : "isNamedFunction",
			fn               : me.isNamedFunction,
			source           : "Core Framework",
			checksFor        : "named Function",
			desc             : "Checks if a value is a named function.",
			describePriority : 900,
		} );

		// Add `isBoundFunction`
		this.addSimpleCheck( {
			name             : "isBoundFunction",
			fn               : me.isBoundFunction,
			source           : "Core Framework",
			checksFor        : "bound Function",
			desc             : "Checks if a value is function that has been bound.",
			describePriority : 900,
		} );

		// Add `isUnboundFunction`
		this.addSimpleCheck( {
			name             : "isUnboundFunction",
			fn               : me.isUnboundFunction,
			source           : "Core Framework",
			checksFor        : "unbound Function",
			desc             : "Checks if a value is function that has not been bound.",
			describePriority : 900,
		} );

		// Add `isAsyncFunction`
		this.addSimpleCheck( {
			name             : "isAsyncFunction",
			fn               : me.isAsyncFunction,
			source           : "Core Framework",
			checksFor        : "Async Function",
			desc             : "Checks if a value is a function declared with the 'async' keyword.",
			describePriority : 97,
		} );

		// Add `isNonAsyncFunction`
		this.addSimpleCheck( {
			name             : "isNonAsyncFunction",
			fn               : me.isNonAsyncFunction,
			source           : "Core Framework",
			checksFor        : "non-Async Function",
			desc             : "Checks if a value is a function that was NOT declared with the 'async' keyword.",
			describePriority : 900,
		} );


		// --- Moment.js Checks ---

		// Add `isMoment`
		this.addSimpleCheck( {
			name             : "isMoment",
			fn               : me.isMoment,
			source           : "Moment.js",
			checksFor        : "Moment Object",
			desc             : "Checks if a value is a Moment.js Object.",
			describePriority : 100,
		} );


		// --- Special Framework Checks ---

		this.addSimpleCheck( {
			name             : "isCoreClass",
			fn               : me.isCoreClass,
			source           : "Core Framework",
			checksFor        : "Core Class Definition",
			desc             : "Checks if a value is a Core Framework class definition/constructor.",
			describePriority : 10,
		} );

		this.addSimpleCheck( {
			name             : "isCoreClassName",
			fn               : me.isCoreClassName,
			source           : "Core Framework",
			checksFor        : "Core Class Name",
			desc             : "Checks if a value is a valid, namespaced, Core Framework class name.",
			describePriority : 9,
		} );

		this.addSimpleCheck( {
			name             : "isCoreClassLike",
			fn               : me.isCoreClassLike,
			source           : "Core Framework",
			checksFor        : "Core Class-like value",
			desc             : "Checks if a value is either a Core Framework class definition/constructor OR a valid, namespaced, Core Framework class name.",
			describePriority : 900,
		} );

		this.addSimpleCheck( {
			name             : "isCoreClassInstance",
			fn               : me.isCoreClassInstance,
			source           : "Core Framework",
			checksFor        : "Core Class Instance",
			desc             : "Checks if a value is an instantiated Core Framework class.",
			describePriority : 10,
		} );

	}




	// </editor-fold>

	// <editor-fold desc="--- 'Simple Checks' copied from Lodash -----------------------------------------------------">




	/**
	 * Checks if `value` is likely an arguments object.
	 *
	 * Note: This method is a thin wrapper for the `Lodash` function of the same name.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is an arguments object; otherwise it returns FALSE.
	 */
	isArguments( value ) {
		return _.isArguments( value );
	}

	/**
	 * Checks if `value` is classified as an Array object.
	 *
	 * Note: This method is a thin wrapper for the `Lodash` function of the same name.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is an array; otherwise it returns FALSE.
	 */
	isArray( value ) {
		return _.isArray( value );
	}

	/**
	 * Checks if `value` is classified as an ArrayBuffer object.
	 *
	 * Note: This method is a thin wrapper for the `Lodash` function of the same name.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is an array buffer; otherwise it returns FALSE.
	 */
	isArrayBuffer( value ) {
		return _.isArrayBuffer( value );
	}

	/**
	 * Checks if `value` is array-like. A value is considered array-like if it's not a function and has a `value.length`
	 * that's an integer greater than or equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	 *
	 * Note: This method is a thin wrapper for the `Lodash` function of the same name.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is array-like; otherwise it returns FALSE.
	 */
	isArrayLike( value ) {
		return _.isArrayLike( value );
	}

	/**
	 * This method is like `isArrayLike` except that it also checks if value is an object.
	 *
	 * Note: This method is a thin wrapper for the `Lodash` function of the same name.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is an array-like object; otherwise it returns FALSE.
	 */
	isArrayLikeObject( value ) {
		return _.isArrayLikeObject( value );
	}

	/**
	 * Checks if `value` is classified as a boolean primitive or object.
	 *
	 * Note: This method is a thin wrapper for the `Lodash` function of the same name.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a boolean; otherwise it returns FALSE.
	 */
	isBoolean( value ) {
		return _.isBoolean( value );
	}

	/**
	 * Checks if `value` is a buffer.
	 *
	 * Note: This method is a thin wrapper for the `Lodash` function of the same name.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a buffer; otherwise it returns FALSE.
	 */
	isBuffer( value ) {
		return _.isBuffer( value );
	}

	/**
	 * Checks if `value` is classified as a Date object.
	 *
	 * Note: This method is a thin wrapper for the `Lodash` function of the same name.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a date; otherwise it returns FALSE.
	 */
	isDate( value ) {
		return _.isDate( value );
	}

	/**
	 * Checks if value is an empty object, collection, map, or set.
	 *
	 * Objects are considered empty if they have no own enumerable string keyed properties.
	 *
	 * Array-like values such as arguments objects, arrays, buffers, strings, or jQuery-like collections are
	 * considered empty if they have a length of 0. Similarly, maps and sets are considered empty if they have a
	 * size of 0.
	 *
	 * Note: This method is a thin wrapper for the `Lodash` function of the same name.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is empty; otherwise it returns FALSE.
	 */
	isEmpty( value ) {
		return _.isEmpty( value );
	}

	/**
	 * Checks if `value` is an Error, EvalError, RangeError, ReferenceError, SyntaxError, TypeError, or URIError object.
	 *
	 * Note: This method is a thin wrapper for the `Lodash` function of the same name.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is an error object; otherwise it returns FALSE.
	 */
	isError( value ) {
		return _.isError( value );
	}

	/**
	 * Checks if `value` is a finite primitive number.
	 *
	 * Note: This method is a thin wrapper for the `Lodash` function of the same name.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a finite number; otherwise it returns FALSE.
	 */
	isFinite( value ) {
		return _.isFinite( value );
	}

	/**
	 * Checks if `value` is classified as a Function object.
	 *
	 * Note: This method is a thin wrapper for the `Lodash` function of the same name.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a function; otherwise it returns FALSE.
	 */
	isFunction( value ) {
		return _.isFunction( value );
	}

	/**
	 * Checks if `value` is an integer.
	 *
	 * Note: This method is a thin wrapper for the `Lodash` function of the same name.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is an integer; otherwise it returns FALSE.
	 */
	isInteger( value ) {
		return _.isInteger( value );
	}

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * Note: This method is a thin wrapper for the `Lodash` function of the same name.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a valid length; otherwise it returns FALSE.
	 */
	isLength( value ) {
		return _.isLength( value );
	}

	/**
	 * Checks if `value` is classified as a Map object.
	 *
	 * Note: This method is a thin wrapper for the `Lodash` function of the same name.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a map; otherwise it returns FALSE.
	 */
	isMap( value ) {
		return _.isMap( value );
	}

	/**
	 * Checks if `value` is NaN.
	 *
	 * Note: This method is a thin wrapper for the `Lodash` function of the same name.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is NaN; otherwise it returns FALSE.
	 */
	isNaN( value ) {
		return _.isNaN( value );
	}

	/**
	 * Checks if `value` is a pristine native function.
	 *
	 * Note: This method is a thin wrapper for the `Lodash` function of the same name.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a native function; otherwise it returns FALSE.
	 */
	isNative( value ) {
		return _.isNative( value );
	}

	/**
	 * Checks if `value` is NULL or UNDEFINED.
	 *
	 * Note: This method is a thin wrapper for the `Lodash` function of the same name.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is nullish; otherwise it returns FALSE.
	 */
	isNil( value ) {
		return _.isNil( value );
	}

	/**
	 * Checks if `value` is NULL.
	 *
	 * Note: This method is a thin wrapper for the `Lodash` function of the same name.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is NULL; otherwise it returns FALSE.
	 */
	isNull( value ) {
		return _.isNull( value );
	}

	/**
	 * Checks if `value` is classified as a Number primitive or object.
	 *
	 * Note: This method is a thin wrapper for the `Lodash` function of the same name.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a number; otherwise it returns FALSE.
	 */
	isNumber( value ) {
		return _.isNumber( value );
	}

	/**
	 * Checks if `value` is the language type of Object. (e.g. arrays, functions, objects, regexes, new Number(0),
	 * and new String(''))
	 *
	 * Note: This method is a thin wrapper for the `Lodash` function of the same name.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is an object; otherwise it returns FALSE.
	 */
	isObject( value ) {
		return _.isObject( value );
	}

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not null and has a typeof result of "object".
	 *
	 * Note: This method is a thin wrapper for the `Lodash` function of the same name.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` if object-like; otherwise it returns FALSE.
	 */
	isObjectLike( value ) {
		return _.isObjectLike( value );
	}

	/**
	 * Checks if `value` is a plain object, that is, an object created by the Object constructor or one with a
	 * `[[Prototype]]` of NULL.
	 *
	 * Note: This method is a thin wrapper for the `Lodash` function of the same name.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a plain object; otherwise it returns FALSE.
	 */
	isPlainObject( value ) {
		return _.isPlainObject( value );
	}

	/**
	 * Checks if `value` is classified as a RegExp object.
	 *
	 * Note: This method is a thin wrapper for the `Lodash` function of the same name.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a regexp; otherwise it returns FALSE.
	 */
	isRegExp( value ) {
		return _.isRegExp( value );
	}

	/**
	 * Checks if `value` is a safe integer. An integer is safe if it's an IEEE-754 double precision number which isn't
	 * the result of a rounded unsafe integer.
	 *
	 * Note: This method is a thin wrapper for the `Lodash` function of the same name.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a safe integer; otherwise it returns FALSE.
	 */
	isSafeInteger( value ) {
		return _.isSafeInteger( value );
	}

	/**
	 * Checks if `value` is classified as a Set object.
	 *
	 * Note: This method is a thin wrapper for the `Lodash` function of the same name.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a set; otherwise it returns FALSE.
	 */
	isSet( value ) {
		return _.isSet( value );
	}

	/**
	 * Checks if `value` is classified as a String primitive or object.
	 *
	 * Note: This method is a thin wrapper for the `Lodash` function of the same name.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a string; otherwise it returns FALSE.
	 */
	isString( value ) {
		return _.isString( value );
	}

	/**
	 * Checks if `value` is classified as a Symbol primitive or object.
	 *
	 * Note: This method is a thin wrapper for the `Lodash` function of the same name.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a symbol; otherwise it returns FALSE.
	 */
	isSymbol( value ) {
		return _.isSymbol( value );
	}

	/**
	 * Checks if `value` is classified as a typed array.
	 *
	 * Note: This method is a thin wrapper for the `Lodash` function of the same name.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a typed array; otherwise it returns FALSE.
	 */
	isTypedArray( value ) {
		return _.isTypedArray( value );
	}

	/**
	 * Checks if `value` is undefined.
	 *
	 * Note: This method is a thin wrapper for the `Lodash` function of the same name.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is undefined; otherwise it returns FALSE.
	 */
	isUndefined( value ) {
		return _.isUndefined( value );
	}

	/**
	 * Checks if `value` is classified as a WeakMap object.
	 *
	 * Note: This method is a thin wrapper for the `Lodash` function of the same name.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a weak map; otherwise it returns FALSE.
	 */
	isWeakMap( value ) {
		return _.isWeakMap( value );
	}

	/**
	 * Checks if `value` is classified as a WeakSet object.
	 *
	 * Note: This method is a thin wrapper for the `Lodash` function of the same name.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a weak set; otherwise it returns FALSE.
	 */
	isWeakSet( value ) {
		return _.isWeakSet( value );
	}





	// </editor-fold>

	// <editor-fold desc="--- More 'Simple Checks' for Functions -----------------------------------------------------">




	/**
	 * Checks if `value` is an arrow function.
	 *
	 * Important Notes:
	 *
	 *    - This method depends on interpreting the contents of the function (using `Function.prototype.toString()`)
	 * 		to determine if the function is an arrow function. Because the `toString()` return is mutated by certain
	 * 		native operations (such as `Function.prototype.bind()`), those operations will render this method
	 * 		ineffective and unable to determine whether or not a function is an arrow function. In such cases, where
	 * 		functions have been converted to "native functions", this method will always return FALSE, regardless of
	 * 		whether or not the function was originally declared using the arrow syntax.
	 *
	 *    - This function is meant to be used for reflective purposes. Implementing it as a way to fork logic based on
	 *    	whether or not a function is an arrow function is almost certainly a very-bad-idea.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is an arrow function; otherwise it returns FALSE.
	 */
	isArrowFunction( value ) {

		// First, check to see that it's a function
		if( !this.isFunction( value ) ) {
			return false;
		}

		// If the function has been converted to a native function (mutated),
		// then we cannot determine if it was originally an arrow function,
		// and we'll always return FALSE.
		if( this.isNative( value ) ) {
			return false;
		}

		// Now let's see if it's an arrow function
		let fc = value.toString();

		// Remove all the whitespace
		fc = fc.replace( /[\s\r\n]+/g, "" );

		// Define a regular expression that SHOULD be able to detect all
		// variations of arrow functions..
		let rgx = /^(async)*(\(\)|[\$_a-zA-Z]+\w*|\([\$_a-zA-Z]+\w*(,[\$_a-zA-Z]+\w*)*\))=>/;

		// Test the function against the RegEx
		if( rgx.test( fc ) === true ) {
			return true;
		} else {
			return false;
		}

	}

	/**
	 * Checks if `value` is a function, but not an arrow function.
	 *
	 * Important Notes:
	 *
	 *    - This method depends on interpreting the contents of the function (using `Function.prototype.toString()`)
	 * 		to determine if the function is an arrow function. Because the `toString()` return is mutated by certain
	 * 		native operations (such as `Function.prototype.bind()`), those operations will render this method
	 * 		ineffective and unable to determine whether or not a function is an arrow function. In such cases, where
	 * 		functions have been converted to "native functions", this method will always return TRUE, regardless of
	 * 		whether or not the function was originally declared using the arrow syntax.
	 *
	 *    - This function is meant to be used for reflective purposes. Implementing it as a way to fork logic based on
	 *    	whether or not a function is an arrow function is almost certainly a very-bad-idea.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is non-arrow function; otherwise it returns FALSE.
	 */
	isNonArrowFunction( value ) {

		// First, check to see that it's a function
		if( !this.isFunction( value ) ) {
			return false;
		}

		// From here we can defer to the isArrowFunction() method
		return !this.isArrowFunction( value );

	}

	/**
	 * Checks if `value` is a function that was declared with the `async` keyword.
	 *
	 * Important Notes:
	 *
	 *    - Although this method can detect whether or not a function was declared using the `async` keyword, any
	 *      function that returns a promise could be considered to be 'async'. Given that this method does not
	 *      introspect the return values of the target function, it cannot truly tell if a given function is async.
	 *
	 *    - This method is meant to be used for reflective purposes. Implementing it as a way to fork logic based on
	 *      whether or not a function is an async function is almost certainly a very-bad-idea.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is an async function; otherwise it returns FALSE.
	 */
	isAsyncFunction( value ) {

		// First, check to see that it's a function
		if( !this.isFunction( value ) ) {
			return false;
		}

		// Async functions will always have a constructor.name of 'AsyncFunction'
		if( value.constructor !== null && value.constructor !== undefined &&
			value.constructor.name !== null && value.constructor.name !== undefined &&
			value.constructor.name === "AsyncFunction"
		) {
			return true;
		} else {
			return false;
		}

	}

	/**
	 * Checks if `value` is a function that was NOT declared using the `async` keyword.
	 *
	 * Important Notes:
	 *
	 *    - Although this method can detect whether or not a function was declared using the `async` keyword, any
	 *      function that returns a promise could be considered to be 'async'. Given that this method does not
	 *      introspect the return values of the target function, it cannot truly tell if a given function is async.
	 *
	 *    - This method is meant to be used for reflective purposes. Implementing it as a way to fork logic based on
	 *      whether or not a function is an async function is almost certainly a very-bad-idea.
	 *
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a non-async function; otherwise it returns FALSE.
	 */
	isNonAsyncFunction( value ) {

		// First, check to see that it's a function
		if( !this.isFunction( value ) ) {
			return false;
		}

		// From here we can defer to the isAsyncFunction() method
		return !this.isAsyncFunction( value );

	}

	/**
	 * Checks if `value` is an anonymous function.
	 *
	 * Important Notes:
	 *
	 *    - This method depends on interpreting the contents of the function (using `Function.prototype.toString()`)
	 * 		to determine if the function is an arrow function. Because the `toString()` return is mutated by certain
	 * 		native operations (such as `Function.prototype.bind()`), those operations will render this method
	 * 		ineffective and unable to determine whether or not a function is anonymous. In such cases, where
	 * 		functions have been converted to "native functions", this method will return TRUE if the function has
	 * 	    an empty `.name`. Otherwise, it will return FALSE (even though the function might, technically, be
	 * 	    an anonymous function).
	 *
	 *    - This function is meant to be used for reflective purposes. Implementing it as a way to fork logic based on
	 *    	whether or not a function is an arrow function is almost certainly a very-bad-idea.
	 *
	 *
	 * Important Note: This function is meant to be used for reflective purposes. Implementing it as a way to fork
	 * logic based on whether or not a function is anonymous is almost certainly a very-bad-idea.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is an anonymous function; otherwise it returns FALSE.
	 */
	isAnonymousFunction( value ) {

		// First, check to see that it's a function
		if( !this.isFunction( value ) ) {
			return false;
		}

		// All arrow functions are anonymous
		if( this.isArrowFunction( value ) ) {
			return true;
		}

		// If .name is empty, we know its anonymous
		if( value.name === "" || value.name === "bound " ) {
			return true;
		}

		// If this function is a native function, we'll
		// [reluctantly] assume that it is a named function
		// and NOT anonymous.
		if( this.isNative( value ) ) {
			return false;
		}

		// If we made it this far, we need to look at the code..
		let fs = value.toString();
		fs = fs.replace( /[\r\s\n]+/g, "" );

		// Anonymous functions will start with "function()"
		// (with no name after the function keyword)
		if( _.startsWith( fs, "function(" ) || _.startsWith( fs, "asyncfunction(" ) ) {
			return true;
		} else {
			return false;
		}

	}

	/**
	 * Checks if `value` is named function.
	 *
	 * Important Note: This function is meant to be used for reflective purposes. Implementing it as a way to fork
	 * logic based on whether or not a function is named is almost certainly a very-bad-idea.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a named function; otherwise it returns FALSE.
	 */
	isNamedFunction( value ) {

		// First, check to see that it's a function
		if( !this.isFunction( value ) ) {
			return false;
		}

		// From here we can defer to the isAnonymousFunction() method
		return !this.isAnonymousFunction( value );

	}

	/**
	 * Checks if `value` is function that been `bound()` to a scope.
	 *
	 * Important Note: This function is meant to be used for reflective purposes. Implementing it as a way to fork
	 * logic based on whether or not a function has been bound is almost certainly a very-bad-idea.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a bound function; otherwise it returns FALSE.
	 */
	isBoundFunction( value ) {

		// First, check to see that it's a function
		if( !this.isFunction( value ) ) {
			return false;
		}

		// Bound functions will have a mutated .name
		if( _.startsWith( value.name, "bound" ) ) {
			return true;
		} else {
			return false;
		}

	}

	/**
	 * Checks if `value` is a function that has not been `bound()` to a scope.
	 *
	 * Important Note: This function is meant to be used for reflective purposes. Implementing it as a way to fork
	 * logic based on whether or not a function has been bound is almost certainly a very-bad-idea.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is an unbound function; otherwise it returns FALSE.
	 */
	isUnboundFunction( value ) {

		// First, check to see that it's a function
		if( !this.isFunction( value ) ) {
			return false;
		}

		// From here we can defer to the isBoundFunction() method
		return !this.isBoundFunction( value );


	}





	// </editor-fold>

	// <editor-fold desc="--- More 'Simple Checks' for Moment.js -----------------------------------------------------">




	/**
	 * Checks if `value` is a Moment.js object.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a Moment.js object; otherwise it returns FALSE.
	 */
	isMoment( value ) {
		return MOMENT.isMoment( value );
	}




	// </editor-fold>

	// <editor-fold desc="--- 'Simple Checks' for Framework entities -------------------------------------------------">



	/**
	 * Checks if `value` is a Core Framework class constructor/definition.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a Core Framework class constructor/definition; otherwise it returns FALSE.
	 */
	isCoreClass( value ) {

		// Classes will ALWAYS be a function.
		if( !this.isFunction( value ) ) {
			return false;
		}

		// Core Classes will ALWAYS have a
		// static property named '$isCoreClass'
		// that resolves to TRUE.
		if( value.$isCoreClass !== true ) {
			return false;
		}

		// Ok, its a Core Class..
		return true;

	}

	/**
	 * Checks if `value` is a string and represents a Core Framework class name that includes
	 * a full namespace path.
	 *
	 * Rules:
	 * - Class names must have at least one dot ('.')
	 * - The top-most namespace must start with a capital letter ("Core" not "core")
	 * - The last node must start with a capital letter ("SomeClass" not "someClass")
	 * - Nodes in the middle can include capital letters but must START with a lower-case letter ("someThing" not "SomeThing")
	 *
	 * @example
	 * isCoreClassName( "Core.Something"            ); // true
	 * isCoreClassName( "Core.ns.Something"         ); // true
	 * isCoreClassName( "Core.something"            ); // false - last node starts with a lower-case letter.
	 * isCoreClassName( "Core"                      ); // false - the path must contain at least 1 dot.
	 * isCoreClassName( "Core.Something.Something"  ); // false - middle nodes cannot start with a capital letter
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a Core Framework class constructor/definition; otherwise it returns FALSE.
	 */
	isCoreClassName( value ) {

		// Class names will ALWAYS be a string.
		if( !this.isString( value ) ) {
			return false;
		}

		// Use RegEx for the rest..
		return CORE_CLASS_NAME_REGEX.test( value );

	}

	/**
	 * Checks if `value` is either a Core Framework class definition/constructor OR a string that represents a Core
	 * Framework class name which includes a full namespace path.
	 *
	 * @see isCoreClass
	 * @see isCoreClassName
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a Core Framework class constructor/definition or a valid Core
	 * Framework class path; otherwise it returns FALSE.
	 */
	isCoreClassLike( value ) {

		if( this.isCoreClass( value ) || this.isCoreClassName( value ) ) {
			return true;
		} else {
			return false;
		}

	}

	/**
	 * Checks if `value` is an instantiated Core Framework class.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a Core Framework class instance; otherwise it returns FALSE.
	 */
	isCoreClassInstance( value ) {

		// Core Class instances will ALWAYS be objects.
		if( !this.isObject( value ) ) {
			return false;
		}

		// .. and they'll ALWAYS have a `constructor`
		if( value.constructor === undefined || value.constructor === null ) {
			return false;
		}

		// .. and that constructor will resolve as a "Core Class Definition"
		return this.isCoreClass( value.constructor );

	}

	// </editor-fold>



}

module.exports = Inspector;
