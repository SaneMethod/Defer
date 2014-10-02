/**
 * A simple example of a xmlhttprequest wrapped with Defer. Note you'll need Defer.js.
 * This ajax function can then be used in a manner similar to jQuery.ajax.
 */
(function(root, Defer){
    /**
     * Simple Promise example based on jQuery ajax api, wrapping xmlhttprequest and Defer/Promises.
     * @param {object} opts
     * @returns {*}
     */
    var ajax = function(opts){
        var xhr = new XMLHttpRequest(),
            defer = Defer(),
            url = opts.url || window.location.href,
            type = opts.type || 'GET',
            dataType = opts.dataType || 'text',
            data = opts.data || null,
            async = (typeof opts.async !== 'undefined') ? opts.async : true;


        xhr.addEventListener('load', function(){
            (xhr.status >= 200 && xhr.status <= 299) ? defer.resolve(xhr.response)
                : defer.reject(Error(xhr.statusText));
        });

        xhr.open(type, url, async);
        xhr.responseType = dataType;
        xhr.send(data);

        return defer;
    };

    root.ajax = ajax;
})(window, window.Defer);