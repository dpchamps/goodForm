/* goodForm main */

var doc = root.document;

// Base function.
var goodForm = function(form, options) {
    function extend( a, b ) {
        for( var key in b ) {
            if( b.hasOwnProperty( key ) ) {
                a[key] = b[key];
            }
        }
        return a;
    }
    var default_options = {
        honeypot : true
    };

    _init();

    var _init = function(){
        extend(default_options, options);
        if(default_options.honeypot){
            _honeyPot();
        }
    };

    var _honeyPot = function(){
        var input1 = doc.createElement('input'),
            input2 = doc.createElement('input'),
            median = Math.floor(form.childNodes.length / 2);

        input1.placeholder("Do Not Fill");
        input2.placeholder("Do Not Fill");

        input1.style.display = "none";
        input2.style.display = "none";

        input1.id = "_honey1";
        input2.id = "_honey2";

        form.appendChild(input2);
        form.insertBefore(input1, form.childNodes[median]);
    };

    return {
        addMask : function(id, o){
            //
        }

    }

};

root.goodForm = goodForm;
