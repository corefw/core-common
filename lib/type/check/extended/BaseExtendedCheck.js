/**
 * @file
 * Defines the Core.type.check.extended.BaseExtendedCheck class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

// Load dependencies using the Core Framework
// const { _, TIPE } = Core.deps( "_", "tipe" );

/**
 * A base class for extended type checks (those that accept arguments)
 *
 * @abstract
 * @memberOf Core.type.check.extended
 * @extends Core.type.check.BaseCheck
 */
class BaseExtendedCheck extends Core.cls( "Core.type.check.BaseCheck" ) {

}

module.exports = BaseExtendedCheck;
