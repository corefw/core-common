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

// todo: consider the complexity setting in the ESLINT config...
//       .. should _normalizeValidationInstructions break the complexity rule?
/* eslint complexity: "off" */

// Load dependencies using the Core Framework
const { _ } = Core.deps( "_" );

// Alias constants for brevity
const VALIDATION_WAS_NULL_BYPASSED 	= Core.constants.validation.VALIDATION_WAS_NULL_BYPASSED;
const IS_DEFAULT_INSTRUCTION 		= Core.constants.validation.IS_DEFAULT_INSTRUCTION;
const IS_NORMALIZED_INSTRUCTION 	= Core.constants.validation.IS_NORMALIZED_INSTRUCTION;

/**
 * Validates things.
 *
 * @memberOf Core.type
 * @extends Core.abstract.Component
 */
class Validator extends Core.cls( "Core.abstract.Component" ) {



	// <editor-fold desc="--- Construction & Initialization ----------------------------------------------------------">



	$construct( checkCollection, assetManager ) {

		// We cannot use $require here because $require uses a
		// Validator (this object); so, chickens and eggs..
		if( assetManager === null ) {
			throw new Error( "Missing the `assetManager` class dependency for `Core.type.Validator`; this dependency is REQUIRED but was not provided!" );
		}

		// Allow the checkCollection to be overridden
		if( checkCollection !== null ) {
			this._checkCollection = checkCollection;
		}

		// Persist the class deps
		this._assetManager 	= assetManager;

	}



	// </editor-fold>

	// <editor-fold desc="--- Properties -----------------------------------------------------------------------------">



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
	 * Contains the 'Check Classes' that the validator will use during validation operations.
	 *
	 * @access public
	 * @type {Core.type.check.Collection}
	 */
	get checks() {

		if( this._checkCollection === undefined || this._checkCollection === null ) {
			this._checkCollection = Core.inst( "Core.type.check.Collection", {} );
		}

		return this._checkCollection;

	}

	/**
	 * The validation instructions that will be used in validation operations when no other instructions are specified.
	 *
	 * @access public
	 * @type {LooseValidationInstruction}
	 */
	get defaultValidationInstructions() {

		/*
		return {
			"isNil": false
		};



		*/

		/*
		return this._normalizeValidationInstructions(
			{
				"isNil": false
			}
		);
		*/

		if( this._defaultValidationInstructions === undefined ) {

			// Define the default instructions..
			let defaultLooseInstructions = {
				"isNil": false
			};

			// Normalize the instructions from above
			this._defaultValidationInstructions = this._normalizeValidationInstructions( defaultLooseInstructions );

			// Attach a special marker (symbol) that identifies these
			// instructions as being the default instructions.
			this._defaultValidationInstructions[ IS_DEFAULT_INSTRUCTION ] = true;

		}

		return this._defaultValidationInstructions;


	}


	/**
	 * A Set of strings that represent property names that might be found in `LooseValidationInstruction`
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
					"mixin", "$and", "$or", "$all", "$args", "throwErrors",
					"allowNull", "defaultValue", "returnFullResults", "debug"
				]
			);
		}

		return this.__specialInstructionProperties;

	}


	/**
	 * The default options that will be used in validation operations.
	 *
	 * @access public
	 * @type {Object}
	 */
	get defaultValidationOptions() {
		return {
			throwErrors       : true,
			allowNull         : false,
			defaultValue      : Core.constants.validation.NO_DEFAULT_VALUE,
			returnFullResults : false,
			debug             : false
		};
	}

	// </editor-fold>

	// <editor-fold desc="--- Utility Methods ------------------------------------------------------------------------">



	instructionHasChecks( instructions ) {
		if( this.getInstructionCheckCount( instructions ) === 0 ) {
			return false;
		} else {
			return true;
		}
	}


	getInstructionCheckCount( instructions, curDepth = 1 ) {

		// Locals
		let me = this;

		// Ensure we're dealing with a 'normalized' instruction
		if( curDepth === 1 ) {
			instructions = me._normalizeValidationInstructions( instructions );
		}

		// For check instructions, return 1..
		if( instructions.$check !== undefined ) {
			return 1;
		}

		// For collections, return the sum..
		let isCollection = false;
		let collectionProp;
		if( instructions.$all !== undefined ) {
			isCollection 	= true;
			collectionProp 	= "$all";
		} else if( instructions.$any !== undefined ) {
			isCollection 	= true;
			collectionProp 	= "$any";
		}
		if( isCollection ) {
			let sum = 0;
			_.each( instructions[ collectionProp ], function( item ) {
				sum += me.getInstructionCheckCount( item, ( curDepth + 1 ) );
			} );
			return sum;
		}

		// For everything else, return 0...
		return 0;

	}





	// </editor-fold>


	// <editor-fold desc="--- Primary Validation Methods -------------------------------------------------------------">



