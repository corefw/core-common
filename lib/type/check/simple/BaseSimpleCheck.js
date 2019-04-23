/**
 * @file
 * Defines the Core.type.check.simple.BaseSimpleCheck class.
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
 * A base class for "simple" type checks (those that do not accept any parameters)
 *
 * @abstract
 * @memberOf Core.type.check.simple
 * @extends Core.type.check.BaseCheck
 */
class BaseSimpleCheck extends Core.cls( "Core.type.check.BaseCheck" ) {

	static evaluateTargetX( value ) {
		// todo:
	}

}

module.exports = BaseSimpleCheck;
