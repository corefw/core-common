/**
 * @file
 * Defines the Core.type.Validator class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/* eslint complexity: "off" */

// Load dependencies using the Core Framework
const { _, TIPE } = Core.deps( "_", "tipe" );

// Alias a few constants, for brevity
const NO_CONFIG_VALUE             = Core.constants.config.NO_CONFIG_VALUE;
const USE_INTERNAL_CONFIG_VALUE   = Core.constants.validation.USE_INTERNAL_CONFIG_VALUE;
const DO_NOT_VALIDATE_TYPE        = Core.constants.validation.DO_NOT_VALIDATE_TYPE;
const DO_NOT_VALIDATE_INSTANCE_OF = Core.constants.validation.DO_NOT_VALIDATE_INSTANCE_OF;
const NOT_FROM_A_MIXIN            = Core.constants.validation.NOT_FROM_A_MIXIN;


/**
 * Validates things.
 *
 * @memberOf Core.type
 * @extends Core.abstract.Component
 */
class Validator extends Core.cls( "Core.abstract.Component" ) {

	$construct( typeInspector, assetManager ) {

		// We cannot use $require here because $require uses a
		// Validator (this object); so, chickens and eggs..
		if( typeInspector === null ) {
			throw new Error( "Missing the `typeInspector` class dependency for `Core.type.Validator`; this dependency is REQUIRED but was not provided!" );
		}
		if( assetManager === null ) {
			throw new Error( "Missing the `assetManager` class dependency for `Core.type.Validator`; this dependency is REQUIRED but was not provided!" );
		}

		// Persist the class deps
		this._typeInspector = typeInspector;
		this._assetManager 	= assetManager;

	}

	/**
	 * The validator uses this to inspect variables and values.
	 *
	 * @access public
	 * @type {Core.type.Inspector}
	 */
	get typeInspector() {
		return this._typeInspector;
	}


	/**
	 * The validator uses this to spawn class definitions, mainly for the
	 * purposes of comparison in `#instanceOf()`.
	 *
	 * @access public
	 * @type {Core.asset.Manager}
	 */
	get assetManager() {
		return this._assetManager;
	}

	/**
	 * Checks to see if an object is an `instanceof` a Core Framework Class.
	 *
	 * @public
 	 * @param {*} obj - The object to check.
	 * @param {function|string} className - Either the name of a Core Framework Class or a Core Framework Class definition.
	 * @returns {boolean} TRUE if `obj` is an `instanceof` the provided class; FALSE otherwise.
	 */
	instanceOf( obj, className ) {

		let cls = Core.cls( className );
		return ( obj instanceof cls );

	}

	/**
	 * This is an alias of the `#instanceOf` method.
	 *
	 * @public
	 * @param {*} obj - The object to check.
	 * @param {function|string} className - Either the name of a Core Framework Class or a Core Framework Class definition.
	 * @returns {boolean} TRUE if `obj` is an `instanceof` the provided class; FALSE otherwise.
	 */
	instanceof( obj, className ) {
		return Core.instanceOf( obj, className );
	}

	validate( value, opts ) {

		// Locals
		let me = this;
		let checkResult;

		//console.log( arguments );

		// tmp
		if( !_.isNil( opts.check ) ) {
			checkResult = me.check( value, opts.check );
		}

	}

	check( value, opts ) {

		// Locals
		let me = this;



		console.log( arguments );

		if( _.isString( opts ) ) {
			return me._doOneCheck( value, opts );
		}



	}

	_doOneCheck( value, checkName ) {

		// Locals
		let me 	  = this;
		let insp  = me.typeInspector;

		console.log( insp[ checkName ]( value ) );

		console.log( arguments );

	}

