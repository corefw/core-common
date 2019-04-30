/**
 * @file
 * Defines the Core.abstract.BaseInterface class.
 *
 * @author Luke Chavers <me@lukechavers.com>
 * @version 1.0
 * @copyright 2019 C2C Schools, LLC
 * @license MIT
 */

"use strict";

// Load dependencies using the Core Framework
// const { _, TIPE } = Core.deps( "_", "tipe" );

/**
 * A base class for all Core Framework Interfaces.
 *
 * @memberOf Core.abstract
 */
class BaseInterface {

	static get $isCoreInterface() {
		return true;
	}

	__notes() {

		/*


		It would probably be best if `Core.type.check.extended.Implements` just checks for
		meta signatures that get created by interfaces during application.

		.. as opposed to running interface.test(), itself...

		.. but, maybe, both options could be viable: check for existing implementation and apply it if not found.

		The thing is... we want interfaces to be applied during class init so that it can be used to
		prevent problems/bugs.  i.e. interfaces are not the same as validators; they enforce a class structure
		at the JS equivalent of "compile-time" whereas validators test variables at run-time.

		(however, validating that a class/object has had an interface applied [previously] provides some
		assurance that the appropriate interfaces are being used)

		.. one argument for allowing the validation-time application of interfaces is non-Core Classes (arbitrary objects)
		.... perhaps we could only allow validation-time application for non-Core classes?

		--

		Redundancy: I suspect that interfaces should not be applied to the same class/object twice and, what's more,
		there probably isn't any need for interfaces to be applied to children if they've already been applied to
		parents/ancestors.

		--

		Should this class be named "IBase", for consistency? ... or should it remain as "BaseInterface", so that it
		cannot, itself, be used as an interface?

		--

		The framework should probably enforce the naming convention for interface classes:

		   - Interfaces should have valid Core Class Names, plus...
		   - The class name should always start with an upper-case I (e.g. "ISomeInterface")
		   -

		 */

	}

	test() {

	}

	get someProp() {
		// Interfaces should DEFINITELY validate the existence of instance properties.
		// If the interface returns "undefined", then the property
		// will be required to exist but will not be validated any further.
	}

	static get someProp() {
		// Interfaces should DEFINITELY validate the existence of static properties.
	}

	get someOtherProp() {

		// Just an idea: the interface _could_ validate the initial property values
		// of the class it is applied to.  The danger, though, is that getters may
		// trigger unintentional logic and, of course, any lazy-loading mechanisms
		// would be defeated.

		// Alternative, perhaps, Interfaces could use AOP/decoration to validate
		// the value of a property each time it is accessed. Would this be useful?

		return {
			isNull: true
		};
	}

	static someStaticMethod() {
		// Interfaces should DEFINITELY validate the existence of static methods.
	}

	someInstanceMethod() {
		// Interfaces should DEFINITELY validate the existence of instance methods.
	}

	someSignature( a, b, c ) {
		// Enforce signatures?
	}

}

module.exports = BaseInterface.js;
