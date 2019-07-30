/**
 * @file
 * Defines the Core.collection.BaseCollection class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

// Load dependencies using the Core Framework
const { _ } = Core.deps( "_" );

// Core.collection.BaseCollection.spawnCollection()

/**
 * An abstract collection.
 *
 * @memberOf Core.collection
 * @extends Core.abstract.Component
 */
class BaseCollection extends Core.cls( "Core.abstract.Component" ) {

	$construct( validationConfig, initialValues ) {

		// Persist the validation config.
		this.validationConfig = validationConfig;

		// Initialize the internal Set store
		this._store = new Set();

		// Apply initial values, if provided
		if( initialValues !== null ) {
			this.setValues( initialValues );
		}

	}


	// <editor-fold desc="--- Validation -----------------------------------------------------------------------------">


	/**
	 * A validation configuration that, if non-NULL, will be asserted on all items added to the collection.
	 *
	 * @access public
	 * @default null
	 * @type {?Object}
	 */
	get validationConfig() {
		return this._validationConfig;
	}
	set validationConfig( val ) {

		// Validate the new validation config
		this._validationConfig = this.$validate( val, {
			isPlainObject : true,
			allowNull     : true,
		} );

	}

	/**
	 * Clears the current validation config.
	 *
	 * @returns {void}
	 */
	clearValidationConfig() {
		this.validationConfig = null;
	}

	/**
	 * Returns TRUE if the collection has a validationConfig; FALSE otherwise.
	 *
	 * @access public
	 * @default null
	 * @type {boolean}
	 */
	get hasValidationConfig() {
		return this.validationConfig !== null;
	}

	/**
	 * Checks to see if a given `item` can be added to this collection.
	 *
	 * @throws Core.error.ValidationError If the provided item is invalid.
	 * @param {*} item - The item to validate.
	 * @returns {void}
	 */
	validateValue( item ) {

		// Locals
		let me = this;

		// Skip validation if no validationConfig exists
		if( me.hasValidationConfig === false ) {
			return;
		}

		// Get the validationConfig
		let validationConfig = me.validationConfig;

		// Validate
		me.$validate( item, validationConfig );

	}


	// </editor-fold>

	// <editor-fold desc="--- Collection Op: Add Value(s) ------------------------------------------------------------">

	/**
	 * Adds one or more items to the collection. If this collection has a `validationConfig`, then all
	 * items will be validated before being added.
	 *
	 * Note: If an array, set, or another Core.collection.BaseCollection is passed, then the items from within
	 * will be iterated over and each will be added independently. (For this reason, collections cannot contain
	 * arrays, sets, or other collections).
	 *
	 * @public
	 * @throws Core.error.ValidationError If any of the provided values fail validation.
	 * @param {*} newValue - The new value (or values) to add to the collection
	 * @returns {void}
	 */
	add( newValue ) {

		// Locals
		let me = this;

		// Ignore 'NULL'
		if( newValue === null ) {
			return;
		}

		// Defer arrays to `#_addArrayOfValues`
		if( Array.isArray( newValue ) ) {
			return me._addArrayOfValues( newValue );
		}

		// Defer sets to `#_addSetOfValues`
		if( _.isSet( newValue ) ) {
			return me._addSetOfValues( newValue );
		}

		// Defer collections to `#_addCollectionOfValues`
		if( newValue instanceof BaseCollection ) {
			return me._addCollectionOfValues( newValue );
		}

		// Send everything else to the real 'add' method: `_addOneValue`
		return me._addOneValue( newValue );

	}

	/**
	 * Adds a single value/item to the collection. If this collection has a `validationConfig`, then the provided
	 * `newValue` will be validated before being added.
	 *
	 * @protected
	 * @throws Core.error.ValidationError If the provided value fails validation.
	 * @param {*} newValue - The new value to add to the collection
	 * @returns {void}
	 */
	_addOneValue( newValue ) {

		// Locals
		let me = this;

		// Validate
		me.validateValue( newValue );

		// Add it
		me._store.add( newValue );

	}

	/**
	 * Adds the values of an array to the collection.
	 *
	 * Note: This method will simply iterate over the provided array and send each value to `#add()`.
	 *
	 * @protected
	 * @throws Core.error.ValidationError If the provided value fails validation.
	 * @param {Array} arrayOfValues - An array of values to be added to the collection.
	 * @returns {void}
	 */
	_addArrayOfValues( arrayOfValues ) {

		// Locals
		let me = this;

		// Iterate over each value
		_.each( arrayOfValues, function( item ) {
			me.add( item );
		} );

	}

	/**
	 * Adds the values within a Set to the collection.
	 *
	 * Note: This method will simply iterate over the provided Set and send each value to `#add()`.
	 *
	 * @protected
	 * @throws Core.error.ValidationError If the provided value fails validation.
	 * @param {Set} setOfValues - A Set of values to be added to the collection.
	 * @returns {void}
	 */
	_addSetOfValues( setOfValues ) {
		this._addArrayOfValues( [ ...setOfValues ] );
	}

	/**
	 * Adds the values within another collection to this collection.
	 *
	 * Note: This method will simply iterate over the provided collection and send each value to `#add()`.
	 *
	 * @protected
	 * @throws Core.error.ValidationError If the provided value fails validation.
	 * @param {Core.collection.BaseCollection} collectionToIngest - A collection of values to be added to this collection.
	 * @returns {void}
	 */
	_addCollectionOfValues( collectionToIngest ) {
		this._addArrayOfValues( collectionToIngest.toArray() );
	}