	__notes() {

		/*

		// Expected a String but received a Number (value=2).
		"isString" -> { $all: [ "isString"] }

		// Expected a String or a Boolean but received a Number (value=2).
		[ "isString", "isBoolean" ] -> { $any: ["isString", "isBoolean"] }

		// Expected a String or a Number but received a Boolean (TRUE).
		{ $any: [ "isString", "isNumber"] }

		// Actually, im not sure what purpose $all serves ?
		// ... checks are specific enough, I think, to where only one is ever needed
		//     (but $any remains needed to allow multiple options)
		//     ($all would make more sense, though, for non-simple checks, like length < 5 AND length > 10 AND whatever)
		{ $all: [ "isString", "isNumber"] }

		{ $any: [ "isString", { $all: [ "isString", "isBoolean"] } ] }

		--

		$validate( x, {

			instanceOf: "Core.cls.Thing"

		} );

		Validation Flavors:

		     ( class dependency )

		          Missing class dependency ('someThing') in 'Core.cls.Something#$construct()': A non-null value was expected but no value was provided.
		          Missing class dependency ('someThing') in 'Core.cls.Something#$construct()': A non-null value was expected but a null value was provided.

					this._someThing = this.$require( "someThing" );

		          Invalid class dependency ('someThing') in 'Core.cls.Something#$construct()': An instance of 'Core.fs.Directory' was expected but a Core Framework Class ('Core.fs.File') was provided.

					this._someThing = this.$require( "someThing", {
						instanceOf : "Core.xyz.abc",	-> { $all: [ { instanceOf: "Core.xyz.abc" ] }
						allowNull:   					-> { $all: [ "!isNull" ] }

															Collectively:
															{ $any: [ $all: [ "!isNull" ]

					} );


		          A class instance (or other object) that implements 'Core.fs.file.IFile'

					this._someThing = this.$require( "someThing", {
						implements : "Core.xyz.IAbc",	-> { $all: [ { $check: "implements", $args: [ "Core.xyz.abc" ] ] }
					} );

		          A String or an Integer was expected

					this._someThing = this.$require( "someThing", {
						implements: "a.b.c",
						$or: [ "isString", "boolean" ]
					} );

					- always check direct match first
					- if no is or non .. also check for is
					- if non .. convert to !is

					.. fuck $and for now
					.. fuck nesting for now

		          A (String, a Boolean, or an Integer) was expected

		          A String (with a maximum length of 6, a minimum length of 10, and that matches the regular expression /abc/) or a Boolean (with an exact value of TRUE) was expected.
		          A String (with a maximum length of 6 and that matches the regular expression /abc../ [truncated] OR with a minimum length of 3 and with a value of 'cats', 'dogs', or 'trees')

		          .. but a String (whose length exceeds 12 bytes AND which does not match /abc../ [truncated])





		     ( mixin dependency )

		          Missing mixin dependency ($someThing) for 'Core.cls.Something' in 'Core.asset.mixin.Parenting#$construct()': The mixin dependency is required but was not provided.
		          Invalid mixin dependency ($someThing) for 'Core.cls.Something' in 'Core.asset.mixin.Something#$construct()': An instance of 'Core.fs.Directory' was expected but a Core Framework Class ('Core.fs.File') was provided.



		     ( method parameter )

		     	Missing function parameter ('someThing') in 'Core.cls.Something#someFunc()':
		     	Invalid function parameter ('someThing') in 'Core.cls.Something#someFunc()':

		     ( config object    )

		     	Missing config property ('opts.someThing') in 'Core.cls.Something#someFunc()':
		     	Invalid config property ('opts.someThing') in 'Core.cls.Something#someFunc()':

		     ( arbitrary value  )

		     	Missing variable value for 'abc' in 'Core.cls.Something#someFunc()':
		     	Invalid variable value for 'xyz' in 'Core.cls.Something#someFunc()':

		 */

		// Require the `xyz` class dep
		this._xyz = this.$require( "xyz", {
			instanceOf: "Core.xyz.abc",
		} );




	}

