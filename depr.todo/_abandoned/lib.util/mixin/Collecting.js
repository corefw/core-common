/**
 * @file
 * Defines the `Core.util.mixin.Collecting` mixin.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

// Load dependencies using the Core Framework
const { _, TIPE, A } = Core.deps( "_", "tipe", "a" );

/**
 * Provides methods and logic for managing collections (Sets) of child variables.
 *
 * @memberOf Core.util.mixin
 */
class Collecting {

	/*

	Collection
	-> get
	-> set
	-> reset
	-> addOne
	-> addMany

	 */


	// <editor-fold desc="--- Master Collection Store (.collections) --------0----------------------------------------">



	/**
	 * A Map object that stores all of the collections managed by this class.
	 *
	 * @access public
	 * @type {Map}
	 */
	get collections() {

		// Locals
		let me = this;

		// Ensure the _collections property is defined and is a Map
		me._initCollections();

		// Return the collections
		return me._collections;

	}

	/**
	 * Ensures that we have a master `Map` variable to store any collections managed by this class.
	 *
	 * @private
	 * @returns {void}
	 */
	_initCollections() {

		// Locals
		let me = this;

		// Ensure the _collections property is defined and is a Map
		if( me._collections === undefined || me._collections === null || _.isMap( me._collections ) === false ) {
			me._collections = new Map();
		}

	}



	// </editor-fold>

	// <editor-fold desc="--- Utility Methods ------------------------------------------------------------------------">



	/**
	 * Normalizes (standardizes) a given collection name.
	 *
	 * @private
	 * @param {string} collectionName - The collection name to normalize.
	 * @returns {string} The normalized collection name.
	 */
	_normalizeCollectionName( collectionName ) {
		return collectionName.toLowerCase();
	}





	// </editor-fold>

	// <editor-fold desc="--- Collection Operations: Init ------------------------------------------------------------">





	/**
	 * Ensures that a single collection, identified by `collectionName`, exists within the master collection `Map`.
	 *
	 * @protected
	 * @param {string} collectionName - The name of the collection to initialize.
	 * @param {Object} [opts=null] - Additional options to be applied to the collection.
	 * @param {Object} [opts.validationConfig] - An optional validation test collection items against.
	 * @param {Array|Set|*} [opts.initialValues] - Optional, initial, values for the collection.
	 * @returns {Set} The referenced collection.
	 */
	_initCollection( collectionName, opts = null ) {

		// Locals
		let me = this;

		// Normalize the collectionName
		collectionName = me._normalizeCollectionName( collectionName );

		// Initialize the collection, if necessary
		if( !me.collections.has( collectionName ) ) {
			me.collections.set( collectionName, new Set() );
		}

		// Process additional options
		if( opts !== null && opts !== undefined && _.isPlainObject( opts ) ) {

			// Add a validation config, if applicable.
			if( opts.validationConfig !== undefined && opts.validationConfig !== null ) {
				me.setCollectionValidationConfig( opts.validationConfig );
			}

			// Add initial values, if applicable
			if( opts.initialValues !== undefined && opts.initialValues !== null ) {
				me.setCollectionValues( collectionName, opts.initialValues );
			}

		}

		// Return the collection
		return me.collections.get( collectionName );

	}




	// </editor-fold>

	// <editor-fold desc="--- Collection Operations: Has -------------------------------------------------------------">




	/**
	 * Checks to see if a collection, identified by collectionName, exists (has been initialized).
	 *
	 * @public
	 * @param {string} collectionName - The name of the collection to check for.
	 * @returns {boolean} TRUE if the collection exists and has been initialized; FALSE otherwise.
	 */
	hasCollection( collectionName ) {

		// Locals
		let me = this;

		// Normalize the collectionName
		collectionName = me._normalizeCollectionName( collectionName );

		// Check for the collection
		return me.collections.has( collectionName );

	}




	// </editor-fold>

	// <editor-fold desc="--- Collection Operations: Delete ----------------------------------------------------------">



	/**
	 * Deletes a collection.
	 *
	 * @public
	 * @param {string} collectionName - The name of the collection to delete/remove.
	 * @returns {void}
	 */
	deleteCollection( collectionName ) {

		// Locals
		let me = this;

		// Normalize the collectionName
		collectionName = me._normalizeCollectionName( collectionName );

		// Delete
		this.collections.delete( collectionName );

	}




	// </editor-fold>

	// <editor-fold desc="--- Collection Operations: Reset / Clear (Delete + Init) -----------------------------------">



	/**
	 * Clears all values for the collection identified by `collectionName`.
	 *
	 * @public
	 * @param {string} collectionName - The name of the collection to clear.
	 * @returns {void}
	 */
	clearCollection( collectionName ) {
		this.deleteCollection( collectionName );
		this._initCollection( collectionName );
	}

	/**
	 * A convenience alias for `#clearCollection()`.
	 *
	 * @public
	 * @param {string} collectionName - The name of the collection to clear.
	 * @returns {void}
	 */
	resetCollection( collectionName ) {
		this.clearCollection( collectionName );
	}




	// </editor-fold>

	// <editor-fold desc="--- Collection Operations: Get -------------------------------------------------------------">


	/**
	 * Returns the collection identified by `collectionName`.  If the collection does not exist, it will be
	 * initialized, making this method an alias for `#_initCollection`.
	 *
	 * @public
	 * @param {string} collectionName - The name of the collection to return.
	 * @returns {Set} The target collection.
	 */
	getCollection( collectionName ) {
		return this._initCollection( collectionName );
	}

