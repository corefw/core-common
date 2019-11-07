/**
 * @file
 * Defines the Core.logging.output.BaseOutput class.
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
 * An abstract base class for log output classes.
 *
 * @abstract
 * @memberOf Core.logging.output
 * @extends Core.abstract.Component
 */
class BaseOutput extends Core.cls( "Core.abstract.Component" ) {

	output( logEvent ) {

	}

}

module.exports = BaseOutput;
