/**
 * @file Defines the KmsCrypt class.
 *
 * @author Kevin Sanders <kevin@c2cschools.com>
 * @since 5.0.0
 * @license See LICENSE.md for details about licensing.
 * @copyright 2017 C2C Schools, LLC
 */

"use strict";

const BaseClass = require( "../common/BaseClass" );

/**
 * A utility class to handle encrypting and decrypting data using AWS KMS.
 *
 * @memberOf Util
 * @extends Common.BaseClass
 */
class KmsCrypt extends BaseClass {

	/**
	 * Declares this class as a singleton.
	 *
	 * @returns {boolean} TRUE if this class has been declared as a singleton.
	 *     FALSE if not.
	 */
	static $singleton() {

		return true;
	}

	/**
	 * Get or set the customer master key (CMK) id.
	 *
	 * To specify a CMK, use its key ID, Amazon Resource Name (ARN), alias name,
	 * or alias ARN. When using an alias name, prefix it with "alias/". To
	 * specify a CMK in a different AWS account, you must use the key ARN or
	 * alias ARN.
	 *
	 * @public
	 * @type {string}
	 * @default null
	 */
	get customerMasterKeyId() {

		const me = this;

		return me.getConfigValue( "customerMasterKeyId", null );
	}

	// noinspection JSUnusedGlobalSymbols
	set customerMasterKeyId( /** string */ val ) {

		const me = this;

		me.setConfigValue( "customerMasterKeyId", val );
	}

	get cmkId() {

		const me = this;

		return me.customerMasterKeyId;
	}

	set cmkId( val ) {

		const me = this;

		me.customerMasterKeyId = val;
	}

	get keyId() {

		const me = this;

		return me.customerMasterKeyId;
	}

	set keyId( val ) {

		const me = this;

		me.customerMasterKeyId = val;
	}

	get dataKey() {

		const me = this;

		return me.getConfigValue( "dataKey", null );
	}

	set dataKey( val ) {

		const me = this;

		me.setConfigValue( "dataKey", val );
	}

	// noinspection JSMethodCanBeStatic
	get iv() {

		return Buffer.from( [
			211, 10, 246, 243, 131, 33, 71, 223,
			61, 47, 71, 61, 238, 107, 92, 150,
		] );
	}

	/**
	 * The AWS region associated with the customer master key (CMK).
	 * @public
	 * @type {string}
	 * @default null
	 */
	get region() {

		const me = this;

		return me.getConfigValue( "region", null );
	}

	set region( /** string */ val ) {

		const me = this;

		me.setConfigValue( "region", val );
	}

	/**
	 * Encrypts an object into ciphertext by using a customer master key (CMK).
	 * You can encrypt up to 4 kilobytes (4096 bytes) of arbitrary data such as
	 * an RSA key, a database password, or other sensitive information.
	 *
	 * @param {Object} data - The object to encrypt.
	 * @param {?Object} [config] - Optional configuration object.
	 * @returns {Promise.<string>} The encrypted object Base64-encoded.
	 */
	encryptObject( data, config ) {

		const me = this;

		// Dependencies
		const BB	= me.$dep( "bluebird" );
		const TIPE	= me.$dep( "tipe" );

		return new BB( function ( resolve, reject ) {

			if ( TIPE( data ) !== "object" ) {

				// TODO: use specific error class

				let err = new Error(
					"The data to encrypt must be an object."
				);

				reject( err );

				return;
			}

			data = JSON.stringify( data );

			resolve( data );

		} ).then( function ( data ) {

			return me.encrypt( data, config );
		} );
	}

	/**
	 * Decrypts ciphertext. Ciphertext is an object that has been
	 * previously encrypted by using {@link Util.KmsCrypt#encryptObject}.
	 *
	 * @param {string} data - Encrypted object data, Base64-encoded.
	 * @param {?Object} [config] - Optional configuration object.
	 * @returns {Promise.<Object>} The decrypted plaintext object.
	 */
	decryptObject( data, config ) {

		const me = this;

		// Dependencies
		const BB = me.$dep( "bluebird" );

		return BB.try( function () {

			return me.decrypt( data, config );

		} ).then( function ( data ) {

			return JSON.parse( data );
		} );
	}

