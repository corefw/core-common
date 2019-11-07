/**
 * @file
 * A temp file that I'm using to do some code generation during a refactor.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";


const FS = Core.dep( "fs" );
const PATH = require( "path" );
const A = Core.dep( "a" );
const _ = Core.dep( "_" );


describe( "Check Class Code Generation", function () {

	describe.skip( "(((((((( check class generation )))))))))", function () {

		let inspector;
		let simpleChecks;

		before( function () {
			inspector = Core.inst( "Core.type.Inspector" );
			simpleChecks = inspector.simpleChecks;
		} );

		it( "should generate properly", function () {

			clearTempDir();

			simpleChecks.forEach( function( simpleCheck ) {
				//console.log( simpleCheck.name );
				doGenerate( simpleCheck );
			} );

			//console.log( simpleChecks );
			//let target = simpleChecks.get( "isArguments" );
			//


		} );

	} );

	describe.skip( "(((((((( check spec generation )))))))))", function () {

		let inspector;
		let simpleChecks;

		before( function () {
			inspector = Core.inst( "Core.type.Inspector" );
			simpleChecks = inspector.simpleChecks;
		} );

		it( "should generate properly", function () {

			clearTempDir();

			simpleChecks.forEach( function( simpleCheck ) {
				//console.log( simpleCheck.name );
				tmpBuildCheckSpec( simpleCheck );
			} );

			//console.log( simpleChecks );
			//let target = simpleChecks.get( "isNumber" );
			//tmpBuildCheckSpec( target );


		} );

	} );

} );

function doGenerate( simpleCheck ) {

	let contents = tmpBuildCheckClass( simpleCheck );

	//console.log( contents );

}

function tmpBuildCheckClass( simpleCheck ) {

	let checkName			= simpleCheck.name;
	let className			= checkName.substr( 0, 1 ).toUpperCase() + checkName.substr( 1 );

	let source 				= simpleCheck.source;
	let checksFor 			= simpleCheck.checksFor;
	let desc 				= simpleCheck.desc;
	let describePriority 	= simpleCheck.describePriority;



	// Indefinite Article for code comments
	let checksForAF = A( checksFor );
	let checksForAQ = checksForAF.replace( checksFor, "'" + checksFor + "'" );

	// Checks for LoDash source
	let isLodash;
	let lodashFunction;
	if( _.startsWith( source.toLowerCase(), "lodash" ) ) {
		isLodash = true;
		let tmp = source.split( "::" );
		lodashFunction = tmp[ 1 ].replace( /[\(\)]+/g, "" );
		//console.log( tmp );
	} else {
		isLodash = false;
	}

	// Create a description for the evaluateTarget method
	let evalDesc = desc.replace( /value/g, "`value`" );

	//console.log( simpleCheck );

	let str = "/**\n";
	str += " * @file\n";

	// INJECT className >>
	str += " * Defines the Core.type.check.simple." + className + " class.\n";
	str += " *\n";
	str += " * @author Luke Chavers <me@lukechavers.com>\n";
	str += " * @version 1.0\n";
	str += " * @copyright 2019 C2C Schools, LLC\n";
	str += " * @license MIT\n";
	str += " */\n";
	str += "\n";
	str += "\"use strict\";\n";
	str += "\n";
	str += "// Load dependencies using the Core Framework\n";
	str += "const { _ } = Core.deps( \"_\" );\n";
	str += "\n";
	str += "/**\n";

	// INJECT checksForAQ >>
	str += " * A simple check that determines if a target variable is " + checksForAQ + ".\n";
	str += " *\n";

	if( isLodash ) {
		str += " * Note: This check is a thin wrapper for the Lodash function `" + lodashFunction + "` and its `evaluateTarget` method will\n";
		str += " * behave identically to that function.\n";
		str += " *\n";
	}

	str += " * @memberOf Core.type.check.simple\n";
	str += " * @extends Core.type.check.simple.BaseSimpleCheck\n";
	str += " */\n";
	str += "class " + className + " extends Core.cls( \"Core.type.check.simple.BaseSimpleCheck\" ) {\n";
	str += "\n";
	str += "\n";
	str += "\n";
	str += "\t// <editor-fold desc=\"--- Static Properties ----------------------------------------------------------------------\">\n";
	str += "\n";
	str += "\n";
	str += "\n";

	if( describePriority < 900 ) {

		str += "\t/**\n";
		str += "\t * @inheritDoc\n";
		str += "\t */\n";
		str += "\tstatic get isDescriptive() {\n";
		str += "\t\treturn true;\n";
		str += "\t}\n";
		str += "\n";

		str += "\t/**\n";
		str += "\t * @inheritDoc\n";
		str += "\t */\n";
		str += "\tstatic get describePriority() {\n";
		str += "\t\treturn " + describePriority + ";\n";
		str += "\t}\n";
		str += "\n";

	}

	str += "\t/**\n";
	str += "\t * @inheritDoc\n";
	str += "\t */\n";
	str += "\tstatic get description() {\n";

	// INJECT desc >>
	str += "\t\treturn \"" + desc + "\";\n";
	str += "\t}\n";
	str += "\n";

	// ---- checksFor --

	str += "\t/**\n";
	str += "\t * @inheritDoc\n";
	str += "\t */\n";
	str += "\tstatic get checksFor() {\n";

	// INJECT checksFor >>
	str += "\t\treturn \"" + checksFor + "\";\n";
	str += "\t}\n";
	str += "\n";

	// ---- end of checksFor --


	if( simpleCheck.checksForA !== null ) {
		str += "\t/**\n";
		str += "\t * @inheritDoc\n";
		str += "\t */\n";
		str += "\tstatic get checksForA() {\n";
		str += "\t\treturn \"" + simpleCheck.checksForA + "\";\n";
		str += "\t}\n";
		str += "\n";
	}
	if( simpleCheck.failsFor !== null ) {
		str += "\t/**\n";
		str += "\t * @inheritDoc\n";
		str += "\t */\n";
		str += "\tstatic get failsFor() {\n";
		str += "\t\treturn \"" + simpleCheck.failsFor + "\";\n";
		str += "\t}\n";
		str += "\n";
	}
	if( simpleCheck.failsForA !== null ) {
		str += "\t/**\n";
		str += "\t * @inheritDoc\n";
		str += "\t */\n";
		str += "\tstatic get failsForA() {\n";
		str += "\t\treturn \"" + simpleCheck.failsForA + "\";\n";
		str += "\t}\n";
		str += "\n";
	}

	str += "\t/**\n";
	str += "\t * @inheritDoc\n";
	str += "\t */\n";
	str += "\tstatic get source() {\n";
	str += "\t\treturn \"" + source + "\";\n";
	str += "\t}\n";




	str += "\n";
	str += "\n";
	str += "\n";
	str += "\t// </editor-fold>\n";
	str += "\n";
	str += "\t// <editor-fold desc=\"--- Target Evaluation ----------------------------------------------------------------------\">\n";
	str += "\n";
	str += "\n";
	str += "\n";
	str += "\t/**\n";
	str += "\t * " + evalDesc + "\n";
	str += "\t *\n";
	str += "\t * @static\n";
	str += "\t * @public\n";
	str += "\t * @param {*} value - The value to check.\n";
	str += "\t * @returns {boolean} Returns TRUE if `value` is " + checksForAF.toLowerCase() + "; otherwise it returns FALSE.\n";
	str += "\t */\n";
	str += "\tstatic evaluateTarget( value ) {\n";

	if( isLodash ) {
		str += "\t\treturn _." + lodashFunction + "( value );\n";
	} else {
		str += "\t\t// todo: add this!\n";
	}

	str += "\t}\n";
	str += "\n";
	str += "\n";
	str += "\n";
	str += "\n";
	str += "\t// </editor-fold>\n";

	str += "\n";
	str += "\t// <editor-fold desc=\"--- Target Description ---------------------------------------------------------------------\">\n";
	str += "\n";
	str += "\n";
	str += "\n";
	str += "\t/**\n";
	str += "\t * @inheritDoc\n";
	str += "\t */\n";
	str += "\tstatic describeTarget( value, opts ) {\n";
	str += "\n";
	str += "\t\t// Start with a default description\n";
	str += "\t\tlet baseDescription = super.describeTarget( value, opts );\n";
	str += "\n";

	str += "\t\t// todo: finish this or remove this whole override...\n";
	str += "\t\treturn baseDescription;\n";
	str += "\n";

	/*
	str += "\t\t// We'll describe \"empty\" variables in a special way...\n";
	str += "\t\tif( value.length === 0 ) {\n";
	str += "\n";
	str += "\t\t\tif( opts.addIndefiniteArticle === true ) {\n";
	str += "\t\t\t\treturn \"an empty \" + this.checksFor;\n";
	str += "\t\t\t} else {\n";
	str += "\t\t\t\treturn \"empty \" + this.checksFor;\n";
	str += "\t\t\t}\n";
	str += "\n";
	str += "\t\t} else {\n";
	str += "\n";
	str += "\t\t\t// For non-empty variables, we'll just append a note,\n";
	str += "\t\t\t// in parenthesis, that shows the value of 'length'\n";
	str += "\t\t\treturn baseDescription + \" (length=\" + value.length + \")\";\n";
	str += "\n";
	str += "\t\t}\n";
	str += "\n";
	*/

	str += "\t}\n";
	str += "\n";
	str += "\n";
	str += "\n";
	str += "\n";
	str += "\t// </editor-fold>\n";
	str += "\n";
	str += "\n";
	str += "\n";
	str += "}\n";
	str += "\n";
	str += "module.exports = " + className + ";\n";


	/*
	console.log( "\n\n\n------------------------------------------------------------------------------------------------------------------\n\n" );
	console.log( str );
	console.log( "\n\n\n------------------------------------------------------------------------------------------------------------------\n\n" );
	*/

	writeToFile( className, str );

	return str;

}

