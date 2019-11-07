/**
 * @file
 * Defines tests for the Core.asset.Mixer class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

describe( "Core.asset.Mixer", function() {

	describe( "#mix()", function() {

		describe( "(Basic Mixin Logic)", function() {

			it( "should apply methods from mixins to classes", function() {

				// We have a fixture to test this..
				let Fixture = Core.cls( "Test.fixture.asset.mixer.basic.ChildClass" );

				// Instantiate it..
				let fixture = new Fixture();

				// The mixin should have provided a method..
				expect( fixture.aSimpleMethod() ).to.equal( "it works!" );

			} );

			it( "should apply getters from mixins to classes", function() {

				// We have a fixture to test this..
				let Fixture = Core.cls( "Test.fixture.asset.mixer.basic.ChildClass" );

				// Instantiate it..
				let fixture = new Fixture();

				// The mixin should have provided a property getter..
				expect( fixture.aSimpleProperty ).to.equal( "it works!" );

			} );

		} );

		describe( "(Precedence)", function() {

			it( "should NOT override child members with mixin members", function() {

				// Note: It would actually be very difficult to make it so that
				// mixins could overwrite the child class members because, under the hood,
				// child classes are extending a MixedResult class that already has
				// the mixin applied.  So, the built-in JS logic for extending
				// will automatically override the mixin.

				// We have a fixture to test this..
				let Fixture = Core.cls( "Test.fixture.asset.mixer.basic.ChildClass" );

				// Instantiate it..
				let fixture = new Fixture();

				// The mixin provides the same method as the child class, and
				// the child class should win; the mixin method should be overridden.
				expect( fixture.aFinalChildMethod() ).to.equal( "ChildClass" );

			} );

			it( "should override PARENT class members with mixin members", function() {

				// We have a fixture to test this..
				let Fixture = Core.cls( "Test.fixture.asset.mixer.basic.ChildClass" );

				// Instantiate it..
				let fixture = new Fixture();

				// The mixin provides the same method as a parent class, and
				// the mixin should win; the parent class method should be overridden.
				expect( fixture.aFinalMixinMethod() ).to.equal( "Mixin" );

			} );

		} );

		describe( "(The `super` keyword)", function() {

			it( "should allow children to access overridden mixin methods with 'super'", function() {

				// We have a fixture to test this..
				let Fixture = Core.cls( "Test.fixture.asset.mixer.basic.ChildClass" );

				// Instantiate it..
				let fixture = new Fixture();

				// The mixin overrides 'aTestOfChildSuper()' on the parent class and
				// the child class overrides the override provided by the mixin.
				// In that case, calling the method should invoke the method defined
				// by the child, but the child should be able to access the
				// method provided by the mixin using the `super.` keyword.
				expect( fixture.aTestOfChildSuper() ).to.equal( "Mixin" );

			} );

		} );

		describe( "(Class/Object Identity)", function() {

			it( "should not affect internal $amClassName resolution", function() {

				// We have a fixture to test this..
				let Fixture = Core.cls( "Test.fixture.asset.mixer.basic.ChildClass" );

				// Instantiate it..
				let fixture = new Fixture();

				// Ensure that $amClassName is properly set..
				expect( fixture.$amClassName ).to.equal( "Test.fixture.asset.mixer.basic.ChildClass" );

			} );

		} );

		describe( "(Reserved Methods)", function() {

			// Note: its not-so-easy to test $construct, because it will exist on the
			// class, even if the mixin does not provide it. It'll be fine :)

			let reservedMethodNames = new Set(
				[
					"$beforeMixin", "$mixin", "$afterMixin", "$beforeConstruct",
					"$afterConstruct", "$beforeReady", "$afterReady"
				]
			);

			reservedMethodNames.forEach( ( reservedName ) => {

				it( "should not copy or mix instances of the special, mixin, method: '" + reservedName + "'", function() {

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixer.reserved.SomeClass" );

					// Test our control method
					expect( fixture.notReserved ).to.be.a( "function" );

					// Ensure that the special/reserved method was not mixed.
					expect( fixture[ reservedName ] ).to.be.an( "undefined" );

				} );

			} );



		} );

		describe( "(Special Mixin Method: $beforeMixin)", function() {

			it( "should execute $beforeMixin methods on all mixins that provide one", function() {

				// We have a fixture to test this..
				let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

				// Capture the $beforeMixin() call tracker data from the helper mixin.
				// (`Core.debug.mixin.CallTrackerMixin`)
				let data = fixture.callTrackerData.$beforeMixin;

				// Ensure that all of our mixins participated
				expect( data.didParticipate.ParentMixin 		).to.equal( "ParentMixin" 		);
				expect( data.didParticipate.SecondParentMixin 	).to.equal( "SecondParentMixin" );
				expect( data.didParticipate.ChildMixin 			).to.equal( "ChildMixin" 		);

				// Note: GrandParentMixin is intentionally excluded in this test; see the
				// note in the GrandParentMixin fixture definition's $beforeMixin method
				// for more information.

			} );

			it( "should execute $beforeMixin methods in the order that the mixins were applied", function() {

				// We have a fixture to test this..
				let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

				// Capture the $beforeMixin() call tracker data from the helper mixin.
				// (`Core.debug.mixin.CallTrackerMixin`)
				let data = fixture.callTrackerData.$beforeMixin;

				// Ensure that all of our mixins participated
				expect( data.participationOrder[ 0 ]	).to.equal( "ParentMixin" 		);
				expect( data.participationOrder[ 1 ] 	).to.equal( "SecondParentMixin" );
				expect( data.participationOrder[ 2 ]	).to.equal( "ChildMixin" 		);

				// Note: GrandParentMixin is intentionally excluded in this test; see the
				// note in the GrandParentMixin fixture definition's $beforeMixin method
				// for more information.

			} );

			it( "should execute $beforeMixin with the scope set to MixedResult.prototype", function() {

				// We have a fixture to test this..
				let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

				// Resolve the `this` reference from one of the calls..
				let thisRef = fixture.callTrackerData.$beforeMixin.thisRefs.ChildMixin;

				// Assert that `this` was an object, which would indicate that it is
				// a prototype, and not a constructor.
				expect( thisRef ).to.be.an( "object" );

				// The mixer always names mixed classes as 'MixedResult'
				expect( thisRef.constructor.name ).to.equal( "MixedResult" );

			} );

			describe( "(Invocation Arguments)", function() {

				it( "should pass the base class' name as a config property (opts.baseClassName) when invoking $beforeMixin", function() {

					// Preliminaries
					let targetMixinName       = "ChildMixin";
					let configPropertyToCheck = "baseClassName";

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

					// Get the config object
					let passedConfig = fixture.callTrackerData.$beforeMixin.argsPassed[ targetMixinName ][ 0 ];
					let passedValue  = passedConfig[ configPropertyToCheck ];

					// Assert
					expect( passedValue ).to.be.a( "string" );
					expect( passedValue ).to.equal( "Test.fixture.asset.mixer.onMixin.ParentClass" );

				} );

				it( "should pass the base class' constructor as a config property (opts.baseClass) when invoking $beforeMixin", function() {

					// Preliminaries
					let targetMixinName       = "ChildMixin";
					let configPropertyToCheck = "baseClass";

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

					// Get the config object
					let passedConfig = fixture.callTrackerData.$beforeMixin.argsPassed[ targetMixinName ][ 0 ];
					let passedValue  = passedConfig[ configPropertyToCheck ];

					// Assert
					expect( passedValue ).to.be.a( "function" );
					expect( passedValue.name ).to.equal( "ParentClass" );

				} );

				it( "should pass the base class' prototype as a config property (opts.baseProto) when invoking $beforeMixin", function() {

					// Preliminaries
					let targetMixinName       = "ChildMixin";
					let configPropertyToCheck = "baseProto";

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

					// Get the config object
					let passedConfig = fixture.callTrackerData.$beforeMixin.argsPassed[ targetMixinName ][ 0 ];
					let passedValue  = passedConfig[ configPropertyToCheck ];

					// Assert
					expect( passedValue ).to.be.an( "object" );
					expect( passedValue.constructor.name ).to.equal( "ParentClass" );

				} );

				it( "should pass a Map of the mixins being applied as a config property (opts.mixins) when invoking $beforeMixin", function() {

					// Preliminaries
					let targetMixinName       = "ChildMixin";
					let configPropertyToCheck = "mixins";

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

					// Get the config object
					let passedConfig = fixture.callTrackerData.$beforeMixin.argsPassed[ targetMixinName ][ 0 ];
					let passedValue  = passedConfig[ configPropertyToCheck ];

					// Assert
					expect( passedValue ).to.be.a( "map" );
					expect( passedValue.size ).to.equal( 1 );
					expect( passedValue.has( "Test.fixture.asset.mixer.onMixin.ChildMixin" ) ).to.equal( true );

				} );

				it( "should pass the MixedResult's constructor as a config property (opts.mixedResult) when invoking $beforeMixin", function() {

					// Preliminaries
					let targetMixinName       = "ChildMixin";
					let configPropertyToCheck = "mixedResult";

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

					// Get the config object
					let passedConfig = fixture.callTrackerData.$beforeMixin.argsPassed[ targetMixinName ][ 0 ];
					let passedValue  = passedConfig[ configPropertyToCheck ];

					// Assert
					expect( passedValue ).to.be.a( "function" );
					expect( passedValue.name ).to.equal( "MixedResult" );

				} );

				it( "should pass the MixedResult's prototype as a config property (opts.mixedProto) when invoking $beforeMixin", function() {

					// Preliminaries
					let targetMixinName       = "ChildMixin";
					let configPropertyToCheck = "mixedProto";

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

					// Get the config object
					let passedConfig = fixture.callTrackerData.$beforeMixin.argsPassed[ targetMixinName ][ 0 ];
					let passedValue  = passedConfig[ configPropertyToCheck ];

					// Assert
					expect( passedValue ).to.be.an( "object" );
					expect( passedValue.constructor.name ).to.equal( "MixedResult" );

				} );

				it( "should pass the mixin's name as a config property (opts.mixinClassName) when invoking $beforeMixin", function() {

					// Preliminaries
					let targetMixinName       = "ChildMixin";
					let configPropertyToCheck = "mixinClassName";

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

					// Get the config object
					let passedConfig = fixture.callTrackerData.$beforeMixin.argsPassed[ targetMixinName ][ 0 ];
					let passedValue  = passedConfig[ configPropertyToCheck ];

					// Assert
					expect( passedValue ).to.be.a( "string" );
					expect( passedValue ).to.equal( "Test.fixture.asset.mixer.onMixin.ChildMixin" );

				} );

				it( "should pass the mixin's constructor as a config property (opts.mixinClass) when invoking $beforeMixin", function() {

					// Preliminaries
					let targetMixinName       = "ChildMixin";
					let configPropertyToCheck = "mixinClass";

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

					// Get the config object
					let passedConfig = fixture.callTrackerData.$beforeMixin.argsPassed[ targetMixinName ][ 0 ];
					let passedValue  = passedConfig[ configPropertyToCheck ];

					// Assert
					expect( passedValue ).to.be.a( "function" );
					expect( passedValue.name ).to.equal( "ChildMixin" );

				} );

				it( "should pass the mixin's prototype as a config property (opts.mixinProto) when invoking $beforeMixin", function() {

					// Preliminaries
					let targetMixinName       = "ChildMixin";
					let configPropertyToCheck = "mixinProto";

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

					// Get the config object
					let passedConfig = fixture.callTrackerData.$beforeMixin.argsPassed[ targetMixinName ][ 0 ];
					let passedValue  = passedConfig[ configPropertyToCheck ];

					// Assert
					expect( passedValue ).to.be.an( "object" );

				} );

				it( "should pass the method name as a config property (opts.methodName) when invoking $beforeMixin", function() {

					// Preliminaries
					let targetMixinName       = "ChildMixin";
					let configPropertyToCheck = "methodName";

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

					// Get the config object
					let passedConfig = fixture.callTrackerData.$beforeMixin.argsPassed[ targetMixinName ][ 0 ];
					let passedValue  = passedConfig[ configPropertyToCheck ];

					// Assert
					expect( passedValue ).to.be.a( "string" );
					expect( passedValue ).to.equal( "$beforeMixin" );

				} );

				it( "should pass a reference to the method being invoked as a config property (opts.methodRef) when invoking $beforeMixin", function() {

					// Preliminaries
					let targetMixinName       = "ChildMixin";
					let configPropertyToCheck = "methodRef";

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

					// Get the config object
					let passedConfig = fixture.callTrackerData.$beforeMixin.argsPassed[ targetMixinName ][ 0 ];
					let passedValue  = passedConfig[ configPropertyToCheck ];

					// Assert
					expect( passedValue ).to.be.a( "function" );
					expect( passedValue.name ).to.equal( "$beforeMixin" );

				} );


			} );


		} );

		describe( "(Special Mixin Method: $mixin)", function() {

			it( "should execute $mixin methods on all mixins that provide one", function() {

				// We have a fixture to test this..
				let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

				// Capture the $mixin() call tracker data from the helper mixin.
				// (`Core.debug.mixin.CallTrackerMixin`)
				let data = fixture.callTrackerData.$mixin;

				// Ensure that all of our mixins participated
				expect( data.didParticipate.GrandParentMixin 	).to.equal( "GrandParentMixin" 	);
				expect( data.didParticipate.ParentMixin 		).to.equal( "ParentMixin" 		);
				expect( data.didParticipate.SecondParentMixin 	).to.equal( "SecondParentMixin" );
				expect( data.didParticipate.ChildMixin 			).to.equal( "ChildMixin" 		);

			} );

			it( "should NOT execute $mixin methods provided by classes", function() {

				// We have a fixture to test this..
				let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

				// Capture the $mixin() call tracker data from the helper mixin.
				// (`Core.debug.mixin.CallTrackerMixin`)
				let data = fixture.callTrackerData.$mixin;

				// Ensure that none of our "control" methods executed...
				expect( data.didParticipate.ChildClass 			).to.be.an( "undefined" );
				expect( data.didParticipate.ParentClass 		).to.be.an( "undefined" );
				expect( data.didParticipate.GrandParentClass 	).to.be.an( "undefined" );

			} );

			it( "should execute $mixin methods in the order that the mixins were applied", function() {

				// We have a fixture to test this..
				let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

				// Capture the $mixin() call tracker data from the helper mixin.
				// (`Core.debug.mixin.CallTrackerMixin`)
				let data = fixture.callTrackerData.$mixin;

				// Ensure that all of our mixins participated
				expect( data.participationOrder[ 0 ] 	).to.equal( "GrandParentMixin" 	);
				expect( data.participationOrder[ 1 ]	).to.equal( "ParentMixin" 		);
				expect( data.participationOrder[ 2 ] 	).to.equal( "SecondParentMixin" );
				expect( data.participationOrder[ 3 ]	).to.equal( "ChildMixin" 		);

			} );

			it( "should execute $mixin with the scope set to MixedResult.prototype", function() {

				// We have a fixture to test this..
				let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

				// Resolve the `this` reference from one of the calls..
				let thisRef = fixture.callTrackerData.$mixin.thisRefs.ChildMixin;

				// Assert that `this` was an object, which would indicate that it is
				// a prototype, and not a constructor.
				expect( thisRef ).to.be.an( "object" );

				// The mixer always names mixed classes as 'MixedResult'
				expect( thisRef.constructor.name ).to.equal( "MixedResult" );

			} );

			describe( "(Invocation Arguments)", function() {

				it( "should pass the base class' name as a config property (opts.baseClassName) when invoking $mixin", function() {

					// Preliminaries
					let targetMixinName       = "ChildMixin";
					let configPropertyToCheck = "baseClassName";

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

					// Get the config object
					let passedConfig = fixture.callTrackerData.$mixin.argsPassed[ targetMixinName ][ 0 ];
					let passedValue  = passedConfig[ configPropertyToCheck ];

					// Assert
					expect( passedValue ).to.be.a( "string" );
					expect( passedValue ).to.equal( "Test.fixture.asset.mixer.onMixin.ParentClass" );

				} );

				it( "should pass the base class' constructor as a config property (opts.baseClass) when invoking $mixin", function() {

					// Preliminaries
					let targetMixinName       = "ChildMixin";
					let configPropertyToCheck = "baseClass";

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

					// Get the config object
					let passedConfig = fixture.callTrackerData.$mixin.argsPassed[ targetMixinName ][ 0 ];
					let passedValue  = passedConfig[ configPropertyToCheck ];

					// Assert
					expect( passedValue ).to.be.a( "function" );
					expect( passedValue.name ).to.equal( "ParentClass" );

				} );

				it( "should pass the base class' prototype as a config property (opts.baseProto) when invoking $mixin", function() {

					// Preliminaries
					let targetMixinName       = "ChildMixin";
					let configPropertyToCheck = "baseProto";

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

					// Get the config object
					let passedConfig = fixture.callTrackerData.$mixin.argsPassed[ targetMixinName ][ 0 ];
					let passedValue  = passedConfig[ configPropertyToCheck ];

					// Assert
					expect( passedValue ).to.be.an( "object" );
					expect( passedValue.constructor.name ).to.equal( "ParentClass" );

				} );

				it( "should pass a Map of the mixins being applied as a config property (opts.mixins) when invoking $mixin", function() {

					// Preliminaries
					let targetMixinName       = "ChildMixin";
					let configPropertyToCheck = "mixins";

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

					// Get the config object
					let passedConfig = fixture.callTrackerData.$mixin.argsPassed[ targetMixinName ][ 0 ];
					let passedValue  = passedConfig[ configPropertyToCheck ];

					// Assert
					expect( passedValue ).to.be.a( "map" );
					expect( passedValue.size ).to.equal( 1 );
					expect( passedValue.has( "Test.fixture.asset.mixer.onMixin.ChildMixin" ) ).to.equal( true );

				} );

				it( "should pass the MixedResult's constructor as a config property (opts.mixedResult) when invoking $mixin", function() {

					// Preliminaries
					let targetMixinName       = "ChildMixin";
					let configPropertyToCheck = "mixedResult";

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

					// Get the config object
					let passedConfig = fixture.callTrackerData.$mixin.argsPassed[ targetMixinName ][ 0 ];
					let passedValue  = passedConfig[ configPropertyToCheck ];

					// Assert
					expect( passedValue ).to.be.a( "function" );
					expect( passedValue.name ).to.equal( "MixedResult" );

				} );

				it( "should pass the MixedResult's prototype as a config property (opts.mixedProto) when invoking $mixin", function() {

					// Preliminaries
					let targetMixinName       = "ChildMixin";
					let configPropertyToCheck = "mixedProto";

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

					// Get the config object
					let passedConfig = fixture.callTrackerData.$mixin.argsPassed[ targetMixinName ][ 0 ];
					let passedValue  = passedConfig[ configPropertyToCheck ];

					// Assert
					expect( passedValue ).to.be.an( "object" );
					expect( passedValue.constructor.name ).to.equal( "MixedResult" );

				} );

				it( "should pass the mixin's name as a config property (opts.mixinClassName) when invoking $mixin", function() {

					// Preliminaries
					let targetMixinName       = "ChildMixin";
					let configPropertyToCheck = "mixinClassName";

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

					// Get the config object
					let passedConfig = fixture.callTrackerData.$mixin.argsPassed[ targetMixinName ][ 0 ];
					let passedValue  = passedConfig[ configPropertyToCheck ];

					// Assert
					expect( passedValue ).to.be.a( "string" );
					expect( passedValue ).to.equal( "Test.fixture.asset.mixer.onMixin.ChildMixin" );

				} );

				it( "should pass the mixin's constructor as a config property (opts.mixinClass) when invoking $mixin", function() {

					// Preliminaries
					let targetMixinName       = "ChildMixin";
					let configPropertyToCheck = "mixinClass";

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

					// Get the config object
					let passedConfig = fixture.callTrackerData.$mixin.argsPassed[ targetMixinName ][ 0 ];
					let passedValue  = passedConfig[ configPropertyToCheck ];

					// Assert
					expect( passedValue ).to.be.a( "function" );
					expect( passedValue.name ).to.equal( "ChildMixin" );

				} );

				it( "should pass the mixin's prototype as a config property (opts.mixinProto) when invoking $mixin", function() {

					// Preliminaries
					let targetMixinName       = "ChildMixin";
					let configPropertyToCheck = "mixinProto";

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

					// Get the config object
					let passedConfig = fixture.callTrackerData.$mixin.argsPassed[ targetMixinName ][ 0 ];
					let passedValue  = passedConfig[ configPropertyToCheck ];

					// Assert
					expect( passedValue ).to.be.an( "object" );

				} );

				it( "should pass the method name as a config property (opts.methodName) when invoking $mixin", function() {

					// Preliminaries
					let targetMixinName       = "ChildMixin";
					let configPropertyToCheck = "methodName";

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

					// Get the config object
					let passedConfig = fixture.callTrackerData.$mixin.argsPassed[ targetMixinName ][ 0 ];
					let passedValue  = passedConfig[ configPropertyToCheck ];

					// Assert
					expect( passedValue ).to.be.a( "string" );
					expect( passedValue ).to.equal( "$mixin" );

				} );

				it( "should pass a reference to the method being invoked as a config property (opts.methodRef) when invoking $mixin", function() {

					// Preliminaries
					let targetMixinName       = "ChildMixin";
					let configPropertyToCheck = "methodRef";

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

					// Get the config object
					let passedConfig = fixture.callTrackerData.$mixin.argsPassed[ targetMixinName ][ 0 ];
					let passedValue  = passedConfig[ configPropertyToCheck ];

					// Assert
					expect( passedValue ).to.be.a( "function" );
					expect( passedValue.name ).to.equal( "$mixin" );

				} );


			} );


		} );

		describe( "(Special Mixin Method: $afterMixin)", function() {

			it( "should execute $afterMixin methods on all mixins that provide one", function() {

				// We have a fixture to test this..
				let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

				// Capture the $afterMixin() call tracker data from the helper mixin.
				// (`Core.debug.mixin.CallTrackerMixin`)
				let data = fixture.callTrackerData.$afterMixin;

				// Ensure that all of our mixins participated
				expect( data.didParticipate.GrandParentMixin 	).to.equal( "GrandParentMixin" 	);
				expect( data.didParticipate.ParentMixin 		).to.equal( "ParentMixin" 		);
				expect( data.didParticipate.SecondParentMixin 	).to.equal( "SecondParentMixin" );
				expect( data.didParticipate.ChildMixin 			).to.equal( "ChildMixin" 		);

			} );

			it( "should execute $afterMixin methods in the order that the mixins were applied", function() {

				// We have a fixture to test this..
				let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

				// Capture the $afterMixin() call tracker data from the helper mixin.
				// (`Core.debug.mixin.CallTrackerMixin`)
				let data = fixture.callTrackerData.$afterMixin;

				// Ensure that all of our mixins participated
				expect( data.participationOrder[ 0 ] 	).to.equal( "GrandParentMixin" 	);
				expect( data.participationOrder[ 1 ]	).to.equal( "ParentMixin" 		);
				expect( data.participationOrder[ 2 ] 	).to.equal( "SecondParentMixin" );
				expect( data.participationOrder[ 3 ]	).to.equal( "ChildMixin" 		);

			} );

			it( "should execute $afterMixin with the scope set to MixedResult.prototype", function() {

				// We have a fixture to test this..
				let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

				// Resolve the `this` reference from one of the calls..
				let thisRef = fixture.callTrackerData.$afterMixin.thisRefs.ChildMixin;

				// Assert that `this` was an object, which would indicate that it is
				// a prototype, and not a constructor.
				expect( thisRef ).to.be.an( "object" );

				// The mixer always names mixed classes as 'MixedResult'
				expect( thisRef.constructor.name ).to.equal( "MixedResult" );

			} );

			describe( "(Invocation Arguments)", function() {

				it( "should pass the base class' name as a config property (opts.baseClassName) when invoking $afterMixin", function() {

					// Preliminaries
					let targetMixinName       = "ChildMixin";
					let configPropertyToCheck = "baseClassName";

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

					// Get the config object
					let passedConfig = fixture.callTrackerData.$afterMixin.argsPassed[ targetMixinName ][ 0 ];
					let passedValue  = passedConfig[ configPropertyToCheck ];

					// Assert
					expect( passedValue ).to.be.a( "string" );
					expect( passedValue ).to.equal( "Test.fixture.asset.mixer.onMixin.ParentClass" );

				} );

				it( "should pass the base class' constructor as a config property (opts.baseClass) when invoking $afterMixin", function() {

					// Preliminaries
					let targetMixinName       = "ChildMixin";
					let configPropertyToCheck = "baseClass";

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

					// Get the config object
					let passedConfig = fixture.callTrackerData.$afterMixin.argsPassed[ targetMixinName ][ 0 ];
					let passedValue  = passedConfig[ configPropertyToCheck ];

					// Assert
					expect( passedValue ).to.be.a( "function" );
					expect( passedValue.name ).to.equal( "ParentClass" );

				} );

				it( "should pass the base class' prototype as a config property (opts.baseProto) when invoking $afterMixin", function() {

					// Preliminaries
					let targetMixinName       = "ChildMixin";
					let configPropertyToCheck = "baseProto";

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

					// Get the config object
					let passedConfig = fixture.callTrackerData.$afterMixin.argsPassed[ targetMixinName ][ 0 ];
					let passedValue  = passedConfig[ configPropertyToCheck ];

					// Assert
					expect( passedValue ).to.be.an( "object" );
					expect( passedValue.constructor.name ).to.equal( "ParentClass" );

				} );

				it( "should pass a Map of the mixins being applied as a config property (opts.mixins) when invoking $afterMixin", function() {

					// Preliminaries
					let targetMixinName       = "ChildMixin";
					let configPropertyToCheck = "mixins";

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

					// Get the config object
					let passedConfig = fixture.callTrackerData.$afterMixin.argsPassed[ targetMixinName ][ 0 ];
					let passedValue  = passedConfig[ configPropertyToCheck ];

					// Assert
					expect( passedValue ).to.be.a( "map" );
					expect( passedValue.size ).to.equal( 1 );
					expect( passedValue.has( "Test.fixture.asset.mixer.onMixin.ChildMixin" ) ).to.equal( true );

				} );

				it( "should pass the MixedResult's constructor as a config property (opts.mixedResult) when invoking $afterMixin", function() {

					// Preliminaries
					let targetMixinName       = "ChildMixin";
					let configPropertyToCheck = "mixedResult";

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

					// Get the config object
					let passedConfig = fixture.callTrackerData.$afterMixin.argsPassed[ targetMixinName ][ 0 ];
					let passedValue  = passedConfig[ configPropertyToCheck ];

					// Assert
					expect( passedValue ).to.be.a( "function" );
					expect( passedValue.name ).to.equal( "MixedResult" );

				} );

				it( "should pass the MixedResult's prototype as a config property (opts.mixedProto) when invoking $afterMixin", function() {

					// Preliminaries
					let targetMixinName       = "ChildMixin";
					let configPropertyToCheck = "mixedProto";

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

					// Get the config object
					let passedConfig = fixture.callTrackerData.$afterMixin.argsPassed[ targetMixinName ][ 0 ];
					let passedValue  = passedConfig[ configPropertyToCheck ];

					// Assert
					expect( passedValue ).to.be.an( "object" );
					expect( passedValue.constructor.name ).to.equal( "MixedResult" );

				} );

				it( "should pass the mixin's name as a config property (opts.mixinClassName) when invoking $afterMixin", function() {

					// Preliminaries
					let targetMixinName       = "ChildMixin";
					let configPropertyToCheck = "mixinClassName";

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

					// Get the config object
					let passedConfig = fixture.callTrackerData.$afterMixin.argsPassed[ targetMixinName ][ 0 ];
					let passedValue  = passedConfig[ configPropertyToCheck ];

					// Assert
					expect( passedValue ).to.be.a( "string" );
					expect( passedValue ).to.equal( "Test.fixture.asset.mixer.onMixin.ChildMixin" );

				} );

				it( "should pass the mixin's constructor as a config property (opts.mixinClass) when invoking $afterMixin", function() {

					// Preliminaries
					let targetMixinName       = "ChildMixin";
					let configPropertyToCheck = "mixinClass";

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

					// Get the config object
					let passedConfig = fixture.callTrackerData.$afterMixin.argsPassed[ targetMixinName ][ 0 ];
					let passedValue  = passedConfig[ configPropertyToCheck ];

					// Assert
					expect( passedValue ).to.be.a( "function" );
					expect( passedValue.name ).to.equal( "ChildMixin" );

				} );

				it( "should pass the mixin's prototype as a config property (opts.mixinProto) when invoking $afterMixin", function() {

					// Preliminaries
					let targetMixinName       = "ChildMixin";
					let configPropertyToCheck = "mixinProto";

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

					// Get the config object
					let passedConfig = fixture.callTrackerData.$afterMixin.argsPassed[ targetMixinName ][ 0 ];
					let passedValue  = passedConfig[ configPropertyToCheck ];

					// Assert
					expect( passedValue ).to.be.an( "object" );

				} );

				it( "should pass the method name as a config property (opts.methodName) when invoking $afterMixin", function() {

					// Preliminaries
					let targetMixinName       = "ChildMixin";
					let configPropertyToCheck = "methodName";

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

					// Get the config object
					let passedConfig = fixture.callTrackerData.$afterMixin.argsPassed[ targetMixinName ][ 0 ];
					let passedValue  = passedConfig[ configPropertyToCheck ];

					// Assert
					expect( passedValue ).to.be.a( "string" );
					expect( passedValue ).to.equal( "$afterMixin" );

				} );

				it( "should pass a reference to the method being invoked as a config property (opts.methodRef) when invoking $afterMixin", function() {

					// Preliminaries
					let targetMixinName       = "ChildMixin";
					let configPropertyToCheck = "methodRef";

					// We have a fixture to test this..
					let fixture = Core.inst( "Test.fixture.asset.mixer.onMixin.ChildClass" );

					// Get the config object
					let passedConfig = fixture.callTrackerData.$afterMixin.argsPassed[ targetMixinName ][ 0 ];
					let passedValue  = passedConfig[ configPropertyToCheck ];

					// Assert
					expect( passedValue ).to.be.a( "function" );
					expect( passedValue.name ).to.equal( "$afterMixin" );

				} );


			} );


		} );

	} );


} );
