/**
 * @file
 * Defines the `Core.util.mixin.Configurable` mixin.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

// Load dependencies using the Core Framework
const { _ } = Core.deps( "_" );


/**
 * Adds various utility methods for working with configuration objects.
 *
 * @memberOf Core.util.mixin
 */
class Configurable {

	get _hasValidatingPeer() {

		if( this.$validateObject === undefined ) {
			return false;
		} else {
			return true;
		}

	}

	$parseCfg( configObject, propertyOptions ) {

		// Locals
		let me = this;

		// Ensure the `configObject` is valid.
		// (Important Note: if it's not, then we'll create a new object, which will break
		// any external code that depends on byRef modifications to `configObject`)
		if( !_.isPlainObject( configObject ) ) {
			configObject = {};
		}

		// We can exit early if `propertyOptions` is not a plain object.
		if( !_.isPlainObject( propertyOptions ) ) {
			return configObject;
		}

		// Iterate over the property options and apply each set of options.
		_.each( propertyOptions, function( propOptions, propName ) {
			me._parseOneConfigProperty( propName, propOptions, configObject );
		} );

		// Return the original config object
		return configObject;

	}

	_parseOneConfigProperty( propertyName, propertyOptions, configObject ) {

		// Locals
		let me = this;

		// First, normalize the propertyOptions by inferring whatever we can.
		propertyOptions = me._normalizePropertyOptions( propertyOptions );

		// Use the validator, if possible and applicable..
		if( _.isPlainObject( propertyOptions.validate ) ) {

			// Transfer the defaultValue to the validation config, if applicable..
			if( !_.isNil( propertyOptions.defaultValue ) ) {
				propertyOptions.validate.defaultValue = propertyOptions.defaultValue;
			}

			// Build a validateObject config
			let $voPropConfig = {};
			$voPropConfig[ propertyName ] = propertyOptions.validate;

			// Create a temporary slice to validate
			// (this prevents full-object validation on the config object, allowing
			// us to validate a single property per call to $validateObject)
			let tmpConfigSlice = {};
			tmpConfigSlice[ propertyName ] = configObject[ propertyName ];

			// Apply the validation..
			me.$validateObject( "configObject", tmpConfigSlice, $voPropConfig );

			// Copy the value back from the temporary slice to the config object
			// (this will capture any default imposed by $validateObject)
			configObject[ propertyName ] = tmpConfigSlice[ propertyName ];

		} else {

			// Otherwise, do a simple default application.
			if( configObject[ propertyName ] === undefined ) {

				// If we do not have a defaultValue, we'll use NULL
				if( propertyOptions.defaultValue === undefined ) {
					configObject[ propertyName ] = null;
				} else {
					configObject[ propertyName ] = propertyOptions.defaultValue;
				}

			}

		}

	}

	_normalizePropertyOptions( propertyOptions ) {

		// Locals
		let me = this;

		// If propertyOptions is a scalar value, we'll transform that into the default value.
		if( !_.isPlainObject( propertyOptions ) ) {
			propertyOptions = {
				defaultValue: propertyOptions
			};
		}

		// If we're missing the Validating peer mixin, we need to throw
		// an Error if a `validate` property was explicitly passed.
		if( !_.isNil( propertyOptions.validate ) && !me._hasValidatingPeer ) {
			throw new Core.error.PropertyValidationError( "Attemped to validate a configuration option property (using `Core.util.mixin.Configurable#parseCfg`) in a class that does not mix `Core.type.mixin.Validating`. Either the `Validating` mixin should be added or the `propertyOptions` passed to `#parseCfg` should not include a `validate` option." );
		}

		// If we have a default value, but no `type`, we will attempt to infer the `type`
		if( _.isNil( propertyOptions.type ) && propertyOptions.defaultValue !== undefined ) {
			propertyOptions.type = me._inferTypeFromDefaultValue( propertyOptions.defaultValue );
		}

		// Next, we'll attempt to infer the `validate` options from the type.
		if( _.isNil( propertyOptions.validate ) ) {
			propertyOptions.validate = me._inferValidationFromType( propertyOptions.type );
		}

		// Finally, if the `defaultValue` is a function, we need to call it and get the return..
		if( _.isFunction( propertyOptions.defaultValue ) ) {
			propertyOptions.defaultValue = propertyOptions.defaultValue();
		}

		return propertyOptions;

	}

	_inferTypeFromDefaultValue( defaultValue ) {

		if( _.isBoolean( defaultValue ) ) {
			return "boolean";
		} else if( _.isNumber( defaultValue ) ) {
			return "number";
		} else if( _.isString( defaultValue ) ) {
			return "string";
		} else {
			return "any";
		}

	}

	_inferValidationFromType( type ) {

		// Locals
		let me = this;

		// Always return NULL if we do not have the Validating peer.
		if( !me._hasValidatingPeer ) {
			return null;
		}

		// Otherwise, give it a go..
		switch( type ) {

			case "boolean":
				return {
					isBoolean: true
				};

			case "number":
				return {
					isNumber: true
				};

			case "string":
				return {
					isString: true
				};

			default:
				return null;

		}

	}

	$spliceCfg( configObject, propertyOptions ) {

		// Locals
		let me = this;
		let splice = {};

		// Iterate over the property options..
		_.each( propertyOptions, function( propOpts, propName ) {

			// Transfer the property to the new splice..
			splice[ propName ] = configObject[ propName ];

			// Remove the property from the original config object
			delete configObject[ propName ];

		} );

		// Now forward the new splice to $parseCfg
		return me.$parseCfg( splice, propertyOptions );

	}

}

module.exports = Configurable;
