/**
 * @file
 * Defines tests for the Core.asset.mixin.MixUtilsMixin mixin.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

describe( "Core.asset.mixin.MixUtilsMixin", function() {

	describe( ".$mixins", function() {

		describe( "(Inclusion)", function() {

			it( "should be included in all classes that inherit from Core.abstract.Component", function() {

				// We have a fixture to test this..
				let Fixture = Core.cls( "Test.fixture.asset.mixin.mixUtils.inclusion.ChildOfComponent" );

				// Instantiate it..
				let fixture = new Fixture();

				// The mixin should have provided a method..
				expect( fixture.$mixins ).to.be.an( "object" );

			} );

		} );

		describe( "(Mixin Reflection)", function() {

			describe( ".all", function() {

				it( "should return a Map of all mixins affecting the target object", function() {

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixin.mixUtils.basic.ChildClass" );

					// Fetch the mixins
					let mixins = fixture.$mixins.all;

					// Ensure that we have our known fixture mixins
					expect( mixins.has( "Test.fixture.asset.mixin.mixUtils.basic.GrandParentMixin" 		) ).to.equal( true );
					expect( mixins.has( "Test.fixture.asset.mixin.mixUtils.basic.ParentMixin" 			) ).to.equal( true );
					expect( mixins.has( "Test.fixture.asset.mixin.mixUtils.basic.SecondParentMixin" 	) ).to.equal( true );
					expect( mixins.has( "Test.fixture.asset.mixin.mixUtils.basic.ChildMixin" 			) ).to.equal( true );

				} );

				it( "should return the mixins in application order", function() {

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixin.mixUtils.basic.ChildClass" );

					// Fetch the mixins
					let mixins = fixture.$mixins.all;

					// Get the keys from the Map and cast them as an array
					// to allow easier position checking...
					let arrClassNames = [ ...mixins.keys() ];

					// We know what the last four [4] mixins should be,
					// so we'll check them in reverse order..
					expect( arrClassNames.pop() ).to.equal( "Test.fixture.asset.mixin.mixUtils.basic.ChildMixin" 		);
					expect( arrClassNames.pop() ).to.equal( "Test.fixture.asset.mixin.mixUtils.basic.SecondParentMixin" );
					expect( arrClassNames.pop() ).to.equal( "Test.fixture.asset.mixin.mixUtils.basic.ParentMixin" 		);
					expect( arrClassNames.pop() ).to.equal( "Test.fixture.asset.mixin.mixUtils.basic.GrandParentMixin" 	);

				} );

			} );

			describe( ".names", function() {

				it( "should return a Set containing the names of all mixins affecting the target object", function() {

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixin.mixUtils.basic.ChildClass" );

					// Check for our known mixins..
					let mixinClassNames = fixture.$mixins.names;
					expect( mixinClassNames.has( "Test.fixture.asset.mixin.mixUtils.basic.GrandParentMixin" 	) ).to.equal( true );
					expect( mixinClassNames.has( "Test.fixture.asset.mixin.mixUtils.basic.ParentMixin" 			) ).to.equal( true );
					expect( mixinClassNames.has( "Test.fixture.asset.mixin.mixUtils.basic.SecondParentMixin" 	) ).to.equal( true );
					expect( mixinClassNames.has( "Test.fixture.asset.mixin.mixUtils.basic.ChildMixin" 			) ).to.equal( true );

				} );

				it( "should return the mixin names in application order", function() {

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixin.mixUtils.basic.ChildClass" );

					// Cast to an array so that we can check positions..
					let arrClassNames = [ ...fixture.$mixins.names ];

					// We know what the last four [4] mixins should be,
					// so we'll check them in reverse order..
					expect( arrClassNames.pop() ).to.equal( "Test.fixture.asset.mixin.mixUtils.basic.ChildMixin" 		);
					expect( arrClassNames.pop() ).to.equal( "Test.fixture.asset.mixin.mixUtils.basic.SecondParentMixin" );
					expect( arrClassNames.pop() ).to.equal( "Test.fixture.asset.mixin.mixUtils.basic.ParentMixin" 		);
					expect( arrClassNames.pop() ).to.equal( "Test.fixture.asset.mixin.mixUtils.basic.GrandParentMixin" 	);

				} );

			} );

			describe( "#get", function() {

				describe( "( <string> )", function() {

					it( "should return the mixin prototype if the exact mixin has been applied to the target", function() {

						// Preliminaries
						let mixinToGet = "Test.fixture.asset.mixin.mixUtils.basic.SecondParentMixin";

						// We have a fixture to test this..
						let fixture = Core.inst( "Test.fixture.asset.mixin.mixUtils.basic.ChildClass" );

						// Execute
						let result = fixture.$mixins.get( mixinToGet );

						// Assert
						expect( result ).to.be.an( "object" );

						// We know our mixin has this function,
						// so let's just verify that it's there..
						expect( result.whoRanThis ).to.be.a( "function" );

					} );

					it( "should return NULL if the exact mixin has NOT been applied to the target", function() {

						// Preliminaries
						let mixinToGet = "Test.fixture.asset.mixin.mixUtils.basic.SomethingElse";

						// We have a fixture to test this..
						let fixture = Core.inst( "Test.fixture.asset.mixin.mixUtils.basic.ChildClass" );

						// Execute
						let result = fixture.$mixins.get( mixinToGet );

						// Assert
						expect( result ).to.equal( null );

					} );

				} );

				describe( "( <RegExp> )", function() {

					it( "should return the FIRST mixin prototype if any mixins with names matching the RegExp have been applied to the target", function() {

						// Preliminaries
						let regexToUseForCheck = /ParentMixin/;

						// We have a fixture to test this..
						let fixture = Core.inst( "Test.fixture.asset.mixin.mixUtils.basic.ChildClass" );

						// Execute
						let result = fixture.$mixins.get( regexToUseForCheck );

						// Assert
						expect( result ).to.be.an( "object" );

						// We know our mixin has this function,
						// so let's just verify that it's there..
						expect( result.whoRanThis ).to.be.a( "function" );

					} );


					it( "should return NULL if none of the mixins applied to the target have names matching the RegExp", function() {

						// Preliminaries
						let regexToUseForCheck = /SomethingElse/;

						// We have a fixture to test this..
						let fixture = Core.inst( "Test.fixture.asset.mixin.mixUtils.basic.ChildClass" );

						// Execute
						let result = fixture.$mixins.get( regexToUseForCheck );

						// Assert
						expect( result ).to.equal( null );

					} );

				} );

			} );

			describe( "#has", function() {

				describe( "( <string> )", function() {

					it( "should return TRUE if the exact mixin has been applied to the target", function() {

						// Preliminaries
						let mixinToCheckFor = "Test.fixture.asset.mixin.mixUtils.basic.GrandParentMixin";

						// We have a fixture to test this..
						let fixture = Core.inst( "Test.fixture.asset.mixin.mixUtils.basic.ChildClass" );

						// Execute the method and asset
						expect( fixture.$mixins.has( mixinToCheckFor ) ).to.equal( true );

					} );

					it( "should return FALSE if the exact mixin has NOT been applied to the target", function() {

						// Preliminaries
						let mixinToCheckFor = "Test.fixture.asset.mixin.mixUtils.basic.SomeOtherMixin";

						// We have a fixture to test this..
						let fixture = Core.inst( "Test.fixture.asset.mixin.mixUtils.basic.ChildClass" );

						// Execute the method and asset
						expect( fixture.$mixins.has( mixinToCheckFor ) ).to.equal( false );

					} );

				} );

				describe( "( <RegExp> )", function() {

					it( "should return TRUE if any mixins with names matching the RegExp have been applied to the target", function() {

						// Preliminaries
						let regexToUseForCheck = /GrandParentMixin/;

						// We have a fixture to test this..
						let fixture = Core.inst( "Test.fixture.asset.mixin.mixUtils.basic.ChildClass" );

						// Execute the method and asset
						expect( fixture.$mixins.has( regexToUseForCheck ) ).to.equal( true );

					} );

					it( "should return FALSE if none of the names of mixins applied to the target match the RegExp", function() {

						// Preliminaries
						let regexToUseForCheck = /SomethingElse/;

						// We have a fixture to test this..
						let fixture = Core.inst( "Test.fixture.asset.mixin.mixUtils.basic.ChildClass" );

						// Execute the method and asset
						expect( fixture.$mixins.has( regexToUseForCheck ) ).to.equal( false );

					} );

				} );

			} );

		} );

		describe( "(Method Chains)", function() {

			describe( "#getMethodChain", function() {

				it( "should return functions for all mixins that define the target method", function() {

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixin.mixUtils.basic.ChildClass" );

					// Fetch the methods
					let chainMethods = fixture.$mixins.getMethodChain( "$testChain" );

					// We should have exactly 4 methods
					expect( chainMethods.size ).to.equal( 4 );

				} );

				it( "should return functions in the order that the mixins were applied", function() {

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixin.mixUtils.basic.ChildClass" );

					// Fetch the methods
					let chainMethods = fixture.$mixins.getMethodChain( "$testChain" );

					// Execute the methods
					let results = [];
					chainMethods.forEach( function( fn ) {
						results.push( fn.apply( fixture, [] ) );
					} );

					// Assert the execution order
					expect( results[ 0 ] ).to.equal( "GrandParentMixin" 	);
					expect( results[ 1 ] ).to.equal( "ParentMixin" 			);
					expect( results[ 2 ] ).to.equal( "SecondParentMixin" 	);
					expect( results[ 3 ] ).to.equal( "ChildMixin" 			);

				} );

			} );

			describe( "#applyMethodChain", function() {

				it( "should execute the target method on all mixins that provide it", function() {

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixin.mixUtils.basic.ChildClass" );

					// Execute the methods
					let chainMethodResults = fixture.$mixins.applyMethodChain( "$testChain" );

					// We should have exactly 4 results
					expect( chainMethodResults.size ).to.equal( 4 );

				} );

				it( "should execute the target methods in the order that the mixins were applied", function() {

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixin.mixUtils.basic.ChildClass" );

					// Execute the methods
					let chainMethodResults = fixture.$mixins.applyMethodChain( "$testChain" );

					// Convert the results to an array, for easier order checking...
					let arrMethodResults = [];
					chainMethodResults.forEach( function( returnVal, mixinName ) {
						arrMethodResults.push( {
							value     : returnVal,
							mixinName : mixinName
						} );
					} );

					// Assert the execution order
					expect( arrMethodResults[ 0 ].mixinName ).to.equal( "Test.fixture.asset.mixin.mixUtils.basic.GrandParentMixin" 	);
					expect( arrMethodResults[ 0 ].value 	).to.equal( "GrandParentMixin" 											);
					expect( arrMethodResults[ 1 ].mixinName ).to.equal( "Test.fixture.asset.mixin.mixUtils.basic.ParentMixin" 		);
					expect( arrMethodResults[ 1 ].value 	).to.equal( "ParentMixin" 												);
					expect( arrMethodResults[ 2 ].mixinName ).to.equal( "Test.fixture.asset.mixin.mixUtils.basic.SecondParentMixin" );
					expect( arrMethodResults[ 2 ].value 	).to.equal( "SecondParentMixin" 										);
					expect( arrMethodResults[ 3 ].mixinName ).to.equal( "Test.fixture.asset.mixin.mixUtils.basic.ChildMixin" 		);
					expect( arrMethodResults[ 3 ].value 	).to.equal( "ChildMixin" 												);

				} );

			} );

		} );

	} );


} );