	/**
	 * Decrypts ciphertext and applies it as environment variables. Ciphertext
	 * is an object that has been previously encrypted by using
	 * {@link Util.KmsCrypt#encryptObject}.
	 *
	 * @param {string} data - Encrypted object data, Base64-encoded.
	 * @param {?Object} [config] - Optional configuration object.
	 * @returns {Promise.<void>} Void
	 */
	decryptAndApplyEnvObject( data, config ) {

		const me = this;

		// Dependencies
		const BB	= me.$dep( "bluebird" );
		const _		= me.$dep( "lodash" );

		return BB.try( function () {

			return me.decryptObject( data, config );

		} ).then( function ( data ) {

			_.assign( process.env, data );
		} );
	}

	/**
	 * Encrypts plaintext into ciphertext by using a customer master key (CMK).
	 * You can encrypt up to 4 kilobytes (4096 bytes) of arbitrary data such as
	 * an RSA key, a database password, or other sensitive information.
	 *
	 * @param {Buffer|string} data - The plaintext data to encrypt.
	 * @param {?Object} [config] - Optional configuration object.
	 * @returns {Promise.<string>} The encrypted plaintext data.
	 */
	encrypt( data, config ) {

		const me = this;

		// Dependencies
		const BB		= me.$dep( "bluebird" );
		// const AWS		= me.$dep( "aws-sdk" );
		const CRYPTO	= me.$dep( "crypto" );

		return new BB( function ( resolve, reject ) {

			config = config || {};

			// customer master key id

			const customerMasterKeyId =
				config.cmkId ||
				config.keyId ||
				config.customerMasterKeyId ||
				me.customerMasterKeyId;

			if ( customerMasterKeyId === null ) {

				let err = new Error(
					"Missing cmkId or keyId or customerMasterKeyId!"
				);

				reject( err );

				return;
			}

			// data key

			const dataKey = config.dataKey || me.dataKey;

			if ( dataKey === null ) {

				let err = new Error(
					"Missing dataKey!"
				);

				reject( err );

				return;
			}

			// region

			const region = config.region || me.region;

			if ( region === null ) {

				let err = new Error(
					"Missing region!"
				);

				reject( err );

				return;
			}

			// algorithm

			const algorithm = config.algorithm || "aes-256-ctr";

			// input encoding

			const inputEncoding = config.inputEncoding || "utf8";

			// output encoding

			const outputEncoding = config.outputEncoding || "base64";

			// initialization vector

			const iv = config.iv || me.iv;

			me.decryptDataKey(
				dataKey,
				{
					region: config.region,
				}
			).then( function ( decryptedDataKey ) {

				const cipher = CRYPTO.createCipheriv(
					algorithm, decryptedDataKey.buffer, iv
				);

				let crypted = cipher.update(
					data, inputEncoding, outputEncoding
				);

				crypted += cipher.final( outputEncoding );

				resolve( crypted );

			} ).catch( function ( err ) {

				reject( err );
			} );

			// const kms = new AWS.KMS( {
			// 	region: region,
			// } );
			//
			// const params = {
			// 	KeyId     : customerMasterKeyId,
			// 	Plaintext : data,
			// };
			//
			// kms.encrypt( params, function ( err, data ) {
			//
			// 	if ( err ) {
			//
			// 		reject( err );
			//
			// 	} else {
			//
			// 		resolve( data.CiphertextBlob.toString( "base64" ) );
			// 	}
			// } );
		} );
	}

