/**
 * @file
 * Provides constants that are used throughout the framework by various entities.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.1.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/**
 * Contains constants that are used throughout the framework by various entities.
 * @namespace constants
 * @memberOf Core
 */
const constants = {};



// <editor-fold desc="--- Configuration Constants --------------------------------------------------------------------">



/**
 * Contains constants related to internal class configuration.
 * @namespace config
 * @memberOf Core.constants
 */
constants.config = {

	// Indicates that a configuration setting has no value.
	NO_CONFIG_VALUE: Symbol( "No Config Value" )

};



// </editor-fold>

// <editor-fold desc="--- Validation Constants -----------------------------------------------------------------------">


/**
 * Contains constants related to validation.
 * @namespace validation
 * @memberOf Core.constants
 */
constants.validation = {

	USE_INTERNAL_CONFIG_VALUE    : Symbol( "Use Internal Config Value (this.$corefw.config)" ),
	DO_NOT_VALIDATE_TYPE         : Symbol( "Do not validate type" ),
	DO_NOT_VALIDATE_INSTANCE_OF  : Symbol( "Do not validate using instanceOf" ),
	NOT_FROM_A_MIXIN             : Symbol( "Not from a mixin" ),
	CORE_CLASS_NAME_REGEX        : /^[A-Z][A-Za-z0-9]+\.([a-z][A-Za-z0-9]+\.)*[A-Z][A-Za-z0-9]+$/,
	CORE_CLASS_NAME_SEARCH_REGEX : /[A-Z][A-Za-z0-9]+\.([a-z][A-Za-z0-9]+\.)*[A-Z][A-Za-z0-9]+/g,
	VALIDATION_WAS_NULL_BYPASSED : Symbol( "Validation skipped; the value was NULL and allowNull=true" ),
	NO_DEFAULT_VALUE             : Symbol( "No default value was specified" ),
	IS_DEFAULT_INSTRUCTION       : Symbol( "These are the default validation instructions" ),
	IS_NORMALIZED_INSTRUCTION    : Symbol( "This ValidationInstruction object has been normalized" ),

};



// </editor-fold>

// <editor-fold desc="--- Validation Constants -----------------------------------------------------------------------">


/**
 * Contains constants related to errors.
 * @namespace error
 * @memberOf Core.constants
 */
constants.error = {

	SPAWED_BY_ERROR_MANAGER: Symbol( "This error was spawned by Core.error.Manager" )

};



// </editor-fold>

// <editor-fold desc="--- Logging Constants --------------------------------------------------------------------------">


/**
 * Contains constants related to logging.
 * @namespace logging
 * @memberOf Core.constants
 */
constants.logging = {

	levels: {

		str: {
			emergency : 0,
			alert     : 1,
			critical  : 2,
			error     : 3,
			warning   : 4,
			notice    : 5,
			info      : 6,
			debug     : 7,
			trace     : 8
		}

	}

};



// </editor-fold>

module.exports = constants;
