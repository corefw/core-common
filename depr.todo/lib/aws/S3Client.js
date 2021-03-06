/**
 * @file Defines the S3Client class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.2
 * @license See LICENSE.md for details about licensing.
 * @copyright 2019 C2C Schools, LLC
 */

"use strict";

// Important Note
// --------------
// This module only loads a single dependency, directly, which is the
// parent class for the class defined within. This is intended to force
// dependency loading through the parent class, by way of the `$dep()`
// method, in order to centralize dependency definition and loading.

const ParentClass = require( "./BaseClientWrapper" );

/**
 * Something...
 *
 * @abstract
 * @memberOf Aws
 * @extends Aws.BaseClientWrapper
 */
class S3Client extends ParentClass {

	// <editor-fold desc="--- Construction and Initialization ----------------">

	/**
	 * @inheritDoc
	 */
	_initialize( cfg ) {

		// Call parent
		super._initialize( cfg );

	}

	// </editor-fold>

	// <editor-fold desc="--- Logging ----------------------------------------">

	/**
	 * @inheritDoc
	 */
	get logger() {

		const me = this;

		if ( me._logger === undefined ) {

			let parentLogger	= super.logger;

			me._logger = parentLogger.fork( {
				component  : "S3Client",
				namePrefix : "config",
			} );

		}

		return me._logger;

	}

	/**
	 * @inheritDoc
	 */
	set logger( val ) {

		super.logger = val;

	}

	// </editor-fold>

	// <editor-fold desc="--- Config Properties ----------------------------------------------------------------------">

	/**
	 * The AWS bucket that content should be deployed to.
	 *
	 * @access public
	 * @default null
	 * @type {*}
	 */
	get bucket() {

		return this.getConfigValue( "bucket", null );

	}

	set bucket( val ) {

		this.setConfigValue( "bucket", val );

	}

	/**
	 * The AWS region in which the target S3 bucket resides.
	 *
	 * @access public
	 * @default "us-east-1"
	 * @type {string}
	 */
	get awsRegion() {

		return this.getConfigValue( "awsRegion", "us-east-1" );

	}

	set awsRegion( val ) {

		this.setConfigValue( "awsRegion", val );

	}

	// </editor-fold>

	// <editor-fold desc="--- Other Properties -----------------------------------------------------------------------">

	/**
	 * The S3 client that is provided by the AWS SDK.
	 *
	 * @access public
	 * @type {AWS.S3}
	 */
	get s3() {

		// Locals
		let me = this;

		if ( me._s3client === undefined ) {

			// Dependencies
			let AWS = me.$dep( "aws" );

			// Init S3 client
			me._s3client = new AWS.S3(
				{
					apiVersion : "2006-03-01",
					region     : me.awsRegion,
				}
			);

		}

		return me._s3client;

	}

	// </editor-fold>

	// <editor-fold desc="--- Direct Wrapper Methods -----------------------------------------------------------------">

	/**
	 * This method wraps the AWS SDK's S3 client method "getObject" to make its usage more succinct
	 * and to including framework components/logic, such as logging. When called, this method will
	 * download a file from S3 and will return a promise that is resolved with the file contents.
	 *
	 * @private
	 * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getObject-property
	 * @param {string} bucket - The bucket containing the target file/object.
	 * @param {string} remoteAbsPath - The absolute, remote, path of the file/object (a.k.a "[the] key").
	 * @returns {Promise<Buffer|null>} The contents of the downloaded file, as a Buffer object, or NULL if the file
	 * could not be retrieved.
	 */
	_getObject( bucket, remoteAbsPath ) {

		// Locals
		let me = this;

		// Configure S3 Operation Params
		let params = {
			Bucket : bucket,
			Key    : remoteAbsPath,
		};

		// Tell someone
		me.$log( "debug", "get-object.start", "... Downloading 's3://" + bucket + "/" + remoteAbsPath + "' ..." );

		// Defer to S3 SDK
		return me.s3.getObject( params ).promise().then(

			function afterS3DirList( results ) {

				// Tell someone
				me.$log( "debug", "get-object.finish", "... Download of 's3://" + bucket + "/" + remoteAbsPath + "' completed successfully!" );

				// Return the file contents
				return results.Body;

			}

		).catch(

			function onS3GetError() {

				// Tell someone
				me.$log( "warning", "get-object.not-found", "Download of 's3://" + bucket + "/" + remoteAbsPath + "' failed, file not found!" );

				// Return NULL so that subsequent logic
				// can gracefully handle the failure.
				return null;

			}

		);

	}

