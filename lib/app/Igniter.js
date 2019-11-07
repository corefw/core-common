"use strict";

// const _ = require("lodash");

/**
 * @memberOf Core.app
 */
class Igniter {

	constructor() {
		// nada
	}

	ignite( appClassName, cfg = null ) {

		// Ensure we have a cfg
		if ( cfg === null ) {

			cfg = {};

		}

		// Resolve the application class
		let AppClass = Core.cls( appClassName );

		// Spawn the application
		let app = new AppClass( cfg );

		// Execute
		app.execute();

		// Return the new app
		return app;

	}

}

module.exports = Igniter;