	// </editor-fold>

	// <editor-fold desc="--- Collection Op: Set Value(s) [ clear + add ] --------------------------------------------">

	/**
	 * Replaces the existing values within the collection with the value or values provided.
	 *
	 * Note: this is a convenience for running `clear()` and `add()`.
	 *
	 * @access public
	 * @param {*} newValues - The new values to set for the collection.
	 * @returns {void}
	 */
	setValues( newValues ) {

		// Locals
		let me = this;

		// First, clear the store...
		me.clear();

		// Now add the values
		if( newValues !== undefined && newValues !== null ) {
			me.add( newValues );
		}

	}





	// </editor-fold>


	/**
	 * Removes a single item from the collection.
	 *
	 * Note: This is convenience alias for `#delete()`.
	 *
	 * @access public
	 * @param {*} valueToRemove - The value to remove from the collection
	 * @returns {boolean} TRUE if an item was removed from the collection; FALSE otherwise.
	 */
	remove( valueToRemove ) {
		return this.delete( valueToRemove );
	}

	/**
	 * Removes a single item from the collection.
	 *
	 * @access public
	 * @param {*} valueToRemove - The value to remove from the collection
	 * @returns {boolean} TRUE if an item was removed from the collection; FALSE otherwise.
	 */
	delete( valueToRemove ) {
		return this._store.delete( valueToRemove );
	}

	/**
	 * Clears all values from the collection.
	 *
	 * @public
	 * @returns {void}
	 */
	clear() {
		this._store.clear();
	}

	/**
	 * Checks to see if the collection contains a specific value.
	 *
	 * @access public
	 * @param {*} targetValue - The value to check for.
	 * @returns {boolean} TRUE if the collection contains the target value; FALSE otherwise.
	 */
	has( targetValue ) {
		return this._store.has( targetValue );
	}

	/**
	 * Returns the values of the collection as an array.
	 *
	 * @access public
	 * @default []
	 * @type {Array}
	 */
	get values() {
		return this.toArray();
	}
	set values( newValues ) {
		this.setValues( newValues );
	}

	/**
	 * Returns the values of the collection as a _new_ Set().
	 *
	 * @public
	 * @returns {Set} The values of the collection.
	 */
	toSet() {
		return new Set( this.toArray() );
	}

	/**
	 * Returns the values of the collection as an array.
	 *
	 * @public
	 * @returns {Array} The values of the collection as an array.
	 */
	toArray() {
		return [ ...this._store ];
	}

	/**
	 * Returns the current size of the collection.
	 *
	 * @access public
	 * @returns {number} The current size of the collection.
	 */
	get size() {
		return this._store.size;
	}

	/**
	 * Returns the current size of the collection.
	 *
	 * Note: This is convenience alias for `.size`.
	 *
	 * @access public
	 * @returns {number} The current size of the collection.
	 */
	get length() {
		return this.size;
	}

	/**
	 * Returns the current size of the collection.
	 *
	 * Note: This is convenience alias for `.size`.
	 *
	 * @access public
	 * @returns {number} The current size of the collection.
	 */
	get count() {
		return this.size;
	}

	// <editor-fold desc="--- Iteration ------------------------------------------------------------------------------">

	/**
	 * Iterates over each item in the collection calling a function (`cb`) on each item.
	 *
	 * Note: The callback function will be called with three arguments: `value`, `index`, and `collection` (this collection).
	 *
	 * @access public
	 * @param {function} cb - The callback function to call for each item in the collection.
	 * @param {?Object} [thisArg=this] - The value to use as `this` when executing `cb`. If no value is provided, then
	 * the collection will be used as `this`.
	 * @returns {void}
	 */
	forEach( cb, thisArg ) {

		// Locals
		let me = this;

		// Default `this`
		if( thisArg === undefined ) {
			thisArg = me;
		}

		// Prelim variables
		let currentIndex = 0;

		// Iterate
		me._store.forEach( function( val1, val2, store ) {

			// a) val2 not being used is by design / intentional
			// b) use of the ambiguous `this` variable, below, is by design / intentional

			// Execute
			cb.apply( this, [ val1, currentIndex, me ] );

			// Increment the index
			currentIndex++;

		}, thisArg );

	}

	/**
	 * Iterates over each item in the collection calling a function (`cb`) on each item.
	 *
	 * Notes:
	 *     - This method is a convenience alias for `#forEach`
	 *     - The callback function will be called with three arguments: `value`, `index`, and `collection` (this collection).
	 *
	 * @access public
	 * @param {function} cb - The callback function to call for each item in the collection.
	 * @param {?Object} [thisArg=this] - The value to use as `this` when executing `cb`. If no value is provided, then
	 * the collection will be used as `this`.
	 * @returns {void}
	 */
	each( cb, thisArg ) {
		return this.forEach( cb, thisArg );
	}

	/*

	todo: Add support for for...in and other iterators

	*[Symbol.iterator]() {
        yield '1';
        yield '2';
    }

	*/


	// </editor-fold>


}

module.exports = BaseCollection;