	executeCheck( checkName, value, additionalArgs = [] ) {

		// Locals
		let me = this;
		let checks = me.checks;

		// Throw an error if we don't have the requested check
		if( !checks.has( checkName ) ) {
			throw new Error( "Invalid check name ('" + checkName + "') passed to Core.type.Validator::executeCheck(). No such check exists in the attached `Core.type.check.Collection` object." );
		}

		// Get the check class
		let CheckClass = checks.get( checkName );

		// Build the final args array
		if( !Array.isArray( additionalArgs ) ) {
			additionalArgs = [];
		}
		let argsToPass = [ value ].concat( additionalArgs );

		// Evaluate the value..
		return CheckClass.evaluateTarget.apply( CheckClass, argsToPass );

	}

	validate( value, instructions = null ) {

		// Locals
		let me = this;
		// Initialize the return
		let fullResults = {
			$isValidationResults : true,
			success              : null,
			options              : null,
			instructions         : null,
			initialValue         : value,
			failureDetails       : {},
			finalValue           : null
		};

		// If "instructions" is NULL or UNDEFINED, then we will go ahead and default it..
		if( _.isNil( instructions ) ) {
			instructions = me.defaultValidationInstructions;
		}

		// Extract any validation options present in the instructions
		let opts = me._extractValidationOptions( instructions );

		// Add the options to the return object.
		fullResults.options = opts;

		// We can skip validation if the `allowNull` option is
		// TRUE and the `value` is null..
		if( opts.allowNull === true && value === null ) {
			fullResults.success 		= true;
			fullResults.instructions 	= VALIDATION_WAS_NULL_BYPASSED;
			fullResults.failureDetails 	= VALIDATION_WAS_NULL_BYPASSED;
			fullResults.finalValue      = null;

			if( opts.returnFullResults ) {
				return fullResults;
			} else {
				return null;
			}

		}

		// Normalize the instructions
		instructions = me._normalizeValidationInstructions( instructions );

		// If the instructions do not have any checks, we'll use the default instructions..
		if( !me.instructionHasChecks( instructions ) ) {
			instructions = me.defaultValidationInstructions;
		}

		// Add the instructions to the return object.
		fullResults.instructions = instructions;

		// Debug
		if( opts.debug === true ) {
			Core.inspect( instructions, "Final Validation Instructions (debug=true)" );
		}

		// Do the real validation work.
		fullResults.success = me._validateInstruction( value, instructions );

		// Handle errors..
		if( fullResults.success === false ) {

			// Populate the failure details..
			fullResults.failureDetails.expected = me.describeExpectations( instructions );
			fullResults.failureDetails.provided = me.describeA( value );
			fullResults.failureDetails.message  = "expected " + fullResults.failureDetails.expected + " but " + fullResults.failureDetails.provided + " was provided.";

			// Should we throw an Error?
			if( opts.throwErrors === true ) {

				// Yes, throw an error...
				return Core.throw( "ValidationError", fullResults.failureDetails.message, {
					fullValidationResults: fullResults
				} );

			} else {

				// No, we need to return something.
				// ... return the `defaultValue`, if provided ...
				if( opts.defaultValue !== undefined &&
					opts.defaultValue !== Core.constants.validation.NO_DEFAULT_VALUE ) {

					// If the `defaultValue` is a function, we'll execute it..
					if( _.isFunction( opts.defaultValue ) ) {
						fullResults.finalValue = opts.defaultValue( fullResults, me );
					} else {
						fullResults.finalValue = opts.defaultValue;
					}

				} else {

					// If a defaultValue is not defined, we'll return NULL
					fullResults.finalValue = null;

				}

			}

		} else {

			// When validation succeeds, we return the `value`.
			fullResults.finalValue = value;

		}

		// Return the value (default) or the full results
		if( opts.returnFullResults ) {
			return fullResults;
		} else {
			return fullResults.finalValue;
		}

	}

