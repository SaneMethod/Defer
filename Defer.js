/**
 * @author Christopher Keefer
 * Defer wraps the new JS Promises with a pleasantly familiar api similar to the jQuery api for
 * Deferred (but not a 1:1 copy) - see README for details.
 */
(function(root){
    var Defer = function(){
        var defer = function(){
            this.promise = new Promise(function(resolve, reject){
                this._resolve = resolve;
                this._reject = reject;
            }.bind(this));
            this.callWhenDone = [];
            this.callAlways = [];
        };

        /**
         * Determine whether an object is a promise by duck-typing - anything with a 'then' function
         * is considered a promise.
         */
        defer.prototype.isPromise = function(promise){
            return (typeof promise).indexOf('object') !== -1 &&
                (typeof promise.then).indexOf('Function') !== -1;
        };

        /**
         * Resolve the promise with any number of passed values. Before doing so, attach
         * all done and always calls to the current promise - as it will be at the bottom of the chain, its
         * then calls will occur once the chain has fully resolved. Done and always functions will be
         * called in the order they appear in the array (that is, the order they were added).
         */
        defer.prototype.resolve = function(){
            var args = Array.prototype.slice.call(arguments);

            this.callWhenDone.forEach(function(func){
                this.promise.then(func);
            }.bind(this));

            this.callAlways.forEach(function(func){
                this.promise.then(func);
            }.bind(this));

            this._resolve.apply(this, args);
        };

        /**
         * Call reject on our promise. Add always calls to the current promise before rejecting.
         */
        defer.prototype.reject = function(){
            var args = Array.prototype.slice.call(arguments);

            this.callAlways.forEach(function(func){
                this.promise.catch(func);
            }.bind(this));

            this._reject.apply(this, args);
        };

        /**
         * Add a callback function to be called when the complete promise chain resolves.
         * @param {Array|Function} fulfilled
         * @returns {defer}
         */
        defer.prototype.done = function(fulfilled){
            this.callWhenDone.push(fulfilled);
            return this;
        };

        /**
         * Add a callback function to be called when the promise is rejected.
         * @param {Function} rejected
         * @returns {defer}
         */
        defer.prototype.fail = function(rejected){
            this.promise = this.promise.catch(rejected);
            return this;
        };

        /**
         * Add functions to be called when the promise is fulfilled or, optionally, rejected.
         * @param {Function} fulfilled
         * @param {Function=} rejected
         * @returns {defer}
         */
        defer.prototype.then = function(fulfilled, rejected){
            this.promise = this.promise.then(fulfilled, rejected);
            return this;
        };

        /**
         * Add a function to be called after the promise chain has either resolved or been rejected.
         * @param {Function} always
         */
        defer.prototype.always = function(always){
            this.promise.then(always, always);
            return this;
        };

        return new defer();
    };

    root.Defer = Defer;
})(window);