	// </editor-fold>

	// <editor-fold desc="--- READ Methods ---------------------------------------------------------------------------">

	/**
	 * Downloads a file from S3.
	 *
	 * @public
	 * @param {string} remoteAbsPath - The absolute, remote, path of the file/object (a.k.a "[the] key").
	 * @returns {Promise<Buffer|null>} The contents of the downloaded file, as a Buffer object, or NULL if the file
	 * could not be retrieved.
	 */
	getObject( remoteAbsPath ) {

		// Locals
		let me = this;

		// Defer to the _getObject method
		return me._getObject( me.bucket, remoteAbsPath );

	}

	/**
	 * Downloads a remote S3 object and converts it to a UTF-8 string.
	 *
	 * @public
	 * @param {string} remoteAbsPath - The absolute, remote, path of the YAML file/object (a.k.a "[the] key").
	 * @returns {Promise<string|null>} The contents of the downloaded file, as a string, or NULL if the file
	 * could not be retrieved.
	 */
	getObjectAsString( remoteAbsPath ) {

		// Locals
		let me = this;

		// First, download the YAML file
		return me.getObject( remoteAbsPath ).then(

			function afterFileDownload( buf ) {

				if ( buf === null ) {

					return null;

				}

				return buf.toString( "utf8" );

			}

		);

	}

	/**
	 * Downloads a YAML file from S3 and converts it to an object.
	 *
	 * @public
	 * @throws Error if the file cannot be read or parsed.
	 * @param {string} remoteAbsPath - The absolute, remote, path of the YAML file/object (a.k.a "[the] key").
	 * @returns {Promise<Buffer|null>} The contents of the downloaded file, as an object, or NULL if the file
	 * could not be retrieved.
	 */
	getYamlObject( remoteAbsPath ) {

		// Locals
		let me = this;

		// Dependencies
		const YAML	= me.$dep( "js-yaml" );

		// First, download the YAML file
		return me.getObjectAsString( remoteAbsPath ).then(

			function afterFileDownload( str ) {

				if ( str === null ) {

					return me.$throw( "get-yaml-object.error.download", "Failed to download the YAML object from AWS S3, the file may not exist at the specified location or you may not have permissions to read it." );

				}

				try {

					return YAML.safeLoad( str );

				} catch ( err ) {

					return me.$throw( "get-yaml-object.error.parse", err, "Failed to parse the remote YAML file" );

				}

			}

		);

	}

	// </editor-fold>

	// <editor-fold desc="--- Deployment Methods ---------------------------------------------------------------------">

	/**
	 * A direct, public, interface for the private `_deployOneFile()` method.
	 *
	 * @todo This method needs to be reviewed and tweaked before use!
	 * @public
	 * @param {string} localRelPath - The path of the source file, relative to the "Service Root".
	 * @param {string} remoteRelPath - The path of the file's destination, relative to the "Deployment Root"
	 * @returns {Promise<AWS.Request>} Handle to the operation request.
	 */
	_todoNeedsReviewDeployFile( localRelPath, remoteRelPath ) {

		return this._deployOneFile( localRelPath, remoteRelPath );

	}

	/**
	 * Deploys multiple files to the remote.
	 *
	 * @todo This method needs to be reviewed and tweaked before use!
	 * @public
	 * @param {Object[]} filesToDeploy - The relative local and remote paths for the files to be deployed.
	 * @returns {Promise<AWS.Request>} Handle to the operation request.
	 */
	_todoNeedsReviewDeployFiles( filesToDeploy ) {

		// Locals
		let me = this;

		// Dependencies
		const BB = me.$dep( "bluebird" );

		// Execute each..
		return BB.map( filesToDeploy, function ( item ) {

			return me._deployOneFile( item.localRelPath, item.remoteRelPath );

		} );

	}