	/**
	 * Converts any valid check-instruction format into a single, consistent, and predictable format
	 * that is optimized for evaluation and for converting the instructions into human-readable text.
	 *
	 * @private
	 * @param {LooseValidationInstruction} instructions - The validation instruction(s) to normalize.
	 * @param {number} [curDepth=1] - Indicates the current normalization depth. Recursive operations performed
	 * within this method will set this value automatically and implementors should not need to provide a value for it.
	 * @returns {ValidationInstruction} A normalized representation of the provided `instructions`. When called
	 * from outside implementors (which will, presumably, pass `curDepth=1`), this method will always return a
	 * `ValidationInstructionCollection` (i.e. root-level instruction objects will NOT be represented as
	 * `ValidationCheckInstruction` objects, even if the full instruction only contains a single check).
	 */
	_normalizeValidationInstructions( instructions, curDepth = 1 ) {

		// Locals
		let me      = this;
		let insp    = me.typeInspector;
		let special = me._specialInstructionProperties;
		let any     = [];
		let all     = [];

		// First, deal with scalars
		if( insp.isString( instructions ) ) {

			return me._normalizeValidationInstructions(
				{
					$check : instructions,
					$args  : []
				}, curDepth
			);

		} else if( insp.isNumber( instructions ) || instructions === true || instructions === false ) {

			return me._normalizeValidationInstructions(
				{
					$check : "equals",
					$args  : [ instructions ]
				}, curDepth
			);

		}

		// Convert arrays to $any ..
		if( insp.isArray( instructions ) ) {

			// .. and start over ..
			return me._normalizeValidationInstructions( {
				$any: instructions
			}, curDepth );

		}

		// If the instruction contains $check or $args, then its a check
		// and cannot have children.
		if( instructions.$check !== undefined || instructions.$args !== undefined ) {

			let check = me._normalizeOneCheckInstruction( instructions );

			// If our current depth is '1', we'll wrap the
			// check instruction in an $all object.
			if( curDepth === 1 ) {
				return { $all: [ check ] };
			} else {
				return check;
			}

		}

		// If we have an existing $all, we'll use it
		if( !insp.isNil( instructions.$all ) ) {

			// Instruction collections MUST be arrays..
			if( !insp.isArray( instructions.$all ) ) {
				let provided = insp.describe( instructions.$all, { addIndefiniteArticle: true } );
				throw new Error( "Invalid '$all' instruction provided to 'Core.type.Validator#_normalizeValidationInstructions()'; an Array was expected but " + provided + " was provided." );
			}

			all = instructions.$all;
			delete instructions.$all;
		}

		// If we have an existing $any, we'll use it
		if( !insp.isNil( instructions.$any ) ) {

			// Instruction collections MUST be arrays..
			if( !insp.isArray( instructions.$any ) ) {
				let provided = insp.describe( instructions.$any, { addIndefiniteArticle: true } );
				throw new Error( "Invalid '$any' instruction provided to 'Core.type.Validator#_normalizeValidationInstructions()'; an Array was expected but " + provided + " was provided." );
			}

			any = instructions.$any;
			delete instructions.$any;
		}

		// If an $and was provided, we'll merge it with
		// our running $all collection.
		if( !insp.isNil( instructions.$and ) ) {

			// Instruction collections MUST be arrays..
			if( !insp.isArray( instructions.$and ) ) {
				let provided = insp.describe( instructions.$and, { addIndefiniteArticle: true } );
				throw new Error( "Invalid '$and' instruction provided to 'Core.type.Validator#_normalizeValidationInstructions()'; an Array was expected but " + provided + " was provided." );
			}

			all = all.concat( instructions.$and );
			delete instructions.$and;
		}

		// If an $or was provided, we'll merge it with
		// our running $any collection.
		if( !insp.isNil( instructions.$or ) ) {

			// Instruction collections MUST be arrays..
			if( !insp.isArray( instructions.$or ) ) {
				let provided = insp.describe( instructions.$or, { addIndefiniteArticle: true } );
				throw new Error( "Invalid '$or' instruction provided to 'Core.type.Validator#_normalizeValidationInstructions()'; an Array was expected but " + provided + " was provided." );
			}

			any = any.concat( instructions.$or );
			delete instructions.$or;
		}

		// Any non-special prop indicates a stand-alone check
		// .. we'll add any that we find to the running $all.
		_.each( instructions, function( val, key ) {

			if( !special.has( key ) ) {

				all.push(
					{
						$check : key,
						$args  : [ val ]
					}
				);

			}

		} );

		// Normalize the children of $all
		if( all.length > 0 ) {
			all = me._normalizeValidationCollection( all, curDepth );
		}

		// Normalize the children of $any
		if( any.length > 0 ) {
			any = me._normalizeValidationCollection( any, curDepth );
		}

		// Now the logic forks based on whether or not
		// we have $all, $any, neither, or both.
		let ret;
		if( all.length === 0 && any.length === 0 ) {

			// We have nothing...
			// Return a default skeleton.
			ret = { $all: [] };

		} else if( all.length > 0 && any.length === 0 ) {

			// We only have items in $all...
			// Return it..
			ret = { $all: all };

		} else if( any.length > 0 && all.length === 0 ) {

			// We only have items in $any...
			// Return it..
			ret = { $any: any };

		} else {

			// We have items in both...
			// Add the $any to the end of $all
			all.push( {
				$any: any
			} );

			// and return the $all
			ret = { $all: all };

		}

		return me._flattenInstructions( ret, curDepth );

	}

