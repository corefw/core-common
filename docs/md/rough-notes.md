Variable Conventions
--------------------

Variables and class members that are prefixed with a `$` are framework
features and serve a special purpose.  In most cases, you should not
need to interact with these variables, directly.


`$construct`
------------

Framework classes should *not* define a `constructor()` method.
Instead, classes should define a `$construct()` method, with
one or more named parameters, which will be automatically mapped from
the config object that is passed into the constructor.



The behavior of `$construct` is, also, a bit different than built-in
class constructors.  In the Core Framework, ALL `$construct` methods
will be called for all members of an inheritance tree, starting with
the highest level (child) and working it's way up.


```
// Core.pets.Animal
class Animal extends Core.cls("Core.abstract.BaseClass") {

    $construct( name, gender ) {
        log(`My name is: ${name}`);
        log(`My gender is: ${gender}`);
    }

}

// Core.pets.Dog
class Dog extends Core.cls("Core.pets.Dog") {

    $construct( breed, color ) {
        log(`My breed is: ${breed}`);
        log(`My color is: ${color}`);

        return {
            gender: "male"
        };

    }

}

classLoader.spawn( "Core.pets.Dog", {
    name: "Sparky",
    breed: "Lab",
    gender: "female"
});

// My breed is: Lab
// My color is: null
// My name is: Sparky
// My gender is: male
```

The framework will _always_ pass `null` for parameters named in
`$construct()` that are not passed into the configuration object,
so each class must assert it's own required parameters.

Child `$construct()` methods can override the configuration that will be
passed to its parents by returning an override object with the new
values as keys.

Important Note: Returned overrides will be persisted to the
internal configuration object (`this.$corefw.config`), which may have
additional implications, even after the `$construct()` chain has
completed. In other words, returning overrides will permanently
re-configure the object.

Likewise, if a `$contruct()` method returns exactly `false`, then any
subsequent parent methods will not be executed.


`$ready()`
----------

After all `$construct` methods are called, the framework will call
the `$ready()` method, if it exists.  Unlike the `$construct()` method,
however, the framework will only call the top-most `$ready()` method;
children must use `super.$ready()` if calling its parent method is
desired.

No parameters will be passed to `$ready()`.
