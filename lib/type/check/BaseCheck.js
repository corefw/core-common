/**
 * @file
 * Defines the Core.type.check.BaseCheck class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

// Load dependencies using the Core Framework
const { _, A } = Core.deps( "_", "a" );

/**
 * A base class for type-checker classes.
 *
 * @abstract
 * @memberOf Core.type.check
 * @extends Core.abstract.Component
 */
class BaseCheck extends Core.cls( "Core.abstract.Component" ) {


	/**
	 * Indicates whether or not a check class can be used to "describe" a target variable.
	 *
	 * @static
	 * @access public
	 * @type {boolean}
	 */
	static get isDescriptive() {

		// This stub provides the default value of FALSE; children that CAN be used to describe
		// variables should override this property to return TRUE.

		return false;

	}

	/**
	 * Indicates the relative priority that should be given to this check class in comparison to other,
	 * descriptive `(isDescriptive=true)` check classes, when a `describe()` operation is attempting to
	 * resolve the description of a variable by checking it against a collection of check classes.
	 *
	 * The lower the number, the higher the priority.
	 *
	 * Note: If `this.isDescriptive` is FALSE, then this variable has no effect.
	 *
	 * @static
	 * @access public
	 * @type {number}
	 */
	static get describePriority() {
		return 500;
	}

	/**
	 * Describes, in human-readable format, how a check class evaluates a target. This description will be
	 * displayed in certain introspective operations, such as some of those that produce error messages.
	 *
	 * @static
	 * @access public
	 * @type {string}
	 */
	static get description() {

		// We can guess at a description, if it was not provided by the child class..
		return "Checks if a value is " + this.checksForA + ".";

	}

	/**
	 * Describes the type of variable that should PASS evaluation. This string is used to generate strings
	 * (especially error messages) in response to check failures.
	 *
	 * For example, a good `checksFor` value for a check that determines if a variable is an arguments object would be
	 * "Arguments Object". Then, the "expects" portion of a validation error for a variable that fails the check might
	 * be: "expected an Arguments Object, but received a ____".
	 *
	 * @static
	 * @access public
	 * @type {string}
	 */
	static get checksFor() {

		// ALL check classes must override this getter!
		throw new Error( "Check classes MUST provide a value for 'checksFor'." );

	}

	/**
	 * The `checksFor` value with an indefinite article prepended to the front of the string.
	 *
	 * @static
	 * @access public
	 * @type {string}
	 */
	static get checksForA() {
		return A( this.checksFor, { caseInsensitive: true } );
	}

	/**
	 * Describes the type of variable that should FAIL evaluation. This string is used to generate strings
	 * (especially error messages) in response to check failures that are NEGATED (inverted).
	 *
	 * @static
	 * @access public
	 * @type {string}
	 */
	static get failsFor() {

		// We append "non-" to the `checksFor` value, as a rough guess..
		return "non-" + this.checksFor;

	}

	/**
	 * The `failsFor` value with an indefinite article prepended to the front of the string.
	 *
	 * @static
	 * @access public
	 * @type {string}
	 */
	static get failsForA() {
		return A( this.failsFor, { caseInsensitive: true } );
	}

	/**
	 * Returns the short name of this check. By default, this checkName will be the short class name
	 * (without a namespace, such as "IsArray") with its first letter lower-cased (e.g. "isArray"),
	 * but child classes can override this value.
	 *
	 * Check names should be unique and an Error will be thrown if two checks with the same name are
	 * added to a `Core.type.check.Collection`.
	 *
	 * @static
	 * @access public
	 * @type {string}
	 */
	static get checkName() {

		// A bit of caching..
		if( this._checkName === undefined ) {
			this._checkName = this.name.substr( 0, 1 ).toLowerCase() + this.name.substr( 1 );
		}

		// Return
		return this._checkName;

	}

	static evaluateTarget( value ) {

		// ALL check classes must override this method!
		throw new Error( "Check classes MUST provide a 'evaluateTarget' method!" );

	}

	static describeExpectation( negate, args ) {

		if( !negate ) {
			return this.checksForA;
		} else {
			return this.failsForA;
		}

	}

	/**
	 * Normalizes describe options (`opts`) by ensuring that it is a plain object and by applying default values.
	 *
	 * @private
	 * @param {Object} opts - The `opts` param passed to the `describeTarget` method.
	 * @returns {Object} The normalized `opts` object.
	 */
	static _normalizeDescribeOptions( opts ) {

		// Ensure we have an object
		if( !_.isPlainObject( opts ) ) {
			opts = {};
		}

		// Apply default options
		return _.defaults( {}, opts, {
			addIndefiniteArticle: false
		} );

	}

	/**
	 * Describes a variable/value that conforms to this check class. (A "conforming value", in this context, means a
	 * variable that would receive a TRUE return from `evaluateTarget()`)
	 *
	 * @public
	 * @throws Error if a non-conforming variable/value is passed as `value`.
	 * @param {*} value - The value to describe
	 * @param {?Object} [opts=null] - Additional options for the describe operation.
	 * @param {boolean} [opts.addIndefiniteArticle=false] - When TRUE, the returned description will be prefixed with an
	 * indefinite article ("a" or "an"); when FALSE (default), no indefinite article will be prepended.
	 * @returns {string} A human-readable description of `value`.
	 */
	static describeTarget( value, opts = null ) {

		// By default, the 'simple description' will be used to describe values.
		// "Descriptive" child classes can override this method to add additional
		// details and notes for values that conform.
		return this.getSimpleDescription( value, opts );

	}

	/**
	 * Describes a variable/value that conforms to this check class, without adding any additional notes.
	 * (A "conforming value", in this context, means a variable that would receive a TRUE return from `evaluateTarget()`)
	 *
	 * @public
	 * @throws Error if a non-conforming variable/value is passed as `value`.
	 * @param {*} value - The value to describe
	 * @param {?Object} [opts=null] - Additional options for the describe operation.
	 * @param {boolean} [opts.addIndefiniteArticle=false] - When TRUE, the returned description will be prefixed with an
	 * indefinite article ("a" or "an"); when FALSE (default), no indefinite article will be prepended.
	 * @returns {string} A human-readable description of `value`.
	 */
	static getSimpleDescription( value, opts = null ) {

		// Locals
		let me = this;

		// Normalize the `opts` param
		opts = me._normalizeDescribeOptions( opts );

		// Evaluate the value against `evaluateTarget` to be
		// sure that this method can be used to describe the target.
		if( this.evaluateTarget( value ) === false ) {
			throw new Error( "Invalid `value` provided to `Core.type.check.BaseCheck::getSimpleDescription()`; check classes can only be used to describe conforming values!" );
		}

		// Apply indefinite article, if desired..
		if( opts.addIndefiniteArticle === true ) {
			return this.checksForA;
		} else {
			return this.checksFor;
		}

	}

	/**
	 * Executes the `evaluateTarget()` method on another check class.
	 *
	 * @private
	 * @param {string} peerClassName - The peer check class to execute the `evaluateTarget()` method on.
	 * @param {*} value - The value to check.
	 * @returns {boolean} TRUE if `value` passes peer evaluation; FALSE otherwise.
	 */
	static _doPeerReview( peerClassName, value ) {
		let PeerCheckClass = Core.cls( peerClassName );
		return PeerCheckClass.evaluateTarget( value );
	}

}

module.exports = BaseCheck;