	/**
	 * Extracts any validation options specified in the root level of an instructions object.
	 *
	 * @private
	 * @param {LooseValidationInstruction} instructions - The validation instruction(s) to inspect for instructions.
	 * @param {boolean} [applyDefaults=true] - When TRUE, the "options" returned will be contain default values
	 * for any options that were not resolved from `instructions`.
	 * @returns {Object} Validation options. Any changes to `instructions` will be byRef.
	 */
	_extractValidationOptions( instructions, applyDefaults = true ) {

		let opts;

		// Apply defaults?
		if( applyDefaults !== false ) {
			opts = this.defaultValidationOptions;
		} else {
			opts = {};
		}

		// We only look for validation options if our
		// instructions variable is an object.
		if( _.isObject( instructions ) ) {

			// Apply 'throwErrors', if present in the instructions:
			if( instructions.throwErrors !== undefined ) {

				// We only need to update the options if `throwErrors`
				// is exactly FALSE. TRUE is the default and all other
				// values are invalid...
				if( instructions.throwErrors === false ) {
					opts.throwErrors = false;
				}

				// Remove the option from the instructions
				// object to prevent it from being interpreted
				// as a check instruction. (paranoid)
				delete instructions.throwErrors;

			}

			// Apply 'allowNull', if present in the instructions:
			if( instructions.allowNull !== undefined ) {

				// We only need to update the options if `allowNull`
				// is exactly TRUE. FALSE is the default and all other
				// values are invalid...
				if( instructions.allowNull === true ) {
					opts.allowNull = true;
				}

				// Remove the option from the instructions
				// object to prevent it from being interpreted
				// as a check instruction. (paranoid)
				delete instructions.allowNull;

			}

			// Apply 'defaultValue', if present in the instructions:
			if( instructions.defaultValue !== undefined ) {

				// Apply the default value
				opts.defaultValue = instructions.defaultValue;

				// Remove the option from the instructions
				// object to prevent it from being interpreted
				// as a check instruction. (paranoid)
				delete instructions.defaultValue;

			}

			// Apply 'returnFullResults', if present in the instructions:
			if( instructions.returnFullResults !== undefined ) {

				// Apply
				opts.returnFullResults = instructions.returnFullResults;

				// Remove the option from the instructions
				// object to prevent it from being interpreted
				// as a check instruction. (paranoid)
				delete instructions.returnFullResults;

			}

			// Apply 'debug', if present in the instructions:
			if( instructions.debug === true ) {

				// Apply
				opts.debug = true;

				// Remove the option from the instructions
				// object to prevent it from being interpreted
				// as a check instruction. (paranoid)
				delete instructions.debug;

			}

		}

		// If a defaultValue option was provided, then
		// we'll force `throwErrors` to FALSE.
		if( opts.defaultValue !== undefined && opts.defaultValue !== Core.constants.validation.NO_DEFAULT_VALUE ) {
			opts.throwErrors = false;
		}

		// Done
		return opts;


	}


	/**
	 * Validates a `value` against the provided, pre-normalized, validation `instructions`.
	 *
	 * This is the main entry point for actual validation and all that it does is route the validation to the
	 * other specialist methods based on the type of instruction it is given.
	 *
	 * @private
	 * @param {*} value - The value to validate.
	 * @param {ValidationInstruction} instructions - The *normalized* validation instructions to test the `value` against.
	 * @returns {boolean} TRUE if validation succeeds/passes; FALSE if validation failed.
	 */
	_validateInstruction( value, instructions ) {

		// Locals
		let me = this;

		// Fork the logic based on the type of `instructions` given:
		if( instructions.$all !== undefined ) {
			return me._validateAllInstructionCollection( value, instructions );
		} else if( instructions.$any !== undefined ) {
			return me._validateAnyInstructionCollection( value, instructions );
		} else if( instructions.$check !== undefined ) {
			return me._validateCheckInstruction( value, instructions );
		} else {
			Core.throw( "ParamValidationError", "Invalid `instructions` passed to `Core.type.Validator::_validateInstruction()`: the provided value is not a valid, normalized, `ValidationInstruction`." );
		}

	}

	/**
	 * Routes a `ValidationCheckInstruction` (an instruction that is NOT a collection of other instructions) to the
	 * appropriate check class (`Core.type.check.BaseCheck`).
	 *
	 * Note: This method is called, exclusively, by `_validateInstruction()` and should not be called from any other source.
	 *
	 * @private
	 * @param {*} value - The value to validate.
	 * @param {ValidationCheckInstruction} instruction - Normalized information about the validation check to be performed.
	 * @returns {boolean} TRUE if validation succeeds/passes; FALSE if validation failed.
	 */
	_validateCheckInstruction( value, instruction ) {

		// Locals
		let me = this;

		// Execute the check..
		let result = me.executeCheck( instruction.$check, value, instruction.$args );

		// Negate?
		if( instruction.$negate ) {
			result = !result;
		}

		// Done
		return result;

	}

	/**
	 * Iterates over an `AnyValidationInstructionCollection`, evaluating each `ValidationInstruction` within.
	 * If any of the child validations PASS then the whole collection will PASS (i.e. if ANY child passes, the
	 * collection passes).
	 *
	 * Note: This method is called, exclusively, by `_validateInstruction()` and should not be called from any other source.
	 *
	 * @private
	 * @param {*} value - The value to validate.
	 * @param {AnyValidationInstructionCollection} instructions - A collection of child instructions.
	 * @returns {boolean} TRUE if validation succeeds/passes; FALSE if validation failed.
	 */
	_validateAnyInstructionCollection( value, instructions ) {

		// Locals
		let me  = this;
		let ret = false;

		// Iterate over each instruction in the collection
		_.each( instructions.$any, function( instruction ) {

			// Evaluate the instruction.
			let result = me._validateInstruction( value, instruction );

			// If any instruction passes, the whole collection passes
			if( result === true ) {

				// Update the return
				ret = true;

				// No reason to continue validating
				// this collection; returning false
				// will cancel iteration.
				return false;

			}

		} );

		// Done
		return ret;

	}

