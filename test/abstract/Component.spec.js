/**
 * @file
 * Defines tests for the Core.abstract.Component class.
 *
 * @author Luke Chavers <luke@c2cschools.com>
 * @since 6.0.0
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

describe( "Core.abstract.Component", function() {

	describe( "(Construction & Initialization)", function() {

		describe( "#$construct()", function() {

			it( "should execute as expected", function() {

				// We have a fixture to test this..
				let fixture = Core.inst( "Test.fixture.abstract.component.construct.DoesRunFixture" );

				// Check to see if $construct was executed
				expect( fixture.didConstructExecute ).to.equal( true );

			} );

			it( "should execute in order from final inheritor, first, to eldest ancestor, last", function() {

				// We have a fixture to test this..
				let Fixture = Core.cls( "Test.fixture.abstract.component.construct.DoesRunChildFixture" );

				// Instantiate it..
				let fixture = new Fixture();

				// The $construct method on the final inheritor (DoesRunChildFixture) should
				// execute BEFORE the $construct method on its parent class (DoesRunFixture).
				expect( fixture.lastToRunConstruct ).to.equal( "DoesRunFixture" );

			} );

			it( "should allow children to cancel their parent's $construct execution", function() {

				// We have a fixture to test this..
				let Fixture = Core.cls( "Test.fixture.abstract.component.construct.DoesRunChildFixtureTwo" );

				// Instantiate it..
				let fixture = new Fixture();

				// DoesRunChildFixtureTwo::$construct returns false, which should cancel the
				// execution of $construct on its ancestors/super classes (DoesRunFixture & DoesRunChildFixture).
				expect( fixture.lastToRunConstruct ).to.equal( "DoesRunChildFixtureTwo" );

			} );

			it( "should automatically receive config properties passed to the real constructor", function() {

				// We have a fixture to test this..
				let Fixture = Core.cls( "Test.fixture.abstract.component.construct.ConfigValueFixture" );

				// Instantiate it..
				let fixture = new Fixture( {
					someSetting: "abc"
				} );

				// Make sure that the $construct method received the configuration values..
				expect( fixture.someSetting ).to.equal( "abc" );

			} );

			it( "should default missing config values to NULL", function() {

				// We have a fixture to test this..
				let Fixture = Core.cls( "Test.fixture.abstract.component.construct.ConfigValueFixture" );

				// Instantiate it..
				let fixture = new Fixture( {
					someSetting: "abc"
				} );

				// The object should not have received a value for 'anotherSetting',
				// and it should have defaulted the value to NULL.
				expect( fixture.anotherSetting ).to.equal( null );

			} );

			it( "should allow parent classes to define class dependencies independently", function() {

				// We have a fixture to test this..
				let Fixture = Core.cls( "Test.fixture.abstract.component.construct.ConfigValueChildFixture" );

				// Instantiate it..
				let fixture = new Fixture( {
					someSetting: "abc"
				} );

				// Even though the child fixture is not interested in 'someSetting',
				// the parent fixture should still receive the correct value.
				expect( fixture.someSetting ).to.equal( "abc" );

			} );

			it( "should allow children to override the $construct values for parent classes", function() {

				// We have a fixture to test this..
				let Fixture = Core.cls( "Test.fixture.abstract.component.construct.ConfigValueChildFixture" );

				// Instantiate it..
				let fixture = new Fixture( {
					anotherSetting: "thisValueWillBeLost"
				} );

				// `ConfigValueChildFixture` should forcefully override the value passed in
				// to the constructor and the parent should only see the override value.
				expect( fixture.anotherSetting ).to.equal( "overridden" );

			} );


			it( "should persist overridden values to the internal class config object", function() {

				// We have a fixture to test this..
				let Fixture = Core.cls( "Test.fixture.abstract.component.construct.ConfigValueChildFixture" );

				// Instantiate it..
				let fixture = new Fixture( {
					anotherSetting: "thisValueWillBeLost"
				} );

				// The overridden value for 'anotherSetting' should be persisted
				// to the internal class config, making it permanent.
				expect( fixture.anotherSettingInConfig ).to.equal( "overridden" );

			} );

		} );

		describe( "#$ready()", function() {

			it( "should execute on the final inheritor (child)", function() {

				// We have a fixture to test this..
				let Fixture = Core.cls( "Test.fixture.abstract.component.ready.DoesRunChildFixture" );

				// Instantiate it..
				let fixture = new Fixture();

				// Check to see if $ready was executed
				expect( fixture.readyRanForChild ).to.equal( true );

			} );

			it( "should NOT execute on inherited/super classes", function() {

				// We have a fixture to test this..
				let Fixture = Core.cls( "Test.fixture.abstract.component.ready.DoesRunChildFixture" );

				// Instantiate it..
				let fixture = new Fixture();

				// Check to see if $ready was executed
				expect( fixture.readyRanForParent ).to.be.an( "undefined" );

			} );

		} );

	} );

	describe( "(Mixin Logic)", function() {

		let mixinFixture;

		before( function() {

			// We have a fixture to test this..
			mixinFixture = Core.inst( "Test.fixture.abstract.component.mixin.ChildClass", {
				pcOne  : "ParentClass:One",
				pcTwo  : "ParentClass:Two",
				ccOne  : "ChildClass:One",
				ccTwo  : "ChildClass:Two",
				pmoOne : "ParentMixinOne:One",
				pmoTwo : "ParentMixinOne:Two",
				pmtOne : "ParentMixinTwo:One",
				pmtTwo : "ParentMixinTwo:Two",
				cmoOne : "ChildMixinOne:One",
				cmoTwo : "ChildMixinOne:Two",
				cmtOne : "ChildMixinTwo:One",
				cmtTwo : "ChildMixinTwo:Two",
			} );

		} );

		describe( "(Special Mixin Method: $beforeConstruct)", function() {

			it( "should execute for all mixins that provide it", function() {

				// Capture the data from the call tracker..
				let ctData = mixinFixture.callTrackerData.$beforeConstruct;

				// Verify that $construct ran for all mixins
				expect( ctData.didParticipate.ParentMixinOne ).to.equal( "ParentMixinOne" );
				expect( ctData.didParticipate.ParentMixinTwo ).to.equal( "ParentMixinTwo" );
				expect( ctData.didParticipate.ChildMixinOne  ).to.equal( "ChildMixinOne"  );
				expect( ctData.didParticipate.ChildMixinTwo  ).to.equal( "ChildMixinTwo"  );

			} );

			it( "should execute in order of mixin application", function() {

				// Capture the data from the call tracker..
				let ctData = mixinFixture.callTrackerData.$beforeConstruct;

				// Verify that the methods ran in mixin application order
				expect( ctData.participationOrder[ 0 ] ).to.equal( "ParentMixinOne" );
				expect( ctData.participationOrder[ 1 ] ).to.equal( "ParentMixinTwo" );
				expect( ctData.participationOrder[ 2 ] ).to.equal( "ChildMixinOne"  );
				expect( ctData.participationOrder[ 3 ] ).to.equal( "ChildMixinTwo"  );

			} );

		} );

		describe( "(Special Mixin Method: $construct)", function() {

			it( "should execute for all mixins that provide it", function() {

				// Capture the data from the call tracker..
				let ctData = mixinFixture.callTrackerData.$construct;

				// Verify that $construct ran for all mixins
				expect( ctData.didParticipate.ParentMixinOne ).to.equal( "ParentMixinOne" );
				expect( ctData.didParticipate.ParentMixinTwo ).to.equal( "ParentMixinTwo" );
				expect( ctData.didParticipate.ChildMixinOne  ).to.equal( "ChildMixinOne"  );
				expect( ctData.didParticipate.ChildMixinTwo  ).to.equal( "ChildMixinTwo"  );

			} );

			it( "should execute in order of mixin application AFTER all class $construct methods have executed", function() {

				// Capture the data from the call tracker..
				let ctData = mixinFixture.callTrackerData.$construct;

				// Verify the class $construct methods ran first, and in the order of youngest to eldest..
				expect( ctData.participationOrder[ 0 ] ).to.equal( "ChildClass"     );
				expect( ctData.participationOrder[ 1 ] ).to.equal( "ParentClass"    );

				// .. and then verify that the mixin methods ran after those, in mixin application order..
				expect( ctData.participationOrder[ 2 ] ).to.equal( "ParentMixinOne" );
				expect( ctData.participationOrder[ 3 ] ).to.equal( "ParentMixinTwo" );
				expect( ctData.participationOrder[ 4 ] ).to.equal( "ChildMixinOne"  );
				expect( ctData.participationOrder[ 5 ] ).to.equal( "ChildMixinTwo"  );

			} );

			it( "should receive config values", function() {

				// These are just spot checks because not all variables will have their original value.
				expect( mixinFixture.__pcOne  ).to.equal( "ParentClass:One"   );
				expect( mixinFixture.__cmoOne ).to.equal( "ChildMixinOne:One" );

			} );

			it( "should be able to override config values by returning an object", function() {

				// ParentMixinTwo overrides the 'cmoTwo' value..
				expect( mixinFixture.__cmoTwo  ).to.equal( "ParentMixinTwo" );

				// We'll also check the internal config, so
				// that we'll know the value was persisted.
				expect( mixinFixture.$getConfig( "cmoTwo" ) ).to.equal( "ParentMixinTwo" );

			} );

			it( "should be able to halt subsequent executions of $construct", function() {

				// We need to pass different config values to the fixture to test this...
				let haltingFixture = Core.inst( "Test.fixture.abstract.component.mixin.ChildClass", {
					pcOne  : "ParentClass:One",
					pcTwo  : "ParentClass:Two",
					ccOne  : "ChildClass:One",
					ccTwo  : "ChildClass:Two",
					pmoOne : "ParentMixinOne:One",
					pmoTwo : false,
					pmtOne : "ParentMixinTwo:One",
					pmtTwo : "ParentMixinTwo:Two",
					cmoOne : "ChildMixinOne:One",
					cmoTwo : "ChildMixinOne:Two",
					cmtOne : "ChildMixinTwo:One",
					cmtTwo : "ChildMixinTwo:Two",
				} );

				// We should have stopped the child mixins from running, so, the cm* values should be undefined..
				expect( haltingFixture._cmoOne ).to.be.an( "undefined" );
				expect( haltingFixture._cmoTwo ).to.be.an( "undefined" );
				expect( haltingFixture._cmtOne ).to.be.an( "undefined" );
				expect( haltingFixture._cmtTwo ).to.be.an( "undefined" );

			} );

		} );

		describe( "(Special Mixin Method: $afterConstruct)", function() {

			it( "should execute for all mixins that provide it", function() {

				// Capture the data from the call tracker..
				let ctData = mixinFixture.callTrackerData.$afterConstruct;

				// Verify that $construct ran for all mixins
				expect( ctData.didParticipate.ParentMixinOne ).to.equal( "ParentMixinOne" );
				expect( ctData.didParticipate.ParentMixinTwo ).to.equal( "ParentMixinTwo" );
				expect( ctData.didParticipate.ChildMixinOne  ).to.equal( "ChildMixinOne"  );
				expect( ctData.didParticipate.ChildMixinTwo  ).to.equal( "ChildMixinTwo"  );

			} );

			it( "should execute in order of mixin application", function() {

				// Capture the data from the call tracker..
				let ctData = mixinFixture.callTrackerData.$afterConstruct;

				// Verify that the methods ran in mixin application order
				expect( ctData.participationOrder[ 0 ] ).to.equal( "ParentMixinOne" );
				expect( ctData.participationOrder[ 1 ] ).to.equal( "ParentMixinTwo" );
				expect( ctData.participationOrder[ 2 ] ).to.equal( "ChildMixinOne"  );
				expect( ctData.participationOrder[ 3 ] ).to.equal( "ChildMixinTwo"  );

			} );

		} );

		describe( "(Special Mixin Method: $beforeReady)", function() {

			it( "should execute for all mixins that provide it", function() {

				// Capture the data from the call tracker..
				let ctData = mixinFixture.callTrackerData.$beforeReady;

				// Verify that $construct ran for all mixins
				expect( ctData.didParticipate.ParentMixinOne ).to.equal( "ParentMixinOne" );
				expect( ctData.didParticipate.ParentMixinTwo ).to.equal( "ParentMixinTwo" );
				expect( ctData.didParticipate.ChildMixinOne  ).to.equal( "ChildMixinOne"  );
				expect( ctData.didParticipate.ChildMixinTwo  ).to.equal( "ChildMixinTwo"  );

			} );

			it( "should execute in order of mixin application", function() {

				// Capture the data from the call tracker..
				let ctData = mixinFixture.callTrackerData.$beforeReady;

				// Verify that the methods ran in mixin application order
				expect( ctData.participationOrder[ 0 ] ).to.equal( "ParentMixinOne" );
				expect( ctData.participationOrder[ 1 ] ).to.equal( "ParentMixinTwo" );
				expect( ctData.participationOrder[ 2 ] ).to.equal( "ChildMixinOne"  );
				expect( ctData.participationOrder[ 3 ] ).to.equal( "ChildMixinTwo"  );

			} );

		} );

		describe( "(Special Mixin Method: $afterReady)", function() {

			it( "should execute for all mixins that provide it", function() {

				// Capture the data from the call tracker..
				let ctData = mixinFixture.callTrackerData.$afterReady;

				// Verify that $construct ran for all mixins
				expect( ctData.didParticipate.ParentMixinOne ).to.equal( "ParentMixinOne" );
				expect( ctData.didParticipate.ParentMixinTwo ).to.equal( "ParentMixinTwo" );
				expect( ctData.didParticipate.ChildMixinOne  ).to.equal( "ChildMixinOne"  );
				expect( ctData.didParticipate.ChildMixinTwo  ).to.equal( "ChildMixinTwo"  );

			} );

			it( "should execute in order of mixin application", function() {

				// Capture the data from the call tracker..
				let ctData = mixinFixture.callTrackerData.$afterReady;

				// Verify that the methods ran in mixin application order
				expect( ctData.participationOrder[ 0 ] ).to.equal( "ParentMixinOne" );
				expect( ctData.participationOrder[ 1 ] ).to.equal( "ParentMixinTwo" );
				expect( ctData.participationOrder[ 2 ] ).to.equal( "ChildMixinOne"  );
				expect( ctData.participationOrder[ 3 ] ).to.equal( "ChildMixinTwo"  );

			} );

		} );

	} );

	describe( "(Reflection)", function() {

		describe( ".getClassDependencies()", function() {

			it( "should return a Set containing the names of all class dependencies", function() {

				// We have a fixture to test this..
				let Fixture = Core.cls( "Test.fixture.abstract.component.reflection.ChildClass" );

				// Execute the static method
				let classDependencies = Fixture.getClassDependencies();

				// Ensure that the known dependencies are included in the Set...
				expect( classDependencies.has( "childClassDepOne"  ) ).to.equal( true );
				expect( classDependencies.has( "childClassDepTwo"  ) ).to.equal( true );
				expect( classDependencies.has( "childMixinDepOne"  ) ).to.equal( true );
				expect( classDependencies.has( "childMixinDepTwo"  ) ).to.equal( true );
				expect( classDependencies.has( "parentClassDepOne" ) ).to.equal( true );
				expect( classDependencies.has( "parentClassDepTwo" ) ).to.equal( true );
				expect( classDependencies.has( "parentMixinDepOne" ) ).to.equal( true );
				expect( classDependencies.has( "parentMixinDepTwo" ) ).to.equal( true );


			} );

		} );

	} );

} );