	/**
	 * Deploys a single file to the remote host.
	 *
	 * @todo This method needs to be reviewed and tweaked before use!
	 * @private
	 * @param {string} localRelPath - The path of the source file, relative to the "Service Root".
	 * @param {string} remoteRelPath - The path of the file's destination, relative to the "Deployment Root".
	 * @returns {Promise<AWS.Request>} Handle to the operation request.
	 */
	_todoNeedsReviewDeployOneFile( localRelPath, remoteRelPath ) {

		// Locals
		let me = this;

		// Dependencies
		const FS = me.$dep( "fs" );

		// Resolve path(s)
		let localAbsPath = me.resolveLocalAbs( localRelPath );

		// Tell someone...
		me.$log( "info", "deploy.file", "Deploying '" + localAbsPath + "' to '/" + remoteRelPath + "' ..." );

		// Read the file
		return FS.readFileAsync( localAbsPath ).then(

			function ( data ) {

				return me._putObject( remoteRelPath, data );

			}
		);

	}

	/**
	 * Deploys a JavaScript object to the remote host, in JSON format.
	 *
	 * @todo This method needs to be reviewed and tweaked before use!
	 * @public
	 * @param {string} remoteRelPath - The path of the file's destination, relative to the "Deployment Root"
	 * @param {Object} obj - The object to deploy.
	 * @returns {Promise<AWS.Request>} Handle to the operation request.
	 */
	_todoNeedsReviewPutObjectAsJson( remoteRelPath, obj ) {

		// Locals
		let me = this;

		// Convert to JSON
		let json = me._convertObjectToJson( obj );

		// Upload it
		return me._putObject( remoteRelPath, json );

	}

	/**
	 * Deploys a JavaScript object to the remote host, in YAML format.
	 *
	 * @todo This method needs to be reviewed and tweaked before use!
	 * @public
	 * @param {string} remoteRelPath - The path of the file's destination, relative to the "Deployment Root"
	 * @param {Object} obj - The object to deploy.
	 * @returns {Promise<AWS.Request>} Handle to the operation request.
	 */
	_todoNeedsReviewPutObjectAsYaml( remoteRelPath, obj ) {

		// Locals
		let me = this;

		// Convert to YAML
		let yaml = me._convertObjectToYaml( obj );

		// Upload it
		return me._putObject( remoteRelPath, yaml );

	}

	/**
	 * Resolves a remote, absolute, path when provided a path that is relative to the "Deployment Root".
	 *
	 * @todo This method needs to be reviewed and tweaked before use!
	 * @public
	 * @param {string} relRemotePath - A remote path, relative to the "Deployment Root".
	 * @returns {string} Remote absolute path.
	 */
	_todoNeedsReviewResolveRemoteAbs( relRemotePath ) {

		// Locals
		let me = this;

		// Dependencies
		const PATH	= me.$dep( "path" );
		const _		= me.$dep( "lodash" );

		// Resolve
		let resolved = PATH.join( me.rootPath, relRemotePath );

		// Trim leading '/'
		if ( _.startsWith( resolved, "/" ) ) {

			resolved = resolved.substr( 1 );

		}

		// Done
		return resolved;

	}

	/**
	 * Resolves a remote, absolute, path when provided a path that is relative to the "Deployment Root".
	 * This method is similar to the `resolveRemoteAbs()` method except that the string returned by this method
	 * will include the "S3://" protocol handler and the name of the destination bucket.
	 *
	 * @todo This method needs to be reviewed and tweaked before use!
	 * @public
	 * @param {string} relRemotePath - A remote path, relative to the "Deployment Root".
	 * @returns {string} Full remote absolute path.
	 */
	_todoNeedsReviewResolveRemoteAbsFull( relRemotePath ) {

		// Locals
		let me = this;

		// Get Abs Path
		let abs = me.resolveRemoteAbs( relRemotePath );

		// Append with protocol and bucket name
		return "s3://" + me.bucket + "/" + abs;

	}

	/**
	 * Deletes all S3 objects, within the deployment bucket, whose 'Keys' (paths) are prefixed with the
	 * provided `relRemotePath` string.
	 *
	 * @todo This method needs to be reviewed and tweaked before use!
	 * @public
	 * @param {string} relRemotePath - A remote path, relative to the "Deployment Root".
	 * @returns {Promise<void>} Void.
	 */
	_todoNeedsReviewDeleteRemotePath( relRemotePath ) {

		// Locals
		let me = this;
		let remoteAbsPath = this.resolveRemoteAbs( relRemotePath );

		// Tell someone...
		me.$log( "info", "prepare.delete.start", "... Deleting objects with path: '" + remoteAbsPath + "'" );

		// Defer to the private method
		return this._deleteRemoteAbsPath( remoteAbsPath ).then(

			function afterDeleteOperation() {

				me.$log( "info", "prepare.delete.end", "... All objects at path were removed: '" + remoteAbsPath + "'" );

			}
		);

	}

