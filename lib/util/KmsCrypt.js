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
	// get iv() {
	//
	// 	return Buffer.from( [
	// 		211, 10, 246, 243, 131, 33, 71, 223,
	// 		61, 47, 71, 61, 238, 107, 92, 150,
	// 	] );
	// }

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
	 * @param {Object} plaintextData - The object to encrypt.
	 * @param {?Object} [config] - Optional configuration object.
	 * @returns {Promise.<string>} The encrypted object Base64-encoded.
	 */
	encryptObject( plaintextData, config ) {

		const me = this;

		// Dependencies
		const BB	= me.$dep( "bluebird" );
		const TIPE	= me.$dep( "tipe" );

		return new BB( function ( resolve, reject ) {

			if ( TIPE( plaintextData ) !== "object" ) {

				// TODO: use specific error class

				let err = new Error(
					"The plaintext data to encrypt must be an object."
				);

				reject( err );

				return;
			}

			plaintextData = JSON.stringify( plaintextData );

			resolve( plaintextData );

		} ).then( function ( plaintextData ) {

			return me.encrypt( plaintextData, config );
		} );
	}

	/**
	 * Decrypts ciphertext. Ciphertext data is an object that has been
	 * previously encrypted by using {@link Util.KmsCrypt#encryptObject}.
	 *
	 * @param {string} ciphertextData - Encrypted object data, Base64-encoded.
	 * @param {?Object} [config] - Optional configuration object.
	 * @returns {Promise.<Object>} The decrypted plaintext object.
	 */
	decryptObject( ciphertextData, config ) {

		const me = this;

		// Dependencies
		const BB = me.$dep( "bluebird" );

		return BB.try( function () {

			return me.decrypt( ciphertextData, config );

		} ).then( function ( plaintextData ) {

			return JSON.parse( plaintextData );
		} );
	}

	/**
	 * Decrypts ciphertext and applies it as environment variables. Ciphertext
	 * data is an object that has been previously encrypted by using
	 * {@link Util.KmsCrypt#encryptObject}.
	 *
	 * @param {string} ciphertextData - Encrypted object data, Base64-encoded.
	 * @param {?Object} [config] - Optional configuration object.
	 * @returns {Promise.<void>} Void
	 */
	decryptAndApplyEnvObject( ciphertextData, config ) {

		const me = this;

		// Dependencies
		const BB	= me.$dep( "bluebird" );
		const _		= me.$dep( "lodash" );

		return BB.try( function () {

			return me.decryptObject( ciphertextData, config );

		} ).then( function ( plaintextData ) {

			_.assign( process.env, plaintextData );
		} );
	}

	// md5( data ) {
	//
	// 	const me = this;
	//
	// 	// Dependencies
	// 	const CRYPTO	= me.$dep( "crypto" );
	//
	// 	let hash = CRYPTO.createHash( "md5" )
	// 		.update( data )
	// 		.digest( "hex" );
	//
	// 	console.log( hash );
	//
	// 	return hash;
	// }

	/**
	 * Encrypts plaintext into ciphertext by using a customer master key (CMK).
	 * You can encrypt up to 4 kilobytes (4096 bytes) of arbitrary data such as
	 * an RSA key, a database password, or other sensitive information.
	 *
	 * @param {Buffer|string} plaintextData - The plaintext data to encrypt.
	 * @param {?Object} [config] - Optional configuration object.
	 * @returns {Promise.<string>} The encrypted plaintext data.
	 */
	encrypt( plaintextData, config ) {

		const me = this;

		// Dependencies
		const BB		= me.$dep( "bluebird" );
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

			const algorithm = config.algorithm || "aes-256-gcm";

			// input encoding

			const inputEncoding = config.inputEncoding || "utf8";

			// output encoding

			const outputEncoding = config.outputEncoding || "base64";

			// initialization vector

			// const iv = config.iv || me.iv;

			const iv = CRYPTO.randomBytes( 16 );

			me.decryptDataKey(
				dataKey,
				{
					region: config.region,
				}
			).then( function ( decryptedDataKey ) {

				const cipher = CRYPTO.createCipheriv(
					algorithm, decryptedDataKey.buffer, iv
				);

				let ciphertextData = cipher.update(
					plaintextData, inputEncoding, outputEncoding
				);

				ciphertextData += cipher.final( outputEncoding );

				let authTag = cipher.getAuthTag();

				// console.log( iv.toString( "hex" ) );
				// console.log( authTag.toString( "hex" ) );

				resolve(
					iv.toString( "hex" ) +
					authTag.toString( "hex" ) +
					ciphertextData
				);

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
	 * Decrypts ciphertext. Ciphertext data is plaintext data that has been
	 * previously encrypted by using {@link Util.KmsCrypt#encrypt}.
	 *
	 * @param {Buffer|string} ciphertextData - Encrypted plaintext data,
	 *     Base64-encoded.
	 * @param {?Object} [config] - Optional configuration object.
	 * @returns {Promise.<*>} Decrypted plaintext data.
	 */
	decrypt( ciphertextData, config ) {

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

			const algorithm = config.algorithm || "aes-256-gcm";

			// input encoding

			const inputEncoding = config.inputEncoding || "base64";

			// output encoding

			const outputEncoding = config.outputEncoding || "utf8";

			// initialization vector

			// const iv = config.iv || me.iv;

			let iv		= ciphertextData.slice( 0, 32 );
			let authTag	= ciphertextData.slice( 32, 64 );

			// console.log( iv );
			// console.log( authTag );

			iv		= Buffer.from( iv, "hex" );
			authTag	= Buffer.from( authTag, "hex" );

			ciphertextData = ciphertextData.slice( 64 );

			me.decryptDataKey(
				dataKey,
				{
					region: config.region,
				}
			).then( function ( decryptedDataKey ) {

				const decipher = CRYPTO.createDecipheriv(
					algorithm, decryptedDataKey.buffer, iv
				);

				decipher.setAuthTag( authTag );

				let plaintextData = decipher.update(
					ciphertextData, inputEncoding, outputEncoding
				);

				plaintextData += decipher.final( outputEncoding );

				resolve( plaintextData );

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

	decryptFromS3( config ) {

		const me = this;

		// Dependencies
		const BB		= me.$dep( "bluebird" );
		const AWS		= me.$dep( "aws-sdk" );
		const s3		= new AWS.S3();

		let kmsCryptConfig;

		return BB.try( function () {

			// Load KmsCrypt configuration from S3...

			let params = {
				Bucket : config.s3Bucket,
				Key    : config.configFile || "kms-crypt.config.json",
			};

			return s3.getObject( params ).promise();

		} ).then( function ( data ) {

			// Load ciphertext data from S3...

			kmsCryptConfig = JSON.parse( data.Body.toString( "utf-8" ) );

			let params = {
				Bucket : config.s3Bucket,
				Key    : config.ciphertextFile || "ciphertext",
			};

			return s3.getObject( params ).promise();

		} ).then( function ( data ) {

			// Decrypt ciphertext data...

			let ciphertextData = data.Body.toString( "utf-8" );

			return me.decrypt( ciphertextData, kmsCryptConfig );
		} );
	}

	encryptToS3( plaintextData, config ) {

		const me = this;

		// Dependencies
		const BB		= me.$dep( "bluebird" );
		const AWS		= me.$dep( "aws-sdk" );
		const s3		= new AWS.S3();

		let kmsCryptConfig;

		return BB.try( function () {

			// Load KmsCrypt configuration from S3...

			let params = {
				Bucket : config.s3Bucket,
				Key    : config.configFile || "kms-crypt.config.json",
			};

			return s3.getObject( params ).promise();

		} ).then( function ( data ) {

			kmsCryptConfig = JSON.parse( data.Body.toString( "utf-8" ) );

			// Encrypt plaintext data...

			return me.encrypt( plaintextData, kmsCryptConfig );

		} ).then( function ( ciphertextData ) {

			// Upload ciphertext data to S3...

			let params = {
				Bucket : config.s3Bucket,
				Key    : config.ciphertextFile || "ciphertext",
				Body   : ciphertextData,
			};

			return s3.putObject( params ).promise();
		} );
	}

	// decryptAndApplyEnvConfig( config ) {
	//
	// 	const me = this;
	//
	// 	let data = config.data;
	//
	// 	return me.decryptAndApplyEnvObject( data, config );
	// }

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