	/**
	 * Reduces the complexity of `ValidationInstruction` objects in a few ways:
	 *
	 *     - `ValidationInstructionCollection` objects that contain a single `ValidationCheckInstruction` will be
	 *        eliminated and the `ValidationCheckInstruction` it contained will be returned.
	 *
	 *     - Child `AnyValidationInstructionCollection`s whose parents are also `AnyValidationInstructionCollection`s
	 *       will be merged, upward, into their parents.
	 *
	 *     - Child `AllValidationInstructionCollection`s whose parents are also `AllValidationInstructionCollection`s
	 *       will be merged, upward, into their parents.
	 *
	 * Note: This method is called, exclusively and automatically, by `_normalizeValidationInstructions`; it should not
	 * be called from external implementors because those implementors are not likely to know the correct value
	 * to set for the `curDepth` parameter.
	 *
	 * @private
	 * @param {ValidationInstruction} instructions - The instruction(s) to flatten/simplify. If a
	 * `ValidationCheckInstruction` is passed (which is not a collection, but, rather, a single check), it will be
	 * returned without modification.
	 * @param {number} [curDepth=1] - Indicates the current normalization depth. Recursive operations performed
	 * within this method will set this value automatically and implementors should not need to provide a value for it.
	 * @returns {ValidationInstruction} The flattened/simplified instruction object.
	 */
	_flattenInstructions( instructions, curDepth = 1 ) {

		// 1. Flatten collections with only 1 check
		if( instructions.$all !== undefined && instructions.$all.length === 1 && curDepth > 1 ) {
			return instructions.$all[ 0 ];
		} else if( instructions.$any !== undefined && instructions.$any.length === 1 && curDepth > 1 ) {
			return instructions.$any[ 0 ];
		}


		// 2. Merge child collections of the same type
		let collectionType  = null;

		if( instructions.$all !== undefined && instructions.$all.length > 0 ) {

			// We're evaluating an $all collection
			collectionType = "$all";


		} else if( instructions.$any !== undefined && instructions.$any.length > 0 ) {

			// We're evaluating an $all collection
			collectionType = "$any";

		} else {

			// If it has neither $all nor $any, then we can return
			// the `instructions` without making any modifications.
			return instructions;

		}

		// Temp arrays to build final results
		let toBeMerged      = [];
		let finalCollection = [];

		// Iterate over our existing collection
		_.each( instructions[ collectionType ], function( child ) {

			// Check to see this child is a collection of the same type.
			if( child[ collectionType ] !== undefined ) {

				// It is, so we'll merge it down..
				toBeMerged = toBeMerged.concat( child[ collectionType ] );

			} else {

				// It is not, so we'll just keep it as-is
				finalCollection.push( child );

			}

		} );

		// Merge the final result
		let ret = {};
		ret[ collectionType ] = finalCollection.concat( toBeMerged );

		// All done
		return ret;

	}

