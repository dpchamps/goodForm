/* goodForm main */


// An extend function, automatically makes deep copies
var extend = function(dest, sources, deepCopy){
    if(typeof deepCopy === 'undefined'){
        deepCopy = false;
    }
    var args = Array.prototype.slice.call(arguments);
    for(var i = 1; i < args.length; i++){
        for(var key in args[i]){
            if(args[i].hasOwnProperty(key)){
                if(deepCopy){
                    if(typeof args[i][key] === 'object' && (args[i][key] instanceof Array) === false){
                        dest[key] = dest[key] || {};
                        extend(dest[key], args[i][key]);
                    }else{
                        dest[key] = args[i][key];
                    }
                }else{
                    dest[key] = args[i][key];
                }

            }
        }
    }
    return dest;
};

var GoodForm = {};

GoodForm.extend = extend;
var config = {
    doc : root.document
};

extend(GoodForm, config);