function tmpBuildCheckSpec( simpleCheck ) {

	let checkName			= simpleCheck.name;
	let className			= checkName.substr( 0, 1 ).toUpperCase() + checkName.substr( 1 );

	let source 				= simpleCheck.source;
	let checksFor 			= simpleCheck.checksFor;
	let desc 				= simpleCheck.desc;
	let describePriority 	= simpleCheck.describePriority;



	// Indefinite Article for code comments
	let checksForAF = A( checksFor );
	let checksForAQ = checksForAF.replace( checksFor, "'" + checksFor + "'" );

	// Checks for LoDash source
	let isLodash;
	let lodashFunction;
	if( _.startsWith( source.toLowerCase(), "lodash" ) ) {
		isLodash = true;
		let tmp = source.split( "::" );
		lodashFunction = tmp[ 1 ].replace( /[\(\)]+/g, "" );
		//console.log( tmp );
	} else {
		isLodash = false;
	}

	// Create a description for the evaluateTarget method
	let evalDesc = desc.replace( /value/g, "`value`" );

	//console.log( simpleCheck );

	let str = "";
	str += "/**\n" +
		" * @file\n" +
		" * Defines tests for the Core.type.check.simple." + className + " class.\n" +
		" *\n" +
		" * @author Luke Chavers <luke@c2cschools.com>\n" +
		" * @since 6.0.0\n" +
		" * @version 1.0\n" +
		" * @copyright 2019 C2C Schools, LLC\n" +
		" * @license MIT\n" +
		" */\n" +
		"\n" +
		"\"use strict\";\n" +
		"\n" +
		"describe( \"Core.type.check.simple." + className + "\", function () {\n" +
		"\n" +
		"\tlet check;\n" +
		"\n" +
		"\tbefore( function () {\n" +
		"\n" +
		"\t\t// Get the class definition for the check class\n" +
		"\t\tcheck = Core.cls( \"Core.type.check.simple." + className + "\" );\n" +
		"\n" +
		"\t} );\n" +
		"\n" +
		"\tdescribe( \"::evaluateTarget()\", function () {\n" +
		"\n" +
		"\t\tit.skip( \"should return TRUE when passed " + checksForAF + "\", function () {\n" +
		"\n" +
		"\t\t\t// Define the test value\n" +
		"\t\t\tlet testValue = \"put-a-value-here\";\n" +
		"\n" +
		"\t\t\t// Evaluate\n" +
		"\t\t\tlet result = check.evaluateTarget( testValue );\n" +
		"\n" +
		"\t\t\t// Assert\n" +
		"\t\t\texpect( result ).to.equal( true );\n" +
		"\n" +
		"\t\t} );\n" +
		"\n" +
		"\t\tit.skip( \"should return FALSE when passed a ____\", function () {\n" +
		"\n" +
		"\t\t\t// Define the test value\n" +
		"\t\t\tlet testValue = \"put-a-value-here\";\n" +
		"\n" +
		"\t\t\t// Evaluate\n" +
		"\t\t\tlet result = check.evaluateTarget( testValue );\n" +
		"\n" +
		"\t\t\t// Assert\n" +
		"\t\t\texpect( result ).to.equal( false );\n" +
		"\n" +
		"\t\t} );\n" +
		"\n" +
		"\t} );\n" +
		"\n" +
		"\tdescribe( \"::describeTarget()\", function() {\n" +
		"\n" +
		"\t\tit.skip( \"should properly describe _____\", function () {\n" +
		"\n" +
		"\t\t\t// Define the test value\n" +
		"\t\t\tlet testValue = arguments;\n" +
		"\n" +
		"\t\t\t// Describe it\n" +
		"\t\t\tlet result = check.describeTarget( testValue );\n" +
		"\n" +
		"\t\t\t// Define our expectations\n" +
		"\t\t\tlet expectedResult = \"xxx\";\n" +
		"\n" +
		"\t\t\t// Assert\n" +
		"\t\t\texpect( result ).to.equal( expectedResult );\n" +
		"\n" +
		"\t\t} );\n" +
		"\n" +
		"\t} );\n" +
		"\n" +
		"} );\n";



	//console.log( "\n\n\n------------------------------------------------------------------------------------------------------------------\n\n" );
	//console.log( str );
	//console.log( "\n\n\n------------------------------------------------------------------------------------------------------------------\n\n" );


	writeToFile( className + ".spec", str );

	return str;

}

function clearTempDir() {

	let tempDirPath = PATH.join( __dirname, "_gen" );

	console.log( "Emptying >> " + tempDirPath );
	FS.emptyDirSync( tempDirPath );
	//console.log( tempDirPath );

}

function writeToFile( checkName, contents ) {

	let filePath = PATH.join( __dirname, "_gen", checkName + ".js" );

	//console.log( filePath );

	console.log( "Writing >> " + filePath );

	FS.writeFileSync( filePath, contents );
}