	/**
	 * Iterates over an `AllValidationInstructionCollection`, evaluating each `ValidationInstruction` within.
	 * If any of the child validations FAIL then the whole collection will FAIL (i.e. ALL children are required to
	 * validate successfully).
	 *
	 * Note: This method is called, exclusively, by `_validateInstruction()` and should not be called from any other source.
	 *
	 * @private
	 * @param {*} value - The value to validate.
	 * @param {AllValidationInstructionCollection} instructions - A collection of child instructions.
	 * @returns {boolean} TRUE if validation succeeds/passes; FALSE if validation failed.
	 */
	_validateAllInstructionCollection( value, instructions ) {

		// Locals
		let me  = this;
		let ret = true;

		// Iterate over each instruction in the collection
		_.each( instructions.$all, function( instruction ) {

			// Evaluate the instruction.
			let result = me._validateInstruction( value, instruction );

			// If any instruction fails, the whole collection fails
			if( result === false ) {

				// Update the return
				ret = false;

				// No reason to continue validating
				// this collection; returning false
				// will cancel iteration.
				return false;

			}

		} );

		// Done
		return ret;

	}



	// </editor-fold>

	// <editor-fold desc="--- Methods for describing 'expectations' --------------------------------------------------">



	describeExpectations( instructions ) {

		// Locals
		let me = this;

		// Normalize the instructions. Although this method is usually called
		// by `validate()`, which normalizes the instructions, itself, this
		// method CAN be called from elsewhere, so we need to ensure that the
		// instructions are normalized.
		instructions = me._normalizeValidationInstructions( instructions );

		// Defer to the specialist methods..
		return me._describeInstruction( instructions, 1 );

		//let res = me._describeInstruction( instructions, 1 );
		//console.log( res );
		//return res;

	}

	_describeInstruction( instructions, curDepth = 1 ) {

		// Locals
		let me = this;

		// Fork the logic based on the type of `instructions` given:
		if( instructions.$all !== undefined ) {
			return me._describeAllInstructionCollection( instructions, curDepth );
		} else if( instructions.$any !== undefined ) {
			return me._describeAnyInstructionCollection( instructions, curDepth );
		} else if( instructions.$check !== undefined ) {
			return me._describeCheckInstruction( instructions, curDepth );
		} else {
			throw new Error( "Invalid `instructions` passed to `Core.type.Validator::_describeInstruction()`: the provided value is not a valid, normalized, `ValidationInstruction`." );
		}

	}

	_describeCheckInstruction( instruction, curDepth = 1 ) {

		// Locals
		let me = this;

		// Execute the 'describeExpectations' static method on the check class..
		let result = me._executeDescribeExpectationForCheck(
			instruction.$check, instruction.$negate, instruction.$args
		);

		// Done
		return result;

	}

	_describeAnyInstructionCollection( instructions, curDepth = 1 ) {

		// Locals
		let me = this;
		let childExpectations = [];

		// Get the expectations for all children
		_.each( instructions.$any, function( instruction ) {
			childExpectations.push( me._describeInstruction( instruction, ( curDepth + 1 ) ) );
		} );

		// Join with a conjunction
		let joined = me._addConjunction( childExpectations, "or", curDepth );

		// Surround with parenthesis
		if( curDepth === 1 ) {
			return joined;
		} else {
			return "( " + joined + " )";
		}

	}

	_describeAllInstructionCollection( instructions, curDepth = 1 ) {

		// Locals
		let me = this;
		let childExpectations = [];

		// Get the expectations for all children
		_.each( instructions.$all, function( instruction ) {
			childExpectations.push( me._describeInstruction( instruction, ( curDepth + 1 ) ) );
		} );

		// Join with a conjunction
		let joined = me._addConjunction( childExpectations, "and", curDepth );

		// Surround with parenthesis

		if( curDepth === 1 ) {

			if( instructions.$all.length < 2 ) {
				return joined;
			} else {
				return "( " + joined + " )";
			}

		} else {
			return "( " + joined + " )";
		}

	}

	_addConjunction( expectations, conjunction, curDepth ) {

		if( expectations.length === 1 ) {
			return expectations[ 0 ];
		} else if( expectations.length === 2 ) {

			if( conjunction === "or" ) {
				return expectations[ 0 ] + " or " + expectations[ 1 ];
			} else {
				return expectations[ 0 ] + " && " + expectations[ 1 ];
			}

		} else {

			if( conjunction === "or" ) {

				if( curDepth === 1 ) {

					let last = expectations.pop();
					let withCommas = expectations.join( ", " );
					return withCommas + ", or " + last;

				} else {

					return expectations.join( " || " );

				}

			} else if( conjunction === "and" ) {

				return expectations.join( " && " );

			}

		}

	}

	_executeDescribeExpectationForCheck( checkName, negate, additionalArgs = [] ) {

		// Locals
		let me = this;
		let checks = me.checks;

		// Throw an error if we don't have the requested check
		if( !checks.has( checkName ) ) {
			throw new Error( "Invalid check name ('" + checkName + "') passed to Core.type.Validator::_executeDescribeExpectationForCheck(). No such check exists in the attached `Core.type.check.Collection` object." );
		}

		// Get the check class
		let CheckClass = checks.get( checkName );

		// Build the final args array
		if( !Array.isArray( additionalArgs ) ) {
			additionalArgs = [];
		}
		let argsToPass = [ negate ].concat( additionalArgs );

		// Evaluate the value..
		return CheckClass.describeExpectation.apply( CheckClass, argsToPass );

	}