	/**
	 * Applies normalization to all `ValidationInstruction` objects within a provided `ValidationInstructionCollection`.
	 *
	 * Note: This method is called, exclusively and automatically, by `_normalizeValidationInstructions`; it should not
	 * be called from external implementors because those implementors are not likely to know the correct value
	 * to set for the `curDepth` parameter.
	 *
	 * @private
	 * @param {ValidationInstructionCollection} collection - The validation collection to normalize.
	 * @param {number} [curDepth=1] - Indicates the current normalization depth. Recursive operations performed
	 * within this method will set this value automatically and implementors should not need to provide a value for it.
	 * @returns {ValidationInstruction} The flattened/simplified instruction object.
	 */
	_normalizeValidationCollection( collection, curDepth = 1 ) {

		// Locals
		let me = this;
		let ret = [];

		// Iterate over each item
		_.each( collection, function( val ) {

			// normalize the item ..
			val = me._normalizeValidationInstructions( val, ( curDepth + 1 ) );

			// and add it to the return
			ret.push( val );

		} );


		return ret;
	}

	/**
	 * Normalizes a `ValidationCheckInstruction` object by interpreting special configurations and by applying
	 * property defaults.
	 *
	 * Note: This method is called, exclusively and automatically, by `_normalizeValidationInstructions`; it should not
	 * be called from external implementors.
	 *
	 * @private
	 * @param {ValidationCheckInstruction} instruction - The `ValidationCheckInstruction` to normalize.
	 * @returns {ValidationCheckInstruction} The normalized instruction object.
	 */
	_normalizeOneCheckInstruction( instruction ) {

		// Locals
		let me   = this;
		let insp = me.typeInspector;

		// Apply defaults
		instruction = _.defaults( {}, instruction, {
			$check  : null,
			$args   : [],
			$negate : false
		} );

		// If $args has exactly one value and its a boolean, then we'll use the INVERSE
		// value of that arg as the value for $negate.
		//
		// Example: { isNull: true }
		//
		//    1. The instruction implies that our value should PASS if it is NULL.
		//    2. The default check behavior is to PASS values that get TRUE returns for all checks.
		//    3. So we SHOULD NOT negate the default behavior, it's what we want...
		//    4. The arg value is TRUE ..
		//    5. We want $negate to be FALSE ..
		//    6. Thus ... $negate = !$arg[0]
		//
		if( instruction.$args.length === 1 && insp.isBoolean( instruction.$args[ 0 ] ) ) {
			instruction.$negate = !instruction.$args[ 0 ];
			instruction.$args   = [ ];
		}

		// Handle special check names
		if( _.startsWith( instruction.$check, "!" ) ) {

			// $checks that start with ! will flip the value of $negate
			instruction.$negate = !instruction.$negate;

			// slice off the !
			instruction.$check = instruction.$check.substr( 1 );

			// send it back through with the new values
			return me._normalizeOneCheckInstruction( instruction );

		} else if ( _.startsWith( instruction.$check, "non" ) || _.startsWith( instruction.$check, "not" ) ) {

			// $checks that start with 'non' or 'not' will flip the value of $negate
			instruction.$negate = !instruction.$negate;

			// slice off the 'non' or 'not'
			instruction.$check = instruction.$check.substr( 3 );

			// Note: we could have prepended 'is' right here, (e.g. "notNull" -> "isNull"),
			//       but that won't always be proper (e.g. "notImplements" - bad -> "isImplements"),
			//       so 'is' will be inferred later on (during execution), if applicable.

			// send it back through with the new values
			return me._normalizeOneCheckInstruction( instruction );

		}

		// All done..
		return instruction;

	}

	/**
	 * Returns a Set of strings that represent property names that might be found in `LooseValidationInstruction`
	 * objects which should NOT be converted into `ValidationCheckInstruction` objects.
	 *
	 * Note: This property is used, exclusively, by `_normalizeValidationInstructions`; it contains very little
	 * value for outside implementors.
	 *
	 * @access private
	 * @type {Set<string>}
	 */
	get _specialInstructionProperties() {

		if( this.__specialInstructionProperties === undefined ) {
			this.__specialInstructionProperties = new Set(
				[
					"mixin", "$and", "$or", "$all", "$args"
				]
			);
		}

		return this.__specialInstructionProperties;

	}

}

module.exports = Validator;