	/**
	 * Deletes all S3 objects, within the deployment bucket, whose 'Keys' (paths) are prefixed with the
	 * provided `remoteAbsPath` string.
	 *
	 * @todo This method needs to be reviewed and tweaked before use!
	 * @private
	 * @param {string} remoteAbsPath - An absolute remote path.
	 * @returns {Promise<boolean>} TRUE once all objects have been deleted.
	 */
	_todoNeedsReviewDeleteRemoteAbsPath( remoteAbsPath ) {

		// Locals
		let me = this;

		// Tell someone...
		me.$log( "info", "prepare.delete.batch", "... Deleting one batch" );

		// First, we need to get a list of objects...
		return me._getObjectsAtPath( remoteAbsPath ).then(

			function afterListObjects( remoteKeys ) {

				// Nothing to delete...
				if ( remoteKeys.length === 0 ) {

					return true;

				}

				// Things to delete..
				return me._deleteObjects( remoteKeys ).then(

					function afterBatchDelete() {

						// Because the AWS SDK methods for listing and deleting are limited to 1,000
						// objects, we will need to run _another_ delete operation if there are more
						// than 1,000 objects that need to be removed. We'll assume that if the
						// `listObjects` operation returned exactly 1,000 results, then there are
						// probably more objects that need to be deleted...
						if ( remoteKeys.length === 1000 ) {

							return me._deleteRemoteAbsPath( remoteAbsPath );

						}

						return true;

					}
				);

			}

		).catch(

			function onS3DeleteError( err ) {

				me.$throw( "s3.deleteobjects.error", err, "S3 DeleteObjects Failed" );

			}
		);

	}

	// </editor-fold>

	// <editor-fold desc="--- S3 Wrapper Methods ---------------------------------------------------------------------">

	/**
	 * Wrapper for the AWS SDK method 'putObject'.  This method will upload a single object/file to S3.
	 *
	 * @todo This method needs to be reviewed and tweaked before use!
	 * @private
	 * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
	 * @param {string} remoteRelPath - The path, relative to the 'Deployment Root', that the file will be uploaded to.
	 * @param {string|ReadableStream|Buffer} body - The contents of the file being uploaded.
	 * @returns {Promise<AWS.Request>} Handle to the operation request.
	 */
	_todoNeedsReviewPutObject( remoteRelPath, body ) {

		// Locals
		let me = this;
		let remoteAbsPath = me.resolveRemoteAbs( remoteRelPath );
		let remoteAbsFull = me.resolveRemoteAbsFull( remoteRelPath );

		// Configure S3 Operation Params
		let params = {
			Bucket : me.bucket,
			Key    : remoteAbsPath,
			Body   : body,
		};

		// Tell someone...
		me.$log( "info", "deploy.put", "... Putting '" + remoteAbsFull + "' (" + body.length + " bytes)" );

		// Defer to S3 SDK
		return me.s3.putObject( params ).promise().then(

			function afterS3Put( results ) {

				me.$log( "info", "deploy.put", "... Upload of '" + remoteAbsFull + "' completed!" );

				return results;

			}

		).catch(

			function onS3PutError( err ) {

				me.$throw( "s3.putobject.error", err, "S3 PutObject Failed" );

			}
		);

	}

	/**
	 * Wrapper for the AWS SDK method 'deleteObjects'.  This method will delete one or more objects located in the
	 * deploy target's S3 bucket based on a provided array of object keys (paths).
	 *
	 * Important: Just like `AWS.S3.deleteObjects`, this method will delete a maximum of 1,000 results.
	 *
	 * @todo This method needs to be reviewed and tweaked before use!
	 * @private
	 * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObjects-property
	 * @param {string[]} remoteKeys - The keys of one or more remote S3 objects.
	 * @returns {Promise<AWS.Request>} Handle to the operation request.
	 */
	_todoNeedsReviewDeleteObjects( remoteKeys ) {

		// Locals
		let me = this;

		// Dependencies
		const _ = me.$dep( "lodash" );

		// Parse the provided array and convert them into
		// objects that are compatible with the AWS S3 SDK..
		let s3ObjectDescriptions = [];

		_.each( remoteKeys, function ( remoteKey ) {

			s3ObjectDescriptions.push( {
				Key: remoteKey,
			} );

		} );

		// Configure S3 Operation Params
		let params = {
			Bucket : me.bucket,
			Delete : {
				Objects: s3ObjectDescriptions,
			},
		};

		// Defer to S3 SDK
		return me.s3.deleteObjects( params ).promise().catch(

			function onS3DeleteError( err ) {

				me.$throw( "s3.deleteobjects.error", err, "S3 DeleteObjects Failed" );

			}
		);

	}

