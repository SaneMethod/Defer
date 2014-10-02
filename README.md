Defer
=====
######Native Promise API Wrapper

Defer is for those who like the jQuery API for [Deferred](http://api.jquery.com/category/deferred-object/), but
want to take advantage of the new, native Promise API built into modern versions of Firefox, Chrome, Opera and Safari
(but not ie - see [caniuse](http://caniuse.com/#feat=promises) for up-to-date details).

Defer is also for those who'd like a 'done' function (that is, one which executes after the entire promise chain
is completed, which doesn't currently exist in the Promise specification), for those who like to call resolve or reject
from outside the Promise constructor, and for those who consider one function per composition ideals, and two or more
unbearably ugly (with the exception of .then, because reasons). See below for some more details on this.

Defer is in an immediately-invoked closure, so you can pass whatever context you'd like it to live in to it. By default,
it attaches itself to the global window.

Usage:
------
[Example](#simple-example)

[Another Example](#another-example)

[Ajax Example](#ajax-example)

[Comparison with Native API](#native-comparison)

[Comparison with jQuery API](#jquery-comparison)

###Simple Example:

```javascript
var defer = Defer();
defer.then(function(value){
    // Do something with the value
    // Returning an altered value will propagate to succeeding then and done calls
}).done(function(value){
    // Called when the promise chain is fully resolved
}).fail(function(error){
    // Called when the promise is rejected, with any value passed into reject
    // A nice convention is to make that value a new Error()
});

// ... Do your async stuff ... \\
defer.resolve('some value your async stuff gave you');
}
```

###Another Example

```javascript
var p2 = Defer(),
    p1 = Defer();

p2.then(function (value) {
    console.log(value); // 1
    return value + 1;
}).done(function(value){
    console.log('Done:', value); // Done: 3
}).then(function (value) {
    console.log(value); // 2
    return value + 1;
});

p2.resolve(1);
p1.resolve(2);

Promise.all([p2, p1]).then(function(vals){
    console.log(vals); // [3, 2]
});
```

###Ajax Example
See the [ajax example](./DeferAjaxEample.js) for the ajax wrapper being used below.

```javascript
ajax({
    url:'/somewhere/',
    type:'GET',
    dataType:'arraybuffer'
}).then(function(res){
    // alter the result in someway and return it
    return res;
}).done(function(res){
    // Do something with the result which was altered in the then block.
});
```

###Native Comparison:

See the [MDN Promise article](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
 for the current form of the Promise API.

####Constructor
#####Native
```javascript
var promise = new Promise(function(resolve, reject){});
```

#####Defer
```javascript
var promise = Defer();
```

####Resolve or Reject
#####Native
Must be done within the Promise constructor.

#####Defer
Can be done anywhere the variable in question is in scope, via ```.resolve()``` or ```.reject()```.

####Adding success/failure handlers
#####Native
```javascript
promise.then(successHandler, optionalFailureHandler);
promise.catch(failureHandler);
```

#####Defer
```javascript
promise.then(successHandler, optionalFailureHandler);
promise.fail(failureHandler);
promise.done(doneHandler); // Called when the promise chain fully resolves - not present in native Promise
promise.always(alwaysHandler); // Called when the promise chain fully resolves, or is rejected - not present in native Promise
```

###jQuery Comparison
See the [jQuery Deferred documentation](http://api.jquery.com/category/deferred-object/) for the full Deferred API.

####Adding handlers
jQuery allows you to add an array of handlers, or a comma-seperated series of handlers, for most calls.
Defer does not, for purely personal, aesthetic-preference reasons. If you want to add multiple handlers,
make multiple calls to .done, .then, etc.

####When and race
#####jQuery
```javascript
jQuery.when(comma, separated, deferreds).done(function(valuesArray){});
```

#####Defer
```javascript
Promise.all([array, of, Defer, Objects]).then(function(valuesArray){});
Promise.race([array, of, Defer, Objects]).then(function(firstDeferToResolveValue){});
```