	// </editor-fold>

	// <editor-fold desc="--- Validation Instruction Normalization ---------------------------------------------------">



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
		let special = me._specialInstructionProperties;
		let any     = [];
		let all     = [];

		// Check to see if the `instructions` have already been normalized..
		if( curDepth === 1 && _.isPlainObject( instructions ) && instructions[ IS_NORMALIZED_INSTRUCTION ] === true  ) {
			return instructions;
		}

		// Deal with scalars
		if( me.isString( instructions ) ) {

			return me._normalizeValidationInstructions(
				{
					$check : instructions,
					$args  : []
				}, curDepth
			);

		} else if( me.isNumber( instructions ) || instructions === true || instructions === false ) {

			return me._normalizeValidationInstructions(
				{
					$check : "equals",
					$args  : [ instructions ]
				}, curDepth
			);

		}

		// Convert arrays to $any ..
		if( me.isArray( instructions ) ) {

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
				return me._applyNormalizedSymbol( { $all: [ check ] } );
			} else {
				return check;
			}

		}

		// Break the reference to avoid modifying the source
		instructions = _.clone( instructions );

		// If we have an existing $all, we'll use it
		if( !me.isNil( instructions.$all ) ) {

			// Instruction collections MUST be arrays..
			if( !me.isArray( instructions.$all ) ) {
				let provided = me.describe( instructions.$all, { addIndefiniteArticle: true } );
				throw new Error( "Invalid '$all' instruction provided to 'Core.type.Validator#_normalizeValidationInstructions()'; an Array was expected but " + provided + " was provided." );
			}

			all = instructions.$all;
			delete instructions.$all;
		}

		// If we have an existing $any, we'll use it
		if( !me.isNil( instructions.$any ) ) {

			// Instruction collections MUST be arrays..
			if( !me.isArray( instructions.$any ) ) {
				let provided = me.describe( instructions.$any, { addIndefiniteArticle: true } );
				throw new Error( "Invalid '$any' instruction provided to 'Core.type.Validator#_normalizeValidationInstructions()'; an Array was expected but " + provided + " was provided." );
			}

			any = instructions.$any;
			delete instructions.$any;
		}

		// If an $and was provided, we'll merge it with
		// our running $all collection.
		if( !me.isNil( instructions.$and ) ) {

			// Instruction collections MUST be arrays..
			if( !me.isArray( instructions.$and ) ) {
				let provided = me.describe( instructions.$and, { addIndefiniteArticle: true } );
				throw new Error( "Invalid '$and' instruction provided to 'Core.type.Validator#_normalizeValidationInstructions()'; an Array was expected but " + provided + " was provided." );
			}

			all = all.concat( instructions.$and );
			delete instructions.$and;
		}

		// If an $or was provided, we'll merge it with
		// our running $any collection.
		if( !me.isNil( instructions.$or ) ) {

			// Instruction collections MUST be arrays..
			if( !me.isArray( instructions.$or ) ) {
				let provided = me.describe( instructions.$or, { addIndefiniteArticle: true } );
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

		// Flatten..
		ret = me._flattenInstructions( ret, curDepth );

		// Apply a special marker (symbol) that indicates
		// that these instructions have been normalized.
		if( curDepth === 1 ) {
			me._applyNormalizedSymbol( ret );
		}

		// All done
		return ret;

	}

	/**
	 * Flags the provided object as being "normalized" by creating a special symbol property within it.
	 *
	 * @private
	 * @param {ValidationInstruction} obj - The validation instruction object to flag.
	 * @returns {ValidationInstruction} Returns `obj` after the symbol has been applied.
	 */
	_applyNormalizedSymbol( obj ) {
		obj[ IS_NORMALIZED_INSTRUCTION ] = true;
		return obj;
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
		if( instruction.$args.length === 1 && me.isBoolean( instruction.$args[ 0 ] ) ) {
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



	// </editor-fold>

	// <editor-fold desc="--- Validation Instruction Mutation --------------------------------------------------------">


	/**
	 * Merges two or more validation instructions by joining them in an `AllValidationInstructionCollection`.
	 *
	 * @public
	 * @param {...ValidationInstruction} instructions - The instructions to merge.
	 * @returns {AllValidationInstructionCollection} The merged instructions.
	 */
	mergeInstructions( ...instructions ) {

		// Locals
		let me                 = this;
		let validationOptions  = {};
		let mergedInstructions = {
			$and: []
		};


		// Iterate over each instruction object
		_.each( instructions, function( instruction ) {

			// Extract the options from the instruction.
			let opts = me._extractValidationOptions( instruction, false );

			// Merge (giving precedence to the first specifier)
			validationOptions = _.merge( {}, opts, validationOptions );

			// Add this instruction
			mergedInstructions.$and.push( instruction );

		} );

		// Apply the options..
		mergedInstructions = _.merge( mergedInstructions, validationOptions );

		// All done
		return mergedInstructions;

	}



	// </editor-fold>

	// <editor-fold desc="--- Logic for describing variables/values --------------------------------------------------">



	/**
	 * Provides a short description of the type of the provided `value`.
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

		// Ensure `opts` is an object.
		if( !this.isPlainObject( opts ) ) {
			opts = {};
		}

		// Apply default options
		opts = _.defaults( {}, opts, {
			addIndefiniteArticle : false,
			noAdditions          : false
		} );

		// Find the check class that should be used to describe the target value.
		let descriptiveCheck = me.checks.getFirstDescriptiveMatch( value );

		// Determine which static method to use for the
		// description, based on the value of 'opts.noAdditions'
		let describeFnName = "describeTarget";
		if( opts.noAdditions === true ) {
			describeFnName = "getSimpleDescription";
		}

		// Call the describe function & return
		return descriptiveCheck[ describeFnName ]( value, opts );

	}

	/**
	 * A convenience alias for `describe` which forces the value of `opts.addIndefiniteArticle` to TRUE.
	 *
	 * @param {*} value - The variable to describe.
	 * @param {Object} opts - Additional options; see {@link `#describe()`}
	 * @returns {string} A short description of `value`.
	 */
	describeA( value, opts ) {

		// Ensure `opts` is an object.
		if( !this.isPlainObject( opts ) ) {
			opts = {};
		}

		// Force indefinite article
		opts.addIndefiniteArticle = true;

		// Defer to `describe`
		return this.describe( value, opts );

	}



	// </editor-fold>

	// <editor-fold desc="--- Convenience Aliases for Type Checks ----------------------------------------------------">




	/**
	 * Checks if `value` is likely an arguments object.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsArguments#evaluateTarget()}.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is an arguments object; otherwise it returns FALSE.
	 */
	isArguments( value ) {
		return this.executeCheck( "isArguments", value );
	}

	/**
	 * Checks if `value` is classified as an Array object.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsArray#evaluateTarget()}.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is an array; otherwise it returns FALSE.
	 */
	isArray( value ) {
		return this.executeCheck( "isArray", value );
	}

	/**
	 * Checks if `value` is classified as an ArrayBuffer object.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsArrayBuffer#evaluateTarget()}.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is an array buffer; otherwise it returns FALSE.
	 */
	isArrayBuffer( value ) {
		return this.executeCheck( "isArrayBuffer", value );
	}

	/**
	 * Checks if `value` is array-like. A value is considered array-like if it's not a function and has a `value.length`
	 * that's an integer greater than or equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsArrayLike#evaluateTarget()}.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is array-like; otherwise it returns FALSE.
	 */
	isArrayLike( value ) {
		return this.executeCheck( "isArrayLike", value );
	}

	/**
	 * This method is like `isArrayLike` except that it also checks if value is an object.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsArrayLikeObject#evaluateTarget()}.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is an array-like object; otherwise it returns FALSE.
	 */
	isArrayLikeObject( value ) {
		return this.executeCheck( "isArrayLikeObject", value );
	}

	/**
	 * Checks if `value` is classified as a boolean primitive or object.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsBoolean#evaluateTarget()}.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a boolean; otherwise it returns FALSE.
	 */
	isBoolean( value ) {
		return this.executeCheck( "isBoolean", value );
	}

	/**
	 * Checks if `value` is a buffer.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsBuffer#evaluateTarget()}.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a buffer; otherwise it returns FALSE.
	 */
	isBuffer( value ) {
		return this.executeCheck( "isBuffer", value );
	}

	/**
	 * Checks if `value` is classified as a Date object.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsDate#evaluateTarget()}.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a date; otherwise it returns FALSE.
	 */
	isDate( value ) {
		return this.executeCheck( "isDate", value );
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
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsEmpty#evaluateTarget()}.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is empty; otherwise it returns FALSE.
	 */
	isEmpty( value ) {
		return this.executeCheck( "isEmpty", value );
	}

	/**
	 * Checks if `value` is an Error, EvalError, RangeError, ReferenceError, SyntaxError, TypeError, or URIError object.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsError#evaluateTarget()}.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is an error object; otherwise it returns FALSE.
	 */
	isError( value ) {
		return this.executeCheck( "isError", value );
	}

	/**
	 * Checks if `value` is a finite primitive number.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsFinite#evaluateTarget()}.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a finite number; otherwise it returns FALSE.
	 */
	isFinite( value ) {
		return this.executeCheck( "isFinite", value );
	}

	/**
	 * Checks if `value` is classified as a Function object.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsFunction#evaluateTarget()}.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a function; otherwise it returns FALSE.
	 */
	isFunction( value ) {
		return this.executeCheck( "isFunction", value );
	}

	/**
	 * Checks if `value` is an integer.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsInteger#evaluateTarget()}.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is an integer; otherwise it returns FALSE.
	 */
	isInteger( value ) {
		return this.executeCheck( "isInteger", value );
	}

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsLength#evaluateTarget()}.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a valid length; otherwise it returns FALSE.
	 */
	isLength( value ) {
		return this.executeCheck( "isLength", value );
	}

	/**
	 * Checks if `value` is classified as a Map object.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsMap#evaluateTarget()}.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a map; otherwise it returns FALSE.
	 */
	isMap( value ) {
		return this.executeCheck( "isMap", value );
	}

	/**
	 * Checks if `value` is NaN.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsNaN#evaluateTarget()}.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is NaN; otherwise it returns FALSE.
	 */
	isNaN( value ) {
		return this.executeCheck( "isNaN", value );
	}

	/**
	 * Checks if `value` is a pristine native function.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsNative#evaluateTarget()}.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a native function; otherwise it returns FALSE.
	 */
	isNative( value ) {
		return this.executeCheck( "isNative", value );
	}

	/**
	 * Checks if `value` is NULL or UNDEFINED.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsNil#evaluateTarget()}.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is nullish; otherwise it returns FALSE.
	 */
	isNil( value ) {
		return this.executeCheck( "isNil", value );
	}

	/**
	 * Checks if `value` is NULL.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsNull#evaluateTarget()}.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is NULL; otherwise it returns FALSE.
	 */
	isNull( value ) {
		return this.executeCheck( "isNull", value );
	}

	/**
	 * Checks if `value` is classified as a Number primitive or object.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsNumber#evaluateTarget()}.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a number; otherwise it returns FALSE.
	 */
	isNumber( value ) {
		return this.executeCheck( "isNumber", value );
	}

	/**
	 * Checks if `value` is the language type of Object. (e.g. arrays, functions, objects, regexes, new Number(0),
	 * and new String(''))
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsObject#evaluateTarget()}.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is an object; otherwise it returns FALSE.
	 */
	isObject( value ) {
		return this.executeCheck( "isObject", value );
	}

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not null and has a typeof result of "object".
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsObjectLike#evaluateTarget()}.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` if object-like; otherwise it returns FALSE.
	 */
	isObjectLike( value ) {
		return this.executeCheck( "isObjectLike", value );
	}

	/**
	 * Checks if `value` is a plain object, that is, an object created by the Object constructor or one with a
	 * `[[Prototype]]` of NULL.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsPlainObject#evaluateTarget()}.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a plain object; otherwise it returns FALSE.
	 */
	isPlainObject( value ) {
		return this.executeCheck( "isPlainObject", value );
	}

	/**
	 * Checks if `value` is classified as a RegExp object.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsRegExp#evaluateTarget()}.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a regexp; otherwise it returns FALSE.
	 */
	isRegExp( value ) {
		return this.executeCheck( "isRegExp", value );
	}

	/**
	 * Checks if `value` is a safe integer. An integer is safe if it's an IEEE-754 double precision number which isn't
	 * the result of a rounded unsafe integer.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsSafeInteger#evaluateTarget()}.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a safe integer; otherwise it returns FALSE.
	 */
	isSafeInteger( value ) {
		return this.executeCheck( "isSafeInteger", value );
	}

	/**
	 * Checks if `value` is classified as a Set object.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsSet#evaluateTarget()}.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a set; otherwise it returns FALSE.
	 */
	isSet( value ) {
		return this.executeCheck( "isSet", value );
	}

	/**
	 * Checks if `value` is classified as a String primitive or object.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsString#evaluateTarget()}.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a string; otherwise it returns FALSE.
	 */
	isString( value ) {
		return this.executeCheck( "isString", value );
	}

	/**
	 * Checks if `value` is classified as a Symbol primitive or object.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsSymbol#evaluateTarget()}.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a symbol; otherwise it returns FALSE.
	 */
	isSymbol( value ) {
		return this.executeCheck( "isSymbol", value );
	}

	/**
	 * Checks if `value` is classified as a typed array.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsTypedArray#evaluateTarget()}.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a typed array; otherwise it returns FALSE.
	 */
	isTypedArray( value ) {
		return this.executeCheck( "isTypedArray", value );
	}

	/**
	 * Checks if `value` is undefined.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsUndefined#evaluateTarget()}.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is undefined; otherwise it returns FALSE.
	 */
	isUndefined( value ) {
		return this.executeCheck( "isUndefined", value );
	}

	/**
	 * Checks if `value` is classified as a WeakMap object.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsWeakMap#evaluateTarget()}.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a weak map; otherwise it returns FALSE.
	 */
	isWeakMap( value ) {
		return this.executeCheck( "isWeakMap", value );
	}

	/**
	 * Checks if `value` is classified as a WeakSet object.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsWeakSet#evaluateTarget()}.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a weak set; otherwise it returns FALSE.
	 */
	isWeakSet( value ) {
		return this.executeCheck( "isWeakSet", value );
	}

	/**
	 * Checks if `value` is an arrow function.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsArrowFunction#evaluateTarget()}.
	 *
	 * Other Important Notes:
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
		return this.executeCheck( "isArrowFunction", value );
	}

	/**
	 * Checks if `value` is a function, but not an arrow function.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsNonArrowFunction#evaluateTarget()}.
	 *
	 * Other Important Notes:
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
		return this.executeCheck( "isNonArrowFunction", value );
	}

	/**
	 * Checks if `value` is a function that was declared with the `async` keyword.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsAsyncFunction#evaluateTarget()}.
	 *
	 * Other Important Notes:
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
		return this.executeCheck( "isAsyncFunction", value );
	}

	/**
	 * Checks if `value` is a function that was NOT declared using the `async` keyword.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsNonAsyncFunction#evaluateTarget()}.
	 *
	 * Other Important Notes:
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
		return this.executeCheck( "isNonAsyncFunction", value );
	}

	/**
	 * Checks if `value` is an anonymous function.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsAnonymousFunction#evaluateTarget()}.
	 *
	 * Other Important Notes:
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
		return this.executeCheck( "isAnonymousFunction", value );
	}

	/**
	 * Checks if `value` is named function.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsNamedFunction#evaluateTarget()}.
	 *
	 * Other Important Notes:
	 *
	 *    - This function is meant to be used for reflective purposes. Implementing it as a way to fork
	 *      logic based on whether or not a function is named is almost certainly a very-bad-idea.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a named function; otherwise it returns FALSE.
	 */
	isNamedFunction( value ) {
		return this.executeCheck( "isNamedFunction", value );
	}

	/**
	 * Checks if `value` is function that been `bound()` to a scope.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsBoundFunction#evaluateTarget()}.
	 *
	 * Other Important Notes:
	 *
	 *    - This function is meant to be used for reflective purposes. Implementing it as a way to fork
	 *      logic based on whether or not a function has been bound is almost certainly a very-bad-idea.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a bound function; otherwise it returns FALSE.
	 */
	isBoundFunction( value ) {
		return this.executeCheck( "isBoundFunction", value );
	}

	/**
	 * Checks if `value` is a function that has not been `bound()` to a scope.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsUnboundFunction#evaluateTarget()}.
	 *
	 * Other Important Notes:
	 *
	 *    - This function is meant to be used for reflective purposes. Implementing it as a way to fork
	 *      logic based on whether or not a function has been bound is almost certainly a very-bad-idea.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is an unbound function; otherwise it returns FALSE.
	 */
	isUnboundFunction( value ) {
		return this.executeCheck( "isBoundFunction", value );
	}

	/**
	 * Checks if `value` is a Moment.js object.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsMoment#evaluateTarget()}.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a Moment.js object; otherwise it returns FALSE.
	 */
	isMoment( value ) {
		return this.executeCheck( "isMoment", value );
	}

	/**
	 * Checks if `value` is a Core Framework class constructor/definition.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsCoreClass#evaluateTarget()}.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a Core Framework class constructor/definition; otherwise it returns FALSE.
	 */
	isCoreClass( value ) {
		return this.executeCheck( "isCoreClass", value );
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
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsCoreClassName#evaluateTarget()}.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a Core Framework class constructor/definition; otherwise it returns FALSE.
	 */
	isCoreClassName( value ) {
		return this.executeCheck( "isCoreClassName", value );
	}

	/**
	 * Checks if `value` is either a Core Framework class definition/constructor OR a string that represents a Core
	 * Framework class name which includes a full namespace path.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsCoreClassLike#evaluateTarget()}.
	 *
	 * @see isCoreClass
	 * @see isCoreClassName
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a Core Framework class constructor/definition or a valid Core
	 * Framework class path; otherwise it returns FALSE.
	 */
	isCoreClassLike( value ) {
		return this.executeCheck( "isCoreClassLike", value );
	}

	/**
	 * Checks if `value` is an instantiated Core Framework class.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.simple.IsCoreClassInstance#evaluateTarget()}.
	 *
	 * @public
	 * @param {*} value - The value to check.
	 * @returns {boolean} Returns TRUE if `value` is a Core Framework class instance; otherwise it returns FALSE.
	 */
	isCoreClassInstance( value ) {
		return this.executeCheck( "isCoreClassInstance", value );
	}

	/**
	 * Checks if a `value` an instance of `Constructor`.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.extended.IsInstanceOf#evaluateTarget()}.
	 *
	 * @static
	 * @public
	 * @param {*} value - The value to check.
	 * @param {function|string} Constructor - A constructor to test `value` against. If a string is provided then
	 * a Core Framework Class will be resolved and used for the test.
	 * @returns {boolean} Returns TRUE if `value` is an instance of `Constructor`; otherwise it returns FALSE.
	 */
	instanceOf( value, Constructor ) {
		return this.executeCheck( "isInstanceOf", value, [ Constructor ] );
	}

	/**
	 * Checks if a `value` an instance of `Constructor`.
	 *
	 * Note: This method is convenience alias for {@link Core.type.check.extended.IsInstanceOf#evaluateTarget()}.
	 *
	 * @static
	 * @public
	 * @param {*} value - The value to check.
	 * @param {function|string} Constructor - A constructor to test `value` against. If a string is provided then
	 * a Core Framework Class will be resolved and used for the test.
	 * @returns {boolean} Returns TRUE if `value` is an instance of `Constructor`; otherwise it returns FALSE.
	 */
	instanceof( value, Constructor ) {
		return this.executeCheck( "isInstanceOf", value, [ Constructor ] );
	}



	// </editor-fold>



}

module.exports = Validator;