	/**
	 * Wrapper for the AWS SDK method 'listObjectsV2'.  This method will list all of the objects whose
	 * 'Key' is prefixed with `remoteAbsPath` (making this, effectively, a recursive directory search).
	 *
	 * Important: Just like `AWS.S3.listObjectsV2`, this method will return a maximum of 1,000 results.
	 *
	 * @todo This method needs to be reviewed and tweaked before use!
	 * @private
	 * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listObjectsV2-property
	 * @param {string} remoteAbsPath - The absolute, remote, path (key prefix) to search for S3 objects.
	 * @returns {Promise<Array>} S3 Object list.
	 */
	_todoNeedsReviewGetObjectsAtPath( remoteAbsPath ) {

		// Locals
		let me = this;

		// Dependencies
		const _ = me.$dep( "lodash" );

		// Configure S3 Operation Params
		let params = {
			Bucket  : me.bucket,
			Prefix  : remoteAbsPath,
			MaxKeys : 1000,
		};

		// Defer to S3 SDK
		return me.s3.listObjectsV2( params ).promise().then(

			function afterS3List( results ) {

				// We're only interested in the path ('Key') of
				// each matching object, so we'll reduce our results
				// down to that...

				let final = [];

				// Iterate over each raw result
				_.each( results.Contents, function ( object ) {

					// .. and capture the key
					final.push( object.Key );

				} );

				// All Done...
				return final;

			}

		).catch(

			function onS3ListError( err ) {

				me.$throw( "s3.listobjects.error", err, "S3 ListObjectsV2 Failed" );

			}
		);

	}

	// </editor-fold>

	// <editor-fold desc="--- AWS S3 Wrappers ------------------------------------------------------------------------">

	/**
	 * Wrapper for the AWS SDK method 'listObjectsV2'.  This method will list all of the objects whose
	 * 'Key' is prefixed with `remoteAbsPath`.
	 *
	 * Important: Just like `AWS.S3.listObjectsV2`, this method will return a maximum of 1,000 results.
	 *
	 * @todo This method needs to be reviewed and tweaked before use!
	 * @private
	 * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listObjectsV2-property
	 * @param {string} bucket - The bucket to search for objects.
	 * @param {string} remoteAbsPath - The absolute, remote, path (key prefix) to search for S3 objects.
	 * @returns {Promise<Array>} A Promise resolved with an array list of subdirectories beneath the provided path.
	 */
	_todoNeedsReviewGetSubdirectories( bucket, remoteAbsPath ) {

		// Locals
		let me = this;

		// Dependencies
		const _ = me.$dep( "lodash" );

		// Configure S3 Operation Params
		let params = {
			Bucket    : bucket,
			Prefix    : remoteAbsPath,
			MaxKeys   : 1000,
			Delimiter : "/",
		};

		// Defer to S3 SDK
		return me.s3.listObjectsV2( params ).promise().then(

			function afterS3DirList( results ) {

				let final = [];

				// Iterate over each subdirectory result
				_.each( results.CommonPrefixes, function ( object ) {

					// Remove the parent directory
					let relativePath = object.Prefix.replace( remoteAbsPath, "" );

					// Remove trailing slashes
					if ( _.endsWith( relativePath, "/" ) ) {

						relativePath = relativePath.substr( 0, relativePath.length - 1 );

					}

					// .. and capture the key
					final.push( relativePath );

				} );

				// All Done...
				return final;

			}

		).catch(

			function onS3ListError( err ) {

				me.$throw( "s3.listobjects.error", err, "S3 ListObjectsV2 Failed" );

			}

		);

	}

	// </editor-fold>

}

module.exports = S3Client;
