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

	USE_INTERNAL_CONFIG_VALUE   : Symbol( "Use Internal Config Value (this.$corefw.config)" ),
	DO_NOT_VALIDATE_TYPE        : Symbol( "Do not validate type" ),
	DO_NOT_VALIDATE_INSTANCE_OF : Symbol( "Do not validate using instanceOf" ),
	NOT_FROM_A_MIXIN            : Symbol( "Not from a mixin" ),

};



// </editor-fold>



module.exports = constants;
