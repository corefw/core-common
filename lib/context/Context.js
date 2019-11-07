/**
 * @file
 * Defines the Core.context.Context class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

// Load dependencies using the Core Framework
const { _, TIPE, DOT } = Core.deps( "_", "tipe", "dot" );

/**
 * Stores variables within a certain context (need better desc)
 *
 * @memberOf Core.context
 * @extends Core.abstract.Component
 */
class Context extends Core.cls( "Core.abstract.Component" ) {

	$construct( templateParser ) {

		// Require the `templateParser` class dep
		this._templateParser = this.$require( "templateParser", {
			instanceOf: "Core.template.Parser"
		} );

		// Initialize the store
		this._initStore();

	}

	/**
	 * Initializes the store object, which houses the variable values for this context.
	 *
	 * @private
	 * @returns {void}
	 */
	_initStore() {
		this.clearStore();
	}

	/**
	 * Clears the internal store, which stores variable values.
	 *
	 * @public
	 * @returns {void}
	 */
	clearStore() {
		this._store = {};
	}

	/**
	 * A template parser object.
	 *
	 * @access public
	 * @default null
	 * @type {Core.template.Parser}
	 */
	get templateParser() {
		return this._templateParser;
	}

	/**
	 * The internal variable/value store.
	 *
	 * @access public
	 * @default null
	 * @type {Object}
	 */
	get store() {
		return this._store;
	}

	/**
	 * Adds or updates a single value in the internal variable value store.
	 *
	 * @public
	 * @param {string} name - The name of the value to set.
	 * @param {*} value - The new value to set.
	 * @param {Object} [opts] - Additional options used during the set operation.
	 * @param {string} [opts.prefix=""] - When provided, the `name` value will be prepended with this `prefix`.
	 * @returns {void}
	 */
	setValue( name, value, opts ) {

		// Locals
		let me       = this;
		let store    = me.store;
		let keyCache = me._keyCache;

		// Apply default config
		opts = _.defaults( {}, opts, {
			prefix: ""
		} );

		// Validate the value
		me._validateValue( value );

		// Prepend prefix
		name = opts.prefix + name;

		// Store the value
		DOT.str( name, value, store );

	}

	/**
	 * Ensures that the provided value is allowed in the internal store.
	 *
	 * Important: If an array or a plain object is passed in, each of element or enumerable property (respectively)
	 * will be validated. If you are receiving errors from this method, but the value being passed in is seemingly
	 * valid, then the validation may be failing on a child value (and currently, this method does not provide
	 * any indication of where validation is failing in nested validations).
	 *
	 * @private
	 * @throws Error if the provided value is invalid.
	 * @param {*} value - The value to validate.
	 * @returns {void}
	 */
	_validateValue( value ) {

		// Locals
		let me = this;

		// Type-specific logic
		switch( TIPE( value ) ) {

			case "boolean":
			case "string":
			case "number":
				break;

			case "object":

				// We only allow plain objects (key/value-ish objects)
				if( !_.isPlainObject( value ) ) {
					throw new Error( "Invalid store value identified in Core.context.Context::_validateValue(). Only 'plain' objects can be stored within the context." );
				}

				// Validate all of the objects enumerable properties.
				_.each( value, function( childValue ) {
					me._validateValue( childValue );
				} );
				break;


			case "array":

				// Validate each element
				_.each( value, function( elementValue ) {
					me._validateValue( elementValue );
				} );
				break;

			default:
				throw new Error( "Invalid store value identified in Core.context.Context::_validateValue(). Values of type '" + TIPE( value ) + "' are not allowed in the context store." );

		}

	}

	/**
	 * Adds or updates one or more values in the internal variable value store.
	 *
	 * @public
	 * @param {Object} values - A key/value object of values to set with each 'key' being the name of a context variable.
	 * @param {Object} [opts] - Additional options used during the set operation.
	 * @param {string} [opts.prefix=""] - When provided, the `name` of each variable will be prepended with this `prefix`.
	 * @returns {void}
	 */
	setValues( values, opts ) {

		// Locals
		let me = this;

		// Iterate over each value
		_.each( values, function( value, name ) {
			me.setValue( name, value, opts );
		} );

	}

	/**
	 * Returns a value from the internal value store. If `name` represents a path within the store, from
	 * which multiple values branch, then the whole branch will be returned.
	 *
	 * @public
	 * @param {string} name - The name of the value to fetch from the store.
	 * @returns {*} The value found within the store.
	 */
	getValue( name ) {

		// Locals
		let me       = this;
		let store    = me.store;

		// Use the dot-object module to extract the
		// value from the internal value store.
		return DOT.pick( name, store, false );

	}

	/**
	 * Returns a subset of the internal store at `path`.
	 *
	 * Note: This function is similar to `getValue()` except that it enforces that the return value
	 * be an actual path (object) within the store and NOT a final value endpoint.
	 *
	 * @public
	 * @throws Error if the provided `path` indicates a value, rather than a collection of values.
	 * @param {string} path - The path to use to filter the store.
	 * @returns {Object} A subset of the internal store.
	 */
	getValuePath( path ) {

		// Locals
		let me 		= this;

		// Fetch the tree indicated by `path`
		let ret = me.getValue( path );

		// If getValue returns undefined, then we can assume that
		// the provided path does not contain any values.
		if( ret === undefined ) {
			return {};
		}

		// If priorityValues is not an object,
		// then we have a problem.
		if( !_.isPlainObject( ret ) ) {
			throw new Error( "Invalid 'path' provided to Core.context.Context::getValuePath(). The provided path ('" + path + "') did not resolve to a plain object and likely refers to a value instead of a value path." );
		}

		// All done
		return ret;

	}

	/**
	 * Injects context values into a provided `target`.
	 *
	 * Note: This method defers most (but not all) of the template work to the template parser (`this.templateParser`).
	 * In addition to parsing values for variables, this method adds the `use` logic that allows variables to be
	 * localized before parsing (see `this._use()` for more info).
	 *
	 * @public
	 * @param {*} target - The variable to inject context values into.
	 * @param {Object} [opts] - Additional resolution options.
	 * @param {string} [opts.use] - When provided, the values found at the store variable path specified will be
	 * localized and prioritized in resolution (see `this._use()` for more info).
	 * @returns {*} The target, with values injected. If `target` is an object, a new object will be returned and
	 * the original `target` object will not be modified.
	 */
	resolve( target, opts ) {

		// Locals
		let me = this;
		let values;

		// Apply default options
		opts = _.defaults( {}, opts, {
			use: null
		} );

		// Gather the values that will be passed to the parser
		if( opts.use !== null ) {
			values = me._use( opts.use );
		} else {
			values = me.store;
		}

		// Defer to the template parser
		return this._templateParser.resolve( target, values );

	}

	/**
	 * Returns a modified version of the internal store whereby values found at the
	 * provided `path` are localized to the root of the store and are given resolution
	 * priority over the rest of the values.
	 *
	 * @private
	 * @param {string} path - The path to localize and prioritize.
	 * @returns {Object} A modified version of the context store.
	 */
	_use( path ) {

		// Locals
		let me 		= this;
		let store 	= me.store;

		// Fetch the tree indicated by `path`
		let priorityValues = me.getValuePath( path );

		// Create a new value set, with the `priorityValues`
		// given priority and localized.
		return _.merge( {}, store, priorityValues );

	}


	fork() {
		// todo:
	}

}

module.exports = Context;