	/**
	 * Decrypts ciphertext. Ciphertext is plaintext that has been previously
	 * encrypted by using {@link Util.KmsCrypt#encrypt}.
	 *
	 * @param {string} data - Encrypted plaintext data, Base64-encoded.
	 * @param {?Object} [config] - Optional configuration object.
	 * @returns {Promise.<*>} Decrypted plaintext data.
	 */
	decrypt( data, config ) {

		const me = this;

		// Dependencies
		const BB		= me.$dep( "bluebird" );
		// const AWS	= me.$dep( "aws-sdk" );
		const CRYPTO	= me.$dep( "crypto" );

		return new BB( function ( resolve, reject ) {

			config = config || {};

			// data key

			const dataKey = config.dataKey || me.dataKey;

			if ( dataKey === null ) {

				let err = new Error(
					"Missing dataKey!"
				);

				reject( err );

				return;
			}

			// region

			const region = config.region || me.region;

			if ( region === null ) {

				let err = new Error(
					"Missing region!"
				);

				reject( err );

				return;
			}

			// algorithm

			const algorithm = config.algorithm || "aes-256-ctr";

			// input encoding

			const inputEncoding = config.inputEncoding || "base64";

			// output encoding

			const outputEncoding = config.outputEncoding || "utf8";

			// initialization vector

			const iv = config.iv || me.iv;

			me.decryptDataKey(
				dataKey,
				{
					region: config.region,
				}
			).then( function ( decryptedDataKey ) {

				const decipher = CRYPTO.createDecipheriv(
					algorithm, decryptedDataKey.buffer, iv
				);

				let decrypted = decipher.update(
					data, inputEncoding, outputEncoding
				);

				decrypted += decipher.final( outputEncoding );

				resolve( decrypted );

			} ).catch( function ( err ) {

				reject( err );
			} );

			// const kms = new AWS.KMS( {
			// 	region: region,
			// } );
			//
			// const buffer = new Buffer( data, "base64" );
			//
			// const params = {
			// 	CiphertextBlob: buffer,
			// };
			//
			// kms.decrypt( params, function ( err, data ) {
			//
			// 	if ( err ) {
			//
			// 		reject( err );
			//
			// 	} else {
			//
			// 		resolve( data.Plaintext.toString( "ascii" ) );
			// 	}
			// } );
		} );
	}

	decryptAndApplyEnvConfig( config ) {

		const me = this;

		let data = config.data;

		return me.decryptAndApplyEnvObject( data, config );
	}

	generateDataKey( config ) {

		const me = this;

		// Dependencies
		const BB		= me.$dep( "bluebird" );
		const AWS		= me.$dep( "aws-sdk" );

		return new BB( function ( resolve, reject ) {

			config = config || {};

			const customerMasterKeyId =
				config.cmkId ||
				config.keyId ||
				config.customerMasterKeyId ||
				me.customerMasterKeyId;

			if ( customerMasterKeyId === null ) {

				let err = new Error(
					"Missing cmkId or keyId or customerMasterKeyId!"
				);

				reject( err );

				return;
			}

			const dataKey = config.dataKey || me.dataKey;

			if ( dataKey === null ) {

				let err = new Error(
					"Missing dataKey!"
				);

				reject( err );

				return;
			}

			const region = config.region || me.region;

			if ( region === null ) {

				let err = new Error(
					"Missing region!"
				);

				reject( err );

				return;
			}

			const keySpec = config.keySpec || "AES_256";

			const method = config.plaintext
				? "generateDataKey" : "generateDataKeyWithoutPlaintext";

			const kms = new AWS.KMS( {
				region: region,
			} );

			const params = {
				KeyId   : customerMasterKeyId,
				KeySpec : keySpec,
			};

			kms[ method ]( params, function ( err, data ) {

				if ( err ) {

					reject( err );

				} else {

					resolve( {
						keyId     : data.KeyId,
						dataKey   : data.CiphertextBlob.toString( "base64" ),
						plaintext : data.Plaintext.toString( "base64" ),
					} );
				}
			} );
		} );
	}

	decryptDataKey( dataKey, config ) {

		const me = this;

		// Dependencies
		const BB	= me.$dep( "bluebird" );
		const AWS	= me.$dep( "aws-sdk" );

		return new BB( function ( resolve, reject ) {

			config = config || {};

			const region = config.region || me.region;

			if ( region === null ) {

				let err = new Error(
					"Missing region!"
				);

				reject( err );

				return;
			}

			const kms = new AWS.KMS( {
				region: region,
			} );

			const buffer = new Buffer( dataKey, "base64" );

			const params = {
				CiphertextBlob: buffer,
			};

			kms.decrypt( params, function ( err, data ) {

				if ( err ) {

					reject( err );

				} else {

					resolve( {
						buffer : data.Plaintext,
						base64 : data.Plaintext.toString( "base64" ),
					} );
				}
			} );
		} );
	}
}

module.exports = KmsCrypt;