	/**
	 * Returns the values of a collection as an Array.
	 *
	 * @public
	 * @param {string} collectionName - The name of the collection from which to return the values.
	 * @returns {Array} An array containing zero or more values from the target collection.
	 */
	getCollectionValues( collectionName ) {

		// Locals
		let me = this;

		// Fetch the target collection
		let collection = me.getCollection( collectionName );

		// Return the values as an array
		return [ ...collection ];

	}




	// </editor-fold>

	// <editor-fold desc="--- Collection Operations: AddTo -----------------------------------------------------------">


	/**
	 * Adds one or more values to a collection.
	 *
	 * @public
	 * @param {string} collectionName - The name of the collection to add values to.
	 * @param {Array|Set|*} newValue - If an Array or a Set is provided, then each value from that Array or Set will be
	 * added. If any other type is provided, then it will be validated (if a validator has been attached) and, if valid,
	 * it will be added to the collection.
	 * @returns {void}
	 */
	addValueToCollection( collectionName, newValue ) {

		// Locals
		let me = this;

		// Normalize the collectionName
		collectionName = me._normalizeCollectionName( collectionName );

		// Initialize the collection, if necessary
		if( !me.collections.has( collectionName ) ) {
			me.collections.set( collectionName, new Set() );
		}

		// Defer arrays to `#_addArrayOfValuesToCollection`
		if( Array.isArray( newValue ) ) {
			return me._addArrayOfValuesToCollection( collectionName, newValue );
		}

		// Defer set to `#_addSetOfValuesToCollection`
		if( _.isSet( newValue ) ) {
			return me._addSetOfValuesToCollection( collectionName, newValue );
		}

		// Send everything else to the real 'add' method: `_addValueToCollection`
		return me._addValueToCollection( collectionName, newValue );

	}

	/**
	 * Adds a single value to a collection. Provided values will be validated, first, if a validator has been
	 * attached to the target collection.
	 *
	 * Note: This method should not be used directly; use `#addValueToCollection()` instead.
	 *
	 * @public
	 * @param {string} collectionName - The name of the collection to add a value to.
	 * @param {*} newValue - The value to add to the collection.
	 * @returns {void}
	 */
	_addValueToCollection( collectionName, newValue ) {

		// Locals
		let me = this;

		// Validate
		me._validateValueForCollection( collectionName, newValue );

		// Get the collection
		let collection = me.getCollection( collectionName );

		// Add the value
		collection.add( newValue );

	}

	/**
	 * Adds an array of values to a collection. Provided values will be validated, first, if a validator has been
	 * attached to the target collection.
	 *
	 * Note: This method should not be used directly; use `#addValueToCollection()` instead.
	 *
	 * @public
	 * @param {string} collectionName - The name of the collection to add values to.
	 * @param {Array} arrayOfValues - An array of values to add to the collection.
	 * @returns {void}
	 */
	_addArrayOfValuesToCollection( collectionName, arrayOfValues ) {

		// Locals
		let me = this;

		// Iterate over each value
		_.each( arrayOfValues, function( val ) {
			me._addValueToCollection( collectionName, val );
		} );

	}

	/**
	 * Adds a Set of values to a collection. Provided values will be validated, first, if a validator has been
	 * attached to the target collection.
	 *
	 * Note: This method should not be used directly; use `#addValueToCollection()` instead.
	 *
	 * @public
	 * @param {string} collectionName - The name of the collection to add values to.
	 * @param {Set} setOfValues - A Set of values to add to the collection.
	 * @returns {void}
	 */
	_addSetOfValuesToCollection( collectionName, setOfValues ) {

		// Locals
		let me = this;

		// Defer to `_addArrayOfValuesToCollection`
		return me._addArrayOfValuesToCollection( collectionName, [ ...setOfValues ] );

	}



	// </editor-fold>

	// <editor-fold desc="--- Collection Operations: Set (Clear + AddTo) ---------------------------------------------">



	/**
	 * Replaces the existing values of the collection identified by `collectionName` with the values specified as
	 * `values`.
	 *
	 * @public
	 * @param {string} collectionName - The name of the collection to set the values for.
	 * @param {Array|Set|*} values - The new values for the collection.
	 * @returns {void}
	 */
	setCollectionValues( collectionName, values ) {
		this.clearCollection( collectionName );
		this.addValueToCollection( collectionName, values );
	}




	// </editor-fold>

	// <editor-fold desc="--- Collection Operations: Validate --------------------------------------------------------">


	setCollectionValidationConfig( collectionName, validationConfig ) {



	}

	_collectionHasValidator( collectionName ) {

	}

	_getCollectionValidationConfig( collectionName ) {

	}

	_validateValueForCollection( collectionName, value ) {

		// todo: throw errors

	}




	// </editor-fold>

	/*

	get outputs() {
		return this.getCollection( "outputs" );
	}

	addOutput( newOutput ) {
		return this._addItemToCollection( "outputs", newOutput );
	}

	--

	_createCollectionMembers( collectionName ) {

		this[ "get" + collectionName ] = function() {
			return this._getCollection( collectionName );
		}

	}

	// @method getOutput
	// @returns {Core.logging.output.BaseOutput[]}


	// @returns {Set<Core.logging.output.BaseOutput>}


	 $ready() {

	 	this.initCollection( "outputs", {
	 		validateConfig: {
	 			instanceOf: "Core.logging.output.BaseOutput"
	 		}
	 	} );

	 }

	 get outputs() {
	 	return this._getCollection( "outputs" );
	 }


	 somewhereElse() {

	 	Logger.outputs.add( { } );

	 }

	 // Core.collection.BaseCollection
	 callOnItems( fnName, args ) {

		// iterator
	 	if( typeof item[ fnName ] === "function" ) {

	 	}

	 	// -> __call()

	 	// Object.createMagicMethod( .. );



	 }

	 */



}

module.exports = Collecting;
