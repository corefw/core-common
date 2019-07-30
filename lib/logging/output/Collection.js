/**
 * @file
 * Defines the Core.logging.output.Collection class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

/**
 * Stores a collection of zero or more Core.logging.output.BaseOutput instances.
 *
 * @memberOf Core.logging.output
 * @extends Core.collection.BaseCollection
 */
class Collection extends Core.cls( "Core.collection.BaseCollection" ) {

	$construct() {

		// Default the validation config to require
		// Core.logging.output.BaseOutput instances.
		return {
			validationConfig: {
				instanceOf: "Core.logging.output.BaseOutput"
			}
		};

	}

}

module.exports = Collection;
