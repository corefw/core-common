




// ---- HANDLER --------------------------------------------------------------------------------------------------------




// Instantiate a WeakMap object to store cache data.
const nsProviderCache = new WeakMap();


const Handler = {

	get: function( obj, prop ) {

		let debug = true;

		if( debug === true ) {
			try {
				console.log( ".... Handler.get( '" + prop + "' )" );
			} catch ( e ) {

				if ( prop.toString !== undefined ) {
					console.log( ".... Handler.get( " + prop.toString() + " )" );
				} else {
					console.log( ".... Handler.get( '<UNKNOWN>' )" );
				}

			}
		}

		// For properties that actually exist on our
		// target object, we'll return them verbatim.
		if( prop in obj ) {
			console.log( "........ forward prop: " + prop );
			return obj[ prop ];
		}

		// We also don't handle Symbols, so we forward those too...
		if( typeof prop === "symbol" ) {
			console.log( "........ forward symbol: " + prop.toString() );
			return obj[ prop ];
		}

		if( prop === "inspect" ) {
			console.log( "........ forward INSPECT" );
			return obj[ prop ];
		}

		console.log( "........ will virtualize: " + prop );


		// If we're here, we need to return a virtual value.
		if( prop === "$nsProviderCache" ) {

			// This special object caches namespace look-up data.
			return getNsCacheFor( obj );

		} else if( ( /^[A-Z]/ ).test( prop ) ) {

			// If the requested property starts with an upper-case
			// letter, then we need to return a class.

			console.log( "........ upper case, return class (" + prop + ")" );

		} else {

			// Otherwise, we need to return a new namespace provider.

			console.log( "........ lower case, return namespace (" + prop + ")" );

			console.log( typeof Provider );

			/*
			return new Provider( {
				parentProvider : obj,
				provideForNs   : prop
			} );
			*/

		}

	}

};

function getNsCacheFor( obj ) {

	// If the cache does not have a value
	// for our object, we'll create it.
	if( !nsProviderCache.has( obj ) ) {
		initNsCache( obj );
	}

	return nsProviderCache.get( obj );

}

function initNsCache( obj ) {

	let nueCache = {
		something: "here"
	};
	nsProviderCache.set( obj, nueCache );

}



// ---- EXPORTING ------------------------------------------------------------------------------------------------------


/*
// --

isItAFunction( ProviderSource, "Provider.js -> ProviderSource" );

// --

const ProxiedProviderSource = ProxyApplicator.apply( ProviderSource );

isItAFunction( ProxiedProviderSource, "Provider.js -> ProxiedProviderSource" );

// --

class Provider extends ProxiedProviderSource {

}

isItAFunction( Provider, "Provider.js -> Provider" );

// --

module.exports = Provider;

isItAFunction( module.exports, "Provider.js -> module.exports" );


// --
*/

const Provider = new Proxy( ProviderSource, Handler );

isItAFunction( ProviderSource, "Provider.js -> ProviderSource" );

module.exports = Provider;

isItAFunction( Provider, "Provider.js -> Provider" );

// ---- MISC -----------------------------------------------------------------------------------------------------------



function isItAFunction( target, name ) {

	const CHALK = require( "chalk" );

	let eqs = CHALK.grey( "==========" );

	console.log( "\n" );
	console.log( eqs + " " + CHALK.yellow( name ) + " " + eqs );

	if( typeof target === "function" ) {
		console.log( " ");
		console.log( CHALK.cyan( "Yes, it is a function!" ) );
		console.log( " ");
	} else {
		console.log( " ");
		console.log( CHALK.red( "No, it is not a function; it is a " + ( typeof target ) ) );
		console.log( " ");
	}

	console.log( eqs + eqs + eqs + eqs );
	console.log( "\n" );


}
